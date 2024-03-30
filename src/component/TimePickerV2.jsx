import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";

// Controls
import FusionButton from "./Button";
import DatePicker from "./DateTimePicker";
import Label from "./Label";
import FusionInput from "./Input";

// Utils
import * as timePickerUtil from "./constant/timePicker";

// Header Component
import FusionHeaderComponent from "./FusionHeaderComponent";

// Material UI
import { makeStyles } from "tss-react/mui";
import { Grid } from "@mui/material";

// Style
const useStyles = makeStyles()((theme) => ({
  formContainer: {
    overflow: "hidden",
    overflowY: "auto",
    minHeight: 43,
    borderBottomRightRadius: theme.borderRadius.main,
    borderBottomLeftRadius: theme.borderRadius.main,
    background: theme.palette.background.paper,
    padding: "10px",
    border: "1px solid" + theme.palette.grey[200],
  },
  formContainerNoHeader: {
    borderRadius: theme.borderRadius.small,
  },
  label: {
    padding: "0 !important",
    margin: "0 !important",
  },
  title: {
    padding: "0 !important",
    margin: "0 !important",
    fontWeight: 500,
  },
  button: {
    margin: "0 0 0 10px",
  },
  relativeTimeContainer: {
    alignItems: "center",
  },
  formContainerInner: {},
  samplingLabel: {
    marginLeft: "auto",
  },
  startEndDates: {
    flexGrow: 1,
  },
  startEndDatesItem: {
    alignItems: "center",
  },
  dateTimePicker: {
    margin: "0 6px !important",
  },
  fixHeight: {
    minHeight: 48,
    "& $formContainer": {
      overflowX: "auto",
      minHeight: 48,
    },
    "& $formContainerInner": {
      whiteSpace: "nowrap",
      flexWrap: "nowrap",
    },
    "& $relativeTimeContainer": {
      flexWrap: "nowrap",
    },
  },
}));

// Validation rules for start and end dates
const customValidationSchema = Yup.object().shape({
  startDateTime: Yup.string().required("Start date is Required").nullable(),
  endDateTime: Yup.date()
    .required("End date is Required")
    .nullable()
    .when("startDateTime", (startDateTime, schema) => {
      if (startDateTime) {
        return (
          startDateTime &&
          schema.min(
            startDateTime,
            "End date should be greater than start date"
          )
        );
      }
    }),
});

const RELATIVE_TIME = [
  { id: 0, text: "1h", value: "h1", counter: 1, label: "hours" },
  { id: 1, text: "6h", value: "h6", counter: 6, label: "hours" },
  { id: 2, text: "12h", value: "h12", counter: 12, label: "hours" },
  { id: 3, text: "1d", value: "d1", counter: 1, label: "days" },
  { id: 4, text: "1w", value: "w1", counter: 1, label: "week" },
  { id: 5, text: "1m", value: "m1", counter: 1, label: "months" },
  { id: 6, text: "3m", value: "m3", counter: 3, label: "months" },
  { id: 7, text: "6m", value: "m6", counter: 6, label: "months" },
  { id: 8, text: "1y", value: "y1", counter: 1, label: "years" },
  { id: 9, text: "5y", value: "y5", counter: 5, label: "years" },
  { id: 10, text: "10y", value: "y10", counter: 10, label: "years" },
  { id: 11, text: "All", value: "All", counter: 20, label: "years" },
];

