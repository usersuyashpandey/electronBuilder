import React, { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { Box, Grid, Typography } from "@mui/material";
import InputLabelSelect from "./InputLabelSelect";

const useStyles = makeStyles()((theme) => ({
  dropdownInputs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginRight: "16px",
  },
  selectList: {
    "@media (min-width: 1366px) and (max-width: 1484px)": {
      maxWidth: "50%",
      minWidth: "50%",
    },
  },
  groupItems: {
    "@media (max-width: 760px)": {
      paddingLeft: "16px",
    },
  },
}));

const CorrelationsInputSection = (props) => {
  const { classes } = useStyles();
  const {
    inputConfig,
    correlationTypeOptions,
    handleCorrelationTypeInputChange,
  } = props;
  const correlationInputFields = useMemo(() => {
    const inputGroups = correlationTypeOptions || [];
    return inputGroups.map((group, index) => (
      <Box
        sx={{ display: "flex", flexDirection: "column", paddingTop: "16px" }}
        key={index}
      >
        <Typography variant="body3Large">{`${group?.groupLabel} :`}</Typography>
        <Grid
          container
          className={classes.groupItems}
          item
          rowSpacing={4}
          mt={-2}
          pl={6.5}
        >
          {group?.groupOptions?.map((item, idx) => (
            <Grid
              item
              className={classes.selectList}
              sm={12}
              md={12}
              lg={6}
              xl={4}
              key={idx}
              display="flex"
              justifyContent="center"
            >
              <Box className={classes.dropdownInputs}>
                <InputLabelSelect
                  label={item?.label}
                  value={inputConfig?.pvtParameter?.correlations[item?.name]}
                  options={item?.options}
                  onChange={(e) =>
                    handleCorrelationTypeInputChange(e.target.value, item?.name)
                  }
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correlationTypeOptions, inputConfig, handleCorrelationTypeInputChange]);

  return <Box>{correlationInputFields}</Box>;
};

export default CorrelationsInputSection;
