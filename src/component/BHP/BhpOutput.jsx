import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Chart from "../Chart";
import moment from "moment";
import * as Constants from "../constant/ModelConstants";
import { getModelApiData } from "../../utill/modelApi";
import { toastCustomErrorMessage } from "../../utils/toast";
import { TimeFormat } from "../constant/TimeFormat";
import Highcharts from "highcharts";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const useStyles = makeStyles()((theme) => ({
  card: {
    width: "100%",
  },
  charttext: {
    background: theme.palette.background.header,
    paddingLeft: 7,
    paddingRight: 7,
    position: "absolute",
    top: "50px",
    left: "51px",
    // transform: 'translate(-50%, -50%)',
    color: theme.palette.text?.primary,
    fontSize: 13,
    fontWeight: "bold",
  },
  box: {
    // marginBottom:"px",
    border: `1px solid ${theme.palette.background.border}`,
    height: "15%",
    width: "85%",
    marginTop: 8,
    marginBottom: 8,
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.background.chart,
  },
  Icon2: {
    // width: 30,
    // height: 30,
    backgroundColor: theme.palette.background.screen,
    border: "1px solid " + theme.palette.background.border,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 5,
    padding: "5px 1px",
    "&:hover": {
      // border: "2px solid" + theme.palette.xecta[500],
      backgroundColor: theme.palette.background.header,
    },
    zIndex: 9999,
  },
  cardBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    width: "100%",
    borderRadius: 15,
    border: "1px solid " + theme.palette.background.border,
    marginLeft: 12,
  },
  cardHeader: {
    borderTopRightRadius: "12px",
    borderTopLeftRadius: "12px",
    // fontSize: "15px",
    height: 38,
    width: "100%",
    padding: "4px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.header,
  },
  title: {
    display: "flex",
    color: theme.palette.primary.main,
  },
}));

