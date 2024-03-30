import * as React from "react";
import PropTypes from "prop-types";

import { Button } from "@mui/material";
import clsx from "clsx";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "inline-block",
    minWidth: "70px",
    textTransform: "none",
    padding: "4px 8px",
    margin: 4,
    fontWeight: 400,
    height: 34,
    "&.MuiButton-root": {
      color: theme.palette.text.button,
      background: theme.palette.primary.main,
      border: `solid 1px ${theme.palette.primary.main}`,
    },
    "&:hover": {
      color: theme.palette.black[50],
      background: theme.palette.background.hover,
      border: `solid 1px ${theme.palette.primary.main}`,
    },
  },
  rootTransparent: {
    "&.MuiButton-root": {
      color: theme.palette.text.button,
      background: theme.palette.primary.main,
      border: `solid 1px ${theme.palette.primary.main}`,

      "&:hover": {
        color: theme.palette.black[50],
        background: theme.palette.background.hover,
      },
    },
  },
  rootDisabled: {
    "&.MuiButton-root": {
      color: theme.palette.grey[700],
      background: theme.palette.grey[100],
      border: `solid 1px ${theme.palette.grey[500]}`,
    },
  },
  transparent: {
    fontSize: 12,
    minWidth: 30,
    padding: "3px 6px",
    height: 31,
    border: "transparent",
  },
  small: {
    fontSize: 12,
    minWidth: 55,
    padding: "3px 6px",
    height: 31,
  },
  large: {
    fontSize: 16,
    minWidth: 90,
    height: 43,
  },
}));

const FusionButton = (props) => {
  const {
    children,
    type = "button",
    onClick,
    className,
    text = "Button",
    small = false,
    large = false,
    transparent = false,
    template,
    disabled = false,
    ...other
  } = props;
  const { classes } = useStyles();

  return (
    <Button
      type={type}
      onClick={onClick}
      className={clsx(
        classes.root,
        template === "transparent" && classes.rootTransparent,
        transparent && classes.transparent,
        small && classes.small,
        large && classes.large,
        disabled && classes.rootDisabled,
        className
      )}
      disabled={disabled}
      {...other}
    >
      {text || children}
    </Button>
  );
};

export default FusionButton;
