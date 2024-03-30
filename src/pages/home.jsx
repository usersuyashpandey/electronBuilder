import React, { useEffect, useContext, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Container,
  Button,
  IconButton,
  Typography,
  Dialog,
  List,
  ListItemText,
  ListItem,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import clsx from "clsx";
// import { toastCustomErrorMessage, toastCustomSuccessMessage } from "../utils/toast";
import { getModelApiData } from "../utill/modelApi";
// import PageLoader from "./ProgressPageLoader";
import * as Constants from "../component/constant/ModelConstants";
// import { useReactiveVar } from "@apollo/client";
// import { useWorkflowComponent } from "../vars/workflow/workflowHooks";
// import { workflowsVar } from "../cache";
import ForecastOutput from "../component/Forecast/ForecastOutput";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CreateIcon from "@mui/icons-material/Create";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import forecastDefaultInputConfig from "../component/Forecast/ForecastModelInput.json";
import PageTitleV2 from "../component/PageTitleV2";
import CloseIcon from "@mui/icons-material/Close";
import ThemeButton from "../component/ThemeButton";
import moment from "moment";
import { TimeFormat } from "../component/constant/TimeFormat";

import {
  fluidTypeOptions,
  defaultFluidTypeInputs,
  referenceTypeOptions,
  defaultReferenceInputs,
  correlationTypeOptions,
  flowTypeOptions,
  liftTypeOptions,
  flowCorrelationOptions,
  outputCharts,
  defaultChartConfig,
  timePickerWorkFlow,
  prodColumnOptions,
  youtubeVideoUrl,
} from "../component/BHP/ConstantBhp";

const defaultDetection = {
  pres_init: {
    label: "Initial Reservoir Pressure ",
    min: 14.7,
    max: 30000,
    unit: "(psia)",
    error: "",
    tooltip: "",
  },
  temp_res: {
    label: "Reservoir Temperature",
    min: 60,
    max: 400,
    unit: "(F)",
    error: "",
    tooltip: "",
  },
  cf: {
    label: "Rock Compressibility ",
    min: 0,
    max: "",
    unit: "(psi ^-1)",
    error: "",
    tooltip: "",
  },
};

const useStyles = makeStyles()((theme) => ({
  container: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: 0,
    position: "relative",
  },
  mainContainer: {
    paddingLeft: "32px",
    paddingRight: "32px",
    paddingBottom: 0,
  },
  chartContainerV2: {
    backgroundColor: "transparent",
    marginTop: 0,
  },
  header: {
    width: "100%",
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    backgroundColor: theme.palette.background.screen,
    zIndex: 10,
    minHeight: "50px",
  },
  chartWrapper: {
    "& > div:first-child": {},
    "& > div:last-child": {},
    "& .noPadding": {
      paddingLeft: "unset !important",
      paddingRight: "unset !important",
    },
    "& .MuiPaper-root": {
      marginBottom: 4,
    },
    "& .css-11iy75e-MuiPaper-root-MuiAccordion-root:before": {
      display: "none",
    },
  },
  "@keyframes zoomInButtonAnimation": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },

  animationHover: {
    "&:hover": {
      "& .MuiSvgIcon-root": {
        cursor: "pointer",
        color: theme.palette.primary.main,
        height: "44px",
        width: "44px",
      },
      animation: "$zoomInButtonAnimation 0.8s ease-in-out",
    },
  },
  groupsIcone: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "350px",
    borderRadius: "12px",
    marginTop: "5px",
    flexWrap: "nowrap",
    margin: "auto",
    alignItems: "center",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
    },
    backgroundColor: theme.palette.background.header,
  },
  modelContainer: {
    position: "fixed",
    height: "calc(100vh - 80px)",
    width: "calc(100vw - 250px)",
    overflow: "hidden",
    top: "51%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: theme.palette.background.screen,
    border: "1px solid " + theme.palette.background.border,
    borderRadius: "12px",
    zIndex: 1000,
  },
  fileButton: {
    height: 40,
    display: "inline-block",
    padding: "unset",
    borderRadius: "100%",
    marginTop: "5px",
    minWidth: 25,
    fontWeight: 600,
    textTransform: "none",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      color: theme.palette.primary.main,
      height: "35px",
      width: "35px",
    },
  },
  popUpContainer: {
    display: "flex",
  },
  sidebar: {
    flex: "0 0 auto",
    width: "180px",
    padding: 20,
    height: "calc(100vh - 50px)",
    borderRight: "1px solid black",
    transition: "width 0.5s",
    overflow: "hidden",
    marginRight: "20px",
    backgroundColor: theme.palette.background.header,
  },
  containerMenuIcon: {
    color: theme.palette.primary.main,
    height: "30px",
    width: "30px",
  },
  containerMenuText: {
    color: theme.palette.text.primary,
  },
  collapsed: {
    width: "9%",
  },
  menu: {
    listStyleType: "none",
    padding: 0,
    marginTop: "12px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: 10,
    height: 60,
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "1px solid",
    borderRadius: theme.borderRadius.small,
    "&:hover": {
      background: theme.palette.background.hover + " !important",
    },
    "&.active": {
      backgroundColor: theme.palette.background.active,
      "&:hover": {
        background: theme.palette.background.hover + " !important",
      },
    },
    "&.error": {
      border: "2px solid #FF0000",
    },
  },
  menuLabel: {
    marginLeft: 0,
    opacity: 1,
    color: theme.palette.text.primary,
    transition: "opacity 0.3s",
    "&.visible": {
      opacity: 0,
    },
  },
  mainContent: {
    flexGrow: 1,
    paddingTop: 25,
  },
  closeButton: {
    backgroundColor: theme.palette.primary.header,
    "&:hover": {
      background: theme.palette.primary.screen,
    },
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      color: theme.palette.primary.main,
      height: "30px",
      width: "30px",
    },
  },
}));
const getupdatedInputs = (obj) => {
  const newObj = { ...obj };
  Object.entries(newObj).forEach(([type, fields]) => {
    Object.entries(fields).forEach(([name, value]) => {
      if (name === "oilGrav" || name === "gasGrav") {
        value = parseFloat(Number(value)?.toFixed(2));
      }
      if (name === "y_n2" || name === "y_h2s" || name === "y_co2") {
        value = parseFloat(Number(value)?.toFixed(3));
      }
      fields[name] = value;
    });
  });
  return newObj;
};

