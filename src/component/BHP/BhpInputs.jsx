import React, { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { Box } from "@mui/material";
import * as Constants from "../constant/ModelConstants";
import FluidTypeInputSection from "../FluidTypeInputSection";
import ReferenceRangeInputSection from "../ReferenceRangeInputSection";
import CorrelationsInputSection from "../CorrelationsInputSection";

const useStyles = makeStyles()((theme) => ({
  inputSection: {
    height: "calc(100vh - 140px)",
    overflowY: "auto",
    paddingBottom: 15,
    paddingRight: 50,
  },
}));

const BHP_Inputs = (props) => {
  const { classes } = useStyles();
  const {
    bhpInputConfig,
    setBHPInputConfig,
    showReference = false,
    fluidTypeOptions,
    correlationTypeOptions,
    correlationTypeInputs,
    setIsInputChanged,
    setCorrelationTypeInputs,
    referenceTypeOptions,
    selectedFluidType,
    isWaterChecked,
    selectedReference,
    fluidTypeInputs,
    referenceTypeInputs,
    enableReset,
    setEnableReset,
    setFluidTypeInputs,
    setSelectedFluidType,
    setIsWaterChecked,
    setSelectedReference,
    setReferenceTypeInputs,
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
    setBHPInputConfig({
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig?.pvtParameter,
        fluidInput: {
          ...bhpInputConfig?.pvtParameter?.fluidInput,
          [`${selectedFluidType.value}`]: {
            ...bhpInputConfig?.pvtParameter?.fluidInput[
              `${selectedFluidType.value}`
            ],
            [name]: !value ? "" : Number(value.replace(/^0+/, "")),
          },
        },
      },
    });
  };

  const handleReferenceTypeInputChange = (value, name) => {
    const refValues =
      bhpInputConfig?.pvtParameter?.refInput[`${selectedReference.value}`];
    const minVal = refValues?.min;
    const maxVal = refValues?.max;
    let { min, max } = referenceTypeInputs[name];
    if (name === Constants.INCREMENT) {
      max = maxVal - minVal;
    }
    let inputError = "";

    if (!value) {
      inputError = Constants.EMPTY_INPUT_MESSAGE;
    } else if (Number(value) < min || Number(value) > max) {
      inputError = `${Constants.EMPTY_INPUT_MESSAGE} between ${min} to ${max}`;
    } else if (name === Constants.MIN.toLowerCase() && maxVal) {
      if (Number(value) > Number(maxVal))
        inputError = Constants.LESS_INPUT_MESSAGE;
    } else if (name === Constants.MAX.toLowerCase() && minVal) {
      if (Number(value) < Number(minVal))
        inputError = Constants.GREATER_INPUT_MESSAGE;
    }
    if (!enableReset) {
      setEnableReset(true);
    }
    setIsInputChanged(true);
    setReferenceTypeInputs({
      ...referenceTypeInputs,
      [name]: { ...referenceTypeInputs[name], error: inputError },
    });
    setBHPInputConfig({
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig?.pvtParameter,
        refInput: {
          ...bhpInputConfig?.pvtParameter?.refInput,
          [`${selectedReference.value}`]: {
            ...bhpInputConfig?.pvtParameter?.refInput[
              `${selectedReference.value}`
            ],
            [name]: !value ? "" : Number(value.replace(/^0+/, "")),
          },
        },
      },
    });
  };

  const handleCorrelationTypeInputChange = (value, name) => {
    if (!enableReset) {
      setEnableReset(true);
    }
    setIsInputChanged(true);
    setCorrelationTypeInputs({ ...correlationTypeInputs, [name]: value });
    setBHPInputConfig({
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig?.pvtParameter,
        correlations: {
          ...bhpInputConfig?.pvtParameter?.correlations,
          [name]: value,
        },
      },
    });
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
    setBHPInputConfig({
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig?.pvtParameter,
        fluidType: fluidTypevalue,
      },
    });
  };

  const handleWaterCheck = (isChecked) => {
    setIsInputChanged(true);
    setIsWaterChecked(isChecked);
    setBHPInputConfig({
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig?.pvtParameter,
        isWaterChecked: isChecked,
      },
    });
  };

  const handleReferenceTypeOptions = (referenceTypevalue) => {
    const referenceTypeOption = referenceTypeOptions?.find(
      (item) => item.value === referenceTypevalue
    );
    setIsInputChanged(true);
    setSelectedReference(referenceTypeOption);
    setBHPInputConfig({
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig?.pvtParameter,
        refType: referenceTypevalue,
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
          inputConfig={bhpInputConfig}
          handleFluidTypeInputChange={handleFluidTypeInputChange}
          handleFluidTypeOptions={handleFluidTypeOptions}
          handleWaterCheck={handleWaterCheck}
        />
        {showReference && (
          <ReferenceRangeInputSection
            selectedReference={selectedReference}
            referenceTypeInputs={referenceTypeInputs}
            inputConfig={bhpInputConfig}
            handleReferenceTypeInputChange={handleReferenceTypeInputChange}
            handleReferenceTypeOptions={handleReferenceTypeOptions}
          />
        )}
        <CorrelationsInputSection
          correlationTypeOptions={filterCorrelationTypeOptions}
          correlationTypeInputs={correlationTypeInputs}
          inputConfig={bhpInputConfig}
          handleCorrelationTypeInputChange={handleCorrelationTypeInputChange}
        />
      </Box>
    </>
  );
};

export default BHP_Inputs;
