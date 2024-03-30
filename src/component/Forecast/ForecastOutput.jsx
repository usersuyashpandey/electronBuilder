import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { Tabs, Tab, AppBar, Box, Grid } from "@mui/material";
import { useWindowSize } from "../constant/getWindowSize";
// import { HEIGHT_BREAKPOINT } from "../../constants/AppConstants";
// import useChartHeight from "../../hooks/useChartHeight";
import Chart from "../Chart";
import * as Constants from "../constant/ModelConstants";
import { useTheme } from "@mui/material/styles";
import InterferenceTable from "../InterferenceTable";
import moment from "moment";
import { TimeFormat } from "../constant/TimeFormat";
import FusionSelect from "../Select";

const useStyles = makeStyles()((theme) => ({
  accordionHeader: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "grey.500",
    padding: "4px 16px",
    fontSize: "20px",
    backgroundColor: theme.palette.background.header, //"#bea7e9",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    height: "38px",
  },
  headerName: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  appBar: {
    background: theme.palette.background.screen,
    // borderRadius: "7px",
    marginTop: "7px",
    overflow: "hidden",
    fontSize: "0.875rem",
    "& .MuiButtonBase-root.MuiTab-root": {
      fontWeight: 400,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.screen,
      "&:hover": {
        fontWeight: 400,
        backgroundColor: theme.palette.background.header,
      },
    },
    "& .Mui-selected": {
      // fontWeight: 600 + "!important"
    },
  },
  card: {
    width: "100%",
    // "& .xt-component-content": {
    //     // background: theme.palette.background.chart
    // },
    // "& > *": {
    //     backgroundColor: theme.palette.background.chart,
    //     border: "1px solid" + theme.palette.background.border,
    //     borderRadius: theme.borderRadius.small
    // }
  },
  chartGrid: {
    // height: "100%",
    "& > *": {
      // overflow: "hidden",
      borderRadius: theme.borderRadius.small,
      // marginBottom: "8px",
    },
    "& .highcharts-plot-border": {
      strokeWidth: "0",
    },
    "& .highcharts-empty-series": {
      strokeWidth: "0",
    },
  },
  tabPanelContainer: {
    // height: "100%"
  },
  selectedTab: {
    fontWeight: 600 + "!important",
    // fontWeight: 'bold',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  header: {
    background: theme.palette.background.purple,
    overflow: "hidden",
    justifyContent: "space-between",
    border: "1px solid",
    borderColor: theme.palette.background.border,
    borderRadius: theme.borderRadius.small,
  },
  panelTopToggle: {
    minWidth: "110px",
    marginTop: "4px",
    marginLeft: "8px",
    height: "38px !important",
  },
  tableGrid: {
    // paddingLeft: "10px",
    // paddingRight: "10px",
    "& .xt-component-content": {
      background: theme.palette.background.chart,
    },
  },
  tabHover: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.screen,
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.background.header,
    },
  },
  customDataGrid: {
    background: theme.palette.background.chart,
    overflow: "hidden",
    "& .MuiDataGrid-columnHeader": {
      background: theme.palette.background.chart,
      // color: theme.palette.primary.main,
      color: theme.palette.text.primary,
    },
  },
}));

