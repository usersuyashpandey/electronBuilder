import React from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
  menuItem: {
    "&.MuiMenuItem-root": {
      borderRadius: 15,
      marginBottom: 4,
      "&:hover": {
        background: theme.palette.background.active + " !important",
      },
      "&.Mui-selected": {
        background: theme.palette.background.active + " !important",
        "&:hover": {
          background: theme.palette.background.active + " !important",
        },
      },
    },
  },
  menu: {
    borderRadius: 8,
    boxShadow: theme.shadows[1],
    background: theme.palette.background.screen,
    // maxHeight: (props) => (props.menuHeight ? props.menuHeight : 374),
    marginLeft: 3,
    border: "1px solid " + theme.palette.background.border,
  },
  list: {
    padding: "10px 8px",
    paddingRight: "8px !important",
  },
  inputFields: {
    minWidth: 300,
    "& .MuiFormLabel-root.MuiInputLabel-root": {
      // fontFamily: "Poppins",
      fontSize: "20px !important",
      fontWeight: "400 !important",
      lineHeight: "1.2em !important",
      color: theme.palette.text.label,
      zIndex: 0,
    },
    "& .MuiInputBase-root.MuiOutlinedInput-root": {
      // fontFamily: "Poppins",
      fontSize: "1.3rem",
      borderRadius: "15px",
      height: "50px",
      width: "90%",
      // fontWeight: "lighter",
    },
    "& .MuiInputBase-input.MuiOutlinedInput-input": {
      fontSize: "16px",
      lineHeight: "18px",
      fontWeight: 500,
      // fontFamily: "Poppins",
    },
  },
}));

const InputLabelSelect = (props) => {
  const { label, value, options = [], onChange } = props;
  const { classes } = useStyles();
  return (
    <FormControl className={classes.inputFields} fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={onChange}
        MenuProps={{
          classes: {
            paper: classes.menu,
            list: classes.list,
          },
        }}
      >
        {options?.map((opt, index) => {
          return (
            <MenuItem
              key={index}
              className={classes.menuItem}
              value={opt.value}
            >
              {opt.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default InputLabelSelect;
