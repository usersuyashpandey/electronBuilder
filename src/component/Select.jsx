import React, { useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useTheme } from "@mui/system";

// Material UI
import { makeStyles } from "tss-react/mui";
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
  useMediaQuery,
} from "@mui/material";

// Shared
import FusionTooltip from "./Tooltip";

// Icon
import ChevronDownIcon from "../images/icons/ChevronDown.svg";

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: 100,
    height: (props) => (props.ModelHeight ? props.ModelHeight : 41),
    marginRight: 8,

    "&.responsive": {
      // 1440 down
      [theme.breakpoints.down("xxl")]: {
        maxWidth: 64,
        minWidth: 64,

        "& .MuiSelect-select": {
          "& .select-labelRef": {
            display: "none",
          },
        },
      },
    },

    "&.icon": {
      "& .MuiSelect-select": {
        paddingLeft: 37,
      },
    },

    // Select Icon
    "& .select-iconRef": {
      "& svg": {
        color: theme.palette.grey[800],
      },
    },

    // Select wrapper
    "& .MuiInputBase-root": {
      height: (props) => (props.selectHeight ? props.selectHeight : 41),
      width: (props) => (props.selectWidth ? props.selectWidth : "100%"),
      borderRadius: 10,
      overflow: "hidden",

      // Theme
      background: theme.palette.background.header,
      border: "1px solid " + theme.palette.background.border,
    },

    "&.wellLevel .MuiInputBase-root": {
      height: 32,
      background: "#e0e0e0",
    },

    // Select
    "& .MuiSelect-select": {
      padding: (props) =>
        props.selectedPadding ? props.selectedPadding : "10px 30px 10px 20px",
      display: "flex",
      alignItems: "center",
      color: theme.palette.text.primary,
    },

    // Outline
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },

    // Label icon
    "& .MuiSelect-select > svg": {
      marginRight: 9,
    },

    // Label
    "& .MuiSelect-select > span": {
      lineHeight: "21px",
    },

    // Hover
    "&:hover": {
      "& .arrowIconRef": {
        opacity: 1,
      },
      "& .Mui-disabled .arrowIconRef": {
        opacity: 0,
      },
      "& .MuiInputBase-root": {
        // Theme
        borderColor: theme.palette.grey["300"],
      },
      "& .select-iconRef": {
        "& svg": {
          color: "black",
        },
      },
    },

    // Disabled
    "& .Mui-disabled": {
      opacity: 0.3,
      pointerEvents: "none",
      WebkitTextFillColor: "currentColor",
    },

    // Arrow
    "& .arrowIconRef": {
      position: "absolute",
      top: "50%",
      right: 0,
      transform: "translate(-2px, -9px)",
      width: 18,
      height: 18,
      opacity: 1,
      pointerEvents: "none",

      "& svg": {
        width: "1em",
        height: "1em",
        fontSize: 14,

        color: theme.palette.primary.main,
      },
    },

    // Template : Purple
    "&.template1": {
      // Arrow
      "& .arrowIconRef": {
        opacity: 1,
        "& svg": {
          color: "white",
        },
      },

      "& .MuiSelect-select": {
        // fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: 16,
        // Theme
        color: "white",
      },

      "& .MuiInputBase-root": {
        background: "grey",
        border: "1px solid " + "lightgrey",
      },

      // Hover
      "&:hover": {
        "& .MuiInputBase-root": {
          background: theme.palette.background.default,
          border: "1px solid " + theme.palette.background.paper,
        },

        // Hover : Disabled
        "& .Mui-disabled": {
          "& .arrowIconRef": {
            opacity: 1,
          },
          "&.MuiInputBase-root": {
            background: theme.palette.background.paper,
            border: "1px solid transparent ",
          },
        },
      },

      // Focus
      "& .Mui-focused": {
        "&.MuiInputBase-root": {
          background: theme.palette.background.paper,
          border: "1px solid " + theme.palette.background.paper,
        },
      },
    },
    "&.template2": {
      // Arrow
      "& .arrowIconRef": {
        opacity: 1,
        "& svg": {
          color: "white",
        },
      },

      "& .MuiSelect-select": {
        // fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: 14,
        // Theme
        color: "white",
      },

      "& .MuiInputBase-root": {
        background: theme.palette.background.paper,
        border: "1px solid " + theme.palette.background.paper,
      },

      // Hover
      "&:hover": {
        "& .MuiInputBase-root": {
          background: theme.palette.background.paper,
          border: "1px solid " + theme.palette.background.paper,
        },

        // Hover : Disabled
        "& .Mui-disabled": {
          "& .arrowIconRef": {
            opacity: 1,
          },
          "&.MuiInputBase-root": {
            background: theme.palette.background.paper,
            border: "1px solid transparent ",
          },
        },
      },

      // Focus
      "& .Mui-focused": {
        "&.MuiInputBase-root": {
          background: theme.palette.background.paper,
          border: "1px solid " + theme.palette.background.paper,
        },
      },
    },

    "&.noBorder": {
      "& .MuiInputBase-root": {
        border: "1px solid transparent",
      },
      "&:hover": {
        "& .MuiInputBase-root": {
          border: "1px solid transparent",
        },
      },
    },
    "&.grey50": {
      "& .MuiInputBase-root": {
        background: "grey",
      },
      "&:hover": {
        "& .MuiInputBase-root": {
          background: "grey",
        },
      },
    },

    "&.grey100": {
      // 1 )  Status : Normal
      "& .MuiInputBase-root": {
        border: "3px solid transparent !important",
        background: "lightgrey",
      },

      // Open Modal
      "&.openedModal": {
        "& .MuiInputBase-root": {
          border: "3px solid transparent !important",
          background: "lightgrey",

          // Focused
          "&.Mui-focused": {
            border: "3px solid " + "lightgrey" + " !important",
            background: "lightgrey",
          },
        },
      },

      "&:hover": {
        "& .MuiInputBase-root": {
          background: "lightgrey",
        },
        "& .MuiTypography-root": {
          color: "black",
        },
      },
      "&.active": {
        "&:hover": {
          "& .MuiInputBase-root": {
            border: "3px solid " + "grey" + " !important",
          },
        },
        "& .MuiInputBase-root": {
          border: "3px solid " + "lightgrey" + " !important",
          background: "lightgrey" + " !important",
          "&.Mui-focused": {
            border: "3px solid " + "lightgrey" + " !important",
            background: "lightgrey" + " !important",
          },
        },
      },
    },

    "&.active": {
      "& .MuiInputBase-root": {
        background: theme.palette.grey[300] + " !important",
      },
    },
  },
  menu: {
    borderRadius: 8,
    border: "1px solid " + theme.palette.background.border,
    boxShadow: "black",
    background: theme.palette.grey.color4,
    maxHeight: (props) => (props.menuHeight ? props.menuHeight : 374),
    marginLeft: 3,
    "&.responsive": {
      // 1440 down
      [theme.breakpoints.down("xxl")]: {
        marginLeft: "-8px",
      },
    },
  },
  list: {
    padding: "10px 8px",
    paddingRight: "8px !important",
    backgroundColor: theme.palette.background.header + "!important",
  },
  listItem: {
    fontSize: 14,
    lineHeight: "21px",
    padding: "6px 15px 6px 11px",
    marginBottom: 1,

    // Theme
    color: theme.palette.primary.main,
    borderRadius: 15,
    border: `2px solid transparent`,

    // Selected
    "&.Mui-selected,&.Mui-focusVisible": {
      fontWeight: 600,
      backgroundColor: theme.palette.background.active + " !important",
      "&:hover": {
        background: theme.palette.background.hover + " !important",
      },
    },

    // Focus
    "&.focus,&:hover.focus,&.Mui-selected.focus,&.Mui-selected.focus:hover": {
      backgroundColor: theme.palette.grey[100] + " !important",
      border: `2px solid ${theme.palette.grey[300]}`,
      color: "black",
    },

    // Hover
    "&:hover": {
      color: "black",
      background: theme.palette.background.hover,
    },

    "& .listItemIconRef": {
      marginRight: 8,
    },
  },
  listItemIcon: {
    display: "flex",
    alignItems: "center",

    "& svg": {
      width: "1em",
      height: "1em",
      fontSize: 24,
    },
  },
  icon: {
    top: 5,
    left: 5,
    position: "absolute",
    width: 24,
    overflow: "hidden",
    color: "black",

    "& svg": {
      width: "1em",
      height: "1em",
      fontSize: 24,
    },
  },
  label: {
    color: theme.palette.grey[800],
  },
  text: {
    fontWeight: 400,
    lineHeight: "24px",
  },
  arrowIconComponent: {
    "&.arrowDown": {
      "& svg": {
        // transform: "rotate(180deg)"
      },
    },
    "&.arrowUp": {
      "& svg": {
        transform: "rotate(180deg)",
      },
    },
  },
}));