const Forecast_Output = (props) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const {
    selectedTab,
    selectedFluidType,
    isWaterChecked,
    modelOutputData,
    defaultChartConfig,
  } = props;
  const [indexValue] = useState([]);
  const [rateChartOptions, setRateChartOptions] = useState({});
  const [cumulativeChartOptions, setCumulativeChartOptions] = useState({});
  const [waterCutChartOptions, setWaterCutChartOptions] = useState({});
  const [gorChartOptions, setGorChartOptions] = useState({});
  const [piChartOptions, setPiChartOptions] = useState({});
  const [pavgChartOptions, setPavgChartOptions] = useState({});
  const [ddvChartOptions, setDdvChartOptions] = useState({});
  const [bhpChartOptions, setBhpChartOptions] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [tablecolumn] = useState([]);
  const [selectedTabStyle, setSelectedTabStyle] = useState({});
  const [selectedProdTab, setSelectedProdTab] = useState(0);
  const chartSize = "S";
  const [selectedTypeOption] = useState(Constants.CHART);
  // const gapFromTopInPx = 100;
  // const itemsInAScreen = 1;
  const { height: windowHeight } = useWindowSize();
  // const allColumns = {
  //     z: 0, bg: 0, bo: 0, bob: 0, bw: 0, cg: 0, co: 0, cw: 0, deng: 0, deno: 0, denw: 0, mug: 0, muo: 0, muw: 0, ppc: 0, pres: 0, psat: 0, rs: 0, rsw: 0, sigma_go: 0, sigma_gw: 0, sigma_ow: 0, temp: 0,
  // };

  const [wellChartOptions] = useState({
    data: [],
    chartOptions: [],
    loading: false,
    error: true,
  });

  const itemHeight = useMemo(() => {
    return windowHeight - 178;
  }, [windowHeight]);

  // const [chartHeight] = useChartHeight({
  //     initialHeight: 280,
  //     windowHeight,
  //     gapFromTopInPx,
  //     HEIGHT_BREAKPOINT,
  //     itemsInAScreen
  // });

  const plotOptions = useMemo(() => {
    if (modelOutputData.forecast && modelOutputData.forecast.length > 0) {
      return modelOutputData.forecast.map((item) => ({
        value: item.eventEndDate,
        label: moment
          .unix(item.eventEndDate)
          .utc()
          .format(TimeFormat.dateShort),
      }));
    }
    return [];
  }, [modelOutputData.forecast]);

  const wellOptions = useMemo(() => {
    if (modelOutputData.forecast && modelOutputData.forecast.length > 1) {
      return modelOutputData.forecast.slice(1).map((item) => ({
        value: item.eventEndDate,
        label: moment
          .unix(item.eventEndDate)
          .utc()
          .format(TimeFormat.dateShort),
      }));
    }
    return [];
  }, [modelOutputData.forecast]);

  // const ChartOptions = [
  //     { value: "Oil", label: "Oil" },
  //     { value: "Gas", label: "Gas" },
  //     { value: "Water", label: "Water" }
  // ];

  const [currentSelectedChart] = useState("Oil");
  // const [currentSelectedChart, setCurrentSelectedChart] = useState("Oil");
  const plotLines = wellOptions?.sort()?.map((timestamp) => ({
    color: theme?.palette?.text?.primary,
    width: 1,
    value: timestamp.value,
    dashStyle: "dash",
    label: {
      text: `Event StartDate ${moment
        .unix(timestamp.value)
        .utc()
        .format(TimeFormat.dateShort)}`,
      align: "center",
      x: 3,
      y: 85,
      style: {
        color: theme?.palette?.text?.primary,
      },
    },
  }));

  // const handleChangeButton = (event, newAlignment) => {
  //     if (newAlignment !== null) {
  //         setCurrentSelectedChart(newAlignment);
  //     }
  // };

  useEffect(() => {
    if (plotOptions?.length > 0) {
      setSelectedValue(plotOptions[plotOptions.length - 1]?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotOptions]);

  const handleChange = (e, newValue) => {
    setSelectedValue(e.target.value);
  };

  const filteredForecastdata = modelOutputData?.forecast?.find(
    (item) => item?.eventEndDate === selectedValue
  );

  const createChartOptions = (
    chartData,
    yAxisTitle,
    unit,
    headerName,
    colorIndex,
    yAxisType
  ) => {
    const chartOptions = {
      ...defaultChartConfig,
      chart: {
        zoomType: "x",
        type: "line",
        marginLeft: 75,
        zooming: { mouseWheel: false },
        borderWidth: 0,
        lineWidth: 0,
      },
      tooltip: {
        shared: true,
        formatter: tooltipBHPFormatter(theme?.palette),
      },
      yAxis: [
        {
          gridLineWidth: 0,
          lineColor: "#9e9e9e",
          type: yAxisType || "linear",
          lineWidth: 1,
          title: { text: yAxisTitle },
          autoFormatAxis: { minValue: 0, maxValue: 999 },
          labels: { style: { color: theme?.palette?.text?.primary } },
        },
      ],
      xAxis: [
        {
          gridLineWidth: 0,
          attribute: "datetime",
          type: "datetime",
          lineColor: "#9e9e9e",
          lineWidth: 1,
          format: "MMM 'YY",
          labels: { style: { color: theme?.palette?.text?.primary } },
          plotLines: plotLines,
        },
      ],
      plotOptions: { series: { lineWidth: 1.5 } },
      legend: {
        itemStyle: { color: theme?.palette?.text?.primary },
        itemHoverStyle: {
          color: theme?.palette?.text?.primary,
          textDecoration: "none",
        },
        itemHiddenStyle: { color: "#999", textDecoration: "none" },
      },
      series: chartData.map((data, index) => ({
        name: data.name,
        data: data.data,
        yAxis: 0,
        unit: unit,
        color: theme?.palette?.seriesColors?.colors[colorIndex[index]] || null,
      })),
    };
    chartOptions.headerName = headerName;
    return chartOptions;
  };

  useEffect(() => {
    const rateSeriesData = [];
    const cumulativeSeriesData = [];
    const waterCutSeriesData = [];
    const gorSeriesData = [];
    const piSeriesData = [];
    const pavgSeriesData = [];
    const ddvSeriesData = [];
    const bhpSeriesData = [];
    // ... (existing code)

    let preOutputData = "";
    let postOutputData = "";
    if (
      modelOutputData &&
      modelOutputData?.forecast &&
      modelOutputData?.forecast?.length !== 1
    ) {
      preOutputData =
        modelOutputData?.forecast[modelOutputData?.forecast.length - 2]
          ?.data_fcast;
      postOutputData =
        modelOutputData?.forecast[modelOutputData?.forecast.length - 1]
          ?.data_fcast;
    } else if (
      modelOutputData &&
      modelOutputData?.forecast &&
      modelOutputData?.forecast?.length === 1
    ) {
      preOutputData = modelOutputData?.forecast[0]?.data_fcast;
    } else {
      // console.log('Forecast data is undefined or empty.');
    }
    const filteredPreForecast = preOutputData;
    const filteredPostForecast = postOutputData;

    const production = filteredForecastdata?.data_hist;
    const prodDateTime = production?.datetime;
    const outputDateTime = filteredPreForecast?.datetime;
    const postOutputDateTime = filteredPostForecast?.datetime;
    const lableUnit = currentSelectedChart === "Gas" ? "Mscf/d" : "STB/d";
    const lableCumUnit = currentSelectedChart === "Gas" ? "MMscf" : "MMSTB";

    if (production || filteredPreForecast || filteredPostForecast) {
      // if (currentSelectedChart === "Oil") {
      production?.q_oil?.length &&
        rateSeriesData.push({
          name: "Actual",
          data: production.q_oil.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.q_oil?.length &&
        rateSeriesData.push({
          name: "Forecast Rate Oil (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.q_oil[i]) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.q_oil?.length &&
        rateSeriesData.push({
          name: "Forecast Rate Oil (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.q_oil[i]) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.colors[0],
        });

      production?.cum_oil?.length &&
        cumulativeSeriesData.push({
          name: "Actual",
          data: production.cum_oil.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) / 1000000 || null,
          ]),
          yAxis: 0,
          unit: "MMSTB",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.cum_oil?.length &&
        cumulativeSeriesData.push({
          name: "Forecast Cum Oil (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.cum_oil[i]) / 1000000 || null,
          ]),
          unit: "MMSTB",
          color: theme?.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.cum_oil?.length &&
        cumulativeSeriesData.push({
          name: "Forecast Cum Oil (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.cum_oil[i]) / 1000000 || null,
          ]),
          unit: "MMSTB",
          color: theme?.palette?.seriesColors?.colors[0],
        });
      // } else if (currentSelectedChart === "Gas") {
      production?.q_gas?.length &&
        rateSeriesData.push({
          name: "Actual",
          data: production.q_gas.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) / 1000 || null,
          ]),
          yAxis: 0,
          unit: "Mscf/d",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.q_gas?.length &&
        rateSeriesData.push({
          name: "Forecast Rate Gas (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.q_gas[i]) / 1000,
          ]),
          yAxis: 0,
          unit: "Mscf/d",
          color: theme?.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.q_gas?.length &&
        rateSeriesData.push({
          name: "Forecast Rate Gas (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.q_gas[i]) / 1000 || null,
          ]),
          unit: "Mscf/d",
          color: theme?.palette?.seriesColors?.colors[0],
        });

      production?.cum_gas?.length &&
        cumulativeSeriesData.push({
          name: "Actual",
          data: production.cum_gas.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) / 1000 || null,
          ]),
          yAxis: 0,
          unit: "MMscf",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.cum_gas?.length &&
        cumulativeSeriesData.push({
          name: "Forecast Cum Gas (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.cum_gas[i]) / 1000,
          ]),
          unit: "MMscf",
          color: theme?.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.cum_gas?.length &&
        cumulativeSeriesData.push({
          name: "Forecast Cum Gas (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.cum_gas[i]) / 1000 || null,
          ]),
          unit: "MMscf",
          color: theme?.palette?.seriesColors?.colors[0],
        });

      // } else {
      production?.q_water?.length &&
        rateSeriesData.push({
          name: "Actual",
          data: production.q_water.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.q_water?.length &&
        rateSeriesData.push({
          name: "Forecast Rate Water (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.q_water[i]) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.q_water?.length &&
        rateSeriesData.push({
          name: "Forecast Rate Water (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.q_water[i]) || null,
          ]),
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.colors[0],
        });

      production?.cum_water?.length &&
        cumulativeSeriesData.push({
          name: "Actual",
          data: production.cum_water.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) / 1000000 || null,
          ]),
          yAxis: 0,
          unit: "MMSTB",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.cum_water?.length &&
        cumulativeSeriesData.push({
          name: "Forecast Cum Water (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.cum_water[i]) / 1000000 || null,
          ]),
          unit: "MMSTB",
          color: theme?.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.cum_oil?.length &&
        cumulativeSeriesData.push({
          name: "Forecast Cum Oil (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.cum_oil[i]) / 1000000 || null,
          ]),
          unit: "MMSTB",
          color: theme?.palette?.seriesColors?.colors[0],
        });
      // }
      production?.watercut?.length &&
        waterCutSeriesData.push({
          name: "Actual",
          data: production.watercut.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.watercut?.length &&
        waterCutSeriesData.push({
          name: "Forecast Water Cut (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.watercut[i]) || null,
          ]),
          unit: "",
          color: theme.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.watercut?.length &&
        waterCutSeriesData.push({
          name: "Forecast Water Cut (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.watercut[i]) || null,
          ]),
          unit: "",
          color: theme.palette?.seriesColors?.colors[0],
        });

      production?.inst_gor?.length &&
        gorSeriesData.push({
          name: "Actual",
          data: production.inst_gor.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "scf/STB",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.inst_gor?.length &&
        gorSeriesData.push({
          name: "Forecast Gor (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.inst_gor[i]) || null,
          ]),
          unit: "scf/STB",
          color: theme.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.inst_gor?.length &&
        gorSeriesData.push({
          name: "Forecast Gor (Post",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.inst_gor[i]) || null,
          ]),
          unit: "scf/STB",
          color: theme.palette?.seriesColors?.colors[0],
        });

      production?.pwf?.length &&
        bhpSeriesData.push({
          name: "Actual",
          data: production.pwf.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "psia",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.pwf?.length &&
        bhpSeriesData.push({
          name: "Forecast BHP (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.pwf[i]) || null,
          ]),
          unit: "psia",
          color: theme.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.pwf?.length &&
        bhpSeriesData.push({
          name: "Forecast BHP (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.pwf[i]) || null,
          ]),
          unit: "psia",
          color: theme.palette?.seriesColors?.colors[0],
        });

      production?.PI_liq?.length &&
        piSeriesData.push({
          name: "Actual",
          data: production.PI_liq.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "STB/d/psi",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.PI_liq?.length &&
        piSeriesData.push({
          name: "Forecast Productivity Index (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.PI_liq[i]) || null,
          ]),
          unit: "STB/d/psi",
          color: theme.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.PI_liq?.length &&
        piSeriesData.push({
          name: "Forecast Productivity Index (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.PI_liq[i]) || null,
          ]),
          unit: "STB/d/psi",
          color: theme.palette?.seriesColors?.colors[0],
        });

      production?.p_avg?.length &&
        pavgSeriesData.push({
          name: "Actual",
          data: production.p_avg.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "psia",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.p_avg?.length &&
        pavgSeriesData.push({
          name: "Forecast Reservoir Pressure (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.p_avg[i]) || null,
          ]),
          unit: "psia",
          color: theme.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.p_avg?.length &&
        pavgSeriesData.push({
          name: "Forecast Reservoir Pressure (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.p_avg[i]) || null,
          ]),
          unit: "psia",
          color: theme.palette?.seriesColors?.colors[0],
        });

      production?.ddv?.length &&
        ddvSeriesData.push({
          name: "Actual",
          data: production.ddv.map((e, i) => [
            prodDateTime[i],
            parseFloat(e) || null,
          ]),
          yAxis: 0,
          unit: "bbl",
          color: theme?.palette?.seriesColors?.colors[3],
        });
      filteredPreForecast?.ddv?.length &&
        ddvSeriesData.push({
          name: "Forecast DDV (Pre)",
          data: outputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPreForecast?.ddv[i]) || null,
          ]),
          unit: "bbl",
          color: theme.palette?.seriesColors?.colors[1],
        });
      filteredPostForecast?.ddv?.length &&
        ddvSeriesData.push({
          name: "Forecast DDV (Post)",
          data: postOutputDateTime?.map((e, i) => [
            e,
            parseFloat(filteredPostForecast?.ddv[i]) || null,
          ]),
          unit: "bbl",
          color: theme.palette?.seriesColors?.colors[0],
        });

      // Update RateChartOptions
      const updatedRateChartOptions = createChartOptions(
        rateSeriesData,
        `${currentSelectedChart} Rate (${lableUnit})`,
        lableUnit,
        "Rates Forecast",
        [3, 1, 0]
      );
      setRateChartOptions(updatedRateChartOptions);

      // Update CumulativeChartOptions
      const updatedCumulativeChartOptions = createChartOptions(
        cumulativeSeriesData,
        `${currentSelectedChart} Cum (${lableCumUnit})`,
        lableCumUnit,
        "Cumulative Volume",
        [3, 1, 0]
      );
      setCumulativeChartOptions(updatedCumulativeChartOptions);

      // Update WaterCutChartOptions
      const updatedWaterCutChartOptions = createChartOptions(
        waterCutSeriesData,
        "WaterCut",
        "",
        "WaterCut",
        [3, 1, 0]
      );
      setWaterCutChartOptions(updatedWaterCutChartOptions);

      // Update GorChartOptions
      const updatedGorChartOptions = createChartOptions(
        gorSeriesData,
        "GOR (scf/STB)",
        "scf/STB",
        "GOR",
        [3, 1, 0]
      );
      setGorChartOptions(updatedGorChartOptions);

      // Update PI ChartOptions
      const updatedPiChartOptions = createChartOptions(
        piSeriesData,
        "PI (STB/d/psi)",
        "STB/d/psi",
        "Productivity Index",
        [3, 1, 0],
        "logarithmic"
      );
      setPiChartOptions(updatedPiChartOptions);

      // Update PAVG ChartOptions
      const updatedPavgChartOptions = createChartOptions(
        pavgSeriesData,
        "Avg Reservoir Pressure (psia)",
        "psia",
        "Reservoir Pressure",
        [3, 1, 0]
      );
      setPavgChartOptions(updatedPavgChartOptions);

      // Update DDV ChartOptions
      const updatedDdvChartOptions = createChartOptions(
        ddvSeriesData,
        "DDV (bbl)",
        "bbl",
        "DDV",
        [3, 1, 0]
      );
      setDdvChartOptions(updatedDdvChartOptions);

      // Update BHP ChartOptions
      const updatedBhpChartOptions = createChartOptions(
        bhpSeriesData,
        "BHP (psia)",
        "psia",
        "BHP",
        [3, 1, 0]
      );
      setBhpChartOptions(updatedBhpChartOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultChartConfig,
    theme,
    filteredForecastdata,
    currentSelectedChart,
    wellOptions,
    selectedValue,
    modelOutputData,
  ]);

  const Production_TABS = useMemo(
    () => [
      {
        key: `tab-panel-0`,
        id: 0,
        name: "Rate",
        component: (
          <>
            <Grid id="container1" item md={12} height="calc(80vh - 180px)">
              <Chart
                key={Constants.CHART}
                className="fdo-result-chart"
                options={rateChartOptions}
                height={"100%"}
                width={"calc(100vw-10px)"}
                classes={classes}
                mx={0}
                // ChartOptions={ChartOptions}
                // currentSelectedChart={currentSelectedChart}
                // handleChangeButton={handleChangeButton}
                DateTimeFormat="MMM'YY"
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-1`,
        id: 1,
        name: "Cumulatitiv volume",
        component: (
          <>
            <Grid id="container1" item md={12} height="calc(80vh - 180px)">
              <Chart
                key={Constants.CHART}
                className="fdo-result-chart"
                options={cumulativeChartOptions}
                height={"100%"}
                width={"calc(100vw-10px)"}
                DateTimeFormat="MMM 'YY"
                classes={classes}
                mx={0}
                // ChartOptions={ChartOptions}
                // currentSelectedChart={currentSelectedChart}
                // handleChangeButton={handleChangeButton}
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-2`,
        id: 2,
        name: "Watercut/Gor",
        component: (
          <>
            <Grid id="container1" item md={12} height="calc(50vh - 72px)">
              <Chart
                key={Constants.CHART}
                headerName="Gas"
                className="fdo-result-chart"
                options={waterCutChartOptions}
                width={"calc(100vw-10px)"}
                height={"100%"}
                DateTimeFormat="MMM 'YY"
                classes={classes}
                mx={0}
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
            <Grid
              id="container1"
              item
              md={12}
              height="calc(50vh - 72px)"
              mt={1.5}
            >
              <Chart
                key={Constants.CHART}
                headerName="Gas"
                className="fdo-result-chart"
                options={gorChartOptions}
                width={"calc(100vw-10px)"}
                height={"100%"}
                DateTimeFormat="MMM 'YY"
                classes={classes}
                mx={0}
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-3`,
        id: 3,
        name: "PI/PAVG",
        component: (
          <>
            <Grid id="container1" item md={12} height="calc(50vh - 72px)">
              <Chart
                key={Constants.CHART}
                className="fdo-result-chart"
                options={piChartOptions}
                width={"100%"}
                height={"100%"}
                classes={classes}
                mx={0}
                DateTimeFormat="MMM 'YY"
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
            <Grid
              id="container1"
              item
              md={12}
              height="calc(50vh - 72px)"
              mt={1.5}
            >
              <Chart
                key={Constants.CHART}
                className="fdo-result-chart"
                options={pavgChartOptions}
                width={"100%"}
                height={"100%"}
                classes={classes}
                mx={0}
                DateTimeFormat="MMM 'YY"
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-4`,
        id: 4,
        name: "BHP",
        component: (
          <>
            <Grid id="container1" item md={12} height="calc(90vh - 55px)">
              <Chart
                key={Constants.CHART}
                className="fdo-result-chart"
                options={bhpChartOptions}
                width={"calc(100vw-10px)"}
                height={"100%"}
                // width={itemsDim?.itemsWidth === 0 ? "100%" : itemsDim?.itemsWidth}
                classes={classes}
                mx={0}
                DateTimeFormat="MMM 'YY"
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-5`,
        id: 5,
        name: "DDV",
        component: (
          <>
            <Grid id="container1" item md={12} height="calc(90vh - 55px)">
              <Chart
                key={Constants.CHART}
                className="fdo-result-chart"
                options={ddvChartOptions}
                width={"calc(100vw-10px)"}
                height={"100%"}
                // width={itemsDim?.itemsWidth === 0 ? "100%" : itemsDim?.itemsWidth}
                classes={classes}
                mx={0}
                DateTimeFormat="MMM 'YY"
                reflowDelay={100}
                excludeExportColumns={["Results"]}
              />
            </Grid>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedTypeOption,
      selectedTab,
      rateChartOptions,
      selectedTabStyle,
      currentSelectedChart,
      chartSize,
      indexValue,
      tablecolumn,
      wellChartOptions,
      itemHeight,
      selectedProdTab,
      modelOutputData,
      selectedFluidType,
      isWaterChecked,
    ]
  );
  const handleProdTabChange = (tabId) => {
    setSelectedProdTab(tabId);
    const boldStyle = {
      fontWeight: "bold",
    };
    setSelectedTabStyle({ [tabId]: boldStyle });
  };

  const a11yProps = (index) => {
    return {
      id: `charts-tab-${index}`,
      "aria-controls": `charts-tabpanel-${index}`,
    };
  };

  const tabNavigation = (
    <Tabs value={selectedProdTab} aria-label="charts-tabs">
      {Production_TABS.map((tab, index) => (
        <Tab
          key={`tab-header-${tab?.id}`}
          label={tab.name}
          value={tab.id}
          onClick={() => handleProdTabChange(tab.id)}
          style={selectedTabStyle[tab.id]}
          {...a11yProps(index)}
        />
      ))}
    </Tabs>
  );

  const tabPanels = (
    <div>
      {Production_TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={selectedProdTab !== tab?.id}
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab?.id}`}
        >
          {selectedProdTab === tab?.id && tab?.component}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Box width={`calc(100vw - 100px)`}>
        <Grid
          container
          maxWidth="100%"
          direction="row"
          justifyContent="space-between"
          mb={0.5}
        >
          <Box width="670px">
            <AppBar position="static" elevation={0} className={classes.appBar}>
              {tabNavigation}
            </AppBar>
          </Box>
          {modelOutputData?.forecast?.length !== 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FusionSelect
                minWidth={"fit-content"}
                onChange={handleChange}
                value={selectedValue}
                options={wellOptions}
                selectHeight={40}
                fullName
              />
            </Box>
          )}
        </Grid>
        <div>{tabPanels}</div>{" "}
        {/* Changed 'span' to 'div' for better structure */}
        {selectedProdTab === 0 || selectedProdTab === 1 ? (
          <Box mt={1.5}>
            <InterferenceTable data={modelOutputData?.forecast} height={185} />
          </Box>
        ) : null}
      </Box>
    </>
  );
};

function tooltipBHPFormatter(color) {
  return function () {
    let points = this?.points || [this?.point];
    return `<div class="tooltip" style='background-color: ${
      color?.background?.screen
    }; box-shadow:
        0px 4px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px -2px 1px rgba(0, 0, 0, 0.04); padding: 7.5px 8px 6.5px 12px; color:${
          color?.text?.primary
        }'>${points?.reduce(function (s, point) {
      let symbolColor = point?.series?.name !== "Actual" ? "red" : "blue";
      return (
        `<span style='color:${color?.text?.primary}>` +
        s +
        "</span>" +
        "<br/>" +
        `<span style='font-size: 20px; margin-top: 10px; padding-top:5px; margin-right: 5px; color: ${symbolColor};'>▪</span>` + // Adjusted styling here
        `<span style='color:${color?.text?.primary}'>${
          point?.series?.options?.custom?.tooltip?.symbol || ""
        }</span>` +
        `<span style='color: ${color?.text?.primary}'>${point?.series?.name}</span>` +
        " : <b>" +
        `<span style='font-weight: 700; color:${
          color?.text?.primary
        }'>${point?.y?.toFixed(2)}</span>` +
        "</b>" +
        `<span style=' color:${color?.text?.primary}'> ${
          point?.series?.options?.unit || ""
        }</span>`
      );
    }, `<b style='color: ${color?.text?.primary}'>` +
      moment.unix(this?.x).utc().format(TimeFormat.dateShort) +
      "</b>")}</div>`;
  };
}

export default Forecast_Output;
