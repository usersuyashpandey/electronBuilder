import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Tooltip } from '@mui/material'
import {
  Thermostat,
  HourglassBottom,
  LightModeOutlined,
  DarkMode,
} from "@mui/icons-material";
import { styled, useTheme } from '@mui/system'
// import { NavigationContext } from '../../service/ContextApi';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.header || '',
  display: 'flex',
  width: '40px',
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(1),
  marginLeft: -10,
  height: "100vh",
}));

interface HomeIconProps {
  style?: React.CSSProperties;
}

const HomeIcon: React.FC<HomeIconProps> = () => (
  <div style={{ padding: "5px" }}>
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
  </div>
);
interface LeftsidePanelProps {
  handleTheme: () => void;
}

const LeftsidePanel: React.FC<LeftsidePanelProps> = ({ handleTheme }) => {
  const theme = useTheme();
  // const navigate = useNavigate();
  // const { handleOptionChange } = useContext(NavigationContext);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <StyledBox>
      <div style={{ padding: '5px' }}>
        <Link to="/">
          <HomeIcon />
        </Link>
      </div>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Forecast" arrow placement="right">
          <Link to="/forecast">
            {/* <div onClick={() => handleOptionChange("forecast", navigate)}> */}
            <Thermostat
              style={{ fontSize: '24px', color: theme.palette.text.primary }}
            />
            {/* </div> */}
          </Link>
        </Tooltip>
        <Tooltip title="BHP" arrow placement="right">
          <Link to="/bhp">
            {/* <div onClick={() => handleOptionChange("bhp", navigate)}> */}

            <HourglassBottom
              style={{ fontSize: '24px', marginTop: "20px", color: theme.palette.text.primary }}
            />
            {/* </div> */}
          </Link>
        </Tooltip>
      </Box >
      <Box mb={3} ml={1}>
        <Box>
          {theme.palette?.mode === 'light' ? (
            <DarkMode
              style={{
                fontSize: '24px',
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }}
              onClick={handleTheme}
            />
          ) : (
            <LightModeOutlined
              style={{
                fontSize: '24px',
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }}
              onClick={handleTheme}
            />
          )}
        </Box>
      </Box>
    </StyledBox >
  );
};

export default LeftsidePanel;
