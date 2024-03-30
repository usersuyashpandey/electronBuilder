import React from "react";
import { Popover, Box, IconButton } from "@mui/material";
import { HourglassBottom, LocalDrink, Thermostat } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/system";

const StyledIconBox = styled(IconButton)(({ theme }) => ({
  border: `2px solid ${theme.palette.background.header}`,
  borderRadius: "12px",
  height: "65px",
  width: "65px",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "4px",
  color: theme.palette.text.primary,
  boxShadow: theme.components.shadow,
  transition: "background-color 0.3s ease-in-out",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  height: 230,
  width: 220,
  backgroundColor: theme.palette.background.screen || "",
  border: `2px solid ${theme.palette.background.header}`,
  display: "grid",
  padding: "15px",
  gridTemplateColumns: "1fr 1fr",
  justifyContent: "space-around",
}));

const MyPopoverComponent = ({ open, anchorEl, onClose }) => {
  const theme = useTheme();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <StyledBox>
        <Box padding={2} sx={{ textAlign: "center" }}>
          <Link
            to="/bhp"
            style={{
              display: "flex",
              flexDirection: "row",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <StyledIconBox>
              <HourglassBottom
                style={{ fontSize: "24px", color: theme.palette.text.primary }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                BHP
              </span>
            </StyledIconBox>
          </Link>
        </Box>
        <Box padding={2} sx={{ textAlign: "center", overflow: "hidden" }}>
          <Link
            to="/forecast"
            style={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <StyledIconBox>
              <Thermostat
                style={{ fontSize: "24px", color: theme.palette.text.primary }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                Forecast
              </span>
            </StyledIconBox>
          </Link>
        </Box>
        <Box padding={2} sx={{ textAlign: "center" }}>
          <Link
            to="/liquidLoading"
            style={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <StyledIconBox>
              <LocalDrink
                style={{ fontSize: "24px", color: theme.palette.text.primary }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                Liquid Loading
              </span>
            </StyledIconBox>
          </Link>
        </Box>
      </StyledBox>
    </Popover>
  );
};

export default MyPopoverComponent;
