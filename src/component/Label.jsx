import React from "react";
import clsx from "clsx";

// Material UI
// import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";

const useStyles = styled((theme) => ({
  root: {
    margin: theme.spacing(0.5),
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    height: 31,
    lineHeight: 1,
    boxSizing: "border-box",
    padding: "8px 6px 6px 6px",
  },
  small: {
    fontSize: 12,
    padding: "7px 6px 5px 6px",
    height: 29,
  },
}));

function Label(props) {
  const { text, className, small } = props;
  const classes = useStyles();

  return (
    <label className={clsx(classes.root, small && classes.small, className)}>
      {text}
    </label>
  );
}

export default Label;
