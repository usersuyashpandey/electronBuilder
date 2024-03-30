import { createTheme } from "@mui/material";

// Theme Globals
import ThemeShared from "./ThemeShared";

const palette = {
  mode: "dark",
  primary: { main: "#cccccc" }, // "#6c69db"
  secondary: { main: "#419f9f" },
  text: {
    primary: "#cccccc",
    secondary: "#EBEBEB",
    label: "#999999",
    disabled: "#606060",
    chart: "#cccccc",
    button: "#000000",
  },
  background: {
    paper: "#ffffff",
    drawer: "#1d1d1d",
    screen: "#2a2a2d",
    hover: "#d5c9c9", //'#575252', // #d5c9c9",
    tab: "#2a2a2d",
    header: "#404040",
    border: "#737373",
    active: "#747171", // "#424242",
    chart: "#262626",
    chartborder: "#4d4d4d",
  },
  action: {
    hover: "#747171",
    selected: "#747171",
  },
  black: {
    50: "#000000",
  },
  seriesColors: {
    colors: [
      "#9a7cf2", // lighter purple
      "#ff66a4", // lighter red
      "#99f1fc", // lighter light blue
      "#9ef68d", // lighter green
      "#ed32cb", // lighter pink
      "#ebbd1a", // lighter yellow
      "#1334f0", // lighter blue
      "#fc949a", // lighter salmon
      "#5e215e", // lighter Violet
      "#2bf0e3", // lighter aqua
      "#f07313", // dark orange
    ],
    axisLineColor: "#E0E0E0",
    depthColors: [
      "#D3D3D3", // lighter gray
      "#00FF00", // darker green
    ],
    pressure: {
      Avg_Reservoir_Pressure: "#BA8344",
      Bottomhole_Pressure: "#EEEEEE",
      Casing_Pressure: "#4363D8",
      Wellhead_Pressure: "#808080",
      ESP_Suction_Pressure: "#AF5FAF",
      ESP_Discharge_Pressure: "#FABED4",
    },
    rate: {
      Gas_Lift_Injection_Rate: "#F5A261",
      Gas_Rate: "#E6194B",
      Oil_Rate: "#3CB44B",
      Water_Rate: "#00B0F0",
    },
    reservoir_Property: {
      kh_Permeability_Thickness: "#800080",
      Productivity_Index: "#AAFFC3",
      Skin: "#FFB6C1",
    },
  },
};

export const darkTheme = createTheme({
  palette,
  transition: ThemeShared.transition,
  borderRadius: ThemeShared.borderRadius,
  shadows: ThemeShared.shadows,
  typography: ThemeShared.typography,
  breakpoints: ThemeShared.breakpoints,
  components: {
    ...ThemeShared?.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...ThemeShared?.components?.MuiCssBaseline?.styleOverrides,
        "body, html": {
          backgroundColor: "#ffffff",
        },
        ".xt-icon": {
          color: "#000000",
        },

        // SCROLLBAR
        "::-webkit-scrollbar": {
          width: 12,
          height: 12,
        },
        // SCROLLBAR: BUTTON
        "::-webkit-scrollbar-button": {
          width: 0,
          height: 0,
        },
        // SCROLLBAR: THUMB
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#D3D3D3",
          border: "2px solid transparent",
          borderRadius: 6,
          backgroundClip: "padding-box",
        },
        "::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#D3D3D3",
          border: "1px solid " + "#D3D3D3",
        },
        "::-webkit-scrollbar-thumb:active": {
          backgroundColor: "#D3D3D3",
          border: "1px solid " + "#D3D3D3",
        },
        // SCROLLBAR: TRACK
        "::-webkit-scrollbar-track": {
          background: "transparent",
          border: "1px solid transparent",
          borderRadius: 6,
        },
        "::-webkit-scrollbar-track:hover": {
          background: "transparent",
        },
        "::-webkit-scrollbar-track:active": {
          background: "transparent",
        },
        // SCROLLBAR: CORNER
        "::-webkit-scrollbar-corner": {
          background: "transparent",
        },
        // SCROLLBAR: PAPER
        ".MuiMenu-paper": {
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#D3D3D3",
          },
        },
      },
    },
  },
});

export default darkTheme;