const TimePicker = (props) => {
  const {
    style,
    showStartEndDate = true,
    showRelativeTime = true,
    showHeader = true,
    showFromTimePickerDate = false,
    text = "Submit",
    endDateText = "End Date",
    startDateText = "Start Date",
    timePicker,
    title = "",
    showAddBtn = false,
    showResetBtn = false,
    config,
    type = "datetime-local",
    dateTimeFormate = "YYYY-MM-DDTHH:mm",
    updateTimePickerData,
    handleOpenModal,
    handleResetConfirm,
    startDateMax,
  } = props;
  const { classes } = useStyles();
  const [enableSampling, setEnableSampling] = useState(true);
  const [relativeTime, setRelativeTime] = useState(
    timePicker ? timePicker.relativeTimeSelected : null
  );

  useEffect(() => {
    setEnableSampling(config ? config?.properties?.samplingInterval : true);
    setRelativeTime(timePicker?.relativeTimeSelected);
  }, [timePicker, config]);

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      ...timePicker,
      startDateTime: moment(timePicker?.startDateTime)?.format(dateTimeFormate),
      endDateTime: moment(timePicker?.endDateTime)?.format(dateTimeFormate),
    },
    enableReinitialize: true,
    validationSchema: customValidationSchema,
    onSubmit(values) {
      setRelativeTime("");
      values.relativeTimeSelected = "";

      // format dates before updating
      let cloneValues = { ...values };
      cloneValues.startDateTime = moment(cloneValues.startDateTime).toDate();
      cloneValues.endDateTime = moment(cloneValues.endDateTime).toDate();

      // update redux store for latest selected values
      if (updateTimePickerData) {
        updateTimePickerData(cloneValues);
      }
    },
    onChange(values) {
      setRelativeTime("");
      values.relativeTimeSelected = "";
      let cloneValues = { ...values };
      cloneValues.startDateTime = moment(cloneValues.startDateTime).toDate();
      cloneValues.endDateTime = moment(cloneValues.endDateTime).toDate();
      // update redux store for latest selected values
      if (updateTimePickerData) {
        updateTimePickerData(cloneValues);
      }
    },
  });

  const relativeTimeButtonVisibility = (buttonType) => {
    if (config && config.properties && config.properties.relativeTime) {
      if (config.properties.relativeTime.includes(buttonType)) {
        return false; // enable only configured buttons
      }
    }
    return true; // by default hide buttons
  };

  const relativeTimeButtonClick = (buttonType, unit, value) => {
    setRelativeTime(buttonType);

    const endDate = showFromTimePickerDate
      ? moment(timePicker.end).toDate()
      : moment().toDate();
    const startDate = moment(endDate).subtract(unit, value).toDate();

    let timePickerClone = { ...timePicker };
    timePickerClone.startDateTime = startDate;
    timePickerClone.endDateTime = endDate;
    timePickerClone.relativeTimeSelected = buttonType;
    timePickerClone.samplingType = "ss";
    timePickerClone.samplingValue = timePickerUtil.SamplingCalculator(
      startDate,
      endDate,
      null
    );

    // update redux store for latest selected values
    if (updateTimePickerData) {
      updateTimePickerData(timePickerClone);
    }
  };

  return (
    <Grid container direction="column" wrap="nowrap" style={style}>
      {showHeader && (
        <Grid item>
          <FusionHeaderComponent
            header={config?.properties?.headerName}
            displayVisualSettings
          />
        </Grid>
      )}

      <Grid
        item
        className={clsx(
          classes.formContainer,
          !showHeader && classes.formContainerNoHeader
        )}
      >
        <form onSubmit={handleSubmit}>
          <Grid
            container
            alignItems="center"
            className={classes.formContainerInner}
          >
            {showRelativeTime && (
              <Grid item>
                <Grid container className={classes.relativeTimeContainer}>
                  <Grid item>
                    <Label
                      className={classes.label}
                      text="Relative Time"
                    ></Label>
                  </Grid>
                  <Grid item>
                    <div style={{ margin: "auto 0px" }}>
                      {RELATIVE_TIME.map((item) => {
                        return (
                          <FusionButton
                            key={item.id}
                            className={classes.button}
                            onClick={() =>
                              relativeTimeButtonClick(
                                item.value,
                                item.counter,
                                item.label
                              )
                            }
                            hidden={relativeTimeButtonVisibility(item.text)}
                            template={
                              relativeTime === item.value ? "" : "transparent"
                            }
                            text={item.text}
                            small
                          />
                        );
                      })}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {enableSampling && (
              <>
                <Grid item className={classes.samplingLabel}>
                  <Label
                    className={classes.label}
                    text="Sampling (Seconds)"
                  ></Label>
                </Grid>
                <Grid item>
                  <FusionInput
                    type="text"
                    name="samplingValue"
                    value={values.samplingValue}
                    onChange={handleChange}
                    max={5}
                    small
                  />
                </Grid>
              </>
            )}

            {showStartEndDate && (
              <Grid item className={classes.startEndDates}>
                <Grid
                  container
                  className={classes.startEndDatesItem}
                  wrap="nowrap"
                  justifyContent={!showRelativeTime ? "flex-start" : "flex-end"}
                >
                  {title && (
                    <Grid item mr={1}>
                      <Label className={classes.title} text={title}></Label>
                    </Grid>
                  )}
                  <Grid item>
                    <Grid container wrap="nowrap">
                      <Grid item>
                        <Label
                          className={classes.label}
                          text={startDateText}
                        ></Label>
                      </Grid>
                      <Grid item>
                        <DatePicker
                          id={"startDateTime"}
                          value={values.startDateTime}
                          type={type}
                          label=""
                          onChange={handleChange}
                          errorMessage={errors.startDateTime}
                          config={config.properties}
                          className={classes.dateTimePicker}
                          small
                          max={startDateMax}
                        ></DatePicker>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container wrap="nowrap">
                      <Grid item>
                        <Label
                          className={classes.label}
                          text={endDateText}
                        ></Label>
                      </Grid>

                      <Grid item>
                        <DatePicker
                          id={"endDateTime"}
                          value={values.endDateTime}
                          type={type}
                          label=""
                          onChange={handleChange}
                          errorMessage={errors.endDateTime}
                          config={config.properties}
                          className={classes.dateTimePicker}
                          small
                        ></DatePicker>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {showAddBtn && (
              <Grid item>
                <FusionButton
                  template="transparent"
                  small
                  type="button"
                  text="Add Scenario"
                  className={classes.button}
                  onClick={handleOpenModal}
                />
              </Grid>
            )}

            {showResetBtn && (
              <Grid item>
                <FusionButton
                  template="transparent"
                  small
                  type="button"
                  text="Reset"
                  className={classes.button}
                  onClick={handleResetConfirm}
                />
              </Grid>
            )}

            {showStartEndDate && (
              <Grid item>
                <FusionButton
                  small
                  type="submit"
                  text={text}
                  className={classes.button}
                />
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default React.memo(TimePicker);
