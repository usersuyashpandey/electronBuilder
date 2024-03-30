import React from "react";
import clsx from "clsx";
import { makeStyles } from "tss-react/mui";
import SpinnerIcon from "../images/icons/SpinnerIcon.svg";
import { Box } from "@mui/material";

// Define your styles object separately
const useStyles = makeStyles()((theme) => ({
  spinner: {
    display: "inline-block",
    borderRadius: "50%",
    animation: "$animation-rotate .75s linear infinite",
    // Use theme variables directly
    color: "grey",
    fill: "transparent",
    "&.light": {
      color: "white",
    },
  },
  "@keyframes animation-rotate": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
}));

const Spinner = ({
  variant = "dark",
  spinnerSize = "24px",
  spinnerColor,
  ...props
}) => {
  const { classes } = useStyles();
  // Dynamically set the width and height based on props
  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    // Dynamically set the color based on props
    color: spinnerColor || classes.spinner?.color,
  };

  return (
    <div
      className={clsx(classes.spinner, variant)}
      style={spinnerStyle}
      role="status"
    >
      <img src={SpinnerIcon} alt="Spinner" />
    </div>
  );
};

export default Spinner;
