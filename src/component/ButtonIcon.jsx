import * as React from "react";
import clsx from "clsx";

// Material UI
import { styled } from "@mui/system";
import IconButton from "@mui/material/IconButton";

const StyledIconButton = styled((theme) => ({
  root: {
    order: "0",
    cursor: "pointer",
    borderRadius: "0",
    padding: "0px",

    "& svg": {
      width: "1em",
      height: "1em",
      fontSize: "30px",
      // Theme
      fill: theme.palette.primary.main,
      stroke: "transparent",
    },

    "&.outline": {
      "& svg": {
        // Theme
        fill: "transparent",
        stroke: theme.palette.primary.main,
      },
    },
  },
  disabled: {
    opacity: "0.2",
  },
}))(IconButton);

const FusionButtonIcon = ({
  children,
  classes,
  icon,
  onClick,
  className = "",
  template = "",
  ...other
}) => {
  return (
    <StyledIconButton
      className={clsx(`${className} ${template}`, {})}
      classes={classes}
      onClick={onClick}
      {...other}
    >
      {icon || children}
    </StyledIconButton>
  );
};

export default FusionButtonIcon;
