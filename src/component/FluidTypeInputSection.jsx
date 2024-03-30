import React, { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  FormControl,
  Checkbox,
} from "@mui/material";
import FusionSelect from "./Select";
import { FusionInputNumber } from "./Input";
import * as Constants from "./constant/ModelConstants";

const useStyles = makeStyles()((theme) => ({
  propSelector: {
    marginTop: "4px",
  },
  inputFields: {
    "& .MuiFormControl-root.MuiTextField-root": {
      width: "85%",
    },
    "& .MuiFormLabel-root.MuiInputLabel-root": {
      fontWeight: 450,
      lineHeight: "1em",
      fontSize: "20px", //"1.2rem"
    },
    "& .MuiInputBase-root.MuiOutlinedInput-root": {
      fontSize: "1.3rem",
    },
    "& .MuiInputBase-input.MuiOutlinedInput-input": {
      fontSize: "18px",
    },
  },
  inputField: {
    "@media (max-width: 840px)": {
      maxWidth: "90%",
      minWidth: "50%",
    },
  },
  fluidTypeRow: {
    display: "flex",
    // paddingTop: "24px",
    flexDirection: "row",
    "@media (max-width: 690px)": {
      flexDirection: "column",
    },
  },
  fluidType: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: "10px",
    flexGrow: 1,
    justifyContent: "space-between",
    "@media (max-width: 835px)": {
      flexDirection: "column",
    },
    "@media (max-width: 690px)": {
      flexDirection: "row",
      paddingLeft: "16px",
    },
  },
}));

const FluidTypeInputSection = (props) => {
  const { classes } = useStyles();
  const {
    inputConfig,
    fluidTypeOptions,
    selectedFluidType,
    isWaterChecked,
    fluidTypeInputs,
    handleFluidTypeInputChange,
    handleFluidTypeOptions,
    handleWaterCheck,
  } = props;

  const fluidTypeInputFields = useMemo(() => {
    const inputFields = isWaterChecked
      ? selectedFluidType?.inputFields
      : selectedFluidType?.inputFields?.filter(
          (item) => item !== "wat_salinity"
        );
    return (inputFields || []).map((item, index) => {
      const fluidField =
        inputConfig?.pvtParameter?.fluidInput[selectedFluidType?.value];
      const step =
        fluidTypeInputs[item]?.label === "Gas Gravity" ||
        fluidTypeInputs[item]?.label === "Molar Fraction - N2" ||
        fluidTypeInputs[item]?.label === "Molar Fraction - H2S" ||
        fluidTypeInputs[item]?.label === "Molar Fraction - CO2"
          ? 0.1
          : 1;
      return (
        <Grid
          item
          className={classes.inputField}
          key={index}
          sm={12}
          md={6}
          lg={4}
          xl={3}
        >
          <FusionInputNumber
            label={
              fluidTypeInputs[item]?.unit === "%" ||
              fluidTypeInputs[item]?.unit === "psia"
                ? fluidTypeInputs[item]?.label
                : `${fluidTypeInputs[item]?.label} (${fluidTypeInputs[item]?.unit})`
            }
            // disabled
            value={fluidField[item]}
            errorMessage={fluidTypeInputs[item]?.error}
            step={step}
            onChange={(e) => handleFluidTypeInputChange(e.target.value, item)}
          />
        </Grid>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFluidType, isWaterChecked, fluidTypeInputs, inputConfig]);

  return (
    <>
      <Box className={classes.fluidTypeRow}>
        <Typography variant="body3Large">{Constants.FLUID_TYPE}</Typography>
        <Box className={classes.fluidType}>
          <Box sx={{ display: "flex" }}>
            <FusionSelect
              name="well-selector"
              onChange={(e) => handleFluidTypeOptions(e?.target?.value)}
              options={fluidTypeOptions}
              value={selectedFluidType?.value}
              fullName={true}
              className={classes.propSelector}
              menuHeight={525}
              selectHeight={35}
            />
            <FormControlLabel
              control={<Checkbox checked={isWaterChecked} />}
              label={<Typography variant="body4Large">{"Water"}</Typography>}
              onChange={(e) => handleWaterCheck(e.target.checked)}
              disabled={false}
              sx={{ pl: 2 }}
            />
          </Box>
        </Box>
      </Box>
      <FormControl
        className={classes.inputFields}
        component="fieldset"
        sx={{
          pl: 2,
          mt: 2,
          ml: 4.5,
          flexDirection: "row",
          display: "flex",
          mr: 2,
        }}
      >
        <Grid container item rowSpacing={4}>
          {fluidTypeInputFields}
        </Grid>
      </FormControl>
    </>
  );
};

export default FluidTypeInputSection;
