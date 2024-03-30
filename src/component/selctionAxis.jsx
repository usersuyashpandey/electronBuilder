import { Box, MenuItem, Select } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React from "react";

const useStyles = makeStyles()((theme) => ({
  mainContainer: {
    // backgroundColor:'blue'
  },

  container: {
    marginLeft: "20px",
    height: "30px",
    borderRadius: "10px",
  },
  label: {
    color: theme.palette.text.secondary,
    background: theme.palette.background.tab,
    "&:hover": {
      color: theme.palette.text.screen,
      backgroundColor: theme.palette.background.active,
    },
    "&.selected": {
      color: theme.palette.text.screen,
      backgroundColor: theme.palette.background.active,
      "&:hover": {
        color: theme.palette.text.screen,
        backgroundColor: theme.palette.background.active,
      },
    },
  },
}));

const SelectAxis = ({ axisSeletion, handleXAxisChange, selectedXAxis }) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.mainContainer}>
      <Select
        value={selectedXAxis?.value}
        onChange={handleXAxisChange}
        className={classes.container}
      >
        {axisSeletion?.map((e, i) => (
          <MenuItem
            className={`${classes.label} ${
              e?.value === selectedXAxis?.value ? "selected" : ""
            }`}
            sx={{ marginY: -1 }}
            value={e?.value}
            key={i}
          >
            {e?.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SelectAxis;
