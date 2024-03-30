import React, { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { Box } from "@mui/material";
import * as Constants from "../constant/ModelConstants";
import FluidTypeInputSection from "../FluidTypeInputSection";
import CorrelationsInputSection from "../CorrelationsInputSection";

const useStyles = makeStyles()((theme) => ({
  inputSection: {
    height: "calc(100vh - 140px)",
    overflowY: "auto",
    paddingBottom: 15,
    paddingRight: 50,
    paddingLeft: 10,
  },
}));

const Forecast_Inputs = (props) => {
  const { classes } = useStyles();
  const {
    pvtInputConfig,
    setPVTInputConfig,
    fluidTypeOptions,
    correlationTypeOptions,
    correlationTypeInputs,
    setIsInputChanged,
    setCorrelationTypeInputs,
    selectedFluidType,
    isWaterChecked,
    fluidTypeInputs,
    enableReset,
    setEnableReset,
    setFluidTypeInputs,
    setSelectedFluidType,
    setIsWaterChecked,
  } = props;

  const handleFluidTypeInputChange = (value, name) => {
    const { min, max } = fluidTypeInputs[name];
    let inputError = "";
    if (!value) {
      inputError = Constants.EMPTY_INPUT_MESSAGE;
    } else if (value < min || value > max) {
      inputError = `${Constants.EMPTY_INPUT_MESSAGE} between ${min} to ${max}`;
    }
    if (name === "oilGrav" || name === "gasGrav") {
      value = Number(value)?.toFixed(2);
    }
    if (name === "y_n2" || name === "y_h2s" || name === "y_co2") {
      value = Number(value)?.toFixed(3);
    }
    if (!enableReset) {
      setEnableReset(true);
    }
    setIsInputChanged(true);
    setFluidTypeInputs({
      ...fluidTypeInputs,
      [name]: { ...fluidTypeInputs[name], error: inputError },
    });
    setPVTInputConfig({
      ...pvtInputConfig,
      pvtParameter: {
        ...pvtInputConfig?.pvtParameter,
        fluidInput: {
          ...pvtInputConfig?.pvtParameter?.fluidInput,
          [`${selectedFluidType.value}`]: {
            ...pvtInputConfig?.pvtParameter?.fluidInput[
              `${selectedFluidType.value}`
            ],
            [name]: !value ? "" : Number(value?.replace(/^0+/, "")),
          },
        },
      },
    });
  };

  const handleCorrelationTypeInputChange = (value, name) => {
    const updatedCorrelationTypeInputs = {
      ...correlationTypeInputs,
      [name]: value,
    };
    setCorrelationTypeInputs(updatedCorrelationTypeInputs);

    const updatedPVTParameterCorrelations = {
      ...pvtInputConfig?.pvtParameter?.correlations,
      [name]: value,
    };

    const updatedPVTInputConfig = {
      ...pvtInputConfig,
      pvtParameter: {
        ...pvtInputConfig?.pvtParameter,
        correlations: updatedPVTParameterCorrelations,
      },
    };

    setPVTInputConfig(updatedPVTInputConfig);
  };
  const filterCorrelationTypeOptions = useMemo(() => {
    let filteredOptions = [];
    let groups = [];
    const selectedType = selectedFluidType?.label;

    if (selectedType === Constants.SATURATED_OIL) {
      groups = [Constants.OIL, Constants.GAS, Constants.INTERFACIAL_TENSION];
      groups = isWaterChecked ? [...groups, Constants.WATER] : groups;
    }
    if (selectedType === Constants.DREAD_OIL) {
      groups = [Constants.OIL];
      groups = isWaterChecked
        ? [...groups, Constants.WATER, Constants.INTERFACIAL_TENSION]
        : groups;
    }
    if (selectedType === Constants.DRY_GAS) {
      groups = [Constants.GAS];
      groups = isWaterChecked
        ? [...groups, Constants.WATER, Constants.INTERFACIAL_TENSION]
        : groups;
    }

    filteredOptions = correlationTypeOptions?.filter((item) =>
      groups.includes(item.groupLabel)
    );
    const interfacialTensionGroup = filteredOptions?.find(
      (item) => item.groupLabel === Constants.INTERFACIAL_TENSION
    )?.groupOptions;

    if (interfacialTensionGroup) {
      let filteredInterfacialTensionGroup;
      if (selectedType === Constants.DRY_GAS) {
        filteredInterfacialTensionGroup = interfacialTensionGroup.filter(
          (group) => group.name === "sigma_gw"
        );
      } else if (selectedType === Constants.DREAD_OIL) {
        filteredInterfacialTensionGroup = interfacialTensionGroup.filter(
          (group) => group.name === "sigma_ow"
        );
      } else if (selectedType === Constants.SATURATED_OIL && !isWaterChecked) {
        filteredInterfacialTensionGroup = interfacialTensionGroup.filter(
          (group) => group.name === "sigma_go"
        );
      } else if (selectedType === Constants.SATURATED_OIL && isWaterChecked) {
        filteredInterfacialTensionGroup = interfacialTensionGroup;
      }
      filteredOptions = filteredOptions?.map((item) =>
        item.groupLabel === Constants.INTERFACIAL_TENSION
          ? { ...item, groupOptions: filteredInterfacialTensionGroup }
          : item
      );
    }

    return filteredOptions;
  }, [selectedFluidType, correlationTypeOptions, isWaterChecked]);

  const handleFluidTypeOptions = (fluidTypevalue) => {
    const fluidTypeOption = fluidTypeOptions?.find(
      (item) => item.value === fluidTypevalue
    );
    setIsInputChanged(true);
    setSelectedFluidType(fluidTypeOption);
    setPVTInputConfig({
      ...pvtInputConfig,
      pvtParameter: {
        ...pvtInputConfig?.pvtParameter,
        fluidType: fluidTypevalue,
      },
    });
  };

  const handleWaterCheck = (isChecked) => {
    setIsInputChanged(true);
    setIsWaterChecked(isChecked);
    setPVTInputConfig({
      ...pvtInputConfig,
      pvtParameter: {
        ...pvtInputConfig?.pvtParameter,
        isWaterChecked: isChecked,
      },
    });
  };

  return (
    <>
      <Box className={classes.inputSection}>
        <FluidTypeInputSection
          fluidTypeOptions={fluidTypeOptions}
          selectedFluidType={selectedFluidType}
          isWaterChecked={isWaterChecked}
          fluidTypeInputs={fluidTypeInputs}
          inputConfig={pvtInputConfig}
          handleFluidTypeInputChange={handleFluidTypeInputChange}
          handleFluidTypeOptions={handleFluidTypeOptions}
          handleWaterCheck={handleWaterCheck}
        />
        <CorrelationsInputSection
          correlationTypeOptions={filterCorrelationTypeOptions}
          correlationTypeInputs={correlationTypeInputs}
          inputConfig={pvtInputConfig}
          handleCorrelationTypeInputChange={handleCorrelationTypeInputChange}
        />
      </Box>
    </>
  );
};

export default Forecast_Inputs;
