import React, { useState, useEffect } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { Settings } from "@mui/icons-material";
import SettingsPopUpContent from "../SettingPopUp";
import FusionIconGroup from "../FusionIconGroup";
import AppsDrawer from "./AppsDrawer";

interface FullScreensvgProps {
  style?: React.CSSProperties;
}
interface HomeIconProps {
  style?: React.CSSProperties;
}

const HomeIcon: React.FC<HomeIconProps> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 535.43 537.51"
    width="25"
    height="25"
  >
    <defs>
      <style>{".cls-1{fill:url(#linear-gradient);}"}</style>
      <linearGradient
        id="linear-gradient"
        x1="510.17"
        y1="6.11"
        x2="16.72"
        y2="541.95"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.01" stopColor="#01d4f5" />
        <stop offset="0.18" stopColor="#31b2f7" />
        <stop offset="0.48" stopColor="#807bfa" />
        <stop offset="0.72" stopColor="#ba53fc" />
        <stop offset="0.9" stopColor="#dd39fd" />
        <stop offset="1" stopColor="#eb30fe" />
      </linearGradient>
    </defs>
    <path
      className="cls-1"
      d="M9.05,537.51c-7.8,0-11.22-5.65-7.61-12.56L105.65,326c3.61-6.91,9.76-7,13.66-.28L234.54,525.23c3.9,6.75.7,12.28-7.09,12.28Zm251.57-79.15c3.9,6.76,10.28,6.76,14.18,0L532.34,12.28c3.9-6.75.71-12.28-7.09-12.28H290.47c-7.8,0-17.14,5.65-20.75,12.56L149.56,242c-3.62,6.91-3.39,18.09,.51,24.84Zm265.76,79.15c7.8,0,11.22-5.65,7.6-12.56l-104.21-199c-3.61-6.91-9.76-7-13.66-.28L300.88,525.23c-3.9,6.75-.71,12.28,7.09,12.28ZM102.73,184.87c3.9,6.76,10,6.63,13.67-.28l90.07-172c3.62-6.91,.2-12.56-7.6-12.56H10.17c-7.8,0-11,5.53-7.09,12.28Z"
    />
  </svg>
);

const AppsSvg: React.FC<FullScreensvgProps & { color: string }> = ({
  color,
}) => (
  <Tooltip title="Apps">
    <svg
      width="25"
      height="25"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 14C12.2091 14 14 12.2091 14 10C14 7.79086 12.2091 6 10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14Z"
        fill={color}
      />
      <path
        d="M24 14C26.2091 14 28 12.2091 28 10C28 7.79086 26.2091 6 24 6C21.7909 6 20 7.79086 20 10C20 12.2091 21.7909 14 24 14Z"
        fill={color}
      />
      <path
        d="M38 14C40.2091 14 42 12.2091 42 10C42 7.79086 40.2091 6 38 6C35.7909 6 34 7.79086 34 10C34 12.2091 35.7909 14 38 14Z"
        fill={color}
      />
      <path
        d="M10 28C12.2091 28 14 26.2091 14 24C14 21.7909 12.2091 20 10 20C7.79086 20 6 21.7909 6 24C6 26.2091 7.79086 28 10 28Z"
        fill={color}
      />
      <path
        d="M24 28C26.2091 28 28 26.2091 28 24C28 21.7909 26.2091 20 24 20C21.7909 20 20 21.7909 20 24C20 26.2091 21.7909 28 24 28Z"
        fill={color}
      />
      <path
        d="M38 28C40.2091 28 42 26.2091 42 24C42 21.7909 40.2091 20 38 20C35.7909 20 34 21.7909 34 24C34 26.2091 35.7909 28 38 28Z"
        fill={color}
      />
      <path
        d="M10 42C12.2091 42 14 40.2091 14 38C14 35.7909 12.2091 34 10 34C7.79086 34 6 35.7909 6 38C6 40.2091 7.79086 42 10 42Z"
        fill={color}
      />
      <path
        d="M24 42C26.2091 42 28 40.2091 28 38C28 35.7909 26.2091 34 24 34C21.7909 34 20 35.7909 20 38C20 40.2091 21.7909 42 24 42Z"
        fill={color}
      />
      <path
        d="M38 42C40.2091 42 42 40.2091 42 38C42 35.7909 40.2091 34 38 34C35.7909 34 34 35.7909 34 38C34 40.2091 35.7909 42 38 42Z"
        fill={color}
      />
    </svg>
  </Tooltip>
);
interface HeaderProps {
  title: string;
  onOpenModal: () => void;
}
const Header: React.FC<HeaderProps> = ({ title, onOpenModal }) => {
  const theme = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadApiKey] = useState(localStorage.getItem("apiKey"));

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if (loadApiKey) {
          return;
        } else if (window.electron && loadApiKey) {
          return;
        } else {
          setIsSettingsOpen(true);
        }
      } catch (error) {
        if (error.message === "Invalid API Key") {
          setIsSettingsOpen(true);
        } else {
          //
        }
      }
    };

    checkApiKey();
  }, []);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      justifyItems="center"
      alignItems="center"
      height="40px"
      ml={0.4}
    >
      <Box
        sx={{ display: "flex", width: "200px", alignItems: "center" }}
        ml={0.7}
      >
        <HomeIcon />
        <Typography
          fontSize="18px"
          fontFamily="Poppins"
          fontWeight="700"
          ml={2.2}
          mt={0.2}
        >
          {title}
        </Typography>
      </Box>
      <FusionIconGroup onOpenModal={onOpenModal} />
      <Box
        display="flex"
        mt={0.5}
        alignContent="center"
        justifyContent="flex-end"
        width="200px"
      >
        <Box
          overflow="hidden"
          mr={1.5}
          mt={0.6}
          style={{ cursor: "pointer" }}
          onClick={handleSettingsClick}
        >
          <Tooltip title="Settings">
            <>
              <Settings
                style={{
                  ...theme.components.iconSize?.workFlowIcon,
                  color: theme.palette.text.primary,
                }}
              />
            </>
          </Tooltip>
        </Box>
        <Box
          overflow="hidden"
          mr={1.5}
          mt={0.8}
          style={{ cursor: "pointer" }}
          onClick={handlePopoverOpen}
        >
          <Tooltip title="Apps">
            <>
              <AppsSvg color={theme.palette.text.primary} />
            </>
          </Tooltip>
        </Box>
      </Box>
      <SettingsPopUpContent
        handleCloseSettings={handleCloseSettings}
        isSettingsOpen={isSettingsOpen}
      />
      <AppsDrawer
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
      />
    </Box>
  );
};

export default Header;
