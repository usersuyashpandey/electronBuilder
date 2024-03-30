import React from "react";
import clsx from "clsx";

// Material UI
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

// Style
const useStyles = makeStyles()((theme) => ({
  formControl: {
    margin: theme.spacing(0.5),
    borderRadius: 0,

    "& .MuiInputBase-root": {
      // background: theme.palette.background.paper,
    },

    "& .MuiInputBase-input": {
      padding: "6px 0 4px 6px",
      marginTop: 0,
      minHeight: 33,
      boxSizing: "border-box",
      fontSize: 15,
      fontWeight: 400,
      border: "none !important",
      outline: "none !important",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: 15,
    },

    // Icon Calendar
    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(0.6)",
    },
  },
  formControlSmall: {
    "& .MuiInputBase-input": {
      minHeight: 31,
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    "& .MuiInputBase-input": {
      fontSize: 15,
      letterSpacing: "-0.4px",
    },
  },
  textField: {
    width: "auto",
    // overflow: "hidden"
  },
  root: {
    position: "relative",
    width: "100%",
    "& .MuiInputBase-input": {
      color: "transparent",
      textIndent: "-100%",
      maxWidth: 210,
    },
  },
  display: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  input: {
    color: "transparent",
    textIndent: "-100%",
  },
}));

export default function FusionDateTimePicker(props) {
  const { classes } = useStyles();
  const {
    id,
    onChange,
    type,
    label,
    max,
    value,
    className,
    style,
    error = "",
    small = false,
    name,
  } = props;

  const fieldType = type ? type : "datetime-local"; // time / date / datetime-local

  return (
    <FormControl
      className={clsx(
        classes.formControl,
        {
          "type-date": fieldType === "date",
          "type-time": fieldType === "time",
          "type-datetime-local": fieldType === "datetime-local",
          colorPrimary: true,
          noLabel: label === undefined || label === "",
          noMargin: className && className.indexOf("noMargin") > -1,
        },
        small && classes.formControlSmall,
        className
      )}
      style={style}
    >
      <div className={classes.container}>
        <TextField
          id={id}
          type={fieldType}
          label={label}
          value={value ? value : ""}
          onChange={onChange}
          className={classes.textField}
          inputProps={{
            className: className,
            max,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error}
          helperText={error}
          name={name}
        />
      </div>
    </FormControl>
  );
}
