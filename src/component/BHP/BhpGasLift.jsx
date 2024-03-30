import React, { useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "tss-react/mui";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useWindowSize } from "../constant/getWindowSize";
import { useEffect, useRef } from "react";
import {
  AddCircleOutline,
  Delete,
  DeleteForever,
  Edit,
  Publish,
} from "@mui/icons-material";
import UploadFile from "@mui/icons-material/UploadFile";
import FileDownload from "@mui/icons-material/FileDownload";
import { exportDateTimeCSV as exportCsv } from "../../utils/exportCSV";
import * as Constants from "../constant/ModelConstants";
import {
  toastCustomErrorMessage,
  toastCustomSuccessMessage,
} from "../../utils/toast";
import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";
import ConfirmationPopup from "../ConfirmationPopup";
import { useTheme } from "@mui/system";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
]);

const useStyles = makeStyles()((theme) => ({
  accordionHeader: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "end",
    alignItems: "center",
    background: theme.palette.background.screen,
    marginBottom: "15px",
    fontSize: "20px",
    // borderTopLeftRadius: "12px",
    // borderTopRightRadius: "12px",
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
      textAlign: "center", // Center-align header text
    },
    "& .MuiDataGrid-cell--editing": {
      backgroundColor: theme.palette.background.header + "!important",
    },
    "& .MuiDataGrid-cell": {
      textAlign: "center", // Center-align cell text
    },
    "& .MuiDataGrid-cell--editable": {
      "&.error": {
        border: "2px solid red !important",
      },
    },
  },
  highlightedRow: {
    background: theme.palette.background.header,
  },
  headerName: {
    color: theme.palette.text,
    fontWeight: 600,
  },
  addNewRow: {
    [theme.breakpoints.down("1280")]: {
      marginTop: 0,
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
  },
  fileButton: {
    height: 35,
    marginTop: 1.5,
    marginRight: 3,
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
  },
}));

