import * as React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// Material UI
import { withStyles, makeStyles } from "tss-react/mui";
import { Tooltip, Fade, Typography } from "@mui/material";

// Icon
import TooltipArrowIcon from "../images/icons/TooltipArrow.svg";

const StyledTooltip = withStyles(Tooltip, (theme) => ({
  tooltipPlacementBottom: {
    margin: "4px 10px",
  },
  tooltip: {
    borderRadius: "5px",

    // Tooltip
    lineHeight: "15px",
    padding: theme.spacing(1),

    backgroundColor: theme.palette.grey["800"],
    color: "white",

    // Arrow

    "& .MuiTooltip-arrow": {
      color: theme.palette.grey["800"],
    },

    "&.MuiTooltip-tooltipPlacementTop .MuiTooltip-arrow": {
      display: "none",
    },

    "&.MuiTooltip-tooltipPlacementBottom .MuiTooltip-arrow": {
      display: "none",
    },

    "&.MuiTooltip-tooltipPlacementRight .MuiTooltip-arrow": {
      display: "none",
    },
  },
  popper: {
    zIndex: 1100,
    maxWidth: 220,
    pointerEvents: "none",

    "&[data-popper-placement*='top'] .MuiTooltip-tooltip": {
      marginBottom: 8,
    },

    "&[data-popper-placement*='bottom'] .MuiTooltip-tooltip": {
      marginTop: 8,
    },

    "&[template*='shadow'] ": {
      "& .MuiTooltip-tooltip": {
        boxShadow: "0px 5.741176128387451px 12.917645454406738px 0px #00000026",
      },
    },

    "&[template*='tooltipInPopup']": {
      zIndex: 9999 + " !important",
    },

    "&[template*='template1'] ": {
      width: "268px",
      maxWidth: "268px",
      // Tooltip
      "& .MuiTooltip-tooltip": {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: 12,
        lineHeight: "18px",

        backgroundColor: "purple", //theme.palette.purple.color1,
        color: theme.palette.grey.color4,
      },
      // Arrow
      "& .MuiTooltip-arrow": {
        color: "purple", //theme.palette.purple.color1
      },
    },

    "&[template*='templateUser']": {
      maxWidth: 160,

      // Tooltip
      "& .MuiTooltip-tooltip": {
        padding: "5px 8px",
        position: "relative",
        left: 0,
        top: 0,

        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",

        color: "black",
        backgroundColor: "lightgrey",
      },
    },

    "&[template*='grey300']": {
      // Tooltip
      "& .MuiTooltip-tooltip": {
        backgroundColor: "lightgrey",
      },
    },

    "&[template*='noMaxWidth']": {
      maxWidth: "unset",
    },

    "&[template*='noPadding']": {
      "& .MuiTooltip-tooltip": {
        padding: "0",
      },
    },

    "&[template*='boxShadow']": {
      "& .MuiTooltip-tooltip": {
        filter: "drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.25))",
      },
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  customArrow: {
    bottom: "-4px",
    position: "absolute",
    left: "calc(50% - 5px)",
    zIndex: 9,

    // Theme
    color: theme.palette.grey[800],

    // Placement : Bottom
    "&.alignTop": {
      top: "-4px",
      bottom: "unset",
      transform: "rotate(180deg)",
    },

    // Placement : Right
    "&.alignLeft": {
      top: "calc(50% - 3px)",
      left: "-7px",
      bottom: "unset",
      transform: "rotate(90deg)",
    },

    "&.grey300": {
      color: theme.palette.grey[300],
    },

    "&.grey50": {
      color: theme.palette.grey[50],
    },
  },
}));

const FusionTooltip = ({
  title,
  placement,
  children,
  template,
  open,
  offset,
  ...other
}) => {
  const { classes } = useStyles();

  return (
    <StyledTooltip
      key={"tooltip" + title}
      title={
        title && (
          <Typography
            variant={
              template === "templateUser" ? "body3Medium" : "body4Medium"
            }
          >
            {title}
            {other.arrow === true &&
              (placement === "top" ||
                placement === "bottom" ||
                placement === "right") && (
                <img
                  src={TooltipArrowIcon}
                  alt=""
                  style={{
                    height: "100%",
                    background: "#fff",
                  }}
                />
                // <TooltipArrowIcon
                // // className={clsx(classes.customArrow, template, {
                // //   alignTop: placement === "bottom",
                // //   alignLeft: placement === "right",
                // // })}
                // />
              )}
          </Typography>
        )
      }
      placement={placement}
      open={open}
      PopperProps={{
        template: template,
        placement: placement,
        popperOptions: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: offset ? offset : [0, 0],
              },
            },
          ],
        },
      }}
      enterDelay={0}
      leaveDelay={0}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      {...other}
    >
      <div>{children}</div>
    </StyledTooltip>
  );
};

FusionTooltip.propTypes = {
  title: PropTypes.any,
  placement: PropTypes.string,
  template: PropTypes.string,
  open: PropTypes.bool,
};

export default FusionTooltip;