const Forecast_Calc = () => {
  const { classes } = useStyles();
  // const { currentTheme } = useContext(CustomThemeContext);
  const updatedConfig = useMemo(() => {
    const config = {
      ...forecastDefaultInputConfig,
      modelInput: {
        ...forecastDefaultInputConfig.modelInput,
        pvtParameter: {
          ...forecastDefaultInputConfig.modelInput.pvtParameter,
          fluidInput: getupdatedInputs(
            forecastDefaultInputConfig.modelInput.pvtParameter.fluidInput
          ),
        },
      },
    };
    return config;
  }, [forecastDefaultInputConfig]);
  const [pvtInputConfig, setPVTInputConfig] = useState({
    ...updatedConfig.modelInput,
  });
  const [calculatedInputConfig, setCalculatedInputConfig] = useState({
    ...updatedConfig.modelInput,
  });
  const [selectedTab, setSelectedTab] = useState(Constants.OUTPUT_TYPE_MENU);
  const [selectedInputSection, setSelectedInputSection] = useState(
    Constants.PVT_INPUTS
  );
  const [errorMessage, setErrorMessage] = useState(false);
  const [enableReset, setEnableReset] = useState(false);
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [fluidTypeInputs, setFluidTypeInputs] = useState({
    ...defaultFluidTypeInputs,
  });
  const [modelInputs, setModelInputs] = useState({ ...defaultDetection });
  const [selectedFluidType, setSelectedFluidType] = useState(
    fluidTypeOptions?.find(
      (item) => item.value === pvtInputConfig?.pvtParameter?.fluidType
    )
  );
  const [correlationTypeInputs, setCorrelationTypeInputs] = useState({
    ...pvtInputConfig?.pvtParameter?.correlations,
  });
  const [modelOutputData, setModelOutputData] = useState({
    ...forecastDefaultInputConfig?.modelOutput,
  });
  const [showLoader, setShowLoader] = useState(false);
  const [modelConfigErrorMessage, setModelConfigErrorMessage] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [isWaterChecked, setIsWaterChecked] = useState(
    forecastDefaultInputConfig?.modelInput?.pvtParameter?.isWaterChecked
  );
  const menuOpen = true;
  const [prodError, setProdError] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState("auto");
  const [showClearConfirmationDialog, setShowClearConfirmationDialog] =
    useState(false);
  const [showVideoPlayerDialog, setShowVideoPlayerDialog] = useState(false);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {}, 1000);
    return () => clearTimeout(animationTimeout);
  }, [selectedInputSection]);

  const handleModelApiCall = () => {
    const isFluidTypeError = Object.entries(fluidTypeInputs).some(
      ([key, value]) => value?.error !== ""
    );
    if (prodError?.length || isFluidTypeError || modelInputs.error) {
      setErrorMessage(true);
      setModelConfigErrorMessage(true);
    } else {
      setShowLoader(true);

      const {
        forecast_settings,
        pwf_sensitivity,
        multisegmentPIFitParams,
        reservoir_properties,
      } = pvtInputConfig;
      const { gasGrav, oilGrav, rsi, wat_salinity, y_co2, y_h2s, y_n2 } =
        pvtInputConfig.pvtParameter.fluidInput.liveOil;
      let inputRequestObj = {
        gasSatWaterFlag: false,
        daily_data: { ...pvtInputConfig.productionData },
        pvt: {
          pvt_type: "BlackOil",
          input: {
            gasSatWaterFlag: false,
            gasgrav: gasGrav,
            oilgrav: oilGrav,
            rsi: rsi,
            wat_salinity: wat_salinity,
            y_co2: y_co2,
            y_h2s: y_h2s,
            y_n2: y_n2,
            corr_method: { ...pvtInputConfig?.pvtParameter.correlations },
          },
        },
        reservoir_properties: { ...reservoir_properties },
        ddv_settings: {
          pavg_determine_by_optimization: true,
          pavg_initial_guess_params: null,
          pavg_params_range: null,
          mbt_filter_on: true,
          mbt_threshold: 5,
          dca_filter_on: true,
          dca_filter_iterations: 1,
          dca_filter_std_multiplier: 3,
          dca_logresiduals: false,
          dca_switch_percent: 0,
          pnr_auto_fit: true,
          pnr_fit_params: null,
          pnr_fit_settings: {
            yi: { min: 0.1, base: 10, max: 100 },
            logdi: { min: -8.5, base: -2, max: 2 },
            b: { min: 1.01, base: 1.2, max: 7 },
            switch_perc: 0,
          },
          pnr_arps_filter: false,
          adjust_gor_cum_early_time: true,
          mb_const_compressibility: true,
          dtof_const_compressibility: true,
          perrine_ignore_gas: false,
          perrine_ignore_gas_undersaturated: false,
        },
        oil_hm_settings: {
          pavg_pwf_diff: 0,
          pres_init_up_mult: 1.2,
          hm_sw: true,
          run_time_constraint: 120,
          res_weights: null,
        },
        PI_fit_settings: {
          train_start_day: 0,
          fit_method: "arps",
          arps_fit_params: {
            yi: { min: 0.01, base: 1, max: 100 },
            logdi: { min: -8, base: -0.4, max: 5 },
            b: { min: 0.07, base: 1.2, max: 7 },
          },
          tail_perc: 10,
          tail_weights: 250,
          dca_logresiduals: true,
          switch_percent: 0,
          threshold_error: 0.6,
          interference_fit_adjust: false,
          interference_filter_points: 5,
          seg_fit: 0,
        },
        auto_generate_pwf_forecast: true,
        forecast_settings: { ...forecast_settings },
        fit_settings: { train_end_day: null },
        PI_forecast_settings: { switch_percent: 0 },
        multisegmentPIFitParams: { ...multisegmentPIFitParams },
        plotParams: { plots: false, y_axis_lim: 15 },
        pwf_fit_settings: {
          train_start_day: 0,
          fit_method: "arps",
          arps_fit_params: {
            yi: { min: 1000, base: 4000, max: 8000 },
            logdi: { min: -4, base: -0.4, max: 4 },
            b: { min: 0.01, base: 0.5, max: 4 },
          },
          tail_perc: 10,
          tail_weights: 20,
          dca_logresiduals: true,
          switch_percent: 0,
        },
        pwf_forecast_settings: {
          switch_percent: 0,
          min_pwf: 100,
          pwf_fcast_adjust: false,
        },
        pwf_sensitivity: { ...pwf_sensitivity },
        watercut_fit_settings: {
          train_start_day: 0,
          min_tail_length: 60,
          tail_perc: 15,
        },
      };
      // setModelOutputData()
      getModelApiData(
        Constants?.DDVplusMSPIBF_liq_MODEL_API_URL,
        inputRequestObj
      )
        .then((response) => {
          setModelOutputData({ ...forecastDefaultInputConfig?.modelOutput });
          setSelectedTab(Constants.OUTPUT_TYPE_MENU);
          setShowLoader(false);
          setShowModel(false);
          setCalculatedInputConfig(pvtInputConfig);
        })
        .catch((error) => {
          setModelOutputData({});
          setShowLoader(false);
          setShowLoader(false);
          const apiError = error?.response?.data?.detail;
          const errorMessage = `${
            Constants.MODEL_API_ERROR
          } ${apiError.substring(0, apiError.indexOf(".."))}`;
        });
    }
  };

  const handleResetModelInput = () => {
    setFluidTypeInputs({ ...defaultFluidTypeInputs });
    setSelectedFluidType(
      fluidTypeOptions?.find(
        (item) => item.value === calculatedInputConfig?.pvtParameter?.fluidType
      )
    );
    setIsWaterChecked(calculatedInputConfig?.pvtParameter?.isWaterChecked);
    setCorrelationTypeInputs({
      ...calculatedInputConfig?.pvtParameter?.correlations,
    });
    setPVTInputConfig({ ...calculatedInputConfig });
    setErrorMessage(false);
    setShowConfirmationDialog(false);
    setShowCancelDialog(false);
    setShowModel(false);
    setModelConfigErrorMessage(false);
    setEnableReset(false);
    setIsInputChanged(false);
  };
  //
  const handleImportedFileInputs = (fileContent) => {
    const fluidTypeOption =
      fluidTypeOptions && fluidTypeOptions?.length > 0
        ? { ...fluidTypeOptions[0] }
        : null;
    if (fluidTypeOption?.value) {
      const roundedFluidInput = Object.keys(
        fileContent?.modelInput?.pvtParameter?.fluidInput
      ).reduce((acc, key) => {
        const value = fileContent?.modelInput?.pvtParameter?.fluidInput[key];

        if (key === "oilGrav" || key === "gasGrav") {
          acc[key] = parseFloat(Number(value).toFixed(2));
        } else if (key === "y_n2" || key === "y_h2s" || key === "y_co2") {
          acc[key] = parseFloat(Number(value).toFixed(3));
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});
      const modelInput = {
        ...forecastDefaultInputConfig?.modelInput,
        modelInput: {
          pvtParameter: {
            ...forecastDefaultInputConfig?.modelInput?.pvtParameter,
            fluidType: fileContent?.pvtParameter?.fluidType,
            isWaterChecked: fileContent?.pvtParameter?.isWaterChecked,
            fluidInput: {
              ...forecastDefaultInputConfig?.modelInput?.pvtParameter
                .fluidInput,
              [fileContent?.pvtParameter?.fluidType]: { ...roundedFluidInput },
            },
            correlations: {
              ...fileContent?.pvtParameter?.correlations,
            },
          },
          production: { ...fileContent.production },
          reservoir_properties: { ...fileContent.reservoir_properties },
          auto_generate_pwf_forecast: true,
          forecast_settings: { ...fileContent.forecast_settings },
          fit_settings: { ...fileContent.fit_settings },
          PI_forecast_settings: { ...fileContent.PI_forecast_settings },
          multisegmentPIFitParams: { ...fileContent.multisegmentPIFitParams },
          plotParams: { ...fileContent.plotParams },
          pwf_fit_settings: { ...fileContent.pwf_fit_settings },
          pwf_forecast_settings: { ...fileContent.pwf_forecast_settings },
          pwf_sensitivity: { ...fileContent.pwf_sensitivity },
          watercut_fit_settings: { ...fileContent.watercut_fit_settings },
        },
        modelOutput: {},
      };
      setPVTInputConfig(modelInput);
      setFluidTypeInputs({ ...defaultFluidTypeInputs });
      setSelectedFluidType(fluidTypeOption);
      setIsWaterChecked(fileContent?.pvtParameter?.isWaterChecked);
      setCorrelationTypeInputs(fileContent?.pvtParameter?.correlations);
      setErrorMessage(false);
      handleModelApiCall();
      setModelConfigErrorMessage(false);
      setEnableReset(true);
      setModelOutputData({});
      // toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
    } else {
      // toastCustomErrorMessage(Constants.UPLOAD_FILE_FORMAT_ERROR_MESSAGE, { style: { width: "400px" } })
    }
  };

  useEffect(() => {
    const isFluidTypeError = Object.entries(fluidTypeInputs).some(
      ([key, value]) => value?.error !== ""
    );
    setErrorMessage(isFluidTypeError);
  }, [fluidTypeInputs]);

  useEffect(() => {
    handleModelApiCall();
  }, []);

  const handleModelErrorMessage = () => {
    const isModelInputs = Object.entries(modelInputs).some(
      ([key, value]) => value?.error !== ""
    );
    setModelConfigErrorMessage(isModelInputs);
  };

  useEffect(() => {
    handleModelErrorMessage();
  }, [modelInputs]);

  const handlePVTInputImport = (event) => {
    if (event?.target?.files?.length) {
      const selectedFile = event?.target?.files[0];
      if (selectedFile.type === Constants.JSON_FILE_EXTENSION) {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = () => {
          const fileContent = JSON.parse(reader?.result);
          handleImportedFileInputs(fileContent);
        };
      } else {
        // toastCustomErrorMessage(Constants.JSON_FILE_ERROR_MESSAGE, { style: { width: "400px" } });
      }
    } else {
      // toastCustomErrorMessage(Constants.UPLOAD_FILE_ERROR_MESSAGE, { style: { width: "400px" } });
    }
  };

  const handlePVTInputExport = () => {
    // Beautify json string with indentation and line breaks
    const modelInput = {
      ...forecastDefaultInputConfig,
      modelInput: {
        ...forecastDefaultInputConfig.modelInput,
        pvtParameter: {
          ...forecastDefaultInputConfig.modelInput.pvtParameter,
          fluidInput: {
            ...forecastDefaultInputConfig.modelInput.pvtParameter.fluidInput[
              selectedFluidType?.value
            ],
          },
          // refInput: { ...bhpInputConfig.pvtParameter.refInput[selectedReference?.value] }
        },
      },
    };
    delete modelInput?.settings;
    delete modelInput?.compute_options;
    const beautifiedJSON = JSON.stringify(modelInput, null, 2);
    // exportToJson(beautifiedJSON, Constants.EXPORT_FORECAST_FILE_NAME)
  };

  const handleShowCancelDialog = (show) => {
    if (isInputChanged) {
      setShowCancelDialog(show);
    } else {
      handleTabSelection(Constants.INPUT_TYPE_MENU, Constants.PVT_INPUTS, true);
      setShowCancelDialog(false);
      setShowModel(false);
    }
  };

  const wellOptions = useMemo(() => {
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

  const handleForecastInputConfig = (config) => {
    //  setTraverseCall(false);
    setPVTInputConfig(config);
  };

  const pvtOutputSection = useMemo(() => {
    return (
      <Box className={classes.chartContainerV2}>
        <ForecastOutput
          selectedTab={selectedTab}
          modelOutputData={modelOutputData}
          outputCharts={outputCharts}
          wellOptions={wellOptions}
          pvtInputConfig={pvtInputConfig}
          // defaultChartConfig={options}
          selectedFluidType={selectedFluidType}
          isWaterChecked={isWaterChecked}
          // selectedTheme={currentTheme}
          showCancelDialog={showCancelDialog}
        />
      </Box>
    );
  }, [
    selectedTab,
    modelOutputData,
    wellOptions,
    isInputChanged,
    pvtInputConfig,
    showCancelDialog,
    selectedFluidType,
    isWaterChecked,
  ]);

  const handleTabSelection = (tabId, inputSection = "", Boolean = "false") => {
    setSelectedTab(tabId);
    setSelectedInputSection(inputSection);
    setShowModel(Boolean);
  };

  const handleShowClearDialog = (show) => {
    if (isInputChanged) {
      setShowClearConfirmationDialog(show);
    } else {
      setShowClearConfirmationDialog(false);
      setShowModel(false);
    }
  };

  const handleShowVideoPlayerDialog = (show) => {
    if (isInputChanged) {
      setShowVideoPlayerDialog(show);
    } else {
      setShowVideoPlayerDialog(false);
    }
  };

  const handleClearModelInput = () => {
    const updatedFluidInput = {
      liveOil: {
        oilGrav: 0,
        gasGrav: 0,
        rsi: 0,
        wat_salinity: 0,
        y_n2: 0,
        y_h2s: 0,
        y_co2: 0,
      },
      dreadOil: {
        oilGrav: 0,
        gasGrav: 0,
        rsi: 0,
        wat_salinity: 0,
        y_n2: 0,
        y_h2s: 0,
        y_co2: 0,
      },
      dryGas: {
        oilGrav: 0,
        gasGrav: 0,
        rsi: 0,
        wat_salinity: 0,
        y_n2: 0,
        y_h2s: 0,
        y_co2: 0,
      },
    };

    const prodObj = {
      datetime: [],
      qo: [],
      qw: [],
      qg: [],
      pres_casing: [],
      pres_tubing: [],
      measured_bhp: [],
      qg_lift: [],
      pwf: [],
      uptime: [],
      elapsed_time: [],
    };

    const reservoir_propertiesobj = {
      cf: 0,
      pres_init: 0,
      //sw_range:[0, 0]
      temp_res: 0,
    };

    const fit_paramsobj = {
      b: 0,
      logdi: 0,
      yi: 0,
    };

    const input = {
      ...pvtInputConfig,
      pvtParameter: {
        ...pvtInputConfig.pvtParameter,
        fluidInput: updatedFluidInput,
      },
      productionData: prodObj,
      reservoir_properties: reservoir_propertiesobj,
      pwf_sensitivity: {
        ...pvtInputConfig.pwf_sensitivity,
        fit_params: fit_paramsobj,
        pwf_fcast_array: [],
      },
    };
    setShowClearConfirmationDialog(false);
    setPVTInputConfig(input);
  };

  return (
    <Container className={classes.mainContainer} maxWidth={false}>
      <Box className={classes.header}>
        <Box display="flex" alignItems="center">
          <PageTitleV2 regularText="Forecast" highlightText="" />
        </Box>
        <Box display="flex" alignItems="center" className={classes.groupsIcone}>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            onClick={() =>
              handleTabSelection(
                Constants.INPUT_TYPE_MENU,
                Constants.BHP_Inputs,
                true
              )
            }
          >
            <Tooltip
              title={Constants.INPUTS}
              placement="bottom"
              arrow
              enterDelay={100}
            >
              <CreateIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            onClick={() => setShowConfirmationDialog(true)}
          >
            <Tooltip title="Reset" placement="bottom" arrow enterDelay={100}>
              <RestartAltIcon />
            </Tooltip>
          </IconButton>
          <Button
            variant="transparant"
            component="label"
            className={clsx(classes.animationHover, classes.fileButton)}
          >
            <Tooltip
              title={Constants.IMPORT_INPUT}
              placement="bottom"
              arrow
              enterDelay={100}
            >
              <UploadFileIcon />
            </Tooltip>
            <input
              type="file"
              accept={".json"}
              hidden
              // onChange={handleBHPInputImport}
            />
          </Button>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            // onClick={handleBHPInputExport}
          >
            <Tooltip
              title={Constants.EXPORT_INPUT}
              placement="bottom"
              arrow
              enterDelay={100}
            >
              <FileDownloadIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            onClick={() => setShowClearConfirmationDialog(true)}
          >
            <Tooltip
              title={Constants.CLEAR_INPUT}
              placement="bottom"
              arrow
              enterDelay={100}
            >
              <ClearIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            onClick={() => setShowVideoPlayerDialog(true)}
          >
            <Tooltip
              title={Constants.VIDEO_PLAYER}
              placement="bottom"
              arrow
              enterDelay={100}
            >
              <PlayCircleOutlineIcon />
            </Tooltip>
          </IconButton>
        </Box>
        <ThemeButton />
      </Box>
      <Grid
        className={classes.chartWrapper}
        container
        direction="row"
        justifyContent="space-between"
      >
        {pvtOutputSection}
      </Grid>
      <Dialog open={showModel}>
        <div className={clsx(classes.modelContainer)}>
          <Box sx={{ display: "flex", position: "fixed", right: "8px" }}>
            <IconButton
              className={classes.closeButton}
              onClick={() => handleShowCancelDialog(true)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box className={classes.popUpContainer}>
            <Box
              className={`${classes.sidebar} ${
                menuOpen ? "" : classes.collapsed
              }`}
            >
              <h6 className={classes.containerMenuText}>
                <Typography variant="body2">{Constants.INPUTS}</Typography>
              </h6>
              <List className={classes.menu}>
                <ListItem
                  className={clsx(classes.menuItem, {
                    active: selectedInputSection === Constants.BHP_Inputs,
                    error: errorMessage,
                  })}
                  onClick={() =>
                    handleTabSelection(
                      Constants.INPUT_TYPE_MENU,
                      Constants.BHP_Inputs
                    )
                  }
                >
                  <ThermostatIcon
                    className={classes.containerMenuIcon}
                    style={{
                      color: errorMessage ? "red" : "inherit",
                    }}
                  />

                  <ListItemText
                    primary={Constants.BHP_INPUTS}
                    style={{
                      color: errorMessage ? "red" : "inherit",
                    }}
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                  />
                </ListItem>
              </List>
              <List className={classes.menu}>
                <ListItem
                  className={clsx(classes.menuItem, {
                    active: selectedInputSection === Constants.BHP_Production,
                    error: prodError?.length,
                  })}
                  onClick={() =>
                    handleTabSelection(
                      Constants.INPUT_TYPE_MENU,
                      Constants.BHP_Production
                    )
                  }
                >
                  <ThermostatIcon className={classes.containerMenuIcon} />
                  <ListItemText
                    primary={Constants.BHP_Production}
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                  />
                </ListItem>
              </List>
              <List className={classes.menu}>
                <ListItem
                  className={clsx(classes.menuItem, {
                    active: selectedInputSection === "Reseroir",
                    error: modelConfigErrorMessage,
                  })}
                  onClick={() =>
                    handleTabSelection(
                      Constants.INPUT_TYPE_MENU,
                      "Reseroir",
                      true
                    )
                  }
                >
                  <ThermostatIcon
                    className={classes.containerMenuIcon}
                    style={{
                      color: modelConfigErrorMessage ? "red" : "inherit",
                    }}
                  />
                  <ListItemText
                    primary="Reseroir"
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                    style={{
                      color: modelConfigErrorMessage ? "red" : "inherit",
                    }}
                  />
                </ListItem>
              </List>
              <List className={classes.menu}>
                <ListItem
                  className={clsx(classes.menuItem, {
                    active: selectedInputSection === "Model Configuration",
                    error: modelConfigErrorMessage,
                  })}
                  onClick={() =>
                    handleTabSelection(
                      Constants.INPUT_TYPE_MENU,
                      "Model Configuration"
                    )
                  }
                >
                  <ThermostatIcon className={classes.containerMenuIcon} />
                  <ListItemText
                    primary="Model Config"
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                  />
                </ListItem>
              </List>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: "20px",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  width: "140px",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleModelApiCall}
                  style={{ marginTop: "5px" }}
                  disabled={errorMessage || modelConfigErrorMessage}
                >
                  {Constants.CALCULATE}
                </Button>
              </Box>
            </Box>
          </Box>
        </div>
      </Dialog>
    </Container>
  );
};

export default Forecast_Calc;
