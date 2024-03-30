import React from "react";
import clsx from "clsx";

// Material UI
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "./Button";

const useStyles = makeStyles()((theme) => ({
  root: {
    width: "114px",
    margin: theme.spacing(0.5),
    height: 33,
    "& .MuiInputBase-input.MuiOutlinedInput-input": {
      // fontFamily: "Poppins",
      fontSize: "18px !important",
      lineHeight: "18px !important",
      fontWeight: "500 !important",
      zIndex: 0,
      color: theme.palette.text.secondary,
    },
    "& input": {
      fontSize: "16px",
      padding: "6px 16px 7px",
    },
    "& .MuiInputBase-root": {
      borderRadius: 15,
    },
  },
  small: {
    height: 29,

    "& input": {
      padding: "7px 16px",
      fontSize: 12,
      lineHeight: "14px",
    },
  },
  textArea: {
    width: "45vw",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontSize: "10px",
    borderRadius: "4px",
    overflow: "auto",
    padding: "8px 8px",
    resize: "none",
    transition: theme.transitions.create(["backgroundColor"], {
      duration: theme.transitions?.duration.standard,
    }),
    "&:hover": {
      outline: "none",
      border: "1px solid #999999",
    },
    "&:focus": {
      backgroundColor: "#e4e4e4",
      color: "#000000",
      outline: "none",
      border: "1px solid #46a0f5",
    },
  },
  panelTitle: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "10px",
    verticalAlign: "middle",
    marginRight: "5px !important",
    margin: "auto",
  },
  saveButton: {
    fontFamily: "Poppins",
    height: 28,
    minWidth: 55,
    fontStyle: "normal",
    fontSize: 10,
    verticalAlign: "middle",
    minWwidth: 50,
  },
  inputLabelStyle: {
    // fontFamily: "Poppins",
    fontSize: "20px !important",
    fontWeight: "400 !important",
    lineHeight: "1.2em !important",
    color: theme.palette.text.label,
    zIndex: 0,
  },
}));

const FusionInput = (props) => {
  const {
    className = "",
    label,
    small = false,
    value,
    onChange,
    onBlur,
    onPointerLeave,
    onKeyDown,
    disabled,
    errorMessage,
    style,
    max,
    min,
    minValue,
    maxValue,
    type = "number",
    step,
    id = "",
  } = props;
  const { classes } = useStyles();

  return (
    <TextField
      className={clsx(classes.root, small && classes.small, className)}
      style={style}
      inputProps={{
        maxLength: max,
        minLength: min,
        min: minValue,
        max: maxValue,
        step: step,
      }}
      InputLabelProps={{
        shrink: true,
        className: classes.inputLabelStyle,
      }}
      error={errorMessage ? true : false}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      disabled={disabled}
      type={type}
      helperText={errorMessage}
      id={id}
      name={props.name}
    />
  );
};

const FusionTextArea = (props) => {
  const { label, value, onChange, rows, onCommentSave } = props;
  const { classes } = useStyles();

  return (
    <>
      <Typography
        className={classes.panelTitle}
        variant="h4"
      >{`${label}`}</Typography>
      <textarea
        className={classes.textArea}
        rows={rows}
        value={value}
        onChange={onChange}
      ></textarea>
      <Button
        text="Save"
        className={classes.saveButton}
        onClick={onCommentSave}
      />
    </>
  );
};

const FusionInputNumber = (props) => <FusionInput {...props} type="number" />;

const FusionInputText = (props) => <FusionInput {...props} type="text" />;

const FusionInputTextArea = (props) => <FusionTextArea {...props} />;

export { FusionInputNumber, FusionInputText, FusionInputTextArea };

export default FusionInput;
