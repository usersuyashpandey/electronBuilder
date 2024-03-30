import React, { useMemo, useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepButton,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  StepConnector,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DateSelectionPopup from "../DateSelectionPopup";
import moment from "moment";
import { toastErrorMessage } from "../../utils/toast";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmationPopup from "../ConfirmationPopup";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import clsx from "clsx";
import { TimeFormat } from "./TimeFormat";

const useStyles = makeStyles()((theme) => ({
  containerMenuIcon: {
    color: theme.palette.primary.main,
    height: "30px",
    width: "30px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  cancelMenuIcon: {
    color: theme.palette.primary.main,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.background.header,
    },
    margin: 0,
    padding: 0,
    marginLeft: 5,
    paddingBottom: 2,
  },
  stepper: {
    width: "100%",
    "& .MuiStepConnector-line": {
      minWidth: "50px",
      borderColor: theme.palette.primary.main,
      marginTop: 5,
      marginLeft: 20,
      marginRight: 20,
    },
  },
  step: {
    borderRadius: 10,
    padding: "7px 40px 2px 40px",
    "@media (max-width: 1200px)": {
      padding: "7px 15px 2px 15px",
    },
    "&:hover": {
      // backgroundColor: theme.palette.background.header,
    },
    "& .MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel": {
      "& .MuiSvgIcon-root": {
        cursor: "pointer",
        // color: theme.palette.primary.main,
        height: "35px",
        width: "35px",
        marginTop: "-6px",
      },
    },
    "&.error": {
      "& .MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel": {
        "& .MuiSvgIcon-root": {
          color: theme.palette.text.label,
          cursor: "pointer",
          border: "2px solid #FF0000",
          height: "35px",
          width: "35px",
          marginTop: "-6px",
          borderRadius: 50,
        },
      },
    },
  },
  fileButton: {
    height: 40,
    marginTop: 2,
    display: "inline-block",
    padding: "unset",
    borderRadius: "100%",
    minWidth: 40,
    fontWeight: 600,
    textTransform: "none",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      // color: theme.palette.primary.main,
      height: "35px",
      width: "35px",
    },
  },
}));

