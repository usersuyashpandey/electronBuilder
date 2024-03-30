import React from "react";
import { Box, styled, useTheme } from "@mui/system";
import {
  Clear,
  Create,
  FileDownload,
  RestartAlt,
  HelpOutline,
  Publish,
} from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";

const StyledtBox = styled(Box)(({ theme }) => ({
  height: "45px",
  display: "flex",
  padding: "10px",
  width: "255px",
  cursor: "pointer",
  color: theme.palette.text.primary,
  background: theme.palette.background.header,
  borderRadius: 15,
  alignItems: "center",
  justifyContent: "space-around",
  "& > *": {
    margin: 0,
    "&:not(:last-child)": {
      marginRight: 1,
    },
    "&:hover": {
      color: theme.palette.background.screen,
    },
  },
}));

interface FusionIconGroupProps {
  onOpenModal: () => void;
}

const FusionIconGroup: React.FC<FusionIconGroupProps> = ({ onOpenModal }) => {
  const theme = useTheme();
  const iconButtonStyle = {
    color: theme.palette.text.primary,
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.2)",
      "& .clear-tooltip": {
        visibility: "visible",
      },
    },
  };
  return (
    <StyledtBox>
      <IconButton sx={iconButtonStyle} onClick={onOpenModal}>
        <Tooltip title="Input" placement="bottom" arrow enterDelay={100}>
          <>
            <Create />
          </>
        </Tooltip>
      </IconButton>
      <IconButton sx={iconButtonStyle}>
        <Tooltip title="Reset" placement="bottom" arrow enterDelay={100}>
          <>
            <RestartAlt />
          </>
        </Tooltip>
      </IconButton>
      <IconButton sx={iconButtonStyle}>
        <Tooltip
          title="Clear"
          placement="bottom"
          arrow
          enterDelay={100}
          className="clear-tooltip"
        >
          <>
            <Clear />
          </>
        </Tooltip>
      </IconButton>
      <IconButton sx={iconButtonStyle}>
        <Button
          component="label"
          size="small"
          sx={{
            color: theme.palette.text.primary,
            m: 0,
            p: 0,
            minWidth: "23px",
          }}
        >
          <Tooltip title="Import" placement="bottom" arrow enterDelay={100}>
            <>
              <Publish
                sx={{
                  "&:hover": {
                    color:
                      theme.palette.mode === "dark" ? " #333333" : "#ffffff",
                  },
                }}
              />
            </>
          </Tooltip>
          <input type="file" accept={".json"} hidden style={{ width: "1px" }} />
        </Button>
      </IconButton>
      <IconButton sx={iconButtonStyle}>
        <Tooltip title="Export" placement="bottom" arrow enterDelay={100}>
          <FileDownload />
        </Tooltip>
      </IconButton>
      <IconButton sx={iconButtonStyle}>
        <Tooltip title="Help" placement="bottom" arrow enterDelay={100}>
          <HelpOutline />
        </Tooltip>
      </IconButton>
    </StyledtBox>
  );
};

export default FusionIconGroup;
