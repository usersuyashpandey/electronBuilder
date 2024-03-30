import React from "react";
import { makeStyles } from "tss-react/mui";
import { Box, Typography } from "@mui/material";
import * as Constants from "../../constants/Constants";
import CorrelationsInputSection from "../Shared/CorrelationsInputSection";

const useStyles = makeStyles()((theme) => ({
  accordionHeader: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "grey.500",
    padding: "4px 16px",
    fontSize: "20px",
    backgroundColor: theme.palette.background.header, //"#bea7e9",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    height: "38px",
  },
  headerName: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const PVT_Correlations = (props) => {
  const { classes } = useStyles();
  const {
    pvtInputConfig,
    setPVTInputConfig,
    correlationTypeOptions,
    correlationTypeInputs,
    enableReset,
    setEnableReset,
    setCorrelationTypeInputs,
  } = props;

  const handleCorrelationTypeInputChange = (value, name) => {
    if (!enableReset) {
      setEnableReset(true);
    }
    setCorrelationTypeInputs({ ...correlationTypeInputs, [name]: value });
    setPVTInputConfig({
      ...pvtInputConfig,
      correlations: { ...pvtInputConfig?.correlations, [name]: value },
    });
  };

  return (
    <>
      <Box className={classes.accordionHeader}>
        <Typography
          color="textPrimary"
          variant="h2"
          className={classes.headerName}
        >
          {Constants.PVT_CORRELATIONS}
        </Typography>
      </Box>
      <CorrelationsInputSection
        correlationTypeOptions={correlationTypeOptions}
        correlationTypeInputs={correlationTypeInputs}
        pvtInputConfig={pvtInputConfig}
        handleCorrelationTypeInputChange={handleCorrelationTypeInputChange}
      />
    </>
  );
};

export default PVT_Correlations;