const BhpGasLift = (props) => {
  const {
    isInputChanged,
    bhpInputConfig,
    selectedConfigDate,
    gasLiftError,
    setGasLiftError,
    setIsInputChanged,
    setBHPInputConfig,
  } = props;
  const { classes } = useStyles();
  const theme = useTheme();
  const rowValues = bhpInputConfig.wellboreConfig?.find(
    (item) => item?.datetime === selectedConfigDate
  )?.gaslift_valve;
  const initialRow = rowValues?.length
    ? rowValues
    : rowValues?.md?.map((mdValue, index) => ({
        id: index + 1,
        md: mdValue,
        delta_pres: (rowValues?.delta_pres || [])[index],
        editMode: true,
      }));
  const [rows, setRows] = useState(initialRow || []);
  const [tableError, setTableError] = useState([]);
  const [showClearConfirmationDialog, setShowClearConfirmationDialog] =
    useState(false);
  const { height: windowHeight } = useWindowSize();

  const itemHeight = useMemo(() => {
    return windowHeight - 330;
  }, [windowHeight]);
  const erroritemHeight = useMemo(() => {
    return windowHeight - 500;
  }, [windowHeight]);

  const gasLiftRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      const errorIndex = gasLiftError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const errors = gasLiftError[errorIndex]?.cellErrors;
      if (errors?.length) {
        const isCellError = errors?.every((item) => item.includes(":"));
        if (isCellError) {
          let focusElement =
            gasLiftRef?.current?.querySelector(".MuiDataGrid-main");
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
        }
      } else {
        setTableError([]);
      }
    }, 250);
  }, [gasLiftError, selectedConfigDate]);

  const isCellErrorExist = (id, field) => {
    const errorIndex = gasLiftError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const errors = gasLiftError[errorIndex]?.cellErrors;
    const isErrorExist = errors?.some((cell) => {
      let errCell = cell.split(":");
      errCell = `${errCell[0]}:${errCell[1]}`;
      return errCell === `${id}:${field}`;
    });
    return isErrorExist;
  };

  const handleInputChange = ({ id, field, value }) => {
    const newValue = value;
    let errorMsg = "";
    if (field === "md") {
      const label = "MD";
      const tubingValues = bhpInputConfig.wellboreConfig?.find(
        (item) => item?.datetime === selectedConfigDate
      )?.tubing;
      const tubingMdValues = tubingValues?.length
        ? tubingValues
            ?.map((item) => item?.md)
            ?.sort((a, b) => (a > b ? 1 : -1))
        : tubingValues?.md?.sort((a, b) => (a > b ? 1 : -1));
      if (isNaN(parseFloat(newValue)) || newValue < 0) {
        errorMsg = `${label} value can not be empty or less than 0`;
      } else if (
        tubingMdValues?.length &&
        parseFloat(value) > tubingMdValues[tubingMdValues.length - 1]
      ) {
        errorMsg = `${label} value must be less than max of Tubing MD`;
      }
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateGasLift = [...rows];
      const rowIndex = rows?.findIndex((item) => item.id === id);
      const row = rows[rowIndex];
      updateGasLift[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].gaslift_valve = [...updateGasLift];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
    } else if (field === "delta_pres") {
      const label = "Delta Pressure";
      if (isNaN(parseFloat(newValue))) {
        errorMsg = `${label} value can not be empty`;
      } else if (newValue < 0) {
        errorMsg = `${label} value can not be less than 0`;
      }
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateGasLift = [...rows];
      const rowIndex = rows?.findIndex((item) => item.id === id);
      const row = rows[rowIndex];
      updateGasLift[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].gaslift_valve = [...updateGasLift];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
    }
    const hasCellError = isCellErrorExist(id, field);
    const cellError = `${id}:${field}`;
    const errorIndex = gasLiftError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = [...gasLiftError[errorIndex]?.cellErrors];
    const updateErrors = [...gasLiftError];
    if (!hasCellError && errorMsg !== "") {
      errors?.push(`${cellError}:${errorMsg}`);
      updateErrors[errorIndex] = {
        ...gasLiftError[errorIndex],
        cellErrors: errors,
      };
      setGasLiftError(updateErrors);
    }
    if (hasCellError && errorMsg === "") {
      errors = errors?.filter((er) => {
        let errCell = er.split(":");
        errCell = `${errCell[0]}:${errCell[1]}`;
        return errCell !== cellError;
      });
      updateErrors[errorIndex] = {
        ...gasLiftError[errorIndex],
        cellErrors: errors,
      };
      setGasLiftError(updateErrors);
    }
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

  const columns = useMemo(() => {
    return [
      { headerName: "ID", field: "id", editable: false },
      { headerName: "MD (ft)", field: "md", editable: true },
      {
        headerName: "Delta Pressure (psi)",
        field: "delta_pres",
        editable: true,
      },
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
  }, [
    rows,
    bhpInputConfig,
    selectedConfigDate,
    setBHPInputConfig,
    setIsInputChanged,
    setGasLiftError,
    gasLiftError,
  ]);

  const components = useMemo(() => {
    return {
      actionsRenderer: actionsRenderer,
    };
  }, []);

  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    const updateGasLift = rows.filter((row) => row.id !== id);
    updateWellConfig[configIndex].gaslift_valve = [...updateGasLift];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    const errorIndex = gasLiftError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = gasLiftError[errorIndex]?.cellErrors;
    const updateErrors = [...gasLiftError];
    errors = errors?.filter((er) => {
      let errCell = er.split(":")[0];
      return Number(errCell) !== id;
    });
    updateErrors[errorIndex] = {
      ...gasLiftError[errorIndex],
      cellErrors: errors,
    };
    setGasLiftError(updateErrors);
  };

  const handleCreate = () => {
    const sortedRows = [...rows].sort(function (a, b) {
      return a.id - b.id;
    });
    const lastRowId = rows?.length ? rows[rows?.length - 1]?.id : 0;
    const firstIndexValues = sortedRows[sortedRows?.length - 3];
    const newRow = {
      id: lastRowId + 1,
      md: firstIndexValues?.md,
      delta_pres: firstIndexValues?.delta_pres, //14.7,
      editMode: true,
    };
    setRows((prevRows) => [...prevRows, newRow]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].gaslift_valve = [...rows, newRow];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    const errorIndex = gasLiftError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = gasLiftError[errorIndex]?.cellErrors || [];
    if (errors?.length) {
      const updateErrors = [...gasLiftError];
      errors = errors?.filter((item) => item.includes(":"));
      updateErrors[errorIndex] = {
        ...gasLiftError[errorIndex],
        cellErrors: errors,
      };
      setGasLiftError(updateErrors);
    }
  };

  const handleImportedFileInputs = (fileContent) => {
    let csvData = fileContent?.split("\n");
    if (csvData?.length) {
      const headerKeys = columns
        ?.filter((item) => item.headerName !== "Actions")
        .map((el) => ({ label: el.headerName, attr: el.field }));
      const fileKeys = csvData[0].split(",");
      let keys = [];
      fileKeys?.forEach((item) => {
        const key = headerKeys?.find((h) => h.label === item)?.attr;
        keys.push(key);
      });
      const csvRowData = csvData.slice(1).map((item) => item?.split(","));

      let rows = csvRowData
        .map((values, index) => {
          let data = { id: index + 1, editMode: true };
          let discardRow = false;

          keys?.forEach((key, keyIndex) => {
            const value = parseFloat(values[keyIndex]);
            if (isNaN(value) || value < 0) {
              discardRow = true;
            }
            data = { ...data, [key]: values[keyIndex] };
          });
          if (!discardRow) {
            return data;
          }

          return null;
        })
        .filter(Boolean);

      setRows(rows);

      const rowsObj = {
        md: [],
        delta_pres: [],
      };
      if (rows?.length) {
        rows.forEach((item) => {
          keys?.forEach((key) => {
            rowsObj[key].push(item[key]);
          });
        });
      }
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      updateWellConfig[configIndex].gaslift_valve = rowsObj;
      const input = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };
      setBHPInputConfig(input);
      toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
      const errorIndex = gasLiftError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateErrors = [...gasLiftError];
      updateErrors[errorIndex] = {
        ...gasLiftError[errorIndex],
        cellErrors: [],
      };
      setGasLiftError(updateErrors);
    } else {
      toastCustomErrorMessage(
        Constants.UPLOAD_FILE_FORMAT_ERROR_MESSAGE,
        { style: { width: "400px" } },
        2000
      );
    }
  };

  const handleBhpFileImport = (event) => {
    if (event?.target?.files?.length) {
      const selectedFile = event?.target?.files[0];
      if (selectedFile.type === "text/csv") {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = () => {
          const fileContent = reader?.result;
          handleImportedFileInputs(fileContent);
        };
      } else {
        toastCustomErrorMessage(
          Constants.CSV_FILE_ERROR_MESSAGE,
          { style: { width: "400px" } },
          2000
        );
      }
    } else {
      toastCustomErrorMessage(
        Constants.UPLOAD_FILE_ERROR_MESSAGE,
        { style: { width: "400px" } },
        2000
      );
    }
  };

  const handleFileExport = () => {
    let csv = "";
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const rowValues = bhpInputConfig.wellboreConfig[configIndex].gaslift_valve;
    const dataRows = rowValues?.length
      ? rowValues
      : rowValues.md.map((mdValue, index) => ({
          md: mdValue,
          delta_pres: rowValues.delta_pres ? rowValues.delta_pres[index] : "",
        }));
    const headerKeys = columns
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
    exportCsv(csv, Constants.EXPORT_BHP_GAS_LIFT_FILE_NAME);
  };

  const handleShowClearDialog = (show) => {
    if (isInputChanged) {
      setShowClearConfirmationDialog(show);
    } else {
      setShowClearConfirmationDialog(false);
      //setShowModel(false);
    }
  };

  const handleClearModelInput = () => {
    setRows([]);
    setShowClearConfirmationDialog(false);
  };

  return (
    <>
      <Box width="calc(100vw - 475px)">
        <Box
          sx={{
            height: tableError?.length ? erroritemHeight : itemHeight,
          }}
        >
          <Box
            className={classes.addNewRow}
            sx={{ display: "flex", mt: -5, mb: 1, justifyContent: "end" }}
          >
            <IconButton onClick={() => setShowClearConfirmationDialog(true)}>
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
              <Tooltip title="Import" placement="bottom" arrow enterDelay={100}>
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
                    title={Constants.IMPORT_GAS_LIFT_DATA}
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
                    onChange={handleBhpFileImport}
                    accept={".csv"}
                    hidden
                    style={{ width: "1px" }}
                  />
                </Button>
              </Tooltip>
            </IconButton>

            <IconButton
              onClick={handleFileExport}
              disabled={bhpInputConfig.wellboreConfig.length > 0 ? false : true}
            >
              <Tooltip
                title={Constants.EXPORT_GAS_LIFT_DATA}
                placement="bottom"
                arrow
                enterDelay={100}
              >
                <FileDownload sx={{ color: theme.palette.text.primary }} />
              </Tooltip>
            </IconButton>

            <IconButton
              onClick={handleCreate}
              disabled={bhpInputConfig.wellboreConfig.length > 0 ? false : true}
            >
              <Tooltip
                title="Add new row"
                placement="bottom"
                arrow
                enterDelay={100}
              >
                <AddCircleOutline sx={{ color: theme.palette.text.primary }} />
              </Tooltip>
            </IconButton>
          </Box>

          <Box ml={1} bgcolor={"red"} height="100%">
            <Box
              className={`${
                theme.palette.mode === "dark"
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
                ref={gasLiftRef}
                rowData={rows}
                columnDefs={columns}
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
        {Boolean(showClearConfirmationDialog) && (
          <ConfirmationPopup
            open={showClearConfirmationDialog}
            handleClose={() => handleShowClearDialog(false)}
            handleConfirm={handleClearModelInput}
            warnMessage={Constants.CLEAR_MESSAGE}
          />
        )}
      </Box>
    </>
  );
};

export default BhpGasLift;
