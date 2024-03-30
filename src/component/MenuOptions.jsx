import React from "react";

// Material UI
import { withStyles } from "tss-react/mui";
import { Menu } from "@mui/material";

const StyledMenu = withStyles(Menu, (theme, props) => ({
  paper: {
    marginTop: "5px",
    minWidth: "140px",
    maxWidth: "220px",
    borderRadius: "4px",
    // Theme
    color: theme.palette.primary.main,
    backdropFilter: "yellow",
    backgroundColor: "Background",
    border: "black",
    boxShadow: "grey",
  },
  list: {
    "& .MuiMenuItem-root": {
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "block",
      // Theme
      color: "red",
      backgroundColor: "blue",
    },
    "& :hover": {
      borderRadius: "4px",
      // Theme
      color: "black",
      backgroundColor: "GrayText",
    },
  },
}));

const FusionMenuOptions = (props) => {
  return <StyledMenu {...props}>{props.children}</StyledMenu>;
};

export default FusionMenuOptions;
