import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

// Clsx
import clsx from "clsx";

// PropTypes
import PropTypes from "prop-types";

// HighchartsReact
import HighchartsReact from "highcharts-react-official";

// Highcharts
import Highcharts from "highcharts";
// import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAnnotations from "highcharts/modules/annotations";
import HighchartsNetworkGraph from "highcharts/modules/networkgraph";
import HighchartsColorAxis from "highcharts/modules/coloraxis";
// import HighchartHeatMap from "highcharts/modules/heatmap";
import HighchartStock from "highcharts/modules/stock";
// import HighchartTreeMap from "highcharts/modules/treemap";
import HighchartSeriesLabel from "highcharts/modules/series-label";
import HighchartBoost from "highcharts/modules/boost";
import HighChartXRange from "highcharts/modules/xrange";
import accessibility from "highcharts/modules/accessibility";

// Component
import FusionSpinner from "./Spinner";
import FusionHeaderComponent from "./FusionHeaderComponent";
import RangePopupModal from "./RangeModal";

// Utils
import hcThemeV3 from "./HighchartThemeV3";

// Material UI
import { Box } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import moment from "moment";
import { TimeFormat } from "./constant/TimeFormat";

// Style
const useStyles = makeStyles()((theme) => ({
  errorMessage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: "0.9",
    top: 0,

    // Theme
    color: theme.palette.text.chart,
  },
  loadingContainer: {
    height: "4px", // with loading indicator container having a defined height, the chart won't appear as "jumping" when loading ends and loader disappears
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    background: theme.palette.background.border,
    border: "1px solid" + theme.palette.background.border,
    borderRadius: 15,
    // Overide: Themes Chart
    "& .powerAxis": {
      backgroundColor: theme?.palette?.background?.header,
    },
    "& rect.highcharts-background": {
      fill: theme.palette.background.chart,
    },
    "& text.highcharts-axis-title, g.highcharts-axis-labels text": {
      color: theme.palette.text.primary + "!important",
      fill: theme.palette.text.primary + "!important",
    },
    "& .xt-component-content": {
      background: theme.palette.background.chart,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    "& .highcharts-tooltip": {
      "& .highcharts-label-box": {
        strokeWidth: "0 !important",
      },

      "& .tooltip": {
        boxShadow:
          "0px 4px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px -2px 1px rgba(0, 0, 0, 0.04)",
        background: "rgba(255,255,255,0.9)",
        borderRadius: 4,
        padding: "7.5px 8px 6.5px 12px",
        fontSize: 12,
        fontWeight: 500,
        color: theme.palette.grey[800],
        letterSpacing: "0.004em",

        "& .unit": {
          letterSpacing: "0.015em",
          fontSize: 10,
        },

        "& b": {
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.004em",
          color: "#000",
        },

        "& .icon": {
          display: "inline-block",
          width: 14,
          marginRight: 8,
          fontSize: 14,
          textAlign: "center",
        },
      },
    },
  },
  chartWrapper: {
    height: "100%",
    width: "100%",
  },
  chartWithColorAxis: {
    "& .highcharts-legend-item.highcharts-color-undefined": {
      transform: "translateY(-30px) translateX(52px)",
    },
  },
  chartWrapperBorder: {
    height: "calc(100% - 54px)",
    // borderRadius: "15px"
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const modulesState = {
  networkgraph: {
    initialized: false,
    init: () => HighchartsNetworkGraph(Highcharts),
  },
};

const initModule = (moduleName) => {
  if (modulesState[moduleName]) {
    if (modulesState[moduleName].initialized) {
      return;
    } else {
      modulesState[moduleName].initialized = true;
      modulesState[moduleName].init();
    }
  }
};

// HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
HighchartsAnnotations(Highcharts);
HighchartsColorAxis(Highcharts);
// HighchartHeatMap(Highcharts);
HighchartStock(Highcharts);
// HighchartTreeMap(Highcharts);
HighchartSeriesLabel(Highcharts);
HighchartBoost(Highcharts);
HighChartXRange(Highcharts);
accessibility(Highcharts);

export const REFLOW_DELAY = 1000;

export const reflowCharts = () => {
  // timeout because this is needed to handle a reflow after the container changes size
  // the containers usually change size as a response to a MUI component moving, which
  // would have an animation that is less than 300ms
  setTimeout(() => {
    Highcharts.charts.forEach((chart) => (chart ? chart.reflow() : undefined));
  }, REFLOW_DELAY);
};

const HighChartsWrapperV3 = forwardRef((props, ref) => {
  const {
    customFileExport,
    title,
    height,
    maxWidth,
    options,
    showHeader = true,
    error,
    wells,
    shoWellCount = false,
    wellLevelSelection,
    loading,
    showTimePicker = false,
    timePicker,
    handleTimePickerUpdated,
    timePickerAnalysisConfig,
    className,
    showLegendToggler = true,
    showDefaultLegend = true,
    reflowDelay = REFLOW_DELAY,
    displayChartEdit,
    headerDate,
    handleInputData = false,
    handleOpenRangeModal,
    excludeExportColumns = [],
    sortOrder,
    handleChangeSortOrder,
    showInputFilter,
    filterInputParams,
    handleFilterInputChange,
    removeChart,
    handleRemoveChart,
    showDeltaIcon,
    inputAxis,
    DateTimeFormat,
    shortHeader = false,
    openRangModal,
    handleCloseRangeModal,
    editChartOptions,
    ChartOptions,
    handleChangeButton,
    ChartButtonOptions,
    currentSelectedChart,
    handleChangeGroupButton,
    showtoggleGrpBtn,
    handleFieldSelection,
    fieldSelectionList,
    selectField,
    handleXAxisChange,
    selectedXAxis,
    axisSeletion,
    defermentTitle,
    showSorting,
    FieldSelectionList = [],
    showAxisPower,
    secondaryOptions,
  } = props;

  const chartRef = useRef();
  const [showLegend, setShowLegend] = useState(showDefaultLegend);
  const { classes } = useStyles();
  const hcThemeInstance = hcThemeV3();
  Highcharts.setOptions(hcThemeInstance);

  useImperativeHandle(ref, () => ({
    reflow: () => {
      chartRef?.current.chart.reflow();
    },
    chart: chartRef?.current.chart,
  }));
  const applyLabelFormatting = (row, i, axis) => {
    const { labels, ...rest } = axis[i];
    if (!labels?.scientific) {
      axis[i] = {
        ...rest,
        labels: {
          ...labels,
          useHTML: true,
          formatter: function () {
            // eslint-disable-next-line
            const { type, format, autoFormatAxis } = axis[i];
            const pow = Math.floor(Math.log10(this?.axis?.dataMax));

            if (type === "datetime" && format) {
              return moment
                ?.unix(this?.value)
                ?.utc()
                ?.format(
                  DateTimeFormat !== undefined
                    ? DateTimeFormat
                    : TimeFormat.dateShort
                );
            }

            if (this?.value === this?.axis?.max && pow > 2) {
              return `<div style="margin-top:10px;">
                        <span class= "powerAxis" style="padding-left:4px; padding-right:4px; padding-top:4px;"><b>x10<sup>${pow}</sup></b></span>
                        </div>`;
            }
            if (this?.value === this?.axis?.max && pow <= 2) {
              return this.axis.max;
            }

            if (this?.isLast && pow > 2 && type !== "datetime") {
              let val = Math.log10(this.value).toFixed(0) - 1;
              let place = Math.pow(10, val);
              let ret = this.value / place;
              return `<div style="position:relative; display: flex; justify-content:space-between; align-items:start">
                        <span style="margin-right:13px;">${ret.toFixed(
                          2
                        )}</span> <span class= "powerAxis" style="align-self: start; position:absolute; top:16px; right:3px; padding-left: 4px; padding-right: 4px; text-align:start;"><b>x10<sup>${pow}</sup></b></span>
                        </div> `;
            }

            if (this.isLast && pow <= 2 && type !== "datetime") {
              return this.value;
            }

            let decimals = null;
            if (row && row.decimals && row.decimals > 0) {
              decimals = row.decimals;
              return Number(this.value).toFixed(decimals);
            }
            if (autoFormatAxis && pow > 2) {
              return applyAutoFormatLabels(
                this.value,
                autoFormatAxis,
                this.axis.max
              );
            }

            return this.axis.defaultLabelFormatter.call(this);
          },
        },
      };
    }
    return axis[i];
  };

  const applyAutoFormatLabels = (value, autoFormatAxis, pow) => {
    // eslint-disable-next-line

    let val = Math.log10(pow).toFixed(0) - 1;
    let place = Math.pow(10, val);
    const { maxValue = 9999 } = autoFormatAxis || {};
    const numericValue = Number(value);
    if (maxValue && numericValue > maxValue && place) {
      const numericSymbols = ["k", "M", "B", "T", "P", "E"];
      var ret = "";
      var i = numericSymbols.length;
      while (i-- && ret === "") {
        if (place && numericSymbols[i] !== null) {
          const res = numericValue / place;
          ret = Highcharts.numberFormat(res, -1);
        } else if (
          -numericValue >= place ||
          (-numericValue <= place && numericSymbols[i] !== null)
        ) {
          const res = numericValue / place;

          ret = Highcharts.numberFormat(res, -1);
        }
      }
      return ret === "" ? value : ret;
    }
    return value;
  };
  useEffect(() => {
    setTimeout(() => {
      if (chartRef?.current?.chart?.reflow) {
        chartRef.current.chart.reflow();
      }
    }, reflowDelay);
  }, [height, maxWidth, reflowDelay]);

  const exportCSV = () => {
    if (chartRef.current?.chart?.downloadCSV) {
      if (excludeExportColumns?.length) {
        let { chart: chartExp } = { ...chartRef.current };
        let mainSeries = chartExp?.series;
        let expSeries = chartExp?.series?.filter(
          (item) => !excludeExportColumns.includes(item.name)
        );
        chartExp.series = expSeries;
        chartExp.downloadCSV();
        chartExp.series = mainSeries;
      } else {
        let { chart: chartExp } = { ...chartRef.current };
        let mainSeries = chartExp?.series;
        chartExp?.series?.forEach((series, i) => {
          let unit = series?.options?.custom?.tooltip?.unit;
          if (unit) {
            series.update({
              name: series.name + ` (${unit})`,
            });
          }
        });
        chartExp.downloadCSV();
        chartExp.series = mainSeries;
      }
    }
  };

  const exportPNG = () => {
    if (chartRef.current?.chart?.exportChart) {
      chartRef.current.chart.exportChart({ type: "image/png" });
    }
  };

  if (!!options?.chart?.type) {
    initModule(options?.chart?.type);
  }

  /**
   * @description update chart title property
   */
  if (title) {
    if (!showHeader) {
      options.title = {
        text: title,
      };
    } else {
      options.exporting = {
        ...options.exporting,
        chartOptions: {
          title: {
            text: title,
          },
        },
      };
    }
  }

  if (options?.xAxis?.length) {
    let xAxis = options?.xAxis || [];
    options.xAxis =
      xAxis?.length &&
      xAxis?.map((x) => {
        return x.type === "datetime"
          ? {
              ...x,
              title: { ...x.title, enabled: false },
              tickAmount: 7,
              lineWidth: 1,
            }
          : x;
      });
  }

  /**
   * @description apply label formatting
   */
  if (options?.xAxis?.length && options?.yAxis?.length) {
    let { xAxis, yAxis } = options;
    options.xAxis = showAxisPower ? xAxis?.map(applyLabelFormatting) : xAxis;
    options.yAxis = yAxis?.map(applyLabelFormatting);
  }

  const headerOptions = [
    {
      label: "Download CSV",
      callback: () => {
        customFileExport ? customFileExport(options) : exportCSV();
      },
    },
    {
      label: "Download PNG",
      callback: exportPNG,
    },
  ];

  const toggleLegend = () => {
    options.legend = {
      ...options?.legend,
      enabled: !showLegend,
    };
    setShowLegend(!showLegend);
  };

  return (
    <>
      <Box className={classes.chartContainer} position="relative">
        {showHeader ? (
          <FusionHeaderComponent
            header={title}
            wells={wells}
            displayFullscreen
            template="transparent"
            options={headerOptions}
            shoWellCount={shoWellCount}
            showLegendToggler={showLegendToggler}
            toggleLegend={toggleLegend}
            showLegend={showLegend}
            headerDate={headerDate}
            handleXAxisChange={handleXAxisChange}
            selectedXAxis={selectedXAxis}
            axisSeletion={axisSeletion}
            inputAxis={inputAxis}
            defermentTitle={defermentTitle}
            timePicker={timePicker}
            showTimePicker={showTimePicker}
            handleTimePickerUpdated={handleTimePickerUpdated}
            timePickerAnalysisConfig={timePickerAnalysisConfig}
            wellLevelSelection={wellLevelSelection}
            handleInputData={handleInputData}
            displayChartEdit={displayChartEdit}
            handleOpenRangeModal={handleOpenRangeModal}
            sortOrder={sortOrder}
            handleChangeSortOrder={handleChangeSortOrder}
            showInputFilter={showInputFilter}
            loading={loading}
            filterInputParams={filterInputParams}
            handleFilterInputChange={handleFilterInputChange}
            removeChart={removeChart}
            handleRemoveChart={handleRemoveChart}
            showDeltaIcon={showDeltaIcon}
            shortHeader={shortHeader}
            ChartOptions={ChartOptions}
            currentSelectedChart={currentSelectedChart}
            handleChangeButton={handleChangeButton}
            ChartButtonOptions={ChartButtonOptions}
            handleChangeGroupButton={handleChangeGroupButton}
            showtoggleGrpBtn={showtoggleGrpBtn}
            handleFieldSelection={handleFieldSelection}
            fieldSelectionList={fieldSelectionList}
            selectField={selectField}
            showSorting={showSorting}
            FieldSelectionList={FieldSelectionList}
          />
        ) : null}
        <Box
          data-testid="hight-charts-react-wrapper"
          className={clsx(
            "xt-component-content",
            classes.chartWrapper,
            classes[className],
            showHeader && classes.chartWrapperBorder
          )}
          sx={{
            px: 2,
            // mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          {!loading && (
            <>
              {secondaryOptions && (
                <HighchartsReact
                  data-testid="hight-charts-react"
                  ref={chartRef}
                  containerProps={{
                    style: { height: "10%", width: "100%" },
                  }}
                  highcharts={Highcharts}
                  options={secondaryOptions}
                  className={classes.chart}
                />
              )}
              <HighchartsReact
                data-testid="hight-charts-react"
                ref={chartRef}
                containerProps={{
                  style: { height: "100%", width: "100%" },
                }}
                highcharts={Highcharts}
                options={options}
                className={classes.chart}
              />
            </>
          )}
          {(error ||
            options?.series?.length === 0 ||
            options?.series?.data?.length === 0) &&
            !loading && (
              <div className={classes.errorMessage}>
                <span>No data to display</span>
              </div>
            )}
          {loading && (
            <div className={classes.spinner}>
              <FusionSpinner />
            </div>
          )}
        </Box>
      </Box>
      {Boolean(openRangModal?.open) && (
        <RangePopupModal
          open={openRangModal}
          handleConfirm={editChartOptions}
          handleClose={handleCloseRangeModal}
        />
      )}
    </>
  );
});

HighChartsWrapperV3.propTypes = {
  title: PropTypes.string,
  options: PropTypes.shape({
    yAxis: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]),
    xAxis: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]),
  }),
  height: PropTypes.number,
  error: PropTypes.bool,
  loading: PropTypes.bool,
};

export default HighChartsWrapperV3;
