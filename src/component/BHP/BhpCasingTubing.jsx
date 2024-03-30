import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Typography, Tooltip, IconButton, Button } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import FusionSelect from "../Select";
import * as Constants from "../constant/ModelConstants";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { Edit, Delete, DeleteForever, Publish } from "@mui/icons-material";
import {
  toastCustomErrorMessage,
  toastCustomSuccessMessage,
} from "../../utils/toast";
import bhpDefaultInputConfig from "./BhpModelInput.json";
import { useLocation } from "react-router-dom";
import FileDownload from "@mui/icons-material/FileDownload";
import { exportDateTimeCSV as exportCsv } from "../../utils/exportCSV";
import ConfirmationPopup from "../ConfirmationPopup";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { useTheme } from "@mui/system";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
]);

const useStyles = makeStyles()((theme) => ({
  accordionHeader: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    background: theme.palette.background.screen,
    fontSize: "20px",
    height: "38px",
  },
  actionButtons: {
    backgroundColor: "red",
    "& button": {
      margin: theme.spacing(0.5),
    },
  },
  customDataGrid: {
    background: theme.palette.background.screen,
    overflow: "hidden",
    "& .MuiDataGrid-columnHeader": {
      background: theme.palette.background.header,
      color: theme.palette.text,
    },
    "& .MuiDataGrid-cell--editing": {
      backgroundColor: theme.palette.background.active + "!important",
    },
    "& .MuiDataGrid-cell--editable": {
      "&.error": {
        border: "2px solid red !important",
      },
    },
  },
  customDataGridDisable: {
    background: theme.palette.background.screen,
    overflow: "hidden",
    "& .MuiDataGrid-columnHeader": {
      background: theme.palette.background.header,
      color: theme.palette.text,
    },
    "& .MuiDataGrid-cell--editing": {
      backgroundColor: theme.palette.background.header + "!important",
    },
    pointerEvents: "none",
    opacity: 0.5,
  },
  highlightedRow: {
    background: theme.palette.background.header,
  },
  headerName: {
    color: theme.palette.text,
    fontWeight: 600,
  },
  fluidTypeRow: {
    display: "flex",
    // paddingTop: "24px",
    flexDirection: "row",
    "@media (max-width: 1333px)": {
      flexDirection: "column",
    },
  },
  fluidType: {
    "@media (max-width: 1333px)": {
      marginTop: -30,
      marginLeft: 140,
      padding: 2,
    },
    // "@media (max-width: 690px)": {
    //     flexDirection: "row",
    //     paddingLeft: "16px"
    // }
  },
  propSelector: {
    marginTop: "4px",
    "@media (max-width: 1333px)": {
      width: 200,
    },
  },
  addRow: {
    height: 35,
    marginTop: 0.5,
    display: "inline-block",
    padding: "unset",
    borderRadius: "100%",
    minWidth: 25,
    fontWeight: 600,
    textTransform: "none",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      color: theme.palette.primary.main,
      height: "35px",
      width: "35px",
    },
    "&:hover": {
      backgroundColor: theme.palette.background.header,
    },
    [theme.breakpoints.down("900")]: {
      marginTop: 10,
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
}));

