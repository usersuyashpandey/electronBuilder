import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Container,
  IconButton,
  Tooltip,
  Button,
  Typography,
  Dialog,
  List,
  ListItemText,
  ListItem,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import clsx from "clsx";
import * as Constants from "../component/constant/ModelConstants";
import { defaultWellOptions } from "../component/constant/DefaultOptions";
import BHPOutput from "../component/BHP/BhpOutput";
import BHPInputs from "../component/BHP/BhpInputs";
import BHPProduction from "../component/BHP/BhpProduction";
import BHPWellboreConfig from "../component/BHP/BhpWellboreConfig";
import ConfirmationPopup from "../component/ConfirmationPopup";
import bhpDefaultInputConfig from "../component/BHP/BhpModelInput.json";
import { exportToJson } from "../utils/exportCSV";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CreateIcon from "@mui/icons-material/Create";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PageTitleV2 from "../component/PageTitleV2";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { TimeFormat } from "../component/constant/TimeFormat";
import VideoPlayer from "../component/VideoPlayer";
import AppsDrawer from "../component/layout/AppsDrawer";

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
import SettingsPopUpContent from "../component/SettingPopUp";
import { Apps, Settings } from "@mui/icons-material";
import XectaIcon from "../images/xecta-icon-small.svg";
import { getBHPDetails } from "../service/ModelRapidApi";

