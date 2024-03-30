const ThemeShared = {
  globals: {},
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".hidden,[hidden]": {
          display: "none !important",
        },
        // Font Weight
        ".fontWeightBold": {
          fontWeight: "700",
        },
        ".fontWeightMedium": {
          fontWeight: "500",
        },
        ".fontWeightRegular": {
          fontWeight: "400",
        },
        ".fontWeightLight": {
          fontWeight: "300",
        },

        // demo box
        ".xt-demo-box": {
          width: "75px",
          height: "75px",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        },

        // Fix for navigation : on open select
        ".vsc-initialized": {
          paddingRight: "0px !important",
        },

        "::-moz-selection": { background: "#1d1d1d1a;" },
        "::selection": { background: "#1d1d1d1a" },

        // Highcharts - Global Style
        ".xt-highcharts-axis-units": {
          fontSize: 8,
          fontWeight: 500,
          marginLeft: 4,
          padding: "1px 6px",
          borderRadius: 2,

          background: "#F5F5F5", // grey[100]
          color: "#757575", // grey[600]
        },

        ".xt-highcharts-axis-title": {
          fontSize: 10,
          fontWeight: 600,

          color: "#000",
        },

        ".xt-highchart-allow-selection": {
          userSelect: "all",
          WebkitTapHighlightColor: "rgb(60 60 60 / 68%)",
        },

        ".xt-highcharts-plotline-label": {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: 10,
          borderRadius: "0px 2px 2px 0px",
          padding: "0px 8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: 23,
          lineHeight: "23px",

          color: "white",
          background: "#424242",
        },

        ".xt-highcharts-label-prefix": {
          ":after": {
            position: "absolute",
            width: 4,
            height: 23,
            content: "' '",
            borderRadius: "1px 0px 0px 1px",
            top: 0,
            left: "-3px",

            background: "grey",
          },
        },

        ".xt-highcharts-label-prefix-right": {
          borderRadius: "2px 0px 0px 2px",
          ":after": {
            borderRadius: "0px 1px 1px 0px",
            top: 0,
            left: "unset",
            right: "-3px",
          },
        },

        ".xt-prefix-bg-purple500": {
          ":after": {
            background: "#9c27b0",
          },
        },

        ".xt-prefix-bg-blue500": {
          ":after": {
            background: "#2096F3",
          },
        },

        ".xt-prefix-bg-blueUnique": {
          ":after": {
            background: "#01bcd4",
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  breakpoints: {
    values: {
      xs: 1000,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1366,
      xxl: 1440,
      xxxl: 1920,
    },
  },
  // borderRadius: {
  //     large: 12,
  //     main: 10,
  //     small: 7,
  //     0: 0,
  //     0.5: 2,
  //     1: 4,
  //     1.5: 6,
  //     2: 8,
  //     2.5: 10,
  //     3: 12,
  //     3.5: 14,
  //     4: 16
  // },
  borderRadius: {
    large: 25,
    main: 20,
    small: 15,
    0: 5,
    1: 10,
    2: 15,
    3: 20,
    4: 25,
  },
  shadows: [
    "none",
    // custom
    "0px 4px 24px #0000001a",
    // narrow
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    // wide
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px…gba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px…gba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px…gba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px…gba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px…gba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px…gba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2p…gba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2p…gba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2p…gba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2p…gba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3…gba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3…gba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3…gba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3…gba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3…gba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  typography: {
    h1: { fontSize: "1.3125rem", fontWeight: 600, letterSpacing: "-.02em" },
    h2: { fontSize: "1.0625rem", fontWeight: 500, letterSpacing: "-.02em" },
    h3: { fontSize: "0.875rem", fontWeight: 400, letterSpacing: "-.02em" },
    h4: { fontSize: 14 },
    h5: { fontSize: 12 },
    h6: { fontSize: 10 },

    /* H 6/Semibold */
    h6Semibold: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 600,
      fontSize: 20,
      lineHeight: "30px",
    },

    /* Body 2/Medium */
    body2Medium: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "21px",
    },
    /* Body 2/Semibold */
    body2Semibold: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "21px",
    },

    /* Body 3/Large */
    body3Large: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "21px",
      display: "flex",
      alignItems: "center",
    },
    /* Body 3/Medium */
    body3Medium: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 500,
      fontSize: 12,
      lineHeight: "18px",
    },
    /* Body 3/Semibold */
    body3Semibold: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 600,
      fontSize: 12,
      lineHeight: "18px",
    },
    /* Body 4/Medium */
    body4Medium: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 500,
      fontSize: 10,
      lineHeight: "15px",
    },
    /* Body 4/Semibold */
    body4Semibold: {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      fontWeight: 600,
      fontSize: 10,
      lineHeight: "15px",
    },

    // fontFamily: ["Poppins", "Helvetica", "Arial", "MontserratAlternates", "sans-serif"].join(",")
    fontFamily: [
      "Segoe UI",
      "-apple-system",
      "BlinkMacSystemFont",
      "Roboto",
      "Helvetica Neue",
      "Helvetica",
      "Ubuntu",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
    ].join(","),
  },
};

export default ThemeShared;
