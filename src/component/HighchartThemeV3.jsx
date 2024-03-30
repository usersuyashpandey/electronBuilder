import { useTheme } from "@mui/system";

const hcTheme = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();

  return {
    colors: theme.palette.seriesColors?.colors,
    // colors: [
    //     "#4309eb", //purple
    //     "#ff0068", //red
    //     "#00ddf7", //light blue
    //     "#5ef041", //green
    //     "#ff0fd4", //pink
    //     "#fbc714", //yellow
    //     "#007d79", //teal
    //     "#fa4d56", //salmon
    //     "#ff7eb6", //light pink
    //     "#1bb474", //aqua
    //     "#ba4e00", //orange
    //     "#b49df7", //lighter purple
    //     "#ff66a4", //lighter red
    //     "#99f1fc", //lighter light blue
    //     "#9ef68d", //lighter green
    //     "#ff6fe5", //lighter pink
    //     "#fef4d0", //lighter yellow
    //     "#66b1af", //lighter teal
    //     "#fc949a", //lighter salmon
    //     "#ff98c5", //lighter light pink
    //     "#b1f8a4", //lighter aqua
    //     "#f1dccc", //lighter orange
    //     "#220576", //darker purple
    //     "#800034", //darker red
    //     "#006f7c", //darker light blue
    //     "#2f7821", //darker green
    //     "#80086a", //darker pink
    //     "#bc950f", //darker yellow
    //     "#003f3d", //darker teal
    //     "#7d27sb", //darker salmon
    //     "#40202e", //darker light pink
    //     "#283e23", //darker aqua
    //     "#5d2700" //darker orange
    // ],
    chart: {
      animation: {
        duration: 1000,
      },
      marginTop: 5,
      marginLeft: 60,
      marginRight: 24,
      plotBorderWidth: 0.5,
      plotBorderColor: "#8c8c8c",
      backgroundColor: theme.palette.background.default,
      style: {
        fontFamily: theme.typography.fontFamily,
      },
    },
    tooltip: {
      useHTML: true,
      borderWidth: 0,
      borderColor: "transparent",
      backgroundColor: "transparent",
      formatter: function () {
        let points = [this.point];
        if (this.points) points = this.points;
        return `<div class="tooltip" style='background-color: #fff; box-shadow:
                0px 4px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px -2px 1px rgba(0, 0, 0, 0.04); padding: 7.5px 8px 6.5px 12px;'>${points.reduce(
                  function (s, point) {
                    return (
                      s +
                      "<br/>" +
                      (point?.series?.options?.custom?.tooltip?.symbol || "") +
                      point.series.name +
                      ": <b>" +
                      point.y?.toFixed(2) +
                      "</b> " +
                      (point?.series?.options?.custom?.tooltip?.unit || "")
                    );
                  },
                  "<b>" + this.x + "</b>"
                )}</div>`;
      },
      positioner: function (w, h, p) {
        const chart = this.chart,
          width2 = chart.plotWidth / 2,
          x = p.plotX + chart.plotLeft,
          offset = 16;

        let tooltipX = x;

        if (p.plotX < width2) {
          tooltipX = x + offset;
        } else {
          tooltipX = x - w - offset;
        }

        return { x: tooltipX, y: 60 };
      },
      borderRadius: 8,
      padding: 0,
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: "#000000",
        fontSize: "14px",
        letterSpacing: "0.015em",
        fontWeight: "400",
      },
      itemHoverStyle: { color: "#000000", fontWeight: "bold" },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    exporting: {
      enabled: true,
    },

    xAxis: {
      minorGridLineWidth: 0,
      labels: {
        y: 20,
        style: {
          color: "#424242",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.015em",
        },
      },
      lineColor: "#8c8c8c",
      lineWidth: 0.25,
      minorGridLineColor: "transparent",
      tickColor: "transparent",
      tickWidth: 0,
      tickLength: 0,
      minorTickLength: 0,
      gridLineColor: "#8c8c8c",
      gridLineWidth: 0.25,
      // crosshair: {
      //     width: 1,
      //     dashStyle: "shortdot",
      //     color: "#BDBDBD"
      // },
      title: {
        y: -22 + 22,
        style: {
          color: "#424242",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.015em",
        },
      },
    },
    yAxis: {
      gridLineColor: "#8c8c8c",
      gridLineWidth: 0.25,
      labels: {
        style: {
          color: "#424242",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.015em",
        },
      },
      // crosshair: {
      //     width: 1,
      //     dashStyle: "shortdot",
      //     color: "#BDBDBD"
      // },
      lineColor: "#8c8c8c", //"#8c8c8c",
      lineWidth: 0.25,
      minorGridLineColor: "transparent",
      tickColor: "transparent",
      title: {
        style: {
          color: "#424242",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.015em",
        },
      },
    },
    plotOptions: {
      series: {
        label: {
          enabled: false,
        },
        animation: false,
        marker: {
          radius: 2,
        },
        states: {
          hover: {
            lineWidth: 1,
          },
          inactive: {
            opacity: 1,
          },
        },
      },
      line: {
        states: {
          hover: {
            lineWidth: 1,
            lineWidthPlus: 1,
          },
        },
      },
      column: {
        borderWidth: 0,
      },
    },
  };
};

export default hcTheme;