const BHPCasingTubing = (props) => {
  const {
    isInputChanged,
    flowTypeOptions,
    inputValues,
    liftTypeOptions,
    casingError,
    setCasingError,
    tubingError,
    setTubingError,
    gasLiftError,
    setGasLiftError,
    flowCorrelationOptions,
    bhpInputConfig,
    selectedConfigDate,
    setIsInputChanged,
    setBHPInputConfig,
  } = props;
  const { classes } = useStyles();
  const theme = useTheme();
  const tubingRef = useRef();
  const casingRef = useRef();
  const pageRoute = useLocation();
  const casingValues = bhpInputConfig.wellboreConfig?.find(
    (item) => item?.datetime === selectedConfigDate
  )?.casing;
  const casingRowsInitial = casingValues?.length
    ? casingValues
    : casingValues?.md?.map((item, index) => ({
        id: index + 1,
        md: item,
        d_inner: casingValues?.d_inner[index],
        d_outer: casingValues?.d_outer[index],
        rough_inner: casingValues?.rough_inner[index],
        rough_outer: casingValues?.rough_outer[index],
        editMode: true,
      }));

  const [liftType, setLiftType] = useState(
    bhpInputConfig.wellboreConfig?.find(
      (item) => item?.datetime === selectedConfigDate
    )?.lift_method
  );
  const [flowType, setFlowType] = useState(
    bhpInputConfig.wellboreConfig?.find(
      (item) => item?.datetime === selectedConfigDate
    )?.flow_type
  );
  const [flowCorrelation, setFlowCorrelation] = useState(
    bhpInputConfig.wellboreConfig?.find(
      (item) => item?.datetime === selectedConfigDate
    )?.flow_correlation
  );
  const [casingRows, setCasingRows] = useState(casingRowsInitial || []);
  const [casingTrue, setCasingTrue] = useState(false);
  const tubingTrue = false;
  const tubingValues = bhpInputConfig.wellboreConfig?.find(
    (item) => item?.datetime === selectedConfigDate
  )?.tubing;
  const tubingRowsInitial = tubingValues?.length
    ? tubingValues
    : tubingValues?.md?.map((item, index) => ({
        id: index + 1,
        md: item,
        d_inner: tubingValues.d_inner[index],
        d_outer: tubingValues.d_outer[index],
        rough_inner: tubingValues.rough_inner[index],
        rough_outer: tubingValues.rough_outer[index],
        editMode: true,
      }));

  const [tubingRows, setTubingRows] = useState(tubingRowsInitial || []);
  const [tableError, setTableError] = useState([]);
  const [tubingTableError, setTubingTableError] = useState([]);
  const [
    showCasingClearConfirmationDialog,
    setShowCasingClearConfirmationDialog,
  ] = useState(false);
  const [
    showTubingClearConfirmationDialog,
    setShowTubingClearConfirmationDialog,
  ] = useState(false);
  const maxTubingMdValue = Math.max(...tubingRows.map((obj) => obj.md));

  useEffect(() => {
    if (flowType === "CasingFlow") {
      setCasingTrue(true);
    }
  }, [flowType]);

  const handleLiftType = (value) => {
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    let flow = "TubingFlow";
    updateWellConfig[configIndex] = {
      ...updateWellConfig[configIndex],
      lift_method: value,
      flow_type: flow,
    };
    setLiftType(value);
    setFlowType(flow);
    setBHPInputConfig({ ...bhpInputConfig, wellboreConfig: updateWellConfig });
    setIsInputChanged(true);
    const rowValues = bhpInputConfig.wellboreConfig?.find(
      (item) => item?.datetime === selectedConfigDate
    )?.gaslift_valve;
    const gasLiftRows = rowValues?.length
      ? rowValues
      : rowValues?.md?.map((mdValue, index) => ({
          id: index + 1,
          md: mdValue,
          delta_pres: (rowValues?.delta_pres || [])[index],
          editMode: true,
        }));
    const errorIndex = gasLiftError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = [...gasLiftError[errorIndex]?.cellErrors] || [];
    const updateErrors = [...gasLiftError];
    if (value === "GasLift") {
      if ((gasLiftRows || [])?.length < 1 && errors?.length < 1) {
        errors?.push(`At least one row should be added in Gas Lift`);
        updateErrors[errorIndex] = {
          ...gasLiftError[errorIndex],
          cellErrors: errors,
        };
        setGasLiftError(updateErrors);
      }
      // handleProd_GasLift();
    }
    if (value === "NaturalFlow") {
      if (errors?.length) {
        updateErrors[errorIndex] = {
          ...gasLiftError[errorIndex],
          cellErrors: [],
        };
        setGasLiftError(updateErrors);
      }
      // handleProd_GasLift(true);
    }
  };

  const handleFlowType = (value) => {
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    if (value === "CasingFlow") {
      const defaultTubingData =
        bhpDefaultInputConfig?.modelInput?.wellboreConfig[3]?.tubing;
      const updatedWellConfig = [...bhpInputConfig.wellboreConfig];
      updatedWellConfig[configIndex] = {
        ...updatedWellConfig[configIndex],
        tubing: defaultTubingData,
        flow_type: value,
      };
      setBHPInputConfig({
        ...bhpInputConfig,
        wellboreConfig: updatedWellConfig,
      });
      const errorIndex = tubingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateErrors = [...tubingError];
      updateErrors[errorIndex] = { ...tubingError[errorIndex], cellErrors: [] };
      setTubingError(updateErrors);
      const CasingerrorIndex = casingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const CasingupdateErrors = [...casingError];
      CasingupdateErrors[CasingerrorIndex] = {
        ...casingError[CasingerrorIndex],
        cellErrors: [],
      };
      setCasingError(CasingupdateErrors);
    } else {
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      updateWellConfig[configIndex] = {
        ...updateWellConfig[configIndex],
        flow_type: value,
      };
      setBHPInputConfig({
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      });
      setIsInputChanged(true);
    }

    if (value === "TubingFlow" || value === "AnnularFlow") {
      const casingValues = Array.isArray(
        bhpInputConfig?.wellboreConfig[configIndex]?.casing
      )
        ? bhpInputConfig?.wellboreConfig[configIndex]?.casing
        : [bhpInputConfig?.wellboreConfig[configIndex]?.casing];

      const field = "md";
      const errorMsg = "MD value can not be less than max of tubing MD";
      const errorIndex = casingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );

      const casingErrors = casingValues
        .filter((casingObject) => casingObject.md < maxTubingMdValue)
        .map((casingObject) => `${casingObject.id}:${field}:${errorMsg}`);

      if (casingErrors.length > 0) {
        const updateErrors = [...casingError];
        const errors = [
          ...casingError[errorIndex]?.cellErrors,
          ...casingErrors,
        ];
        updateErrors[errorIndex] = {
          ...casingError[errorIndex],
          cellErrors: errors,
        };
        setCasingError(updateErrors);
      }
    }
    setFlowType(value);
  };

  const handleFlowCorrelation = (value) => {
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex] = {
      ...updateWellConfig[configIndex],
      flow_correlation: value,
    };
    setFlowCorrelation(value);
    setBHPInputConfig({ ...bhpInputConfig, wellboreConfig: updateWellConfig });
    setIsInputChanged(true);
  };

  const handleCasingDelete = (id) => {
    setCasingRows((prevRows) => prevRows.filter((row) => row.id !== id));

    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    const updateCasing = casingRows.filter((row) => row.id !== id);
    updateWellConfig[configIndex].casing = [...updateCasing];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    const errorIndex = casingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = casingError[errorIndex]?.cellErrors;
    const updateErrors = [...casingError];
    errors = errors?.filter((er) => {
      let errCell = er.split(":")[0];
      return Number(errCell) !== id;
    });
    updateErrors[errorIndex] = {
      ...casingError[errorIndex],
      cellErrors: errors,
    };
    setCasingError(updateErrors);
  };

  const actionsRenderer = (params) => {
    let editingCells = params.api.getEditingCells();
    let isCurrentRowEditing = editingCells.some(
      (cell) => cell.rowIndex === params.node.rowIndex
    );

    return (
      <div className="actions">
        <IconButton
          onClick={() =>
            params.api.startEditingCell({
              rowIndex: params.node.rowIndex,
              colKey: null,
            })
          }
          disabled={isCurrentRowEditing}
          sx={{ mr: 2 }}
        >
          <Edit />
        </IconButton>
        <IconButton
          onClick={() =>
            params.api.applyTransaction({ remove: [params.node.data] })
          }
          disabled={isCurrentRowEditing}
        >
          <Delete />
        </IconButton>
      </div>
    );
  };

  const casingColumns = [
    { headerName: "ID", field: "id", editable: false },
    { headerName: "MD (ft)", field: "md", editable: true },
    { headerName: "Inner Diameter (in)", field: "d_inner", editable: true },
    { headerName: "Outer Diameter (in)", field: "d_outer", editable: true },
    { headerName: "Inner Roughness", field: "rough_inner", editable: true },
    { headerName: "Outer Roughness", field: "rough_outer", editable: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: "actionsRenderer",
      editable: false,
      sortable: false,
      filter: false,
      width: 120,
      suppressNavigable: true,
    },
  ];

  const components = useMemo(() => {
    return {
      actionsRenderer: actionsRenderer,
    };
  }, []);

  const handleTubingDelete = (id) => {
    setTubingRows((prevRows) => prevRows.filter((row) => row.id !== id));

    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    const updateTubing = tubingRows.filter((row) => row.id !== id);
    updateWellConfig[configIndex].tubing = [...updateTubing];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    const errorIndex = tubingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = tubingError[errorIndex]?.cellErrors;
    const updateErrors = [...tubingError];
    errors = errors?.filter((er) => {
      let errCell = er.split(":")[0];
      return Number(errCell) !== id;
    });
    updateErrors[errorIndex] = {
      ...tubingError[errorIndex],
      cellErrors: errors,
    };
    setTubingError(updateErrors);
  };

  const tubingColumns = [
    { headerName: "ID", field: "id", editable: false },
    { headerName: "MD (ft)", field: "md", editable: true },
    { headerName: "Inner Diameter (in)", field: "d_inner", editable: true },
    { headerName: "Outer Diameter (in)", field: "d_outer", editable: true },
    { headerName: "Inner Roughness", field: "rough_inner", editable: true },
    { headerName: "Outer Roughness", field: "rough_outer", editable: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: "actionsRenderer",
      editable: false,
      sortable: false,
      filter: false,
      width: 120,
      suppressNavigable: true,
    },
  ];

  const itemHeight = useMemo(() => {
    return 150;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const errorIndex = casingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const errors = casingError[errorIndex]?.cellErrors;
      if (errors?.length) {
        let focusElement =
          casingRef?.current?.querySelector(".MuiDataGrid-main");
        focusElement = focusElement && focusElement.childNodes[1]?.firstChild;
        focusElement = focusElement && focusElement.childNodes[0]?.firstChild;
        if (focusElement) {
          errors?.forEach((item) => {
            const elem = item.split(":");
            const id = Number(elem[0]);
            const field = elem[1];
            const rowId = `[data-id="${id.toString()}"]`;
            let errorElement = focusElement?.querySelectorAll(rowId);
            errorElement = errorElement?.length && errorElement[0];
            const cell = `[data-field="${field}"]`;
            errorElement = errorElement?.querySelectorAll(cell);
            errorElement = errorElement?.length && errorElement[0];
            errorElement.classList.add("error");
          });
        }
        const uniqueAlerts = errors
          ?.map((er) => er.split(":")[2])
          .filter((item, index, arr) => arr.indexOf(item) === index);
        setTableError(uniqueAlerts);
      } else {
        setTableError([]);
      }
    }, 250);
  }, [casingError, selectedConfigDate]);

  const isCasingCellErrorExist = (id, field) => {
    const errorIndex = casingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const errors = casingError[errorIndex]?.cellErrors;
    const isErrorExist = errors?.some((cell) => {
      let errCell = cell.split(":");
      errCell = `${errCell[0]}:${errCell[1]}`;
      return errCell === `${id}:${field}`;
    });
    return isErrorExist;
  };

  const handleCasingInputChange = ({ id, field, value }) => {
    const newValue = value; //!value ? null : Number(value.replace(/^0+/, ''));
    const val = Number(value);
    const integerPattern = /^\d*\.?\d*$/;
    let errorMsg = "";
    if (field === "rough_inner") {
      const label = "Inner Rough";
      const fieldDecInex = value?.toString().indexOf(".");
      const strValue = value?.toString();
      if (
        (fieldDecInex && strValue?.split(".")[1]?.length > 5) ||
        value < 0 ||
        value === null ||
        !integerPattern.test(val)
      ) {
        errorMsg = `${label} value can not be more than 5 decimal and should be integer value greater than 0`;
        // toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      }
      // else {
      setCasingRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateCasing = [...casingRows];
      const rowIndex = casingRows?.findIndex((item) => item.id === id);
      const row = casingRows[rowIndex];
      updateCasing[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].casing = [...updateCasing];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
    } else if (field === "md") {
      const surveyValues = bhpInputConfig.wellboreConfig?.find(
        (item) => item?.datetime === selectedConfigDate
      )?.deviation_survey;
      const surveyMDValues = surveyValues?.length
        ? surveyValues
            ?.map((item) => item?.md)
            ?.sort((a, b) => (a > b ? 1 : -1))
        : surveyValues?.md?.sort((a, b) => (a > b ? 1 : -1));
      const tubingMDValues = tubingRows?.sort((a, b) =>
        a?.md > b?.md ? 1 : -1
      );
      const label = "MD";
      if (value < 0 || value === null) {
        errorMsg = `${label} value can not be less than 0 `;
        //   toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      } else if (
        surveyMDValues?.length &&
        parseFloat(value) > surveyMDValues[surveyMDValues.length - 1]
      ) {
        errorMsg = `${label} value can not be greater than max of survey MD`;
      } else if (
        tubingMDValues?.length &&
        parseFloat(value) < tubingMDValues[tubingMDValues.length - 1]?.md &&
        flowType !== "CasingFlow"
      ) {
        errorMsg = `${label} value can not be less than max of tubing MD`;
      }
      const hasCellError = isTubingCellErrorExist(
        tubingMDValues[tubingMDValues.length - 1]?.id,
        field
      );
      const cellError = `${
        tubingMDValues[tubingMDValues.length - 1]?.id
      }:${field}`;
      const errorIndex = tubingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      let errors = [...tubingError[errorIndex]?.cellErrors];
      const updateErrors = [...tubingError];
      if (hasCellError && errorMsg === "") {
        errors = errors?.filter((er) => {
          let errCell = er.split(":");
          errCell = `${errCell[0]}:${errCell[1]}`;
          return errCell !== cellError;
        });
        updateErrors[errorIndex] = {
          ...tubingError[errorIndex],
          cellErrors: errors,
        };
        setTubingError(updateErrors);
      }
      // else {
      setCasingRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateCasing = [...casingRows];
      const rowIndex = casingRows?.findIndex((item) => item.id === id);
      const row = casingRows[rowIndex];
      updateCasing[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].casing = [...updateCasing];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);

      if (pageRoute.pathname === "/liquid-loading") {
        const casingMD = updateCasing?.sort((a, b) => (a?.md > b?.md ? 1 : -1));
        if (
          casingMD[casingMD?.length - 1].md < inputValues["Bottom Node"] &&
          errorMsg === ""
        ) {
          errorMsg = "max MD value should be greater than Bottom Node value.";
        }
      }
      // }
    } else if (field === "d_inner") {
      const label = "Inner Diameter";
      const tubingODValues = tubingRows?.sort((a, b) =>
        a?.d_outer > b?.d_outer ? 1 : -1
      );
      if (value <= 0 || value === null) {
        errorMsg = `${label} value should be greater than 0 `;
        //  toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      } else if (
        tubingODValues?.length &&
        parseFloat(value) <=
          tubingODValues[tubingODValues.length - 1]?.d_outer &&
        flowType !== "CasingFlow"
      ) {
        errorMsg = `${label} value should be greater than max of tubing Outer Diameter`;
      }
      const compField = "d_outer";
      const hasCellError = isTubingCellErrorExist(
        tubingODValues[tubingODValues.length - 1]?.id,
        compField
      );
      const cellError = `${
        tubingODValues[tubingODValues.length - 1]?.id
      }:${compField}`;
      const errorIndex = tubingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      let errors = [...tubingError[errorIndex]?.cellErrors];
      const updateErrors = [...tubingError];
      if (hasCellError && errorMsg === "") {
        errors = errors?.filter((er) => {
          let errCell = er.split(":");
          errCell = `${errCell[0]}:${errCell[1]}`;
          return errCell !== cellError;
        });
        updateErrors[errorIndex] = {
          ...tubingError[errorIndex],
          cellErrors: errors,
        };
        setTubingError(updateErrors);
      }
      // else {
      setCasingRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateCasing = [...casingRows];
      const rowIndex = casingRows?.findIndex((item) => item.id === id);
      const row = casingRows[rowIndex];
      updateCasing[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].casing = [...updateCasing];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
    }
    const hasCellError = isCasingCellErrorExist(id, field);
    const cellError = `${id}:${field}`;
    const errorIndex = casingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = [...casingError[errorIndex]?.cellErrors];
    const updateErrors = [...casingError];
    if (!hasCellError && errorMsg !== "") {
      errors?.push(`${cellError}:${errorMsg}`);
      updateErrors[errorIndex] = {
        ...casingError[errorIndex],
        cellErrors: errors,
      };
      setCasingError(updateErrors);
    }
    if (hasCellError && errorMsg === "") {
      errors = errors?.filter((er) => {
        let errCell = er.split(":");
        errCell = `${errCell[0]}:${errCell[1]}`;
        return errCell !== cellError;
      });
      updateErrors[errorIndex] = {
        ...casingError[errorIndex],
        cellErrors: errors,
      };
      setCasingError(updateErrors);
    }
  };

  const handleCasingImportedFileInputs = (fileContent) => {
    let csvData = fileContent?.split("\n");
    if (csvData?.length) {
      const surveyValues = bhpInputConfig.wellboreConfig?.find(
        (item) => item?.datetime === selectedConfigDate
      )?.deviation_survey;
      const surveyMDValues = surveyValues?.length
        ? surveyValues?.map((item) => item?.md).sort((a, b) => a - b)
        : surveyValues?.md?.sort((a, b) => a - b);
      const surveyMaxMDValue = Math.max(...surveyMDValues);

      const headerKeys = casingColumns
        ?.filter((item) => item.headerName !== "Actions")
        .map((el) => ({ label: el.headerName, attr: el.field }));
      const fileKeys = csvData[0].split(",");
      let keys = [];
      fileKeys?.forEach((item) => {
        const key = headerKeys?.find((h) => h.label === item)?.attr;
        keys.push(key);
      });
      const csvRowData = csvData.slice(1).map((item) => item?.split(","));

      let validRowCount = 0;
      let casingRows = csvRowData.reduce((acc, values, index) => {
        if (validRowCount < 3) {
          let data = { id: index + 1, editMode: true };
          let discardRow = false;

          keys?.forEach((key, keyIndex) => {
            const value = parseFloat(values[keyIndex]);
            if (isNaN(value) || value < 0) {
              discardRow = true;
            }

            data = { ...data, [key]: values[keyIndex] };
          });

          if (parseFloat(data["md"]) > surveyMaxMDValue) {
            discardRow = true;
          }
          if (!discardRow) {
            acc.push(data);
            validRowCount++;
          }
        }

        return acc;
      }, []);

      setCasingRows(casingRows);

      const casingObj = {
        md: [],
        d_inner: [],
        rough_inner: [],
      };
      if (casingRows?.length) {
        casingRows.forEach((item) => {
          keys?.forEach((key) => {
            casingObj[key].push(item[key]);
          });
        });
      }
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      updateWellConfig[configIndex].casing = casingObj;
      const input = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };
      setBHPInputConfig(input);
      toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
      const errorIndex = casingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateErrors = [...casingError];
      updateErrors[errorIndex] = { ...casingError[errorIndex], cellErrors: [] };
      setCasingError(updateErrors);
    } else {
      toastCustomErrorMessage(
        Constants.UPLOAD_FILE_FORMAT_ERROR_MESSAGE,
        { style: { width: "400px" } },
        2000
      );
    }
  };

  const handleBhpCasingImport = (event) => {
    if (event?.target?.files?.length) {
      const selectedFile = event?.target?.files[0];
      if (selectedFile.type === "text/csv") {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = () => {
          const fileContent = reader?.result;
          // handleCasingImportedFileInputs(fileContent);
        };
      } else {
        // toastCustomErrorMessage(Constants.CSV_FILE_ERROR_MESSAGE, { style: { width: "400px" } }, 2000);
      }
    } else {
      // toastCustomErrorMessage(Constants.UPLOAD_FILE_ERROR_MESSAGE, { style: { width: "400px" } }, 2000);
    }
  };

  const handleCasingExport = () => {
    let csv = "";
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const rowValues = bhpInputConfig.wellboreConfig[configIndex].casing;
    const dataRows = rowValues?.length
      ? rowValues
      : rowValues.md.map((mdValue, index) => ({
          id: index + 1,
          md: mdValue,
          d_inner: rowValues.d_inner ? rowValues.d_inner[index] : "",
          rough_inner: rowValues.rough_inner
            ? rowValues.rough_inner[index]
            : "",
        }));
    const headerKeys = casingColumns
      ?.filter((item) => item.headerName !== "Actions")
      .map((el) => ({ label: el.headerName, attr: el.field }));
    // join csv header items
    const header = headerKeys?.map((item) => item.label).join(",");
    const csvRows = dataRows.map((item) => {
      // join csv rows by using each key and value
      let rowItems = headerKeys
        ?.map((item) => item.attr)
        .map((column) => item[column])
        .join(",");
      return rowItems;
    });
    // join header and body, and break into separate lines
    csv = [header, ...csvRows].join("\n");
    exportCsv(csv, Constants.EXPORT_BHP_CASING_FILE_NAME);
  };

  useEffect(() => {
    setTimeout(() => {
      const errorIndex = tubingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const errors = tubingError[errorIndex]?.cellErrors;
      if (errors?.length) {
        let focusElement =
          tubingRef?.current?.querySelector(".MuiDataGrid-main");
        focusElement = focusElement && focusElement.childNodes[1]?.firstChild;
        focusElement = focusElement && focusElement.childNodes[0]?.firstChild;
        if (focusElement) {
          errors?.forEach((item) => {
            const elem = item.split(":");
            const id = Number(elem[0]);
            const field = elem[1];
            const rowId = `[data-id="${id.toString()}"]`;
            let errorElement = focusElement?.querySelectorAll(rowId);
            errorElement = errorElement?.length && errorElement[0];
            const cell = `[data-field="${field}"]`;
            errorElement = errorElement?.querySelectorAll(cell);
            errorElement = errorElement?.length && errorElement[0];
            errorElement.classList.add("error");
          });
        }
        const uniqueAlerts = errors
          ?.map((er) => er.split(":")[2])
          .filter((item, index, arr) => arr.indexOf(item) === index);
        setTubingTableError(uniqueAlerts);
      } else {
        setTubingTableError([]);
      }
    }, 250);
  }, [tubingError, selectedConfigDate]);

  const isTubingCellErrorExist = (id, field) => {
    const errorIndex = tubingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const errors = tubingError[errorIndex]?.cellErrors;
    const isErrorExist = errors?.some((cell) => {
      let errCell = cell.split(":");
      errCell = `${errCell[0]}:${errCell[1]}`;
      return errCell === `${id}:${field}`;
    });
    return isErrorExist;
  };

  const handleTubingInputChange = ({ id, field, value }) => {
    const newValue = value; //!value ? null : Number(value.replace(/^0+/, ''));
    let errorMsg = "";
    if (field === "rough_inner" || field === "rough_outer") {
      const label = field === "rough_inner" ? "Inner Rough" : "Outer Rough";
      const fieldDecInex = value?.toString().indexOf(".");
      const strValue = value?.toString();
      const val = Number(value);
      const integerPattern = /^\d*\.?\d*$/;
      if (
        (fieldDecInex && strValue?.split(".")[1]?.length > 5) ||
        value < 0 ||
        value === null ||
        !integerPattern.test(val)
      ) {
        errorMsg = `${label} value can not be more than 5 decimal and should be integer value greater than 0`;
        //  toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      }
      // else {
      setTubingRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateTubing = [...tubingRows];
      const rowIndex = tubingRows?.findIndex((item) => item.id === id);
      const row = tubingRows[rowIndex];
      updateTubing[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].tubing = [...updateTubing];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
    } else if (field === "d_inner" || field === "d_outer") {
      let currentField =
        field === "d_inner" ? "Inner Diameter" : "Outer Diameter";
      let compareField =
        field === "d_inner" ? "Outer Diameter" : "Inner Diameter";
      let comparer = field === "d_inner" ? "greater" : "less";
      const compRow = tubingRows?.find((item) => item.id === id);
      const casingIDValues = casingRows?.sort((a, b) =>
        a?.d_inner > b?.d_inner ? 1 : -1
      );
      if (
        (field === "d_inner" &&
          compRow &&
          Number(value) >= Number(compRow["d_outer"])) ||
        value <= 0 ||
        value === null
      ) {
        errorMsg = `${currentField} value can not be ${comparer} than ${compareField} and value should greater than 0`;
        //  toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      } else if (
        (field === "d_outer" &&
          compRow &&
          Number(value) <= Number(compRow["d_inner"])) ||
        value <= 0 ||
        value === null
      ) {
        errorMsg = `${currentField} value should be greater than ${compareField} and value should be greater than 0`;
        // toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      } else if (
        field === "d_outer" &&
        Number(value) >= casingIDValues[0]?.d_inner
      ) {
        errorMsg = `${currentField} value should be less than min casing Inner Diameter`;
      }

      const compField = field === "d_inner" ? "d_outer" : "d_inner";
      const hasCellError = isTubingCellErrorExist(compRow?.id, compField);
      const cellError = `${compRow?.id}:${compField}`;
      const errorIndex = tubingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      let errors = [...tubingError[errorIndex]?.cellErrors];
      const updateErrors = [...tubingError];
      if (hasCellError && errorMsg === "") {
        errors = errors?.filter((er) => {
          let errCell = er.split(":");
          errCell = `${errCell[0]}:${errCell[1]}`;
          return errCell !== cellError;
        });
        updateErrors[errorIndex] = {
          ...tubingError[errorIndex],
          cellErrors: errors,
        };
        setTubingError(updateErrors);
      }
      if (field === "d_outer") {
        const casingIDField = "d_inner";
        const hasCellError = isCasingCellErrorExist(
          casingIDValues[0]?.id,
          casingIDField
        );
        const cellError = `${casingIDValues[0]?.id}:${casingIDField}`;
        const errorIndex = casingError?.findIndex(
          (item) => item.datetime === selectedConfigDate
        );
        let errors = [...casingError[errorIndex]?.cellErrors];
        const updateErrors = [...casingError];
        if (hasCellError && errorMsg === "") {
          errors = errors?.filter((er) => {
            let errCell = er.split(":");
            errCell = `${errCell[0]}:${errCell[1]}`;
            return errCell !== cellError;
          });
          updateErrors[errorIndex] = {
            ...casingError[errorIndex],
            cellErrors: errors,
          };
          setCasingError(updateErrors);
        }
      }
      // else {
      setTubingRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateTubing = [...tubingRows];
      const rowIndex = tubingRows?.findIndex((item) => item.id === id);
      const row = tubingRows[rowIndex];
      updateTubing[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].tubing = [...updateTubing];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
    } else if (field === "md") {
      const casingMDValues = casingRows?.sort((a, b) =>
        a?.md > b?.md ? 1 : -1
      );
      const label = "MD";
      if (value < 0 || value == null) {
        errorMsg = `${label} value can not be less than 0 or empty`;
        // toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      } else if (
        casingMDValues?.length &&
        parseFloat(value) > casingMDValues[0]?.md
      ) {
        errorMsg = `${label} value should be less than min of Casing MD`;
      }
      const hasCellError = isCasingCellErrorExist(casingMDValues[0]?.id, field);
      const cellError = `${casingMDValues[0]?.id}:${field}`;
      const errorIndex = casingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      let errors = [...casingError[errorIndex]?.cellErrors];
      const updateErrors = [...casingError];
      if (hasCellError && errorMsg === "") {
        errors = errors?.filter((er) => {
          let errCell = er.split(":");
          errCell = `${errCell[0]}:${errCell[1]}`;
          return errCell !== cellError;
        });
        updateErrors[errorIndex] = {
          ...casingError[errorIndex],
          cellErrors: errors,
        };
        setCasingError(updateErrors);
      }
      // else {
      setTubingRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateTubing = [...tubingRows];
      const rowIndex = tubingRows?.findIndex((item) => item.id === id);
      const row = tubingRows[rowIndex];
      updateTubing[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].tubing = [...updateTubing];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
    }
    const hasCellError = isTubingCellErrorExist(id, field);
    const cellError = `${id}:${field}`;
    const errorIndex = tubingError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = [...tubingError[errorIndex]?.cellErrors];
    const updateErrors = [...tubingError];
    if (!hasCellError && errorMsg !== "") {
      errors?.push(`${cellError}:${errorMsg}`);
      updateErrors[errorIndex] = {
        ...tubingError[errorIndex],
        cellErrors: errors,
      };
      setTubingError(updateErrors);
    }
    if (hasCellError && errorMsg === "") {
      errors = errors?.filter((er) => {
        let errCell = er.split(":");
        errCell = `${errCell[0]}:${errCell[1]}`;
        return errCell !== cellError;
      });
      updateErrors[errorIndex] = {
        ...tubingError[errorIndex],
        cellErrors: errors,
      };
      setTubingError(updateErrors);
    }
  };

  const handleTubingImportedFileInputs = (fileContent) => {
    let csvData = fileContent?.split("\n");
    if (csvData?.length) {
      const minCasingMdValue = Math.min(...casingRows.map((obj) => obj.md));
      const headerKeys = tubingColumns
        ?.filter((item) => item.headerName !== "Actions")
        .map((el) => ({ label: el.headerName, attr: el.field }));
      const fileKeys = csvData[0].split(",");
      let keys = [];
      fileKeys?.forEach((item) => {
        const key = headerKeys?.find((h) => h.label === item)?.attr;
        keys.push(key);
      });
      const csvRowData = csvData.slice(1).map((item) => item?.split(","));

      let validRowCount = 0;
      let tubingRows = csvRowData.reduce((acc, values, index) => {
        if (validRowCount < 3) {
          let data = { id: index + 1, editMode: true };
          let discardRow = false;

          keys?.forEach((key, keyIndex) => {
            const value = parseFloat(values[keyIndex]);
            if (isNaN(value) || value < 0) {
              discardRow = true;
            }

            data = { ...data, [key]: values[keyIndex] };
          });

          if (parseFloat(data["md"]) > minCasingMdValue) {
            discardRow = true;
          }

          if (parseFloat(data["d_inner"]) >= parseFloat(data["d_outer"])) {
            discardRow = true;
          }
          if (!discardRow) {
            acc.push(data);
            validRowCount++;
          }
        }

        return acc;
      }, []);

      setTubingRows(tubingRows);

      const tubingObj = {
        md: [],
        d_inner: [],
        rough_inner: [],
        d_outer: [],
        rough_outer: [],
      };
      if (tubingRows?.length) {
        tubingRows.forEach((item) => {
          keys?.forEach((key) => {
            tubingObj[key].push(item[key]);
          });
        });
      }
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      updateWellConfig[configIndex].tubing = tubingObj;
      const input = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };
      setBHPInputConfig(input);
      toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
      const errorIndex = tubingError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateErrors = [...tubingError];
      updateErrors[errorIndex] = { ...tubingError[errorIndex], cellErrors: [] };
      setTubingError(updateErrors);
    } else {
      toastCustomErrorMessage(
        Constants.UPLOAD_FILE_FORMAT_ERROR_MESSAGE,
        { style: { width: "400px" } },
        2000
      );
    }
  };

  const handleBhpTubingImport = (event) => {
    if (event?.target?.files?.length) {
      const selectedFile = event?.target?.files[0];
      if (selectedFile.type === "text/csv") {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = () => {
          const fileContent = reader?.result;
          handleTubingImportedFileInputs(fileContent);
        };
      } else {
        // toastCustomErrorMessage(Constants.CSV_FILE_ERROR_MESSAGE, { style: { width: "400px" } }, 2000);
      }
    } else {
      // toastCustomErrorMessage(Constants.UPLOAD_FILE_ERROR_MESSAGE, { style: { width: "400px" } }, 2000);
    }
  };

  const handleTubingExport = () => {
    let csv = "";
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const rowValues = bhpInputConfig.wellboreConfig[configIndex].tubing;
    const dataRows = rowValues?.length
      ? rowValues
      : rowValues.md.map((mdValue, index) => ({
          md: mdValue,
          d_inner: rowValues.d_inner ? rowValues.d_inner[index] : "",
          rough_inner: rowValues.rough_inner
            ? rowValues.rough_inner[index]
            : "",
          d_outer: rowValues.d_outer ? rowValues.d_outer[index] : "",
          rough_outer: rowValues.rough_outer
            ? rowValues.rough_outer[index]
            : "",
        }));
    const headerKeys = tubingColumns
      ?.filter((item) => item.headerName !== "Actions")
      .map((el) => ({ label: el.headerName, attr: el.field }));
    // join csv header items
    const header = headerKeys?.map((item) => item.label).join(",");
    const csvRows = dataRows.map((item) => {
      // join csv rows by using each key and value
      let rowItems = headerKeys
        ?.map((item) => item.attr)
        .map((column) => item[column])
        .join(",");
      return rowItems;
    });
    // join header and body, and break into separate lines
    csv = [header, ...csvRows].join("\n");
    exportCsv(csv, Constants.EXPORT_BHP_TUBING_FILE_NAME);
  };

  const handleCreateCasing = () => {
    // let defaultValues = casingRows?.length && casingRows[0];
    const lastRowId = casingRows?.length
      ? casingRows[casingRows?.length - 1]?.id
      : 0;
    const firstIndexValues = casingRows[casingRows?.length - 1];
    const newRow = {
      id: lastRowId + 1,
      md: firstIndexValues?.md,
      d_inner: firstIndexValues?.d_inner,
      d_outer: firstIndexValues?.d_outer,
      rough_inner: firstIndexValues?.rough_inner,
      rough_outer: firstIndexValues?.rough_outer,
      editMode: true,
    };
    setCasingRows((prevRows) => [...prevRows, newRow]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].casing = [...casingRows, newRow];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    if (casingRows.length > 1) {
      // toastCustomErrorMessage("Maximum rows limit has been reached")
    }
  };

  const handleCreateTubing = () => {
    // let defaultValues = tubingRows?.length && tubingRows[0];
    console.log("sortedRows", tubingRows);
    const lastRowId = tubingRows?.length
      ? tubingRows[tubingRows?.length - 1]?.id
      : 0;
    const firstIndexValues = tubingRows[tubingRows?.length - 1];
    const newRow = {
      id: lastRowId + 1,
      md: firstIndexValues?.md,
      d_inner: firstIndexValues?.d_inner,
      d_outer: firstIndexValues?.d_outer,
      rough_inner: firstIndexValues?.rough_inner,
      rough_outer: firstIndexValues?.rough_outer,
      editMode: true,
    };
    setTubingRows((prevRows) => [...prevRows, newRow]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].tubing = [...tubingRows, newRow];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    if (tubingRows.length > 1) {
      // toastCustomErrorMessage("Maximum rows limit has been reached")
    }
  };

  const flowTypes = useMemo(() => {
    let flowOptions = flowTypeOptions;
    if (liftType === "NaturalFlow") {
      flowOptions = flowTypeOptions;
    }
    // else if (liftType === "RodPump" || liftType === "ESP") {
    //     flowOptions = flowTypeOptions.filter(item => item.value === "TubingFlow");
    // }
    else if (liftType === "GasLift") {
      flowOptions = flowTypeOptions.filter(
        (item) => item.value === "TubingFlow" || item.value === "AnnularFlow"
      );
    }
    return flowOptions;
  }, [liftType, flowTypeOptions]);

  const handleCasingShowClearDialog = (show) => {
    if (isInputChanged) {
      setShowCasingClearConfirmationDialog(show);
    } else {
      setShowCasingClearConfirmationDialog(false);
    }
  };

  const handleCasingClearModelInput = () => {
    setCasingRows([]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].casing = [];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setShowCasingClearConfirmationDialog(false);
  };

  const handleTubingShowClearDialog = (show) => {
    if (isInputChanged) {
      setShowTubingClearConfirmationDialog(show);
    } else {
      setShowTubingClearConfirmationDialog(false);
    }
  };

  const handleTubingClearModelInput = () => {
    setTubingRows([]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].tubing = [];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setShowTubingClearConfirmationDialog(false);
  };

  return (
    <>
      <Box width="calc(100vw - 475px)" sx={{ mt: 1.5 }}>
        <Box className={classes.fluidTypeRow}>
          {/* <Typography sx={{ lineHeight: 2, fontWeight: 400, display: "inline-block", minWidth: "135px", fontSize: "1.2rem", pl: 2 }}> */}
          <Typography variant="body3Large">{Constants?.LIFT_TYPE}</Typography>
          <Box className={classes.fluidType}>
            <Box sx={{ display: "flex", ml: 1, mr: 2 }}>
              <FusionSelect
                name="well-selector"
                onChange={(e) => handleLiftType(e?.target?.value)}
                options={liftTypeOptions}
                value={liftType}
                fullName={true}
                className={classes.propSelector}
                menuHeight={525}
                selectHeight={35}
              />
            </Box>
          </Box>
          <Typography variant="body3Large">{Constants.FLOW_TYPE}</Typography>
          <Box className={classes.fluidType}>
            <Box sx={{ display: "flex", ml: 1, mr: 2 }}>
              <FusionSelect
                name="well-selector"
                onChange={(e) => handleFlowType(e?.target?.value)}
                options={flowTypes}
                value={flowType}
                fullName={true}
                className={classes.propSelector}
                menuHeight={525}
                selectHeight={35}
              />
            </Box>
          </Box>
          <Typography variant="body3Large">
            {Constants.FLOW_CORRELATION}
          </Typography>
          <Box className={classes.fluidType}>
            <Box sx={{ display: "flex", ml: 1, mr: 2 }}>
              <FusionSelect
                name="well-selector"
                onChange={(e) => handleFlowCorrelation(e?.target?.value)}
                options={flowCorrelationOptions}
                value={flowCorrelation}
                fullName={true}
                className={classes.propSelector}
                menuHeight={525}
                selectHeight={35}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: itemHeight,
          }}
        >
          <Box className={classes.accordionHeader}>
            <Typography
              color="textPrimary"
              variant="h2"
              className={classes.headerName}
            >
              {Constants.CASING}
            </Typography>
            <Box sx={{ display: "flex", mb: 1, justifyContent: "end" }}>
              <IconButton
                onClick={() => setShowCasingClearConfirmationDialog(true)}
              >
                <Tooltip
                  title={Constants.CLEAR_ROWS}
                  placement="bottom"
                  arrow
                  enterDelay={100}
                >
                  <DeleteForever sx={{ color: theme.palette.text.primary }} />
                </Tooltip>
              </IconButton>

              <IconButton>
                <Tooltip
                  title="Import"
                  placement="bottom"
                  arrow
                  enterDelay={100}
                >
                  <Button
                    component="label"
                    size="small"
                    sx={{
                      color: theme.palette.text.primary,
                      m: 0,
                      p: 0,
                      minWidth: "20px",
                    }}
                  >
                    <Tooltip
                      title={Constants.IMPORT_CASING_DATA}
                      placement="bottom"
                      arrow
                      enterDelay={100}
                    >
                      <>
                        <Publish />
                      </>
                    </Tooltip>
                    <input
                      type="file"
                      onChange={handleBhpCasingImport}
                      accept={".csv"}
                      hidden
                      style={{ width: "1px" }}
                    />
                  </Button>
                </Tooltip>
              </IconButton>

              <IconButton
                onClick={handleCasingExport}
                disabled={
                  bhpInputConfig.wellboreConfig.length > 0 ? false : true
                }
              >
                <Tooltip
                  title={Constants.EXPORT_CASING_DATA}
                  placement="bottom"
                  arrow
                  enterDelay={100}
                >
                  <FileDownload sx={{ color: theme.palette.text.primary }} />
                </Tooltip>
              </IconButton>

              <IconButton
                onClick={handleCreateCasing}
                disabled={
                  bhpInputConfig.wellboreConfig.length > 0 ? false : true
                }
              >
                <Tooltip
                  title="Add new row"
                  placement="bottom"
                  arrow
                  enterDelay={100}
                >
                  <AddCircleOutline
                    sx={{ color: theme.palette.text.primary }}
                  />
                </Tooltip>
              </IconButton>
            </Box>
          </Box>
          <Box ml={1} height="100%">
            <Box
              className={`${
                theme?.palette.mode === "dark"
                  ? "ag-theme-alpine-dark"
                  : "ag-theme-alpine"
              } custom-ag-grid`}
              style={{
                height: "100%",
                width: "100%",
                overflowY: "auto",
                overflowX: "auto",
                fontFamily: "Poppins",
              }}
            >
              <AgGridReact
                ref={casingRef}
                rowData={casingRows}
                columnDefs={casingColumns}
                editType="fullRow"
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  cellDataType: false,
                  flex: 1,
                  editable: true,
                }}
                singleClickEdit={true}
                components={components}
              />
            </Box>
          </Box>
        </Box>

        {flowType === "CasingFlow" ? (
          ""
        ) : (
          <Box
            sx={{
              height: itemHeight,
              mt: 6.5,
            }}
          >
            <Box className={classes.accordionHeader}>
              <Typography
                color="textPrimary"
                variant="h2"
                className={classes.headerName}
              >
                {Constants.TUBING}
              </Typography>
              <Box sx={{ display: "flex", mb: 1, justifyContent: "end" }}>
                <IconButton
                  onClick={() => setShowTubingClearConfirmationDialog(true)}
                >
                  <Tooltip
                    title={Constants.CLEAR_ROWS}
                    placement="bottom"
                    arrow
                    enterDelay={100}
                  >
                    <DeleteForever sx={{ color: theme.palette.text.primary }} />
                  </Tooltip>
                </IconButton>

                <IconButton>
                  <Tooltip
                    title="Import"
                    placement="bottom"
                    arrow
                    enterDelay={100}
                  >
                    <Button
                      component="label"
                      size="small"
                      sx={{
                        color: theme.palette.text.primary,
                        m: 0,
                        p: 0,
                        minWidth: "20px",
                      }}
                    >
                      <Tooltip
                        title={Constants.IMPORT_TUBING_DATA}
                        placement="bottom"
                        arrow
                        enterDelay={100}
                      >
                        <>
                          <Publish />
                        </>
                      </Tooltip>
                      <input
                        type="file"
                        onChange={handleBhpTubingImport}
                        accept={".csv"}
                        hidden
                        style={{ width: "1px" }}
                      />
                    </Button>
                  </Tooltip>
                </IconButton>

                <IconButton
                  onClick={handleTubingExport}
                  disabled={
                    bhpInputConfig.wellboreConfig.length > 0 ? false : true
                  }
                >
                  <Tooltip
                    title={Constants.EXPORT_TUBING_DATA}
                    placement="bottom"
                    arrow
                    enterDelay={100}
                  >
                    <FileDownload sx={{ color: theme.palette.text.primary }} />
                  </Tooltip>
                </IconButton>

                <IconButton
                  onClick={handleCreateTubing}
                  disabled={
                    bhpInputConfig.wellboreConfig.length > 0 ? false : true
                  }
                >
                  <Tooltip
                    title="Add new row"
                    placement="bottom"
                    arrow
                    enterDelay={100}
                  >
                    <AddCircleOutline
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </Tooltip>
                </IconButton>
              </Box>
            </Box>
            <Box ml={1} height="100%">
              <Box
                className={`${
                  theme?.palette.mode === "dark"
                    ? "ag-theme-alpine-dark"
                    : "ag-theme-alpine"
                } custom-ag-grid`}
                style={{
                  height: "100%",
                  width: "100%",
                  overflowY: "auto",
                  overflowX: "auto",
                  fontFamily: "Poppins",
                }}
              >
                <AgGridReact
                  ref={tubingRef}
                  rowData={tubingRows}
                  columnDefs={tubingColumns}
                  editType="fullRow"
                  defaultColDef={{
                    sortable: true,
                    resizable: true,
                    cellDataType: false,
                    flex: 1,
                    editable: true,
                  }}
                  singleClickEdit={true}
                  components={components}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {Boolean(showCasingClearConfirmationDialog) && (
        <ConfirmationPopup
          open={showCasingClearConfirmationDialog}
          handleClose={() => handleCasingShowClearDialog(false)}
          handleConfirm={handleCasingClearModelInput}
          warnMessage={Constants.CLEAR_MESSAGE}
        />
      )}
      {Boolean(showTubingClearConfirmationDialog) && (
        <ConfirmationPopup
          open={showTubingClearConfirmationDialog}
          handleClose={() => handleTubingShowClearDialog(false)}
          handleConfirm={handleTubingClearModelInput}
          warnMessage={Constants.CLEAR_MESSAGE}
        />
      )}
    </>
  );
};

export default BHPCasingTubing;