const useStyles = makeStyles()((theme) => ({
  // "& > div:first-of-type": {},
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
    // color: theme.palette.text.primary,
    height: "30px",
    width: "30px",
    // "& .MuiSvgIcon-root": {
    //   cursor: "pointer",
    //   "&:hover": {
    //     backgroundColor: "black",
    //     color: " black",
    //   },
    // },
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
      color: theme.palette.background.default,
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
    "&:hover": {
      color: theme.palette.primary.dark,
    },
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
  calculateButton: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.header,
    "&:hover": {
      background: theme.palette.background.hover + " !important",
      color: theme.palette.background.default,
    },
    border: "1px solid" + theme.palette.background.border,
    color: theme.palette.text.primary,
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

const Home = () => {
  const { classes } = useStyles();
  const updatedConfig = useMemo(() => {
    const config = {
      ...bhpDefaultInputConfig,
      modelInput: {
        ...bhpDefaultInputConfig.modelInput,
        pvtParameter: {
          ...bhpDefaultInputConfig.modelInput.pvtParameter,
          fluidInput: getupdatedInputs(
            bhpDefaultInputConfig.modelInput.pvtParameter.fluidInput
          ),
        },
      },
    };
    return config;
  }, [bhpDefaultInputConfig]);
  const [bhpInputConfig, setBHPInputConfig] = useState({
    ...updatedConfig?.modelInput,
    wellboreConfig: updatedConfig?.modelInput?.wellboreConfig
      .map((item) => ({
        ...item,
        datetime: moment
          .unix(item.datetime)
          .utc()
          .format(TimeFormat.datePicker),
      }))
      .sort((a, b) => (a.datetime > b.datetime ? 1 : -1)),
  });

  const [prodError, setProdError] = useState([]);

  const [nodeError, setNodeError] = useState(
    bhpDefaultInputConfig?.modelInput?.wellboreConfig.map((item) => ({
      datetime: moment.unix(item.datetime).utc().format(TimeFormat.datePicker),
      Gauge: "",
      BHP: "",
    }))
  );
  const [surveyError, setSurveyError] = useState(
    bhpDefaultInputConfig?.modelInput?.wellboreConfig.map((item) => ({
      datetime: moment.unix(item.datetime).utc().format(TimeFormat.datePicker),
      cellErrors: [],
    }))
  );

  const [thermalError, setThermalError] = useState(
    bhpDefaultInputConfig?.modelInput?.wellboreConfig.map((item) => ({
      datetime: moment.unix(item.datetime).utc().format(TimeFormat.datePicker),
      cellErrors: [],
    }))
  );
  const [casingError, setCasingError] = useState(
    bhpDefaultInputConfig?.modelInput?.wellboreConfig.map((item) => ({
      datetime: moment.unix(item.datetime).utc().format(TimeFormat.datePicker),
      cellErrors: [],
    }))
  );
  const [tubingError, setTubingError] = useState(
    bhpDefaultInputConfig?.modelInput?.wellboreConfig.map((item) => ({
      datetime: moment.unix(item.datetime).utc().format(TimeFormat.datePicker),
      cellErrors: [],
    }))
  );
  const [gasLiftError, setGasLiftError] = useState(
    bhpDefaultInputConfig?.modelInput?.wellboreConfig.map((item) => ({
      datetime: moment.unix(item.datetime).utc().format(TimeFormat.datePicker),
      cellErrors: [],
    }))
  );

  const handleNewConfigDateErrors = (date, newActiveStepIndex) => {
    const stepIndex = newActiveStepIndex > 1 ? newActiveStepIndex - 1 : 0;
    let newNodeError = { ...nodeError[stepIndex], datetime: date };
    let newSurveyError = { ...surveyError[stepIndex], datetime: date };
    let newThermalError = { ...thermalError[stepIndex], datetime: date };
    let newCasingError = { ...casingError[stepIndex], datetime: date };
    let newTubingError = { ...tubingError[stepIndex], datetime: date };
    let newGasLiftError = { ...gasLiftError[stepIndex], datetime: date };
    const sortedNodeError = [...nodeError, newNodeError].sort((a, b) =>
      a.datetime > b.datetime ? 1 : -1
    );
    const sortedSurveyError = [...surveyError, newSurveyError].sort((a, b) =>
      a.datetime > b.datetime ? 1 : -1
    );
    const sortedThermalError = [...thermalError, newThermalError].sort((a, b) =>
      a.datetime > b.datetime ? 1 : -1
    );
    const sortedCasingError = [...casingError, newCasingError].sort((a, b) =>
      a.datetime > b.datetime ? 1 : -1
    );
    const sortedTubingError = [...tubingError, newTubingError].sort((a, b) =>
      a.datetime > b.datetime ? 1 : -1
    );
    const sortedGasLiftError = [...gasLiftError, newGasLiftError].sort((a, b) =>
      a.datetime > b.datetime ? 1 : -1
    );
    setNodeError(sortedNodeError);
    setSurveyError(sortedSurveyError);
    setThermalError(sortedThermalError);
    setCasingError(sortedCasingError);
    setTubingError(sortedTubingError);
    setGasLiftError(sortedGasLiftError);
  };

  const [calculatedInputConfig, setCalculatedInputConfig] = useState({
    ...updatedConfig?.modelInput,
    wellboreConfig: updatedConfig?.modelInput?.wellboreConfig
      .map((item) => ({
        ...item,
        datetime: moment
          .unix(item.datetime)
          .utc()
          .format(TimeFormat.datePicker),
      }))
      .sort((a, b) => (a.datetime > b.datetime ? 1 : -1)),
  });
  const [selectedTab, setSelectedTab] = useState(Constants.OUTPUT_TYPE_MENU);
  const [selectedInputSection, setSelectedInputSection] = useState(
    Constants.BHP_Inputs
  );
  const [errorMessage, setErrorMessage] = useState(false);
  const [wellboreErrorMessage, setWellboreErrorMessage] = useState(false);
  const [enableReset, setEnableReset] = useState(false);
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [fluidTypeInputs, setFluidTypeInputs] = useState({
    ...defaultFluidTypeInputs,
  });
  const [selectedFluidType, setSelectedFluidType] = useState(
    fluidTypeOptions?.find(
      (item) => item.value === bhpInputConfig?.pvtParameter?.fluidType
    )
  );
  const [referenceTypeInputs, setReferenceTypeInputs] = useState({
    ...defaultReferenceInputs[bhpInputConfig?.pvtParameter?.refType],
  });
  const [selectedReference, setSelectedReference] = useState(
    referenceTypeOptions?.find(
      (item) => item.value === bhpInputConfig?.pvtParameter?.refType
    )
  );
  const [correlationTypeInputs, setCorrelationTypeInputs] = useState({
    ...bhpInputConfig?.pvtParameter?.correlations,
  });
  const [modelOutputData, setModelOutputData] = useState({});
  const [errorMetricsData, setErrorMetricsData] = useState({});
  const [defaultModelOutputData, setDefaultModelOutputData] = useState({});
  const [traverseOutput, setTraverseOutput] = useState({});
  const [defaultTraverseOutput, setDefaultTraverseOutput] = useState({});
  const [selectedWell2, setSelectedWell2] = useState({ label: "", value: "" });
  const [showLoader, setShowLoader] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showClearConfirmationDialog, setShowClearConfirmationDialog] =
    useState(false);
  const [showVideoPlayerDialog, setShowVideoPlayerDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [isWaterChecked, setIsWaterChecked] = useState(
    bhpDefaultInputConfig?.modelInput?.pvtParameter?.isWaterChecked
  );
  const [selectedConfigDate, setSelectedConfigDate] = useState(
    moment
      .unix(
        (bhpDefaultInputConfig?.modelInput?.wellboreConfig?.sort((a, b) =>
          moment.unix(a.datetime).format(TimeFormat.datePicker) >
          moment.unix(b.datetime).format(TimeFormat.datePicker)
            ? 1
            : -1
        ))[bhpDefaultInputConfig?.modelInput?.wellboreConfig?.length - 1]
          .datetime
      )
      .utc()
      .format(TimeFormat.datePicker)
  );
  const menuOpen = true;
  const [clickedX, setClickedX] = useState([
    bhpDefaultInputConfig?.modelInput?.productionData?.datetime[
      bhpDefaultInputConfig?.modelInput?.productionData?.datetime?.length - 1
    ],
  ]);
  const [traverseCall, setTraverseCall] = useState(true);
  const [focusElem, setFocusElem] = useState(Constants.GAUGE);
  const [isProdGasLiftError, setIsProdGasLiftError] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [isPvtParameterError, setIsPvtParameterError] = useState(false);
  const [isWellboreConfigError, setIsWellboreConfigError] = useState(false);
  const [lastRowIndex, setLastRowIndex] = useState(99);
  const [scrollIndex, setScrollIndex] = useState(99);

  const isCellErrorExist = (id, field) => {
    const isErrorExist = prodError?.some((cell) => {
      let errCell = cell.split(":");
      errCell = `${errCell[0]}:${errCell[1]}`;
      return errCell === `${id}:${field}`;
    });
    return isErrorExist;
  };

  const IsAnyProd_GasLift_Error = (
    clearErrors = false,
    rowId = null,
    cellValue = null
  ) => {
    let gasLiftDates = bhpInputConfig?.wellboreConfig
      ?.filter((item) => item.lift_method === "GasLift")
      ?.map((item) => item?.datetime)
      .sort((a, b) => (a > b ? 1 : -1));
    let gasLifts = bhpInputConfig?.wellboreConfig?.filter(
      (item) => item.lift_method === "GasLift"
    );

    let prodRows = bhpInputConfig?.productionData?.length
      ? bhpInputConfig?.productionData?.map((item) => ({
          ...item,
          datetime: moment(item.datetime).format(TimeFormat.datePicker),
        }))
      : bhpInputConfig?.productionData?.datetime.map((datetime, index) => {
          const obj = {
            id: index + 1,
            datetime: moment.unix(datetime).format(TimeFormat.datePicker),
            qg_lift: bhpInputConfig?.productionData?.qg_lift[index],
          };
          return obj;
        });

    if (gasLifts?.length === 1) {
      const gasLiftIndex = bhpInputConfig?.wellboreConfig?.findIndex(
        (item) => item.datetime === gasLiftDates[0]
      );
      if (prodRows.length > 0) {
        if (
          gasLiftIndex ===
          bhpDefaultInputConfig?.modelInput?.wellboreConfig?.length - 1
        ) {
          gasLiftDates = [
            ...gasLiftDates,
            prodRows[prodRows.length - 1].datetime,
          ];
        } else {
          const lastDate = moment(
            bhpInputConfig?.wellboreConfig[gasLiftIndex + 1].datetime
          )
            .add(-1, "days")
            .format(TimeFormat.datePicker);
          gasLiftDates = [...gasLiftDates, lastDate];
        }
      }
      prodRows = prodRows.filter(
        (item) =>
          item.datetime >= gasLiftDates[0] &&
          item.datetime <= gasLiftDates[gasLiftDates?.length - 1]
      );
    }

    if (gasLifts?.length > 1) {
      const lastGasLiftIndex = (bhpInputConfig?.wellboreConfig ?? []).findIndex(
        (item) => item?.datetime === gasLiftDates[gasLiftDates?.length - 1]
      );

      if (
        lastGasLiftIndex ===
        (bhpDefaultInputConfig?.modelInput?.wellboreConfig?.length ?? 0) - 1
      ) {
        gasLiftDates.pop();
        gasLiftDates = [
          ...gasLiftDates,
          prodRows[prodRows.length - 1]?.datetime,
        ];
      } else {
        const lastDate = moment(
          bhpInputConfig?.wellboreConfig[lastGasLiftIndex + 1]?.datetime
        )
          .add(-1, "days")
          .format(TimeFormat.datePicker);
        gasLiftDates = [...gasLiftDates, lastDate];
      }
      prodRows = prodRows.filter(
        (item) =>
          item?.datetime >= gasLiftDates[0] &&
          item?.datetime <= gasLiftDates[gasLiftDates?.length - 1]
      );
    }

    let updateErrors = [];

    const field = "qg_lift";
    const label = "Gas Lift Injection Rate";

    if (clearErrors) {
      updateErrors = updateErrors?.filter((er) => {
        let errCell = er.split(":")[1];
        return errCell !== field;
      });
    } else {
      prodRows?.forEach((item) => {
        let errorMsg = "";
        const id = item?.id;
        const newValue = parseFloat(id === rowId ? cellValue : item?.qg_lift);
        if (newValue < 0 || isNaN(newValue)) {
          errorMsg = `Invalid value for ${label}. Value must be >= 0`;
        }
        const hasCellError = isCellErrorExist(id, field);
        const cellError = `${id}:${field}`;

        if (!hasCellError && errorMsg !== "") {
          updateErrors?.push(`${cellError}:${errorMsg}`);
        }
      });
    }
    if (updateErrors?.length && gasLifts?.length) {
      setIsProdGasLiftError(true);
      // toastCustomErrorMessage(`Please check values of Production Data Gas lift injection rate between ${gasLiftDates[0]} and ${gasLiftDates[gasLiftDates?.length - 1]}`, { style: { width: "400px" } }, 2000)
      return true;
    } else {
      setIsProdGasLiftError(false);
      return false;
    }
    // setProdError(updateErrors);
  };

  const IsProd_Config_Date_Match = () => {
    let configDates = bhpInputConfig?.wellboreConfig
      ?.map((item) => item?.datetime)
      .sort((a, b) => (a > b ? 1 : -1));
    let prodRows = bhpInputConfig?.productionData?.length
      ? bhpInputConfig?.productionData?.map((item) => ({
          ...item,
          datetime: moment(item.datetime).format(TimeFormat.datePicker),
        }))
      : bhpInputConfig?.productionData?.datetime.map((datetime, index) => {
          const obj = {
            id: index + 1,
            datetime: moment.unix(datetime).utc().format(TimeFormat.datePicker),
            qg_lift: bhpInputConfig?.productionData?.qg_lift[index],
          };
          return obj;
        });

    const datetime = prodRows[0]?.datetime;
    const originalDate = datetime ? moment(datetime) : null;

    let dateEval;

    if (originalDate) {
      const newDate = originalDate.clone().add(1, "day");
      const formattedNewDate = newDate.format("YYYY-MM-DD");
      prodRows = prodRows?.sort((a, b) => (a.datetime > b.datetime ? 1 : -1));
      dateEval = configDates[0] === formattedNewDate;
    } else {
      console.log("No valid datetime found.");
    }

    if (!dateEval) {
      // toastCustomErrorMessage(`First production date and wellbore config date should match.`, { style: { width: "400px" } }, 2000)
    }
    return dateEval;
  };

  const handleModelApiCall = (saveDefault = false) => {
    const isFluidTypeError = Object.entries(fluidTypeInputs).some(
      ([key, value]) => value?.error !== ""
    );
    const isReferenceTypeError = Object.entries(referenceTypeInputs).some(
      ([key, value]) => value?.error !== ""
    );
    const isSurveyErrorExist = surveyError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isThermalErrorExist = thermalError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isGasLiftErrorExist = gasLiftError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isCasingErrorExist = casingError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isTubingErrorExist = tubingError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isNodeErrorExist = nodeError?.some(
      (cell) => cell.Gauge !== "" || cell.BHP !== ""
    );

    if (
      prodError?.length ||
      isFluidTypeError ||
      isReferenceTypeError ||
      isSurveyErrorExist ||
      isThermalErrorExist ||
      isGasLiftErrorExist ||
      isCasingErrorExist ||
      isTubingErrorExist ||
      isNodeErrorExist
    ) {
      if (isFluidTypeError || isReferenceTypeError) {
        setErrorMessage(true);
      }
      if (
        isSurveyErrorExist ||
        isThermalErrorExist ||
        isGasLiftErrorExist ||
        isCasingErrorExist ||
        isTubingErrorExist ||
        isNodeErrorExist
      ) {
        setWellboreErrorMessage(true);
      }
    } else {
      setShowLoader(true);
      let fluidTypeModelInput = {
        ...bhpInputConfig?.pvtParameter?.fluidInput[selectedFluidType?.value],
      };

      const referenceTypeModelInput = {
        ...bhpInputConfig?.pvtParameter?.refInput[selectedReference?.value],
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

      const { wellboreConfig, pvtParameter } = bhpInputConfig;
      let productionData = bhpInputConfig?.productionData;
      let prodObj = {
        datetime: [],
        qo: [],
        qw: [],
        qg: [],
        pres_casing: [],
        pres_tubing: [],
        // measured_bhp: [],
      };
      const isAnyGasLift = bhpInputConfig?.wellboreConfig?.some(
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
        //  tvd: [],
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
        compute_error_metrics: true,
        prod_data: { ...productionData },
        geothermal_gradient: geothermalData,
        compute_natural_flow_traverses: false,
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
            flow_type: item?.flow_type,
            casing: casingData,
            nodes: item?.nodes || wellboreConfig[0]?.nodes,
            tubing: item?.flow_type === "CasingFlow" ? null : tubingData,
          };
          if (item?.lift_method === "GasLift") {
            wellConfigObj = { ...wellConfigObj, gaslift_valve: gasLiftData };
          }
          return wellConfigObj;
        }),
        deviation_survey: deviationData,
        datetime_to_compute: null,
        compute_options: {
          ...bhpDefaultInputConfig?.modelInput?.compute_options,
        },
        pvt_model: {
          pvt_type: pvtParameter?.pvt_type,
          pvtParameter: {
            ...fluidTypeModelInput,
            corr_method: { ...pvtParameter?.correlations },
          },
        },
        settings: { ...bhpDefaultInputConfig?.modelInput?.settings },
      };
      getBHPDetails(inputRequestObj)
        .then((response) => {
          setModelOutputData(response?.data);
          if (saveDefault) {
            setDefaultModelOutputData(response?.data);
          }
          setSelectedTab(Constants.OUTPUT_TYPE_MENU);
          setShowLoader(false);
          setShowModel(false);
          setCalculatedInputConfig({ ...bhpInputConfig });
          if (
            response?.data?.node_values?.length >= 1 &&
            response?.data?.node_values[1]?.pres?.length
            // productionData?.measured_bhp?.length
          ) {
            handleErrorMetricsApi(
              // productionData?.measured_bhp,
              response?.data?.node_values[1]?.pres
            );
          }
        })
        .catch((error) => {
          setModelOutputData({});
          setShowLoader(false);
          setShowLoader(false);
        });
    }
  };

  const handleResetModelInput = () => {
    setFluidTypeInputs({ ...defaultFluidTypeInputs });
    setSelectedFluidType(
      fluidTypeOptions?.find(
        (item) =>
          item.value ===
          bhpDefaultInputConfig?.modelInput?.pvtParameter?.fluidType
      )
    );
    setIsWaterChecked(
      bhpDefaultInputConfig?.modelInput?.pvtParameter?.isWaterChecked
    );
    setReferenceTypeInputs({
      ...defaultReferenceInputs[
        bhpDefaultInputConfig?.modelInput?.pvtParameter?.refType
      ],
    });
    setSelectedReference(
      referenceTypeOptions?.find(
        (item) =>
          item.value ===
          bhpDefaultInputConfig?.modelInput?.pvtParameter?.refType
      )
    );
    setCorrelationTypeInputs({
      ...bhpDefaultInputConfig?.modelInput?.pvtParameter?.correlations,
    });
    setModelOutputData({ ...defaultModelOutputData });
    setTraverseOutput({ ...defaultTraverseOutput });
    setBHPInputConfig({
      ...bhpDefaultInputConfig?.modelInput,
      wellboreConfig: bhpDefaultInputConfig?.modelInput?.wellboreConfig
        .map((item) => ({
          ...item,
          datetime: moment.unix(item.datetime).format(TimeFormat.datePicker),
        }))
        .sort((a, b) => (a.datetime > b.datetime ? 1 : -1)),
    });
    setErrorMessage(false);
    setIsProdGasLiftError(false);
    setWellboreErrorMessage(false);
    handleResetWellboreErrors();
    setProdError([]);
    setShowConfirmationDialog(false);
    setShowCancelDialog(false);
    setShowModel(false);
    setEnableReset(false);
    setIsInputChanged(false);
    let latestConfigDate =
      bhpDefaultInputConfig?.modelInput?.wellboreConfig?.sort((a, b) =>
        moment.unix(a.datetime).format(TimeFormat.datePicker) >
        moment.unix(b.datetime).format(TimeFormat.datePicker)
          ? 1
          : -1
      );
    latestConfigDate = moment
      .unix(latestConfigDate[latestConfigDate?.length - 1].datetime)
      .format(TimeFormat.datePicker);
    setSelectedConfigDate(latestConfigDate);
    let lastDate =
      bhpDefaultInputConfig?.modelInput?.productionData?.datetime[
        bhpDefaultInputConfig?.modelInput?.productionData?.datetime?.length - 1
      ];
    setTraverseCall(false);
    setClickedX([lastDate]);
  };

  const handleResetWellboreErrors = () => {
    setNodeError((prevErrors) =>
      prevErrors.map((item) => ({
        ...item,
        Gauge: "",
        BHP: "",
      }))
    );
    setSurveyError((prevErrors) =>
      prevErrors.map((item) => ({
        ...item,
        cellErrors: [],
      }))
    );
    setThermalError((prevErrors) =>
      prevErrors.map((item) => ({
        ...item,
        cellErrors: [],
      }))
    );
    setGasLiftError((prevErrors) =>
      prevErrors.map((item) => ({
        ...item,
        cellErrors: [],
      }))
    );
    setCasingError((prevErrors) =>
      prevErrors.map((item) => ({
        ...item,
        cellErrors: [],
      }))
    );
    setTubingError((prevErrors) =>
      prevErrors.map((item) => ({
        ...item,
        cellErrors: [],
      }))
    );
  };

  const handleCancelModelInput = () => {
    setFluidTypeInputs({ ...defaultFluidTypeInputs });
    setSelectedFluidType(
      fluidTypeOptions?.find(
        (item) => item.value === calculatedInputConfig?.pvtParameter?.fluidType
      )
    );
    setIsWaterChecked(calculatedInputConfig?.pvtParameter?.isWaterChecked);
    setReferenceTypeInputs({
      ...defaultReferenceInputs[calculatedInputConfig?.pvtParameter?.refType],
    });
    setSelectedReference(
      referenceTypeOptions?.find(
        (item) => item.value === calculatedInputConfig?.pvtParameter?.refType
      )
    );
    setCorrelationTypeInputs({
      ...calculatedInputConfig?.pvtParameter?.correlations,
    });
    setBHPInputConfig({
      ...calculatedInputConfig,
    });
    setErrorMessage(false);
    setIsProdGasLiftError(false);
    setWellboreErrorMessage(false);
    setShowConfirmationDialog(false);
    setShowCancelDialog(false);
    setShowModel(false);
    setEnableReset(false);
    setIsInputChanged(false);
    let latestConfigDate = calculatedInputConfig?.wellboreConfig?.sort((a, b) =>
      moment(a.datetime).format(TimeFormat.datePicker) >
      moment(b.datetime).format(TimeFormat.datePicker)
        ? 1
        : -1
    );
    latestConfigDate = moment(
      latestConfigDate[latestConfigDate?.length - 1].datetime
    ).format(TimeFormat.datePicker);
    setSelectedConfigDate(latestConfigDate);
    let lastDate =
      calculatedInputConfig?.productionData?.datetime[
        calculatedInputConfig?.productionData?.datetime?.length - 1
      ];
    setTraverseCall(false);
    setClickedX([lastDate]);
    handleResetWellboreErrors();
    setProdError([]);
  };

  const handleImportedFileInputs = (fileContent) => {
    const fluidTypeOption = fluidTypeOptions?.find(
      (item) => item.value === fileContent?.modelInput?.pvtParameter?.fluidType
    );
    const refTypeOption = referenceTypeOptions?.find(
      (item) => item.value === fileContent?.modelInput?.pvtParameter?.refType
    );
    if (fluidTypeOption?.value && refTypeOption?.value) {
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
      const pvtParameter = {
        ...bhpDefaultInputConfig?.modelInput,
        pvtParameter: {
          ...bhpDefaultInputConfig?.modelInput?.pvtParameter,
          fluidType: fileContent?.modelInput?.pvtParameter?.fluidType,
          isWaterChecked: fileContent?.modelInput?.pvtParameter?.isWaterChecked,
          refType: fileContent?.modelInput?.pvtParameter?.refType,
          fluidInput: {
            ...bhpDefaultInputConfig?.modelInput?.pvtParameter?.fluidInput,
            [fileContent?.modelInput?.pvtParameter?.fluidType]: {
              ...roundedFluidInput,
            },
          },
          refInput: {
            ...bhpDefaultInputConfig?.modelInput?.pvtParameter?.refInput,
            [fileContent?.modelInput?.pvtParameter?.refType]: {
              ...fileContent?.modelInput?.pvtParameter?.refInput,
            },
          },
          correlations: {
            ...fileContent?.modelInput?.pvtParameter?.correlations,
          },
        },
        productionData: { ...fileContent?.modelInput?.productionData },
        compute_options: {
          ...bhpDefaultInputConfig?.modelInput?.compute_options,
        },
        settings: { ...bhpDefaultInputConfig?.modelInput?.settings },
        wellboreConfig: [...fileContent?.modelInput?.wellboreConfig],
      };
      setBHPInputConfig(pvtParameter);
      // setSelectedConfigDate(fileContent?.modelInput?.wellboreConfig[0].datetime);
      setFluidTypeInputs({ ...defaultFluidTypeInputs });
      setSelectedFluidType(fluidTypeOption);
      setIsWaterChecked(fileContent?.modelInput?.pvtParameter?.isWaterChecked);
      setReferenceTypeInputs({
        ...defaultReferenceInputs[
          `${fileContent?.modelInput?.pvtParameter?.refType}`
        ],
      });
      setSelectedReference(refTypeOption);
      setCorrelationTypeInputs(
        fileContent?.modelInput?.pvtParameter?.correlations
      );
      setErrorMessage(false);
      setIsProdGasLiftError(false);
      setWellboreErrorMessage(false);
      // handleResetWellboreErrors();
      setProdError([]);
      setEnableReset(true);
      setModelOutputData({});
      // toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
    } else {
      // toastCustomErrorMessage(Constants.UPLOAD_FILE_FORMAT_ERROR_MESSAGE, { style: { width: "400px" } })
    }
  };

  const handleErrorMessage = () => {
    const isFluidTypeError = Object.entries(fluidTypeInputs).some(
      ([key, value]) => value?.error !== ""
    );
    const isReferenceTypeError = Object.entries(referenceTypeInputs).some(
      ([key, value]) => value?.error !== ""
    );
    setErrorMessage(isFluidTypeError || isReferenceTypeError);
  };

  useEffect(() => {
    handleErrorMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fluidTypeInputs, referenceTypeInputs]);

  const handleWellboreErrorMessage = () => {
    const isSurveyErrorExist = surveyError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isThermalErrorExist = thermalError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isGasLiftErrorExist = gasLiftError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isCasingErrorExist = casingError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isTubingErrorExist = tubingError?.some(
      (cell) => cell.cellErrors?.length > 0
    );
    const isNodeErrorExist = nodeError?.some(
      (cell) => cell.Gauge !== "" || cell.BHP !== ""
    );
    setWellboreErrorMessage(
      isSurveyErrorExist ||
        isThermalErrorExist ||
        isGasLiftErrorExist ||
        isCasingErrorExist ||
        isCasingErrorExist ||
        isTubingErrorExist ||
        isNodeErrorExist
    );
  };

  useEffect(() => {
    handleWellboreErrorMessage();
  }, [
    surveyError,
    thermalError,
    gasLiftError,
    casingError,
    tubingError,
    nodeError,
  ]);

  useEffect(() => {
    handleModelApiCall(true);
    if (!selectedWell2?.value) {
      setSelectedWell2(defaultWellOptions[0]);
    }
  }, []);

  useEffect(() => {
    const reference = selectedReference?.value;
    const referenceInputs = defaultReferenceInputs[reference];
    setReferenceTypeInputs({ ...referenceInputs });
  }, [defaultReferenceInputs, selectedReference]);

  const handleBHPInputImport = (event) => {
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
        // toastCustomErrorMessage(Constants.JSON_FILE_ERROR_MESSAGE, { style: { width: "400px" } }, 2000);
      }
      event.target.value = "";
    } else {
      // toastCustomErrorMessage(Constants.UPLOAD_FILE_ERROR_MESSAGE, { style: { width: "400px" } }, 2000);
    }
  };

  const handleBHPInputExport = () => {
    // Beautify json string with indentation and line breaks
    const pvtParameter = {
      modelInput: {
        ...bhpInputConfig,
        pvtParameter: {
          ...bhpInputConfig?.pvtParameter,
          fluidInput: {
            ...bhpInputConfig?.pvtParameter?.fluidInput[
              selectedFluidType?.value
            ],
          },
          refInput: {
            ...bhpInputConfig?.pvtParameter?.refInput[selectedReference?.value],
          },
        },
      },
      modelOutput: {},
    };
    delete pvtParameter?.modelInput?.settings;
    delete pvtParameter?.modelInput?.compute_options;
    const beautifiedJSON = JSON.stringify(pvtParameter, null, 2);
    exportToJson(beautifiedJSON, Constants.EXPORT_BHP_INPUT_FILE_NAME);
  };

  const handleShowCancelDialog = (show) => {
    if (isInputChanged) {
      setShowCancelDialog(show);
    } else {
      setShowCancelDialog(false);
      setShowModel(false);
    }
  };

  const handleShowResetDialog = (show) => {
    if (isInputChanged) {
      setShowConfirmationDialog(show);
    } else {
      setShowConfirmationDialog(false);
      setShowModel(false);
    }
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

  const handleBhpInputConfig = (config) => {
    setTraverseCall(false);
    setBHPInputConfig(config);
  };

  useEffect(() => {
    if (bhpInputConfig.wellboreConfig.length <= 0) {
      setWellboreErrorMessage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bhpInputConfig]);

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
      // measured_bhp: [],
      qg_lift: [],
      pwf: [],
      uptime: [],
      elapsed_time: [],
    };
    const input = {
      ...bhpInputConfig,
      pvtParameter: {
        ...bhpInputConfig.pvtParameter,
        fluidInput: updatedFluidInput,
      },
      productionData: prodObj,
      wellboreConfig: [],
    };
    setTraverseCall(false);
    setShowClearConfirmationDialog(false);
    setIsCleared(true);
    setModelOutputData({});
    setErrorMetricsData({});
    setClickedX([]);
    setBHPInputConfig(input);
  };

  const bhpInputSection = useMemo(
    () => {
      if (selectedInputSection === Constants.BHP_Inputs) {
        return (
          <BHPInputs
            fluidTypeOptions={fluidTypeOptions}
            referenceTypeOptions={referenceTypeOptions}
            selectedFluidType={selectedFluidType}
            isWaterChecked={isWaterChecked}
            selectedReference={selectedReference}
            fluidTypeInputs={fluidTypeInputs}
            referenceTypeInputs={referenceTypeInputs}
            enableReset={enableReset}
            bhpInputConfig={bhpInputConfig}
            setBHPInputConfig={handleBhpInputConfig}
            setEnableReset={setEnableReset}
            setFluidTypeInputs={setFluidTypeInputs}
            setSelectedFluidType={setSelectedFluidType}
            setIsWaterChecked={setIsWaterChecked}
            setSelectedReference={setSelectedReference}
            setReferenceTypeInputs={setReferenceTypeInputs}
            correlationTypeOptions={correlationTypeOptions}
            correlationTypeInputs={correlationTypeInputs}
            setCorrelationTypeInputs={setCorrelationTypeInputs}
            setIsInputChanged={setIsInputChanged}
            showReference={false}
          />
        );
      } else if (selectedInputSection === Constants.BHP_Production) {
        return (
          <BHPProduction
            data={bhpInputConfig}
            selectedInputSection={selectedInputSection}
            setBHPInputConfig={handleBhpInputConfig}
            setIsInputChanged={setIsInputChanged}
            isInputChanged={isInputChanged}
            prodError={prodError}
            setProdError={setProdError}
            columnOptions={prodColumnOptions.columns}
            handleGasLiftInputChange={IsAnyProd_GasLift_Error}
          />
        );
      } else if (selectedInputSection === Constants.BHP_WellboreConfig) {
        return (
          <BHPWellboreConfig
            bhpInputConfig={bhpInputConfig}
            selectedConfigDate={selectedConfigDate}
            selectedInputSection={selectedInputSection}
            flowTypeOptions={flowTypeOptions}
            liftTypeOptions={liftTypeOptions}
            flowCorrelationOptions={flowCorrelationOptions}
            setSelectedConfigDate={setSelectedConfigDate}
            setBHPInputConfig={handleBhpInputConfig}
            setIsInputChanged={setIsInputChanged}
            isInputChanged={isInputChanged}
            nodeError={nodeError}
            setNodeError={setNodeError}
            surveyError={surveyError}
            setSurveyError={setSurveyError}
            thermalError={thermalError}
            setThermalError={setThermalError}
            gasLiftError={gasLiftError}
            setGasLiftError={setGasLiftError}
            casingError={casingError}
            setCasingError={setCasingError}
            tubingError={tubingError}
            setTubingError={setTubingError}
            focusElem={focusElem}
            setFocusElem={setFocusElem}
            handleNewConfigDateErrors={handleNewConfigDateErrors}
            lastRowIndex={lastRowIndex}
            setLastRowIndex={setLastRowIndex}
            scrollIndex={scrollIndex}
            setScrollIndex={setScrollIndex}
            // handleProd_GasLift={handleProd_GasLift}
          />
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedInputSection,
      nodeError,
      surveyError,
      prodError,
      thermalError,
      gasLiftError,
      casingError,
      tubingError,
      errorMessage,
      fluidTypeInputs,
      selectedFluidType,
      isWaterChecked,
      referenceTypeInputs,
      selectedReference,
      bhpInputConfig,
      selectedConfigDate,
    ]
    // [selectedInputSection, focusElem, lastRowIndex, scrollIndex, nodeError, surveyError, prodError, thermalError, gasLiftError, casingError, tubingError, errorMessage, fluidTypeInputs, selectedFluidType, isWaterChecked, referenceTypeInputs, selectedReference, correlationTypeInputs, bhpInputConfig, selectedConfigDate]
  );

  const bhpOutputSection = useMemo(() => {
    return (
      <Box className={classes.chartContainerV2}>
        <BHPOutput
          selectedTab={selectedTab}
          selectedReference={selectedReference}
          modelOutputData={modelOutputData}
          errorMetricsData={errorMetricsData}
          outputCharts={outputCharts}
          // defaultChartConfig={options}
          selectedFluidType={selectedFluidType}
          isWaterChecked={isWaterChecked}
          // selectedTheme={currentTheme}
          showCancelDialog={showCancelDialog}
          bhpInputConfig={bhpInputConfig}
          timePickerWorkFlow={timePickerWorkFlow}
          referenceTypeInputs={referenceTypeInputs}
          defaultFluidTypeInputs={defaultFluidTypeInputs}
          showLoader={showLoader}
          clickedX={clickedX}
          setClickedX={setClickedX}
          traverseCall={traverseCall}
          setTraverseCall={setTraverseCall}
          selectedConfigDate={selectedConfigDate}
          traverseOutput={traverseOutput}
          setTraverseOutput={setTraverseOutput}
          defaultTraverseOutput={defaultTraverseOutput}
          setDefaultTraverseOutput={setDefaultTraverseOutput}
          isCleared={isCleared}
          isPvtParameterError={isPvtParameterError}
          isWellboreConfigError={isWellboreConfigError}
        />
      </Box>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTab,
    selectedReference,
    showLoader,
    errorMetricsData,
    modelOutputData,
    traverseOutput,
    defaultTraverseOutput,
    clickedX,
    bhpInputConfig,
    showCancelDialog,
    selectedFluidType.value,
    isWaterChecked,
  ]);

  const handleTabSelection = (tabId, inputSection = "", Boolean = "false") => {
    setSelectedTab(tabId);
    setSelectedInputSection(inputSection);
    setShowModel(Boolean);
  };

  const validateParameter = (label, paramName, min, max, value, setError) => {
    let error = "";

    if (value < min || value > max) {
      error = `${label} value should be between ${min} and ${max}`;
    }

    setError((prevFluidTypeInputs) => ({
      ...prevFluidTypeInputs,
      [paramName]: {
        ...prevFluidTypeInputs[paramName],
        error,
      },
    }));
    setIsPvtParameterError(true);
    return !!error;
  };

  const isPvtParameters_Error = () => {
    const oilGravConfig = {
      label: defaultFluidTypeInputs?.oilGrav?.label,
      paramName: "oilGrav",
      min: defaultFluidTypeInputs.oilGrav.min,
      max: defaultFluidTypeInputs.oilGrav.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.oilGrav,
      setError: setFluidTypeInputs,
    };

    const gasGravConfig = {
      label: defaultFluidTypeInputs?.gasGrav?.label,
      paramName: "gasGrav",
      min: defaultFluidTypeInputs.gasGrav.min,
      max: defaultFluidTypeInputs.gasGrav.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.gasGrav,
      setError: setFluidTypeInputs,
    };

    const rsiConfig = {
      label: defaultFluidTypeInputs?.rsi?.label,
      paramName: "rsi",
      min: defaultFluidTypeInputs.rsi.min,
      max: defaultFluidTypeInputs.rsi.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.rsi,
      setError: setFluidTypeInputs,
    };

    const watsalinityConfig = {
      label: defaultFluidTypeInputs?.wat_salinity?.label,
      paramName: "wat_salinity",
      min: defaultFluidTypeInputs.wat_salinity.min,
      max: defaultFluidTypeInputs.wat_salinity.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.wat_salinity,
      setError: setFluidTypeInputs,
    };

    const y_co2Config = {
      label: defaultFluidTypeInputs?.y_co2?.label,
      paramName: "y_co2",
      min: defaultFluidTypeInputs.y_co2.min,
      max: defaultFluidTypeInputs.y_co2.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.y_co2,
      setError: setFluidTypeInputs,
    };

    const y_h2sConfig = {
      label: defaultFluidTypeInputs?.y_h2s?.label,
      paramName: "y_h2s",
      min: defaultFluidTypeInputs.y_h2s.min,
      max: defaultFluidTypeInputs.y_h2s.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.y_h2s,
      setError: setFluidTypeInputs,
    };

    const y_n2Config = {
      label: defaultFluidTypeInputs?.y_n2?.label,
      paramName: "y_n2",
      min: defaultFluidTypeInputs.y_n2.min,
      max: defaultFluidTypeInputs.y_n2.max,
      value: bhpInputConfig?.pvtParameter?.fluidInput?.liveOil?.y_n2,
      setError: setFluidTypeInputs,
    };

    const error1 = validateParameter(
      oilGravConfig.label,
      oilGravConfig.paramName,
      oilGravConfig.min,
      oilGravConfig.max,
      oilGravConfig.value,
      oilGravConfig.setError
    );
    const error2 = validateParameter(
      gasGravConfig.label,
      gasGravConfig.paramName,
      gasGravConfig.min,
      gasGravConfig.max,
      gasGravConfig.value,
      gasGravConfig.setError
    );
    const error3 = validateParameter(
      rsiConfig.label,
      rsiConfig.paramName,
      rsiConfig.min,
      rsiConfig.max,
      rsiConfig.value,
      rsiConfig.setError
    );
    const error4 = validateParameter(
      watsalinityConfig.label,
      watsalinityConfig.paramName,
      watsalinityConfig.min,
      watsalinityConfig.max,
      watsalinityConfig.value,
      watsalinityConfig.setError
    );
    const error5 = validateParameter(
      y_co2Config.label,
      y_co2Config.paramName,
      y_co2Config.min,
      y_co2Config.max,
      y_co2Config.value,
      y_co2Config.setError
    );
    const error6 = validateParameter(
      y_h2sConfig.label,
      y_h2sConfig.paramName,
      y_h2sConfig.min,
      y_h2sConfig.max,
      y_h2sConfig.value,
      y_h2sConfig.setError
    );
    const error7 = validateParameter(
      y_n2Config.label,
      y_n2Config.paramName,
      y_n2Config.min,
      y_n2Config.max,
      y_n2Config.value,
      y_n2Config.setError
    );

    return error1 || error2 || error3 || error4 || error5 || error6 || error7;
  };

  const isWellboreConfig_Error = () => {
    const configIndex = bhpInputConfig?.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );

    if (configIndex === -1) {
      return;
    }

    const casingValues = Array.isArray(
      bhpInputConfig?.wellboreConfig[configIndex]?.casing
    )
      ? bhpInputConfig?.wellboreConfig[configIndex]?.casing
      : [bhpInputConfig?.wellboreConfig[configIndex]?.casing];

    const tubingValues = Array.isArray(
      bhpInputConfig?.wellboreConfig[configIndex]?.tubing
    )
      ? bhpInputConfig?.wellboreConfig[configIndex]?.tubing
      : [bhpInputConfig?.wellboreConfig[configIndex]?.tubing];

    const field = "d_inner";
    const errorMsg = "Inner Diameter value should be greater than 0";
    const tubingErrorMsg =
      "Inner Diameter value should be greater than 0 or less than Outer Diameter";

    const casingErrorIndex = casingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const casingErrors = casingValues
      .filter((casingObject) => casingObject.d_inner < 1)
      .map((casingObject) => `${casingObject.id ?? 1}:${field}:${errorMsg}`);

    if (casingErrors.length > 0) {
      const updateCasingErrors = [...casingError];
      const casingErrorList = [
        ...casingError[casingErrorIndex]?.cellErrors,
        ...casingErrors,
      ];
      updateCasingErrors[casingErrorIndex] = {
        ...casingError[casingErrorIndex],
        cellErrors: casingErrorList,
      };
      setCasingError(updateCasingErrors);
      setIsWellboreConfigError(true);
    }

    const tubingErrorIndex = tubingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const tubingErrors = tubingValues
      .filter((tubingObject) => tubingObject.d_inner < 1)
      .map(
        (tubingObject) => `${tubingObject.id ?? 1}:${field}:${tubingErrorMsg}`
      );

    if (tubingErrors.length > 0) {
      const updateTubingErrors = [...tubingError];
      const tubingErrorList = [
        ...tubingError[tubingErrorIndex]?.cellErrors,
        ...tubingErrors,
      ];
      updateTubingErrors[tubingErrorIndex] = {
        ...tubingError[tubingErrorIndex],
        cellErrors: tubingErrorList,
      };
      setTubingError(updateTubingErrors);
      setIsWellboreConfigError(true);
    }
    return casingErrors.length > 0 || tubingErrors.length > 0;
  };

  const handleCalculate = () => {
    const isError = IsAnyProd_GasLift_Error();
    const isDateMatch = IsProd_Config_Date_Match();
    const hasErrors = isPvtParameters_Error();
    const isWellboreError = isWellboreConfig_Error();
    if (!isError && isDateMatch) {
      let productionData = bhpInputConfig?.productionData;
      const prodObj = {
        datetime: [],
      };
      if (productionData?.length) {
        productionData?.forEach((item) => {
          Object.keys(prodObj).forEach((key) => {
            if (key === "datetime") {
              prodObj[key].push(moment(item[key]).valueOf() / 1000);
            }
          });
        });
        productionData = prodObj;
      }
      let lastDate =
        productionData?.datetime[productionData?.datetime?.length - 1];
      setTraverseCall(true);
      setClickedX([lastDate]);
      if (isCleared) {
        if (!hasErrors || !isWellboreError) {
          handleModelApiCall();
        }
      } else {
        handleModelApiCall();
      }
    }
    // handleModelApiCall();
  };

  useEffect(() => {
    let prodRows = bhpInputConfig?.productionData?.length;
    if (prodRows === 1) {
      setProdError([]);
    }
  }, [bhpInputConfig]);

  useEffect(() => {
    if (showLoader) {
      const rows =
        bhpInputConfig?.productionData?.length ||
        bhpInputConfig?.productionData?.datetime?.length;
      const years = Math.round(rows / 365);
      const timeout = years * 3.6 * 1000;
      const loaderTimeout = setTimeout(() => {
        setShowLoader(false);
      }, timeout);
      return () => clearTimeout(loaderTimeout);
    }
  }, [showLoader]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInlocal, setApiKeyInlocal] = useState(
    localStorage.getItem("apiKey")
  );

  useEffect(() => {
    if (!apiKeyInlocal) {
      setIsSettingsOpen(true);
    }
  }, []);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Container className={classes.mainContainer} maxWidth={false}>
      <Box className={classes.header}>
        <Box display="flex" alignItems="center">
          <img
            src={XectaIcon}
            style={{ height: 23, width: 23, marginRight: 10 }}
          />
          <PageTitleV2
            regularText={Constants.BHP_Calculator}
            highlightText=""
          />
          {/* <Header title="BHP" /> */}
        </Box>
        <Box display="flex" alignItems="center" className={classes.groupsIcone}>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            onClick={() =>
              handleTabSelection(
                Constants.INPUT_TYPE_MENU,
                Constants.BHP_Inputs
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
            variant="text"
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
              onChange={handleBHPInputImport}
            />
          </Button>
          <IconButton
            sx={{ padding: "0px 3px 3px 3px" }}
            className={clsx(classes.animationHover, classes.fileButton)}
            onClick={handleBHPInputExport}
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
        {/* <SettingsButton /> */}
        <IconButton onClick={handleOpenSettings}>
          <Settings fontSize="large" />
        </IconButton>
        {/* <SettingsButton /> */}
        {/* <SettingsContent /> */}
        <SettingsPopUpContent
          isSettingsOpen={isSettingsOpen}
          handleCloseSettings={handleCloseSettings}
        />
        {/* <SettingsContent /> */}
        {/* <Appdrawer /> */}
        <Box
          overflow="hidden"
          mr={1.5}
          mt={0.8}
          style={{ cursor: "pointer" }}
          onClick={handlePopoverOpen}
        >
          <Tooltip title="Apps">
            <Apps fontSize="large" />
          </Tooltip>
        </Box>
        <AppsDrawer
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
        />
        {/* <Appdrawer /> */}
      </Box>
      <Grid
        className={classes.chartWrapper}
        container
        direction="row"
        justifyContent={"space-between"}
      >
        {bhpOutputSection}
      </Grid>
      <Dialog open={Boolean(showModel)}>
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
                <Typography variant="body3Large">{Constants.INPUTS}</Typography>
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
                      Constants.BHP_Inputs,
                      true
                    )
                  }
                >
                  <ThermostatIcon className={classes.containerMenuIcon} />

                  {/* <ListItemText
                    primary={Constants.BHP_INPUTS}
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                  /> */}
                  <Typography>{Constants.BHP_INPUTS}</Typography>
                </ListItem>
              </List>
              <List className={classes.menu}>
                <ListItem
                  className={clsx(classes.menuItem, {
                    active: selectedInputSection === Constants.BHP_Production,
                    error: prodError?.length || isProdGasLiftError,
                  })}
                  onClick={() =>
                    handleTabSelection(
                      Constants.INPUT_TYPE_MENU,
                      Constants.BHP_Production,
                      true
                    )
                  }
                >
                  <ThermostatIcon className={classes.containerMenuIcon} />

                  {/* <ListItemText
                    primary={Constants.BHP_Production}
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                  /> */}
                  <Typography>{Constants.BHP_Production}</Typography>
                </ListItem>
              </List>
              <List className={classes.menu}>
                <ListItem
                  className={clsx(classes.menuItem, {
                    active:
                      selectedInputSection === Constants.BHP_WellboreConfig,
                    error: wellboreErrorMessage,
                  })}
                  onClick={() =>
                    handleTabSelection(
                      Constants.INPUT_TYPE_MENU,
                      Constants.BHP_WellboreConfig,
                      true
                    )
                  }
                >
                  <ThermostatIcon className={classes.containerMenuIcon} />

                  {/* <ListItemText
                    primary={Constants.BHP_WellboreConfig}
                    className={
                      menuOpen
                        ? classes.menuLabel
                        : `${classes.menuLabel} visible`
                    }
                  /> */}
                  <Typography>{Constants.BHP_WellboreConfig}</Typography>
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
                  onClick={handleCalculate}
                  style={{ marginTop: "5px" }}
                  className={classes.calculateButton}
                  disabled={
                    errorMessage ||
                    wellboreErrorMessage ||
                    prodError?.length > 0 ||
                    isProdGasLiftError
                  }
                >
                  <Typography>{Constants.CALCULATE}</Typography>
                </Button>
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box className={classes.mainContent}>{bhpInputSection}</Box>
            </Box>
          </Box>
        </div>
      </Dialog>
      {Boolean(showConfirmationDialog) && (
        <ConfirmationPopup
          open={showConfirmationDialog}
          handleClose={() => handleShowResetDialog(false)}
          handleConfirm={handleResetModelInput}
          warnMessage={Constants.RESET_MESSAGE}
        />
      )}

      {Boolean(showClearConfirmationDialog) && (
        <ConfirmationPopup
          open={Boolean(showClearConfirmationDialog)}
          handleClose={() => handleShowClearDialog(false)}
          handleConfirm={handleClearModelInput}
          warnMessage={Constants.CLEAR_MESSAGE}
          action={true}
        />
      )}

      {Boolean(showVideoPlayerDialog) && (
        <VideoPlayer
          videoUrl={youtubeVideoUrl}
          open={showVideoPlayerDialog}
          handleClose={() => handleShowVideoPlayerDialog(false)}
        />
      )}
      {Boolean(showCancelDialog) && isInputChanged && (
        <ConfirmationPopup
          open={showCancelDialog}
          handleClose={() => {
            handleShowCancelDialog(false);
            setShowCancelDialog(false);
          }}
          handleConfirm={handleCancelModelInput}
          warnMessage={Constants.CANCEL_MESSAGE}
        />
      )}
    </Container>
  );
};

export default Home;
