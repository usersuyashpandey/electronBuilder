import * as React from "react";
import clsx from "clsx";

// Material UI
import { withStyles, makeStyles } from "tss-react/mui";
import {
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const StyledToggleButtonGroup = withStyles(
  ToggleButtonGroup,
  (theme, props) => ({
    root: {},
  })
);
const StyledToggleButton = withStyles(ToggleButton, (theme, props) => ({
  root: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 12,
    padding: "4px 12px",
    border: "none",
    textTransform: "none",
    color: theme.palette.grey[600],
    "&:hover": {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.hover,
    },

    "&[data-focused='true']": {
      backgroundColor: theme.palette.grey[200],
    },

    "&.Mui-selected": {
      borderRadius: theme.borderRadius[1],
      color: theme.palette.text.primary,
      background: theme.palette.background.active,
      "&:hover": {
        backgroundColor: theme.palette.background.hover,
      },
    },

    "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
      borderRadius: theme.borderRadius[1],
    },

    "&.MuiToggleButtonGroup-grouped:not(:last-of-type)": {
      borderRadius: theme.borderRadius[1],
    },
  },
}));

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: 243,
    height: 32,
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "18px",
    display: "flex",
    alignItems: "center",
    padding: 3,

    // Theme
    borderRadius: theme.borderRadius[1],
    color: theme.palette.grey[600],
    background: theme.palette.background.header,
  },
}));

const FusionToggleButtonGroup = ({ className, onChange, value, options }) => {
  const { classes } = useStyles();
  const [focus, setFocus] = React.useState(false);
  const [selected, setSelected] = React.useState(value);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <Grid item className={clsx(classes.root, className)}>
      <StyledToggleButtonGroup
        color="primary"
        value={selected}
        exclusive
        onChange={onChange}
        className={clsx({
          focus: focus,
        })}
      >
        {options?.map((item) => (
          <StyledToggleButton
            key={item?.value}
            value={item?.value}
            data-focused={focus === item?.value ? true : ""}
            onMouseDown={() => setFocus(item?.value)}
            onMouseUp={() => setFocus(false)}
          >
            <Typography
              variant={
                selected === item?.value ? "body2Semibold" : "body3Semibold"
              }
            >
              {item?.label}
            </Typography>
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Grid>
  );
};

export default FusionToggleButtonGroup;