const BHP_Output = (props) => {
  const axisSelectionData = [
    { name: "Pressure", value: "pres" },
    { name: "Temperature", value: "temp" },
    { name: "Velocity Mixture", value: "velocity_mixture" },
  ];
  const { classes } = useStyles();
  const theme = useTheme();
  const plottedRef = useRef([]);
  const {
    selectedConfigDate,
    errorMetricsData,
    clickedX,
    setClickedX,
    traverseOutput,
    setTraverseOutput,
    defaultTraverseOutput,
    setDefaultTraverseOutput,
    selectedReference,
    setTraverseCall,
    traverseCall,
    referenceTypeInputs,
    selectedFluidType,
    bhpInputConfig,
    defaultFluidTypeInputs,
    modelOutputData,
    defaultChartConfig,
    isCleared,
    isPvtParameterError,
    isWellboreConfigError,
  } = props;
  const [rateChartOptions, setRateChartOptions] = useState({});
  const [liftChartOptions, setLiftChartOptions] = useState({});

  const fluidTypeInputs = { ...defaultFluidTypeInputs };

  const [pressureChartOptions, setPressureChartOptions] = useState({
    ...defaultChartConfig,
  });

  const [bhpChartOptions, setBhpChartOptions] = useState({});
  const [selectedXAxis, setSelectedXAxis] = useState({
    name: "Pressure",
    value: "pres",
  });

  const [xAxisData, setXAxisData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const [openTraverse, setOpenTraverse] = useState(true);
  const [openErrors, setOpenErrors] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const containerRefs = {
    container1: useRef(),
    container2: useRef(),
  };

  useEffect(() => {
    if (containerRefs) {
      ["mousemove", "touchmove", "touchstart", "mouseleave"]?.forEach(function (
        eventType
      ) {
        for (let j = 1; j <= 2; j++) {
          if (eventType === "mouseleave") {
            document
              ?.getElementById("container" + j)
              ?.addEventListener(eventType, function (e) {
                Highcharts?.charts?.forEach((chart) => {
                  if (chart && chart.tooltip) {
                    chart.tooltip.hide();
                  }
                });
              });
          } else {
            document
              ?.getElementById("container" + j)
              ?.addEventListener(eventType, function (e) {
                Highcharts?.charts?.forEach((chart) => {
                  const event = chart?.pointer?.normalize(e);
                  const point = chart?.series[0]?.searchPoint(event, true);
                  if (point !== undefined) {
                    point.highlight(e);
                  }
                });
              });
          }
        }
      });
      Highcharts.Pointer.prototype.reset = function () {
        return undefined;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRefs]);

  useEffect(() => {
    plottedRef.current = clickedX;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedX]);

  const handleChartClick = (event) => {
    if (event?.xAxis?.length && event?.srcElement?.innerHTML === "") {
      const datetime = event?.xAxis[0]?.axis?.chart?.hoverPoint?.category;
      if (datetime !== undefined) {
        let plottedX = plottedRef?.current;
        if (!plottedX.includes(datetime)) {
          setTraverseCall(true);
          setClickedX((prevClickedX) => [...prevClickedX, datetime]);
        } else {
          setTraverseCall(true);
          setClickedX((prevClickedX) =>
            prevClickedX.filter((value) => value !== datetime)
          );
        }
      }
    }
  };

  const plotLines = clickedX?.sort()?.map((timestamp) => ({
    color: theme?.palette?.text?.primary,
    width: 1.5,
    value: timestamp,
    zIndex: 4,
    dashStyle: "dot",
    label: {
      align: "center",
      x: 0,
      y: 70,
    },
  }));

  const DefaultPlotLine = {
    dashStyle: "dash",
    color: [theme?.palette?.text?.primary],
    width: 2,
    value: 0,
    label: {
      text: "",
      verticalAlign: "middle",
      textAlign: "center",
      x: 100,
      style: {
        color: [theme?.palette?.text?.primary],
        fontSize: "14px",
      },
    },
  };

  useEffect(() => {
    const handleModelApiCall = () => {
      const isFluidTypeError = Object.entries(fluidTypeInputs)?.some(
        ([key, value]) => value?.error !== ""
      );
      const isReferenceTypeError = Object.entries(referenceTypeInputs)?.some(
        ([key, value]) => value?.error !== ""
      );
      if (isFluidTypeError || isReferenceTypeError) {
        //setErrorMessage(true);
      } else {
        //setShowLoader(true);
        let fluidTypeModelInput = {
          ...bhpInputConfig?.input?.fluidInput[selectedFluidType?.value],
        };

        const referenceTypeModelInput = {
          ...bhpInputConfig?.input?.refInput[selectedReference?.value],
        };

        let referenceRange = [];

        for (
          let num = referenceTypeModelInput?.min;
          num < referenceTypeModelInput?.max;
          num += referenceTypeModelInput?.increment
        ) {
          referenceRange.push(num);
        }
        referenceRange.push(referenceTypeModelInput?.max);

        const {
          wellboreConfig,
          compute_options,
          correlations,
          settings,
          input,
        } = bhpInputConfig;
        let productionData = bhpInputConfig.productionData;
        let prodObj = {
          datetime: [],
          qo: [],
          qw: [],
          qg: [],
          pres_casing: [],
          pres_tubing: [],
          measured_bhp: [],
        };
        const isAnyGasLift = bhpInputConfig.wellboreConfig?.some(
          (item) => item.lift_method === "GasLift"
        );
        if (isAnyGasLift) {
          prodObj = { ...prodObj, qg_lift: [] };
        }
        if (productionData?.length) {
          productionData.forEach((item) => {
            Object.keys(prodObj).forEach((key) => {
              if (key === "datetime") {
                prodObj[key].push(moment(item[key]).valueOf() / 1000);
              } else {
                prodObj[key].push(item[key]);
              }
            });
          });
          productionData = prodObj;
        }
        let deviationData =
          wellboreConfig?.length > 1
            ? wellboreConfig[wellboreConfig?.length - 1].deviation_survey
            : wellboreConfig[0].deviation_survey;
        const deviationObj = {
          md: [],
          tvd: [],
        };
        if (deviationData?.length) {
          deviationData.forEach((item) => {
            Object.keys(deviationObj).forEach((key) => {
              deviationObj[key].push(item[key]);
            });
          });
          deviationData = deviationObj;
        }

        let geothermalData =
          wellboreConfig?.length > 1
            ? wellboreConfig[wellboreConfig?.length - 1].geothermal_gradient
            : wellboreConfig[0].geothermal_gradient;
        const geothermalObj = {
          md: [],
          // tvd: [],
          temp: [],
        };
        if (geothermalData?.length) {
          geothermalData.forEach((item) => {
            Object.keys(geothermalObj).forEach((key) => {
              geothermalObj[key].push(item[key]);
            });
          });
          geothermalData = geothermalObj;
        }

        const inputRequestObj = {
          properties_to_compute: [
            "pres",
            "temp",
            "liquid_holdup",
            "velocity_mixture",
          ],
          return_traverses: true,
          prod_data: { ...productionData },
          geothermal_gradient: geothermalData,
          equip_data: wellboreConfig?.map((item) => {
            let casingData = item?.casing;
            const casingObj = {
              md: [],
              d_inner: [],
              rough_inner: [],
            };
            if (casingData?.length) {
              casingData.forEach((item) => {
                Object.keys(casingObj).forEach((key) => {
                  casingObj[key].push(item[key]);
                });
              });
              casingData = casingObj;
            }

            let tubingData = item?.tubing;
            const tubingObj = {
              md: [],
              d_inner: [],
              d_outer: [],
              rough_inner: [],
              rough_outer: [],
            };
            if (tubingData?.length) {
              tubingData.forEach((item) => {
                Object.keys(tubingObj).forEach((key) => {
                  tubingObj[key].push(item[key]);
                });
              });
              tubingData = tubingObj;
            }
            const gasLiftObj = {
              md: [],
              delta_pres: [],
            };
            let gasLiftData = item?.gaslift_valve || [];
            if (gasLiftData?.length) {
              gasLiftData.forEach((item) => {
                Object.keys(gasLiftObj).forEach((key) => {
                  gasLiftObj[key].push(item[key]);
                });
              });
              gasLiftData = gasLiftObj;
            }
            let wellConfigObj = {
              datetime: moment.utc(item?.datetime).valueOf() / 1000,
              flow_correlation: item?.flow_correlation,
              lift_method: item?.lift_method,
              casing: casingData,
              nodes: item?.nodes || wellboreConfig[0]?.nodes,
              tubing: tubingData,
            };
            if (item?.lift_method === "GasLift") {
              wellConfigObj = { ...wellConfigObj, gaslift_valve: gasLiftData };
            }
            return wellConfigObj;
          }),
          deviation_survey: deviationData,
          datetime_to_compute: clickedX,
          compute_options: { ...compute_options },
          pvt_model: {
            pvt_type: input?.pvt_type,
            input: {
              ...fluidTypeModelInput,
              corr_method: { ...correlations },
            },
          },
          settings: { ...settings },
        };
        getModelApiData(Constants.BHP_MODEL_API_URL, inputRequestObj)
          .then((response) => {
            setTraverseOutput(response?.data);
            if (!Object.keys(defaultTraverseOutput)?.length) {
              setDefaultTraverseOutput(response?.data);
            }
          })
          .catch((error) => {
            setTraverseOutput({});
            const apiError = error?.response?.data?.detail;
            const errorMessage = `${
              Constants?.MODEL_API_ERROR
            } ${apiError?.substring(
              0,
              apiError?.indexOf("Detailed traceback:")
            )}`;
            toastCustomErrorMessage(
              errorMessage,
              { style: { width: "400px" } },
              2000
            );
          });
      }
    };
    if (traverseCall && clickedX?.length) {
      if (isCleared) {
        if (!isPvtParameterError || !isWellboreConfigError) {
          handleModelApiCall();
        }
      } else {
        handleModelApiCall();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedX, traverseCall]);

  const handleXAxisChange = (event) => {
    const newXAxis = event?.target?.value;
    const selectedItem = axisSelectionData?.find(
      (item) => item.value === newXAxis
    );
    setSelectedXAxis(selectedItem);
    const selectedData = traverseOutput?.traverses?.map(
      (traverse, index) => traverse[selectedItem?.value]
    );
    setXAxisData(selectedData);
  };

  useEffect(() => {
    setIsLoading(true);
    if (traverseOutput?.traverses?.length) {
      const firstItem = traverseOutput?.traverses?.map(
        (traverse, index) => traverse[selectedXAxis?.value]
      );
      if (firstItem) {
        setIsLoading(false);
        setXAxisData(firstItem);
      }
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traverseOutput?.traverses?.length]);

  const handleLegendItemClick = (event) => {
    const formattedDate = moment(
      event.target.name,
      TimeFormat.dateShort
    ).format(TimeFormat.datePicker);
    const dateIndex = clickedX?.findIndex(
      (plotX) =>
        moment.unix(plotX).utc().format(TimeFormat.datePicker) === formattedDate
    );
    if (dateIndex !== -1) {
      const updatedSelectedDate = clickedX?.filter(
        (value) =>
          moment.unix(value).utc().format(TimeFormat.datePicker) !==
          formattedDate
      );
      setClickedX(updatedSelectedDate);
      setTraverseCall(true);
    }
    return false;
  };

  let productionData = bhpInputConfig.productionData;
  let prodObj = {
    datetime: [],
    qo: [],
    qw: [],
    qg: [],
    pres_casing: [],
    pres_tubing: [],
    measured_bhp: [],
  };

  function syncExtremes(e) {
    var thisChart = this.chart;

    const shouldShowResetZoom = !(e.min === undefined && e.max === undefined);

    if (e.trigger !== "syncExtremes") {
      // Prevent feedback loop
      Highcharts.each(Highcharts.charts, function (chart) {
        if (chart && chart.userOptions) {
          if (chart.userOptions.headerName !== "Pressure Traverse") {
            if (e.min === null && e.max === null) {
              if (chart.resetZoomButton) {
                chart.resetZoomButton = chart.resetZoomButton.destroy();
              }
            } else {
              // if (chart.tooltip) {
              //     var point = chart.series[0].searchPoint(e, true);
              //     if (point) {
              //         point.onMouseOver();
              //     }
              // }
              if (chart.xAxis[0].setExtremes) {
                setTimeout(function () {
                  chart.xAxis[0].setExtremes(e.min, e.max, true, false, {
                    trigger: "syncExtremes",
                  });
                }, 0);
              }
              if (chart.yAxis[0].setExtremes) {
                chart.yAxis[0].setExtremes(null, null, true, false, {
                  trigger: "syncExtremes",
                });
              }
              if (chart.yAxis[1] && chart.yAxis[1].setExtremes) {
                chart.yAxis[1].setExtremes(null, null, true, false, {
                  trigger: "syncExtremes",
                });
              }
              if (chart.tooltip) {
                var point = chart.series[0].searchPoint(e, true);
                if (point) {
                  point.onMouseOver();
                }
              }

              if (
                shouldShowResetZoom &&
                !chart.resetZoomButton &&
                chart.userOptions.headerName !== "Lift" &&
                chart.userOptions.headerName !== "Pressure Traverse"
              ) {
                chart.showResetZoom();
              } else if (!shouldShowResetZoom && chart.resetZoomButton) {
                // e?.preventDefault();
                chart.resetZoomButton = chart.resetZoomButton.destroy();
                if (chart !== thisChart) {
                  setTimeout(function () {
                    chart.xAxis[0].setExtremes(null, null, undefined, false);
                  }, 0);
                  if (chart.userOptions.headerName !== "Lift") {
                    setTimeout(function () {
                      chart.yAxis[0].setExtremes(null, null, undefined, false);
                    }, 0);
                    if (chart.userOptions.headerName === "Rates") {
                      setTimeout(function () {
                        chart.yAxis[1].setExtremes(
                          null,
                          null,
                          undefined,
                          false
                        );
                      }, 0);
                    }
                  }
                  // chart.resetZoomButton = chart.resetZoomButton.destroy();
                }
              }
            }
          }
        }
      });
    }
  }

  function syncY1Extremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== "syncExtremes") {
      // Prevent feedback loop
      Highcharts.each(Highcharts.charts, function (chart) {
        if (chart && chart.userOptions) {
          if (
            chart.userOptions.headerName !== "Pressure Traverse" &&
            chart.userOptions.headerName !== "Lift"
          ) {
            if (e.min === null && e.max === null) {
              if (chart.resetZoomButton) {
                chart.resetZoomButton = chart.resetZoomButton.destroy();
              }
            } else {
              if (chart !== thisChart) {
                if (chart.yAxis[0].setExtremes) {
                  // It is null while updating
                  setTimeout(function () {
                    chart.yAxis[0].setExtremes(e.min, e.max, true, false, {
                      trigger: "syncExtremes",
                    });
                  }, 0);
                  if (chart.tooltip) {
                    var point = chart.series[0].searchPoint(e, true);
                    if (point) {
                      point.onMouseOver();
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  }

  function syncY2Extremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== "syncExtremes") {
      // Prevent feedback loop
      Highcharts.each(Highcharts.charts, function (chart) {
        if (chart && chart.userOptions) {
          if (
            chart.userOptions.headerName !== "Pressure Traverse" &&
            chart.userOptions.headerName !== "Lift"
          ) {
            if (e.min === null && e.max === null) {
              if (chart.resetZoomButton) {
                chart.resetZoomButton = chart.resetZoomButton.destroy();
              }
            } else {
              if (
                chart !== thisChart &&
                chart.userOptions.headerName !== "Pressures"
              ) {
                if (chart.yAxis[1].setExtremes) {
                  // It is null while updating
                  setTimeout(function () {
                    chart.yAxis[1].setExtremes(e.min, e.max, true, false, {
                      trigger: "syncExtremes",
                    });
                  }, 0);
                  if (chart.tooltip) {
                    var point = chart.series[0].searchPoint(e, true);
                    if (point) {
                      point.onMouseOver();
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
  }

  useEffect(() => {
    const rateSeriesData = [];
    let liftSeriesData = [];
    const bhpSeriesData = [];
    let pressureSeriesData = [];
    const isAnyGasLift = bhpInputConfig.wellboreConfig?.some(
      (item) => item.lift_method === "GasLift"
    );
    if (isAnyGasLift) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      prodObj = { ...prodObj, qg_lift: [] };
    }
    if (productionData?.length) {
      productionData.forEach((item) => {
        Object.keys(prodObj).forEach((key) => {
          if (key === "datetime") {
            prodObj[key].push(moment(item[key]).valueOf() / 1000);
          } else {
            prodObj[key].push(item[key]);
          }
        });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      productionData = prodObj;
    }

    const wellboreConfig = bhpInputConfig?.wellboreConfig;
    let arr = [];
    let label = [];
    wellboreConfig?.map((item, index) => {
      let name = item?.lift_method;
      if (arr?.length > 0 && arr[arr.length - 1].lift_method === name) {
        // arr[arr.length - 1].endDate = wellboreConfig[index + 1]?.datetime
      } else {
        arr.push(item);
        const lift =
          item.lift_method === "NaturalFlow"
            ? "NF"
            : item.lift_method === "RodPump"
            ? "RP"
            : item.lift_method === "GasLift"
            ? "GL"
            : item.lift_method === "ESP"
            ? "ESP"
            : "";
        label.push(lift);
        // arr[arr.length - 1].endDate = wellboreConfig[index + 1]?.datetime
      }
      return arr;
    });
    const unixTimestamps = arr?.map((e) => e.datetime);
    const timestamps = unixTimestamps?.map((dateString) => {
      const date = new Date(dateString);
      return date?.getTime() / 1000;
    });
    // const label = bhpInputConfig?.wellboreConfig?.map((item, i, arr) => item.lift_method === "NaturalFlow" ? "NF" : item.lift_method === "RodPump" ? "RP" : item.lift_method === "GasLift" ? "GL" : item.lift_method === "ESP" ? "ESP" : "")
    const dateTime = productionData?.datetime;
    const outputDateTime = modelOutputData?.datetime;
    const traverseUnit =
      selectedXAxis.name === "Pressure"
        ? "psia"
        : selectedXAxis.name === "Temperature"
        ? "F"
        : "ft/sec";

    if (productionData) {
      productionData.qo?.length &&
        rateSeriesData.push({
          name: "Oil Rate",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.qo[i]) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.rate?.Oil_Rate,
        });
      productionData.qw?.length &&
        rateSeriesData.push({
          name: "Water Rate",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.qw[i]) || null,
          ]),
          yAxis: 0,
          unit: "STB/d",
          color: theme?.palette?.seriesColors?.rate?.Water_Rate,
        });
      productionData.pres_tubing?.length &&
        bhpSeriesData.push({
          type: "line",
          name: "THP",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.pres_tubing[i]) || null,
          ]),
          yAxis: 0,
          unit: "psia",
          color: theme.palette?.seriesColors?.colors[0],
        });
      productionData.pres_tubing?.length &&
        liftSeriesData.push({
          type: "line",
          name: "Lift",
          data: dateTime?.map((e, i) => [e, 10.5]),
          yAxis: 0,
          unit: "psia",
          color: "rgba(0, 0, 0, 0)",
        });
      productionData.pres_casing?.length &&
        bhpSeriesData.push({
          type: "line",
          name: "CHP",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.pres_casing[i]) || null,
          ]),
          yAxis: 0,
          unit: "psia",
          color: theme.palette?.seriesColors?.colors[1],
        });
      productionData.measured_bhp?.length &&
        bhpSeriesData.push({
          type: "line",
          name: "Measured BHP",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.measured_bhp[i]) || null,
          ]),
          yAxis: 0,
          unit: "psia",
          color: theme?.palette?.seriesColors?.colors[2],
        });
      const calcBhpSeries = {
        type: "line",
        name: "Calculated BHP",
        data: [],
        yAxis: 0,
        unit: "psia",
        color: theme?.palette?.seriesColors?.colors[3],
      };
      if (traverseOutput?.node_values?.length >= 1 && outputDateTime?.length) {
        bhpSeriesData.push({
          ...calcBhpSeries,
          data: outputDateTime?.map((e, i) => [
            e,
            modelOutputData?.node_values[1]?.pres[i],
          ]),
        });
      } else {
        bhpSeriesData.push(calcBhpSeries);
      }
      productionData.qg?.length &&
        rateSeriesData.push({
          name: "Gas Rate",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.qg[i]) / 1000000 || null,
          ]),
          yAxis: 1,
          unit: "MMscf/d",
          color: theme?.palette?.seriesColors?.rate?.Gas_Rate,
        });
      productionData.qg_lift?.length &&
        rateSeriesData.push({
          name: "Gas Lift Injection Rate ",
          data: dateTime?.map((e, i) => [
            e,
            parseFloat(productionData?.qg_lift[i]) / 1000000 || null,
          ]),
          yAxis: 1,
          unit: "MMscf/d",
          color: theme?.palette?.seriesColors?.rate?.Gas_Lift_Injection_Rate,
        });

      function createXRangeData(timestamps, dateTime, label, max) {
        return {
          type: "xrange",
          name: `Start Date`,
          showInLegend: false,
          pointWidth: 18,
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "none",
          data: timestamps?.map((item, i, arr) => ({
            x: item,
            x2:
              arr[i + 1] === undefined
                ? dateTime[dateTime.length - 1]
                : arr[i + 1],
            y: max - 1,
            nfData: [
              item,
              arr[i + 1] === undefined
                ? dateTime[dateTime.length - 1]
                : arr[i + 1],
            ],
            dataLabels: {
              enabled: true,
              style: {
                textShadow: "none",
                textOutline: "none",
                color: theme.palette.background.chart,
                fontWeight: 750,
              },
              formatter: function () {
                return label[i];
              },
            },
            color:
              label[i] === "NF"
                ? theme?.palette?.seriesColors?.colors[2]
                : theme?.palette?.seriesColors?.colors[1],
          })),
        };
      }

      if (bhpInputConfig.wellboreConfig.length) {
        const rateRangeData = createXRangeData(
          timestamps,
          dateTime,
          label,
          10.5
        );
        liftSeriesData.push(rateRangeData);
      }
    }
    let nodePlotLines = [];
    if (traverseOutput?.traverses?.length && clickedX?.length) {
      const latestNode = bhpInputConfig.wellboreConfig?.find(
        (item) => item?.datetime === selectedConfigDate
      )?.nodes;
      const plotLinesData = [
        {
          label: "Gauge Depth",
          value: latestNode?.md[0],
          color: theme?.palette?.seriesColors?.depthColors[0],
        },
        {
          label: "Reservoir Depth",
          value: latestNode?.md[1],
          color: theme?.palette?.seriesColors?.depthColors[1],
        },
      ];
      nodePlotLines = plotLinesData.map((item) => {
        return {
          ...DefaultPlotLine,
          color: item?.color,
          value: item?.value,
        };
      });

      pressureSeriesData.push({
        name: `${plotLinesData[0]?.label} : ${plotLinesData[0]?.value} ft`,
        color: plotLinesData[0].color,
      });
      pressureSeriesData.push({
        name: `${plotLinesData[1]?.label} : ${plotLinesData[1]?.value} ft`,
        color: plotLinesData[1].color,
      });

      const outputDateTime = traverseOutput?.datetime;
      traverseOutput?.traverses?.forEach((series, index) => {
        const mdData = series?.md;
        const axisData = xAxisData?.length && xAxisData[index];

        pressureSeriesData?.push({
          name: moment
            .unix(outputDateTime[index])
            .utc()
            .format(TimeFormat.dateShort),
          data:
            mdData?.length &&
            mdData?.map((e, i) => [e, axisData?.length && axisData[i]]),
          unit: traverseUnit,
          color: theme?.palette?.seriesColors?.colors[index],
        });
      });
    } else {
      pressureSeriesData = [];
    }

    // Update RateChartOptions
    const updatedRateChartOptions = {
      ...defaultChartConfig,
      chart: {
        zoomType: "xy",
        type: "line",
        marginLeft: 82,
        marginRight: 75,
        events: {
          click: handleChartClick,
        },
        zooming: {
          mouseWheel: false,
        },
        // plotBorderWidth:0
      },
      yAxis: [
        {
          gridLineWidth: 0,
          lineWidth: 0,
          title: {
            text: "Oil Rate, Water Rate (STB/d)",
          },

          autoFormatAxis: {
            minValue: 0,
            maxValue: 999,
          },
          labels: {
            style: {
              color: theme?.palette?.text?.primary,
            },
          },
          max: 5000,
          events: {
            setExtremes: syncY1Extremes,
          },
        },
        {
          endOnTick: false,
          gridLineWidth: 0,
          lineColor: "#9e9e9e",
          lineWidth: 1,
          title: {
            text: "Gas Rate (MMscf/d)",
          },
          opposite: true,
          autoFormatAxis: {
            minValue: 0,
            maxValue: 999,
          },
          labels: {
            style: {
              color: theme?.palette?.text?.primary,
            },
          },
          max: 11,
          events: {
            setExtremes: syncY2Extremes,
          },
        },
      ],
      xAxis: [
        {
          gridLineWidth: 0,
          attribute: "datetime",
          type: "datetime",
          lineColor: "#9e9e9e",
          lineWidth: 1,
          format: TimeFormat.dateShort,
          crosshair: true,
          plotLines: plotLines,
          labels: {
            style: {
              color: theme?.palette?.text?.primary,
            },
          },
          tickPositioner: function () {
            const minDate = this.dataMin;
            const maxDate = this.dataMax;
            const tickInterval = this.tickInterval;
            const positions = [minDate];
            for (
              let date = minDate + tickInterval;
              date < maxDate;
              date += tickInterval
            ) {
              positions.push(date);
            }
            positions.push();
            return positions;
          },
          events: {
            setExtremes: syncExtremes,
          },
        },
      ],

      legend: {
        itemStyle: {
          color: theme?.palette?.text?.primary,
          textDecoration: function () {
            return this.visible ? "none" : "none";
          },
        },
        itemHoverStyle: {
          color: theme?.palette?.text?.primary,
          textDecoration: "none",
        },
        itemHiddenStyle: {
          color: "#999",
          textDecoration: "none",
        },
      },
      plotOptions: {
        series: {
          lineWidth: 1.5,
          marker: {
            enabled: false,
          },
        },
      },
      series: rateSeriesData,
      tooltip: {
        shared: true,
        formatter: tooltipBHPFormatter(theme?.palette),
      },
    };

    updatedRateChartOptions.headerName = "Rates";
    setRateChartOptions(updatedRateChartOptions);
    setLiftChartOptions({
      ...updatedRateChartOptions,
      headerName: "Lift",
      chart: {
        ...updatedRateChartOptions.chart,
        height: 80,
        plotBorderWidth: 0,
      },
      yAxis: [
        {
          lineWidth: 0,
          title: {
            text: "",
          },
          gridLineWidth: 0,
          labels: {
            enabled: false,
          },
        },
      ],
      xAxis: [
        {
          type: "datetime",
          lineWidth: 0,
          gridLineWidth: 0,
          labels: {
            enabled: false,
          },
          minPadding: 0,
          maxPadding: 0,
        },
      ],
      legend: {
        enabled: false,
      },
      series: liftSeriesData,
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            radius: -2,
          },
        },
      },
    });
    // Update pressureChartOptions
    const pressureOption = Object.assign(
      {},
      { ...defaultChartConfig, series: [] }
    );
    pressureOption.chart = {
      ...defaultChartConfig?.chart,
      zoomType: "xy",
      inverted: true,
      marginLeft: 75,
      marginRight: 19,
    };
    pressureOption.yAxis = [
      {
        gridLineWidth: 0,
        lineColor: "#9e9e9e",
        lineWidth: 1,
        title: {
          text: `${selectedXAxis?.name} (${traverseUnit})`,
        },
        labels: {
          style: {
            color: theme?.palette?.text?.primary,
          },
        },
      },
    ];
    pressureOption.xAxis = [
      {
        gridLineWidth: 0,
        lineColor: "#9e9e9e",
        lineWidth: 1,
        crosshair: true,
        title: {
          text: "Measured Depth (ft)",
        },
        plotLines: nodePlotLines,
        autoFormatAxis: {
          minValue: 0,
          maxValue: 999,
        },
        labels: {
          style: {
            color: theme?.palette?.text?.primary,
          },
          formatter: function () {
            return this.value;
          },
        },
      },
    ];
    pressureOption.tooltip = {
      shared: true,
      formatter: wellLevelTooltipFormatter(selectedXAxis?.name, theme?.palette),
    };
    pressureOption.plotOptions = {
      series: {
        events: {
          legendItemClick: handleLegendItemClick,
        },
        enabled: true,
      },
    };
    pressureOption.legend = {
      itemStyle: {
        color: theme?.palette?.text?.primary,
        textDecoration: function () {
          return this.visible ? "none" : "none";
        },
      },
      itemHoverStyle: {
        color: theme?.palette?.text?.primary,
        textDecoration: "none",
      },
      itemHiddenStyle: {
        color: theme?.palette?.text?.primary,
        textDecoration: "none",
      },
    };
    pressureOption.series = pressureSeriesData;
    pressureOption.headerName = `${selectedXAxis?.name} Traverse`;
    setPressureChartOptions({ ...pressureOption });

    const updatedBhpChartOptions = {
      ...defaultChartConfig,
      chart: {
        zoomType: "xy",
        type: "line",
        marginLeft: 82,
        marginRight: 75,
        marginTop: 8,
        events: {
          click: handleChartClick,
        },
        zooming: {
          mouseWheel: false,
        },
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
          lineWidth: 1,
          title: {
            text: "THP, CHP, BHP (psia)",
          },
          autoFormatAxis: {
            minValue: 0,
            maxValue: 999,
          },
          labels: {
            style: {
              color: theme?.palette?.text?.primary,
            },
          },
          events: {
            setExtremes: syncY1Extremes,
          },
        },
      ],
      xAxis: [
        {
          gridLineWidth: 0,
          attribute: "datetime",
          type: "datetime",
          lineColor: "#9e9e9e",
          lineWidth: 1,
          format: TimeFormat.dateShort,
          crosshair: true,
          plotLines: plotLines,
          labels: {
            style: {
              color: theme?.palette?.text?.primary,
            },
          },
          tickPositioner: function () {
            const minDate = this.dataMin;
            const maxDate = this.dataMax;
            const tickInterval = this.tickInterval;
            const positions = [minDate];
            for (
              let date = minDate + tickInterval;
              date < maxDate;
              date += tickInterval
            ) {
              positions.push(date);
            }
            positions.push();
            return positions;
          },
          events: {
            setExtremes: syncExtremes,
          },
        },
      ],
      plotOptions: {
        series: {
          lineWidth: 1.5,
          marker: {
            enabled: false,
          },
        },
      },
      legend: {
        itemStyle: {
          color: [theme?.palette?.text?.primary],
          textDecoration: function () {
            return this.visible ? "none" : "none";
          },
        },
        itemHoverStyle: {
          color: [theme?.palette?.text?.primary],
          textDecoration: "none",
        },
        itemHiddenStyle: {
          color: "#999",
          textDecoration: "none",
        },
      },
      series: bhpSeriesData,
    };

    bhpSeriesData?.forEach((series) => {
      if (series?.type === "xrange") {
        series.showInLegend = false;
      } else {
        series.showInLegend = true;
      }
    });
    updatedBhpChartOptions.headerName = Constants.PRESSURES;
    setBhpChartOptions(updatedBhpChartOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productionData,
    defaultChartConfig,
    xAxisData,
    theme,
    bhpInputConfig,
    traverseOutput,
    clickedX,
    selectedXAxis.value,
    modelOutputData,
  ]);

  const onTraverseChevronClick = (value) => {
    setOpenTraverse((prev) => !prev);
  };

  const onErrorsChevronClick = (value) => {
    setOpenErrors((prev) => !prev);
  };

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      Highcharts?.charts?.forEach((chart) => {
        if (chart) {
          chart.reflow();
        }
      });
    }, 100);
    return () => clearTimeout(loaderTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openErrors, openTraverse]);

  return (
    <Box height="calc(100vh - 78px)" width="calc(100vw - 125px)">
      <Box container="true" display="flex" height="100%" mt={1.5}>
        <Grid
          item
          md={
            !openTraverse && !openErrors
              ? 11.8
              : openErrors && !openTraverse
              ? 10.8
              : 7
          }
          height="100%"
        >
          <Grid
            id="container1"
            item
            md={12}
            height="calc(50vh - 45px)"
            mr={1.5}
            position={"relative"}
          >
            <Chart
              options={bhpChartOptions}
              secondaryOptions={liftChartOptions}
              classes={classes}
              mx={0}
              reflowDelay={100}
              onClick={handleChartClick}
            />
            <div className={classes.charttext}>Lift</div>
          </Grid>
          <Grid
            id="container2"
            item
            md={12}
            height="calc(50vh - 45px)"
            mt={1.5}
            mr={1.5}
            position={"relative"}
          >
            <Chart
              options={rateChartOptions}
              secondaryOptions={liftChartOptions}
              classes={classes}
              mx={0}
              reflowDelay={100}
              showAxisPower={true}
            />
            <div className={classes.charttext}>Lift</div>
          </Grid>
        </Grid>
        {openTraverse && (
          <Grid item md={!openErrors ? 4.8 : 3.8} height="100%">
            <Chart
              options={{ ...pressureChartOptions }}
              classes={classes}
              axisSeletion={axisSelectionData}
              handleXAxisChange={handleXAxisChange}
              selectedXAxis={selectedXAxis}
              inputAxis={true}
              inverted={true}
              loading={isLoading}
              mx={0}
              reflowDelay={100}
              showAxisPower={false}
            />
          </Grid>
        )}
        {openErrors && (
          <Grid item md={1} display="flex" height="100%" alignItems="center">
            <Box class={classes.cardBox}>
              <Box className={classes.cardHeader}>
                <Grid container direction="column">
                  <Grid item className={classes.title}>
                    <Typography variant="h2">Error Metrics</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box mx={0} className={classes.box} sx={{ mx: 0.5 }}>
                <Typography variant="h4" sx={{ overflow: "hidden" }}>
                  MedAPE
                </Typography>
                <Typography variant="h1">
                  {`${errorMetricsData?.medAPE?.toFixed(2) || "__"}`}
                  <span style={{ paddingLeft: 4, fontWeight: 300 }}>%</span>
                </Typography>
              </Box>
              <Box mx={0} className={classes.box} sx={{ mx: 0.5 }}>
                <Typography variant="h4" sx={{ overflow: "hidden" }}>
                  MedAE
                </Typography>
                <Typography variant="h1">
                  {`${errorMetricsData?.medAE?.toFixed(2) || "__"}`}
                  <span style={{ paddingLeft: 4, fontWeight: 300 }}>psia</span>
                </Typography>
              </Box>
              <Box mx={0} className={classes.box} sx={{ mx: 0.5 }}>
                <Typography variant="h4" sx={{ overflow: "hidden" }}>
                  MAPE
                </Typography>
                <Typography variant="h1">
                  {`${errorMetricsData?.MAPE?.toFixed(2) || "__"}`}
                  <span style={{ paddingLeft: 4, fontWeight: 300 }}>%</span>
                </Typography>
              </Box>
              <Box mx={0} className={classes.box} sx={{ mx: 0.5 }}>
                <Typography variant="h4" sx={{ overflow: "hidden" }}>
                  MAE
                </Typography>
                <Typography variant="h1">
                  {`${errorMetricsData?.MAE?.toFixed(2) || "__"}`}
                  <span style={{ paddingLeft: 4, fontWeight: 300 }}>psia</span>
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        <Grid item md={0.2} sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "0px",
              right: "-30px",
              display: "block",
              cursor: "pointer",
            }}
            onClick={onTraverseChevronClick}
          >
            <Box className={classes.Icon2}>
              <ChevronLeftIcon
                sx={{ rotate: openTraverse ? "180deg" : "0deg" }}
              />
              <span style={{ writingMode: "vertical-lr", color: "inherit" }}>
                Traverse
              </span>
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "150px",
              right: "-30px",
              display: "block",
              cursor: "pointer",
            }}
            onClick={onErrorsChevronClick}
          >
            <Box className={classes.Icon2}>
              <ChevronLeftIcon
                sx={{ rotate: openErrors ? "180deg" : "0deg" }}
              />
              <span style={{ writingMode: "vertical-lr" }}>Errors</span>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
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
      if (point?.series?.type === "xrange") {
        const X1 = point?.point?.nfData?.length && point?.point?.nfData[0];
        const X2 = point?.point?.nfData?.length && point?.point?.nfData[1];
        return (
          `<span style='color: ${color?.text?.primary}'>Start Date</span>` +
          " : <b>" +
          `<span style='color:${color?.text?.primary}'>${moment
            .unix(X1)
            .utc()
            .format(TimeFormat.dateShort)}</span>` +
          "</b>" +
          "<br/>" +
          `<span style='color:${color?.text?.primary}'>  End Date</span>` +
          " : <b>" +
          `<span style='color:${color?.text?.primary}'>${moment
            .unix(X2)
            .utc()
            .format(TimeFormat.dateShort)}</span>`
        );
      } else {
        return (
          `<span >` +
          s +
          "</span>" +
          "<br/>" +
          `<span style='color: ${color?.text?.primary}'>${
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
      }
    }, `<b style='color: ${color?.text?.primary}'>` +
      moment.unix(this?.x).utc().format(TimeFormat.dateShort) +
      "</b>")}</div>`;
  };
}

function wellLevelTooltipFormatter(selectedXAxis, color) {
  return function () {
    let points = this?.points || [this?.point];
    return `<div class="tooltip" style='background-color: ${
      color?.background?.screen
    }; box-shadow:
        0px 4px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px -2px 1px rgba(0, 0, 0, 0.04); padding: 7.5px 8px 6.5px 12px; color:${
          color?.text?.primary
        }'>${points?.reduce(function (s, point) {
      return (
        `<span style='color:${color?.text?.primary}'>` +
        s +
        "</span>" +
        "<br/>" +
        `<span style='color: ${color?.text?.primary}'>${
          point?.series?.options?.custom?.tooltip?.symbol || ""
        }</span>` +
        `<span style='color: ${color?.text?.primary}'>${
          point?.series?.name === "Gauge Depth : 9450 ft"
            ? ""
            : point?.series?.name === "Reservoir Depth : 9950 ft"
            ? ""
            : point?.series?.name
        }</span>` +
        `${
          point?.series?.name === "Gauge Depth : 9450 ft"
            ? ""
            : point?.series?.name === "Reservoir Depth : 9950 ft"
            ? ""
            : ": "
        }` +
        `<b><span style='font-weight: 700;color:${color?.text?.primary}'>${
          point?.series?.name === "Gauge Depth : 9450 ft"
            ? ""
            : point?.series?.name === "Reservoir Depth : 9950 ft"
            ? ""
            : point.y?.toFixed(2)
        }</span></b>` +
        "</b>" +
        ` ${
          point?.series?.name === "Gauge Depth : 9450 ft"
            ? ""
            : point?.series?.name === "Reservoir Depth : 9950 ft"
            ? ""
            : point?.series?.options?.unit || ""
        }`
      );
    }, `<span style=' color: ${color?.text?.primary}'>Measured Depth : </span>` +
      `<b style=' font-weight: 700; color: ${color?.text?.primary}'>` +
      (this?.x).toFixed(2) +
      "</b>" +
      `<span style=' color: ${color?.text?.primary}'> ft</span>`)}</div>`;
  };
}

export default BHP_Output;
