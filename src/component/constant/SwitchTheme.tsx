import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useAppContext } from "../../utill/ContextApi";

export default function ThemeToggleButton() {
  const { toggleTheme, isDarkMode } = useAppContext();
  const theme = useTheme();

  const handleToggleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    toggleTheme();
  };
  return (
    <Box textAlign="start">
      <Typography variant="h5" fontFamily="Poppins">
        Select Theme
      </Typography>
      <RadioGroup
        row
        value={isDarkMode ? "light" : "dark"}
        onChange={handleToggleTheme}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "20px",
          justifyContent: "space-around",
        }}
      >
        <FormControlLabel
          value="dark"
          control={
            <Radio
              style={{
                color: theme.palette.text.primary,
                cursor: "pointer",
              }}
            />
          }
          label={
            <Typography
              variant="body1"
              style={{
                color: theme.palette.text.primary,
                cursor: "pointer",
              }}
              fontFamily="Poppins"
            >
              Dark Mode
            </Typography>
          }
        />
        <FormControlLabel
          value="light"
          control={
            <Radio
              style={{
                color: theme.palette.text.primary,
                cursor: "pointer",
              }}
            />
          }
          label={
            <Typography
              variant="body1"
              style={{
                color: theme.palette.text.primary,
                cursor: "pointer",
              }}
              fontFamily="Poppins"
            >
              Light Mode
            </Typography>
          }
        />
      </RadioGroup>
    </Box>
  );
}
