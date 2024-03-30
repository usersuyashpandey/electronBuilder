import React, { useRef, useState } from "react";
import {
  Box,
  Switch,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { MoreVert } from "@mui/icons-material";
import FusionButtonIcon from "./FusionButtonIcon";
import SelecttionAxis from "../constant/SelectionAxis";

interface FullScreensvgProps {
  style?: React.CSSProperties;
}

const FullScreenSvg: React.FC<FullScreensvgProps & { color: string }> = ({
  color,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    style={{ fill: color }}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z" />
  </svg>
);
interface Axis {
  name: string;
  value: string;
}

type FusionHeaderProps = {
  headerText?: string;
  toggleLegend?: () => void;
  isLegendVisible?: boolean;
  handleDownloadPNG?: () => void;
  handleDownloadCSV?: () => void;
  toggleFullScreen?: () => void;
  isFullScreen?: boolean;
  showLegends?: boolean;
  axisSelection?: Axis[] | undefined;
  handleXAxisChange?: (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => void;
  selectedXAxis?: Axis | null;
};

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  ...theme.components.typography.body3Large,
  color: theme.palette.text.primary,
  padding: "8px",
}));
const ContainerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "30px",
  border: "1px solid " + theme.palette.background.header,
  backgroundColor: theme.palette.background.header,
}));

const FusionHeader: React.FC<FusionHeaderProps> = ({
  headerText,
  toggleLegend,
  isLegendVisible,
  handleDownloadPNG,
  handleDownloadCSV,
  toggleFullScreen,
  isFullScreen = true,
  showLegends = false,
  axisSelection,
  handleXAxisChange,
  selectedXAxis,
}) => {
  const theme = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ContainerBox>
      <StyledHeaderBox ref={headerRef}>{headerText}</StyledHeaderBox>
      <Box display="flex" alignItems="center">
        {selectedXAxis && (
          <Box>
            <SelecttionAxis
              axisSelection={axisSelection}
              handleXAxisChange={handleXAxisChange}
              selectedXAxis={selectedXAxis}
            />
          </Box>
        )}
        {showLegends && (
          <Tooltip title="Show/Hide Chart Legends" arrow placement="top">
            <Switch
              size="small"
              color="default"
              checked={isLegendVisible}
              onClick={toggleLegend}
            />
          </Tooltip>
        )}
        {isFullScreen && (
          <FusionButtonIcon
            template="outline"
            icon={<FullScreenSvg color={theme.palette.text.primary} />}
            onClick={toggleFullScreen}
          />
        )}
        <Button
          onClick={handleMenuOpen}
          style={{
            minWidth: " 10px",
            width: "10px",
            marginRight: "10px",
            color: theme.palette.text.primary,
          }}
        >
          <Tooltip title="Options">
            <MoreVert />
          </Tooltip>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDownloadCSV}>Download CSV</MenuItem>
          <MenuItem onClick={handleDownloadPNG}>Download PNG</MenuItem>
        </Menu>
      </Box>
    </ContainerBox>
  );
};

export default FusionHeader;
