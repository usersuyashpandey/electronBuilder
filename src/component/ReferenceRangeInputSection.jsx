import React, { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import {
  Box,
  Grid,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { FusionInputNumber } from "./Input";
import * as Constants from "./constant/ModelConstants";

const useStyles = makeStyles()((theme) => ({
  inputFields: {
    "& .MuiFormControl-root.MuiTextField-root": {
      width: "85%",
    },
    "& .MuiFormLabel-root.MuiInputLabel-root": {
      fontWeight: 450,
      lineHeight: "1em",
      fontSize: "20px",
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
  refTypeRow: {
    display: "flex",
    paddingTop: "24px",
    flexDirection: "row",
    "@media (max-width: 690px)": {
      flexDirection: "column",
    },
  },
  refType: {
    flexDirection: "row",
    paddingLeft: "10px",
    "@media (max-width: 835px)": {
      flexDirection: "column",
    },
    "@media (max-width: 690px)": {
      flexDirection: "row",
      paddingLeft: "16px",
    },
  },
}));

const ReferenceRangeInputSection = (props) => {
  const { classes } = useStyles();
  const {
    inputConfig,
    selectedReference,
    referenceTypeInputs,
    handleReferenceTypeInputChange,
    handleReferenceTypeOptions,
  } = props;

  const referenceTypeInputFields = useMemo(() => {
    const inputFields = selectedReference?.inputFields || [];
    return inputFields.map((item, index) => {
      const refField =
        inputConfig?.pvtParameter?.refInput[`${selectedReference.value}`];
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
            label={`${referenceTypeInputs[item]?.label} (${referenceTypeInputs[item]?.unit})`}
            value={refField[item]}
            errorMessage={referenceTypeInputs[item]?.error}
            onChange={(e) =>
              handleReferenceTypeInputChange(e.target.value, item)
            }
          />
        </Grid>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReference, referenceTypeInputs, inputConfig]);

  return (
    <>
      <Box className={classes.refTypeRow}>
        <Typography variant="body3Large">
          {Constants.REFERENCE_RANGE}
        </Typography>
        <FormControl>
          <RadioGroup
            row
            name={"selectedReference"}
            aria-labelledby="demo-radio-buttons-group-label"
            onChange={(e) => handleReferenceTypeOptions(e.target.value)}
            value={selectedReference?.value}
            className={classes.refType}
          >
            <FormControlLabel
              value={Constants.PRESSURE.toLowerCase()}
              control={<Radio />}
              label={`${Constants.PRESSURE}`}
              sx={{ ml: -1 }}
            />
            <FormControlLabel
              value={Constants.TEMPERATURE.toLowerCase()}
              control={<Radio />}
              label={`${Constants.TEMPERATURE}`}
              sx={{ ml: -1 }}
            />
          </RadioGroup>
        </FormControl>
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
          {referenceTypeInputFields}
        </Grid>
      </FormControl>
    </>
  );
};

export default ReferenceRangeInputSection;
