import React, { useMemo, useEffect, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import { Grid, FormControl } from "@mui/material";
import { FusionInputNumber } from "../Input";

const useStyles = makeStyles()((theme) => ({
  inputFields: {
    paddingLeft: 16,
    marginTop: 16,
    marginLeft: 16,
    flexDirection: "row",
    display: "flex",
    "& .MuiFormControl-root.MuiTextField-root": {
      width: "85%",
    },
    "& .MuiFormLabel-root.MuiInputLabel-root": {
      fontWeight: 450,
      lineHeight: "1.2em",
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
}));

function BHPNodeDepth(props) {
  const {
    bhpInputConfig,
    nodeError,
    focusElem,
    setFocusElem,
    setNodeError,
    selectedConfigDate,
    setIsInputChanged,
    setBHPInputConfig,
  } = props;
  const { classes } = useStyles();
  const nodeRef = useRef(null);
  const nodeobj = {
    name: ["Gauge", "BHP"],
  };

  const depthError = useMemo(() => {
    const error = nodeError?.find(
      (item) => item.datetime === selectedConfigDate
    );
    return error;
  }, [nodeError, selectedConfigDate]);

  //     useEffect(()=>{
  //     const configIndex = bhpInputConfig.wellboreConfig?.findIndex(item => item.datetime === selectedConfigDate);
  //     if(configIndex === 1){
  //         const updatedWellboreConfig = [...bhpInputConfig.wellboreConfig];

  //         updatedWellboreConfig[configIndex] = {
  //             ...updatedWellboreConfig[configIndex],
  //             nodes:nodeobj

  //         };
  //         const input = {
  //             ...bhpInputConfig,
  //             wellboreConfig:updatedWellboreConfig,
  //         };
  //     setBHPInputConfig(input);
  //     }
  //    },[bhpInputConfig])

  useEffect(() => {
    setTimeout(() => {
      if (focusElem && nodeRef?.current) {
        const rowId = `[id="${focusElem}"]`;
        let focusElement = nodeRef.current?.querySelectorAll(rowId);
        if (focusElement?.length) {
          focusElement[0].focus();
        }
      }
    }, 100);
  }, [focusElem]);

  const nodeInputFields = useMemo(() => {
    const nodes = bhpInputConfig.wellboreConfig?.find(
      (item) => item?.datetime === selectedConfigDate
    )?.nodes;
    const handleNodeChange = (nodeName, value) => {
      const label = nodeName;
      let errorMsg = "";
      const surveyValues = bhpInputConfig.wellboreConfig?.find(
        (item) => item?.datetime === selectedConfigDate
      )?.deviation_survey;
      const surveyMDValues = surveyValues?.length
        ? surveyValues
            ?.map((item) => item?.md)
            ?.sort((a, b) => (a > b ? 1 : -1))
        : surveyValues?.md?.sort((a, b) => (a > b ? 1 : -1));
      const fieldDecInex = value?.indexOf(".");
      if (isNaN(parseInt(value))) {
        errorMsg = `${label} value can not be empty`;
      } else if (fieldDecInex !== -1) {
        errorMsg = `${label} can not have decimal value`;
      } else if (parseFloat(value) < 0) {
        errorMsg = `${label} value can not be less than 0`;
      } else if (
        surveyMDValues?.length &&
        parseFloat(value) > surveyMDValues[surveyMDValues.length - 1]
      ) {
        errorMsg = `${label} value can not be greater than max of survey MD`;
      }
      const nodeValue = Number(value.replace(/^0+/, ""));
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      let updateNodes = { ...updateWellConfig[configIndex]?.nodes };
      const nodeIndex = updateNodes?.name?.findIndex(
        (item) => item === nodeName
      );
      const updateValues = [...updateNodes?.md];
      updateValues[nodeIndex] = nodeValue;
      updateNodes = { ...updateNodes, md: updateValues };
      updateWellConfig[configIndex].nodes = { ...updateNodes };
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };
      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      const errorIndex = nodeError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateNodeError = {
        ...nodeError[errorIndex],
        [nodeName]: errorMsg,
      };
      const updateError = [...nodeError];
      updateError[errorIndex] = { ...updateNodeError };
      setNodeError(updateError);
      setFocusElem(nodeName);
    };
    const error = nodeError?.find(
      (item) => item.datetime === selectedConfigDate
    );
    return (nodeobj?.name || []).map((item, index) => {
      const nodeValue = nodes?.md[index];
      return (
        item !== "Wellhead" && (
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
              label={`${item === "BHP" ? "Reservoir " : item} (ft)`}
              // disabled
              value={nodeValue}
              id={item}
              errorMessage={error ? error[item] : ""}
              onChange={(e) => handleNodeChange(item, e.target.value)}
            />
          </Grid>
        )
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    depthError,
    classes.inputField,
    selectedConfigDate,
    bhpInputConfig,
    nodeError,
    setBHPInputConfig,
    setFocusElem,
    setIsInputChanged,
    setNodeError,
  ]);

  return (
    <FormControl
      ref={nodeRef}
      className={classes.inputFields}
      component="fieldset"
    >
      <Grid container item rowSpacing={4}>
        {nodeInputFields}
      </Grid>
    </FormControl>
  );
}

export default BHPNodeDepth;