export default function HorizontalNonLinearStepper(props) {
  const {
    selectedConfigDate,
    bhpInputConfig,
    setSelectedConfigDate,
    handleNewConfigDateErrors,
    surveyError,
    thermalError,
    gasLiftError,
    casingError,
    tubingError,
    nodeError,
    setIsInputChanged,
    setBHPInputConfig,
  } = props;
  const { classes } = useStyles();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const maxVisibleSteps = windowWidth > 1500 ? 5 : 3;
  const [showDateSelectionPopup, setShowDateSelectionPopup] = useState(false);
  const [showDeleteSelectionPopup, setShowDeleteSelectionPoupup] =
    useState(false);
  const [activeStep, setActiveStep] = React.useState(
    bhpInputConfig?.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    )
  );
  const [steps, setSteps] = useState(
    bhpInputConfig?.wellboreConfig?.map((item) =>
      moment(item.datetime).format(TimeFormat.dateFull)
    )
  );
  const prevDate = steps[steps.length - 1];
  const handleStep = (step) => () => {
    setActiveStep(step);
    setSelectedConfigDate(moment(steps[step]).format(TimeFormat.datePicker));
  };
  const casingobj = {
    d_inner: [0],
    rough_inner: [0],
    md: [0],
  };
  const tubingobj = {
    d_inner: [0],
    d_outer: [0],
    md: [0],
    rough_inner: [0],
    rough_outer: [0],
  };

  const surveyobj = {
    md: [0],
    tvd: [0],
  };
  const geothermalobj = {
    md: [0],
    tvd: [0],
    temp: [0],
  };

  const handleDeleteStep = () => () => {
    const updatedSteps = [...steps];
    updatedSteps.splice(activeStep, 1);
    setSteps(updatedSteps);

    let newActiveStep = activeStep;
    if (activeStep >= updatedSteps.length) {
      newActiveStep = updatedSteps.length - 1;
    }
    setActiveStep(newActiveStep);
    setShowDeleteSelectionPoupup(false);
    const sortedWellborConfig = bhpInputConfig?.wellboreConfig?.filter((item) =>
      updatedSteps?.includes(moment(item?.datetime).format(TimeFormat.dateFull))
    );
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: sortedWellborConfig,
    };
    setSelectedConfigDate(
      moment(updatedSteps[newActiveStep]).format(TimeFormat.datePicker)
    );
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
  };

  const handleNext = () => {
    const step = activeStep + 1;
    setActiveStep(step);
    setSelectedConfigDate(moment(steps[step]).format(TimeFormat.datePicker));
  };

  const handleBack = () => {
    const step = activeStep - 1;
    setActiveStep(step);
    setSelectedConfigDate(moment(steps[step]).format(TimeFormat.datePicker));
  };

  const startIndex = useMemo(() => {
    const startIndex =
      steps?.length >= maxVisibleSteps && activeStep >= maxVisibleSteps
        ? activeStep - maxVisibleSteps + 1
        : 0;
    return startIndex;
  }, [steps, activeStep, maxVisibleSteps]);

  const endIndex = useMemo(() => {
    const endIndex =
      steps?.length >= maxVisibleSteps && activeStep >= maxVisibleSteps
        ? startIndex + maxVisibleSteps - 1
        : maxVisibleSteps - 1;
    return endIndex;
  }, [steps?.length, activeStep, startIndex, maxVisibleSteps]);

  const handleDateSelection = (value) => {
    setShowDateSelectionPopup(false);
    const isDateExist = steps.some(
      (dt) =>
        moment(dt).format(TimeFormat.dateFull) ===
        moment(value).format(TimeFormat.dateFull)
    );
    if (isDateExist) {
      toastErrorMessage("The selected date already exist.");
      return;
    }
    const newSteps = [...steps, value]
      .sort((a, b) =>
        moment(a).format(TimeFormat.datePicker) >
        moment(b).format(TimeFormat.datePicker)
          ? 1
          : -1
      )
      .map((dt) => moment(dt).format(TimeFormat.dateFull));
    const newActiveStepIndex = newSteps?.findIndex(
      (dt) => dt === moment(value).format(TimeFormat.dateFull)
    );
    if (newActiveStepIndex !== -1) {
      setActiveStep(newActiveStepIndex);
      setSteps(newSteps);
      let prevWellborConfig = bhpInputConfig?.wellboreConfig[0];
      if (newActiveStepIndex > 1) {
        prevWellborConfig =
          bhpInputConfig?.wellboreConfig[newActiveStepIndex - 1];
      }
      const sortedWellborConfig = [
        ...bhpInputConfig?.wellboreConfig,
        {
          ...prevWellborConfig,
          datetime: moment(value).format(TimeFormat.datePicker),
          nodes: {
            md: [0, 0],
            name: ["Gauge", "BHP"],
          },
          casing: casingobj,
          tubing: tubingobj,
          deviation_survey: surveyobj,
          geothermal_gradient: geothermalobj,
          lift_method: "NaturalFlow",
          flow_type: "TubingFlow",
          flow_correlation: "hagedorn_brown",
        },
      ].sort((a, b) => (a.datetime > b.datetime ? 1 : -1));
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: sortedWellborConfig,
      };
      setSelectedConfigDate(moment(value).format(TimeFormat.datePicker));
      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      handleNewConfigDateErrors(
        moment(value).format(TimeFormat.datePicker),
        newActiveStepIndex
      );
    }
  };

  const nextAccess = useMemo(() => {
    let isDisabled = true;
    if (steps?.length >= maxVisibleSteps + 1) {
      isDisabled = false;
    }
    if (endIndex === steps?.length - 1) {
      isDisabled = true;
    }
    return isDisabled;
  }, [steps, endIndex, maxVisibleSteps]);

  const isError = (step) => {
    const date = moment(steps[step]).format(TimeFormat.datePicker);
    const isSurveyErrorExist = surveyError?.some(
      (cell) => cell.datetime === date && cell.cellErrors?.length > 0
    );
    const isThermalErrorExist = thermalError?.some(
      (cell) => cell.datetime === date && cell.cellErrors?.length > 0
    );
    const isGasLiftErrorExist = gasLiftError?.some(
      (cell) => cell.datetime === date && cell.cellErrors?.length > 0
    );
    const isCasingErrorExist = casingError?.some(
      (cell) => cell.datetime === date && cell.cellErrors?.length > 0
    );
    const isTubingErrorExist = tubingError?.some(
      (cell) => cell.datetime === date && cell.cellErrors?.length > 0
    );
    const isNodeErrorExist = nodeError?.some(
      (cell) => cell.datetime === date && (cell.Gauge !== "" || cell.BHP !== "")
    );
    return (
      isSurveyErrorExist ||
      isThermalErrorExist ||
      isGasLiftErrorExist ||
      isCasingErrorExist ||
      isCasingErrorExist ||
      isTubingErrorExist ||
      isNodeErrorExist
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleStep(steps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxVisibleSteps, activeStep]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          ml: -1.5,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep <= maxVisibleSteps - 1}
            className={classes.fileButton}
            style={{ marginRight: "12px" }}
          >
            <KeyboardArrowLeft />
          </Button>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Stepper
            nonLinear
            activeStep={activeStep}
            className={classes.stepper}
            alternativeLabel
            connector={null}
          >
            {steps.map(
              (label, index) =>
                index >= startIndex &&
                index <= endIndex && (
                  <Step
                    key={label}
                    index={index}
                    className={clsx(classes.step, { error: isError(index) })}
                  >
                    <StepConnector
                      sx={{ display: index === startIndex ? "none" : "block" }}
                    />
                    <StepButton
                      color="inherit"
                      onClick={handleStep(index)}
                    ></StepButton>
                    <Typography
                      className={classes.dateLable}
                      sx={{
                        width: "max-content",
                        mt: 2,
                        fontWeight: index === activeStep ? "bold" : "normal",
                      }}
                    >
                      {label}
                      {index === activeStep && (
                        <IconButton
                          className={classes.cancelMenuIcon}
                          onClick={() => setShowDeleteSelectionPoupup(true)}
                          fontSize="small"
                          disabled={steps.length === 1}
                        >
                          <Tooltip
                            title="Delete"
                            placement="right"
                            arrow
                            enterDelay={100}
                          >
                            <CancelIcon fontSize="small" />
                          </Tooltip>
                        </IconButton>
                      )}

                      {Boolean(showDeleteSelectionPopup) && (
                        <ConfirmationPopup
                          open={showDeleteSelectionPopup}
                          handleClose={() =>
                            setShowDeleteSelectionPoupup(false)
                          }
                          handleConfirm={handleDeleteStep(index)}
                          warnMessage={`Do you want to delete ${moment(
                            selectedConfigDate
                          ).format(TimeFormat.dateFull)} ?`}
                        />
                      )}
                    </Typography>
                  </Step>
                )
            )}
            <Step key={"newDate"}>
              <StepConnector />
              <IconButton
                onClick={() => setShowDateSelectionPopup(true)}
                sx={{ mt: -0.5, ml: 5 }}
              >
                <Tooltip
                  title="Add new date"
                  placement="right"
                  arrow
                  enterDelay={100}
                >
                  <AddCircleOutlineIcon className={classes.containerMenuIcon} />
                </Tooltip>
              </IconButton>
            </Step>
          </Stepper>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Button
            size="small"
            onClick={handleNext}
            disabled={nextAccess}
            className={classes.fileButton}
            style={{ marginLeft: "12px" }}
          >
            <KeyboardArrowRight />
          </Button>
        </Box>

        {Boolean(showDateSelectionPopup) && (
          <DateSelectionPopup
            open={showDateSelectionPopup}
            handleClose={() => setShowDateSelectionPopup(false)}
            handleConfirm={handleDateSelection}
            prevdate={prevDate}
          />
        )}
      </Box>
      {steps.length === 0 ? (
        <Typography style={{ margin: 8, color: "red", paddingLeft: 5 }}>
          Please add a date
        </Typography>
      ) : (
        ""
      )}
    </>
  );
}
