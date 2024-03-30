import { createTheme } from "@mui/material/styles";

// Theme Globals
import ThemeShared from "./ThemeShared";

// Theme
const palette = {
  mode: "light",
  primary: { main: "#051347" },
  secondary: { main: "#3E8C8C" },
  text: {
    primary: "#000000",
    secondary: "#252525",
    label: "#080707", //"#8a8787",
    disabled: "#606060",
    chart: "#000000",
    button: "#cccccc",
  },
  // A
  avatar: {
    color: {
      1: "#F44336",
      2: "#F9A825",
      3: "#B7B72A",
      4: "#4CAF50",
      5: "#2096F3",
      6: "#5337FF",
      7: "#A257EC",
      8: "#EC57D3",
    },
    border: {
      1: "#F2C8CE",
      2: "#F8E0CE",
      3: "#E6E6B7",
      4: "#D0EBD0",
      5: "#D3ECF8",
      6: "#D0D0F9",
      7: "#DDD0EB",
      8: "#EBD0E7",
    },
    borderFocus: {
      1: "#E8A1A9",
      2: "#F2C9AB",
      3: "#D8D892",
      4: "#A0D5A0",
      5: "#AFDDF3",
      6: "#A0A0F2",
      7: "#C3ADDC",
      8: "#DCADD5",
    },
    borderHover: {
      1: "#EDB5BD",
      2: "#F5D5BC",
      3: "#D8D892",
      4: "#C2E5C2",
      5: "#C1E5F5",
      6: "#BBBBF6",
      7: "#C3ADDC",
      8: "#DCADD5",
    },
    background: {
      1: "#F8E0E3",
      2: "#FBEEE4",
      3: "#F2F2E0",
      4: "#E0F2E0",
      5: "#E5F6FF",
      6: "#E0E0FB",
      7: "#E9E0F2",
      8: "#F2E0EF",
    },
    backgroundFocus: {
      1: "#F6D5D9",
      2: "#FAE9DB",
      3: "#DFF1DF",
      4: "#DFF1DF",
      5: "#D6F1FF",
      6: "#D6D6FA",
      7: "#E0D4ED",
      8: "#EDD4E9",
    },
    backgroundHover: {
      1: "#F3C9CE",
      2: "#F8E0CE",
      3: "#EDEDD4",
      4: "#CDEACD",
      5: "#CCEDFF",
      6: "#C9C9F8",
      7: "#E0D4ED",
      8: "#EDD4E9",
    },
  },
  // B
  background: {
    paper: "#ffffff",
    drawer: "#1d1d1d",
    screen: "#fafafa", // "#fafafa": 50   "#F5F5F5" : 100
    header: "#E0E0E0",
    active: "#a9abb0", // "#E0E0E0",
    border: "#aca9a9",
    hover: "#c1b9b9", //"#838ba9",
    tab: "#ffffff",
    chart: "#ffffff",
  },
  blue: {
    color1: "#6E7191",
    color2: "#eeeff4",
    color3: "#F0F3F8",
    color4: "#73aaaa",
    color5: "#84869e",
    color6: "#6E7191",
    color7: "#ecf4f4",
    color8: "#9496aa",
    color9: "#f5f6f8",
    color10: "#fafafd",
    color11: "#52aadd",
    color12: "#3B8E8E",
    50: "#E3F2FD",
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2096F3",
    600: "#1F88E5",
    700: "#1A76D2",
    800: "#1665C0",
    900: "#0D47A1",
  },
  black: {
    50: "#000000",
  },
  boxShadow: {
    1: "0px 0px 4px rgba(66, 66, 66, 0.04), 0px 0px 16px rgba(66, 66, 66, 0.16)",
    4: "0px 4px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px -2px 1px rgba(0, 0, 0, 0.04)",
    5: "0px 4px 8px rgba(66, 66, 66, 0.12), 0px 8px 40px rgba(66, 66, 66, 0.2)",
  },
  // C
  common: {
    red1: "#c94449",
    red2: "#ff0000",

    green1: "#3e8c8c",

    yellow1: "#888C3E",
  },
  // D
  // E
  // F
  // G
  green: {
    50: "#E8F5E9",
    100: "#C8E6C9",
    200: "#A5D6A7",
    300: "#81C784",
    400: "#66BB6A",
    500: "#4CAF50",
    600: "#43A047",
    700: "#388E3C",
    800: "#2F7D32",
    900: "#1B5E20",
  },
  grey: {
    color1: "#747575",
    color2: "#B0B0B0",
    color3: "#d1d1d1",
    color4: "#ffffff",
    color5: "#80808017",
    color6: "#999999",
    color7: "#e8e8e8",
    color8: "#e6e6e6",
    color9: "#808080",
    color10: "#CDCDCD",
    color11: "#4A4A4A",
    color12: "#fafafa",
    color13: "#C0C0C0",
    color14: "#404040",
    color15: "#F7F7F7",
    0: "#ffffff",
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    1000: "#000000",
  },
  // H
  // I
  // J
  // K
  // L
  // M
  module: {
    default: {},
  },
  // N
  // O
  orange: {
    50: "#FFD00A",
  },
  // P
  purple: {
    color1: "#7B3E8C",
    color2: "#8934F6",
    color3: "#9744FF",
    color4: "#8000FF",
    50: "#F3E5F5",
    100: "#E1BEE7",
    200: "#CE93D8",
    300: "#BA68C8",
    400: "#AB47BC",
    500: "#9C27B0",
    600: "#8E24AA",
    700: "#7B1FA2",
    800: "#6A1B9A",
    900: "#4A148C",
  },
  // Q
  // R
  red: {
    50: "#FFEBEE",
    100: "#FECDD2",
    200: "#ED9A9A",
    300: "#E37373",
    400: "#EF5350",
    500: "#F44336",
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
  },
  // S
  // T
  teal: {
    50: "#E1F2F1",
    100: "#B2DFDB",
    200: "#80CBC4",
    300: "#4DB6AC",
    400: "#26A79A",
    500: "#009688",
    600: "#01897B",
    700: "#00796B",
    800: "#00695C",
    900: "#004D40",
  },
  turquoise: {
    color1: "#45CCB5",
    700: "#319181",
  },
  // U
  // W
  white: {
    50: "#ffffff",
  },
  // X
  xecta: {
    25: "#F8F3FF",
    50: "#F2E7FF",
    100: "#DCC3FF",
    200: "#E0E0E0",
    300: "#AC6CFF",
    400: "#9744FF",
    500: "#8000FF",
    600: "#7300F8",
    700: "#6100F0",
    800: "#4D00EC",
    900: "#1D00E7",
  },
  // Y
  yellow: {
    900: "#F57F17",
    700: "#FBC02E",
  },
  // Z
  seriesColors: {
    colors: [
      "#220576", //darker purple
      "#f7052d", //darker red
      "#006f7c", //darker light blue
      "#2f7821", //darker green
      "#f01ac9", //darker pink
      "#bc950f", //darker yellow
      "#1334f0", //darker blue
      "#7d27sb", //darker salmon
      "#691969", //darker Violet
      "#283e23", //darker aqua
      "#f07313", //dark orange
    ],
    axisLineColor: "#E0E0E0",
    depthColors: [
      "#696969", // dim gray
      "#00FF00", // darker green
    ],
    pressure: {
      Avg_Reservoir_Pressure: "#BA8344",
      Bottomhole_Pressure: "#333333",
      Casing_Pressure: "#4363D8",
      Wellhead_Pressure: "#A0A0A0",
      ESP_Suction_Pressure: "#8F3F8F",
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
    speed: {
      ESP_Frequency: "#F5A261",
      SRP_SPM: "#F5A261",
    },
    temperature: {
      Wellhead_Temperature: "#808000",
      Bottomhole_Temperature: "#D8BFD8",
      Casing_Temperature: "#939393",
    },
  },
};

export const lightGrayTheme = createTheme({
  palette,
  transition: ThemeShared.transition,
  borderRadius: ThemeShared.borderRadius,
  shadows: ThemeShared.shadows,
  typography: ThemeShared.typography,
  breakpoints: ThemeShared.breakpoints,
  components: {
    ...ThemeShared.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...ThemeShared.components.MuiCssBaseline.styleOverrides,
        "body, html": {
          backgroundColor: palette.grey.color4,
        },
        ".xt-icon": {
          color: palette.blue.color1,
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
          backgroundColor: palette.grey[200],
          border: "2px solid transparent",
          borderRadius: 6,
          backgroundClip: "padding-box",
        },
        "::-webkit-scrollbar-thumb:hover": {
          backgroundColor: palette.grey[300],
          border: "1px solid " + palette.grey[300],
        },
        "::-webkit-scrollbar-thumb:active": {
          backgroundColor: palette.grey[300],
          border: "1px solid " + palette.grey[300],
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
            backgroundColor: palette.grey[300],
          },
        },
      },
    },
  },
});

export default lightGrayTheme;