const FusionSelect = ({
  name,
  label,
  fullName = false,
  value,
  onChange,
  options,
  className = "",
  icon,
  disabled,
  responsive,
  template,
  maxWidth,
  minWidth,
  width,
  iconComponent,
  active = false,
  ...props
}) => {
  const { classes } = useStyles(props);
  const theme = useTheme();

  const hiddenTooltip = useMediaQuery(theme.breakpoints.down(1440));

  const selectRef = useRef();
  const [focused, setFocused] = React.useState({});
  // const [hovered, setHovered] = React.useState("");

  // Status
  const [status, setStatus] = React.useState("close");
  const selectedLabel = options?.find((e) => e.value === value)?.label || "";

  const firstLetterUpper = (s) =>
    s && s[0].toUpperCase() + s.slice(1, s.length);

  const getLabel = (value) => {
    for (var key in options) {
      if (options[key]["value"] === value) {
        return options[key]["label"];
      }
    }
  };

  const handleClose = (e) => {
    setStatus("close");
    removeFocus();
    setFocused(null);
  };

  const removeFocus = () => {
    selectRef?.current?.classList?.remove("Mui-focused");
  };

  const handleOpen = () => {
    setStatus("open");
    selectRef?.current?.classList?.add("Mui-focused");

    setTimeout(function () {
      removeFocus();
    }, 200);
  };

  return (
    <FormControl
      disabled={disabled}
      className={clsx(classes.root, className, template, {
        icon: icon,
        responsive: responsive,
        active: active,
        closedModal: status === "close",
        openedModal: status === "open",
      })}
      style={{ maxWidth: maxWidth, minWidth: minWidth, width: width }}
    >
      <FusionTooltip
        title={hiddenTooltip ? selectedLabel : ""}
        arrow={true}
        placement="top"
      >
        <Select
          ref={selectRef}
          value={value}
          onChange={onChange}
          onClose={handleClose}
          onOpen={handleOpen}
          displayEmpty={true}
          IconComponent={() => (
            <span
              className={clsx(classes.arrowIconComponent, "arrowIconRef", {
                arrowDown: status === "close",
                arrowUp: status === "open",
              })}
              style={{ marginRight: 7 }}
            >
              {iconComponent || <img src={ChevronDownIcon} alt="Spinner" />}
            </span>
          )}
          renderValue={
            (label || icon) &&
            (() => (
              <>
                <span className={clsx(classes.icon, "select-iconRef")}>
                  {icon}
                </span>
                <Typography
                  variant="body2Medium"
                  className={clsx(classes.label, "select-labelRef")}
                >
                  {label || firstLetterUpper(getLabel(value))}
                </Typography>
              </>
            ))
          }
          MenuProps={{
            classes: {
              paper: clsx(classes.menu, { responsive: responsive }),
              list: classes.list,
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          }}
        >
          {options &&
            options.map(({ value: optionValue, label, icon }) => (
              <MenuItem
                key={optionValue}
                value={optionValue}
                className={clsx(classes.listItem, {
                  focus: focused === optionValue,
                })}
                onMouseDown={() => setFocused(optionValue)}
                onMouseUp={() => setFocused(null)}
              >
                <Box className={clsx(classes.listItemIcon, "listItemIconRef")}>
                  {icon}
                </Box>
                <span className={classes.text}>
                  {fullName ? label : label?.slice(0, 15)?.concat("...")}
                </span>
              </MenuItem>
            ))}
        </Select>
      </FusionTooltip>
    </FormControl>
  );
};

export default FusionSelect;
