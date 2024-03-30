import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  IconButton,
  Tooltip,
  InputBase,
  Box,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "tss-react/mui";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useWindowSize } from "../constant/getWindowSize";
import * as Constants from "../constant/ModelConstants";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  toastCustomErrorMessage,
  toastCustomSuccessMessage,
} from "../../utils/toast";
import { exportDateTimeCSV as exportCsv } from "../../utils/exportCSV";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import HighChartsWrapperV3 from "../HighChartsWrapperV3Poc";
import { useTheme } from "@emotion/react";
import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";
import ConfirmationPopup from "../ConfirmationPopup";
import { AgGridReact } from "ag-grid-react";
import {
  Delete,
  DeleteForever,
  Edit,
  FileDownload,
  Publish,
} from "@mui/icons-material";
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
    height: "38px",
  },
  customDataGrid: {
    borderRadius: "15px",
    background: theme.palette.background.chart,
    overflow: "hidden",
    "& .MuiDataGrid-columnHeader": {
      background: theme.palette.background.header,
      color: theme.palette.text,
    },
    "& .MuiDataGrid-cell--editing": {
      backgroundColor: theme.palette.background.header + "!important",
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
  fileButton: {
    marginRight: 3,
    height: 35,
    marginTop: 0,
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
  },
  cartbox: {
    height: "100%",
    [theme.breakpoints.down("1370")]: {
      height: "92%",
    },
  },
}));

const ProductionTable = (props) => {
  const {
    isInputChanged,
    lastRowIndex,
    setLastRowIndex,
    scrollIndex,
    setScrollIndex,
    bhpInputConfig,
    selectedConfigDate,
    surveyError,
    setSurveyError,
    setIsInputChanged,
    setBHPInputConfig,
  } = props;
  const { classes } = useStyles();
  const theme = useTheme();
  const dataGridRef = useRef(null);
  const gridRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [scroll, setScroll] = useState(0);
  const rowValues = bhpInputConfig.wellboreConfig?.find(
    (item) => item?.datetime === selectedConfigDate
  )?.deviation_survey;
  const initialRow = rowValues?.length
    ? rowValues
    : rowValues?.md?.map((mdValue, index) => ({
        id: index + 1,
        md: mdValue,
        tvd: (rowValues?.tvd || [])[index],
        editMode: true,
      }));
  const [rows, setRows] = useState(initialRow || []);
  const [tableError, setTableError] = useState([]);
  const [showClearConfirmationDialog, setShowClearConfirmationDialog] =
    useState(false);

  const { height: windowHeight } = useWindowSize();

  const itemHeight = useMemo(() => {
    return windowHeight - 290;
  }, [windowHeight]);
  const erroritemHeight = useMemo(() => {
    return windowHeight - 360;
  }, [windowHeight]);

  const isCellErrorExist = (id, field) => {
    const errorIndex = surveyError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const errors = surveyError[errorIndex]?.cellErrors;
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
    if (field === "md" || field === "tvd") {
      let currentField = field === "md" ? "MD" : "TVD";
      let compareField = field === "md" ? "TVD" : "MD";
      let comparer = field === "md" ? "less" : "greater";
      const compRow = rows?.find((item) => item.id === id);
      if (
        field === "md" &&
        compRow &&
        (Number(value) < Number(compRow["tvd"]) || value < 0 || value === null)
      ) {
        errorMsg = `${currentField} value can not be ${comparer} than ${compareField} and not less than 0`;
        // toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      } else if (
        (field === "tvd" && compRow && Number(value) > Number(compRow["md"])) ||
        value < 0 ||
        value === null
      ) {
        errorMsg = `${currentField} value can not be ${comparer} than ${compareField} and not less than 0`;
        // toastCustomErrorMessage(errorMsg, { style: { width: "400px" } }, 2000);
      }
      // else {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, [field]: newValue } : row
        )
      );

      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      const updateDeviationSurvey = [...rows];
      const rowIndex = rows?.findIndex((item) => item.id === id);
      const row = rows[rowIndex];
      updateDeviationSurvey[rowIndex] = { ...row, [field]: newValue };
      updateWellConfig[configIndex].deviation_survey = [
        ...updateDeviationSurvey,
      ];
      const newBhpInputConfig = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };

      setBHPInputConfig(newBhpInputConfig);
      setIsInputChanged(true);
      // }
      const hasCellError = isCellErrorExist(id, field);
      const cellError = `${id}:${field}`;
      const errorIndex = surveyError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      let errors = [...surveyError[errorIndex]?.cellErrors];
      const updateErrors = [...surveyError];
      if (!hasCellError && errorMsg !== "") {
        errors?.push(`${cellError}:${errorMsg}`);
        updateErrors[errorIndex] = {
          ...surveyError[errorIndex],
          cellErrors: errors,
        };
        setSurveyError(updateErrors);
      }
      if (hasCellError && errorMsg === "") {
        errors = errors?.filter((er) => {
          let errCell = er.split(":");
          errCell = `${errCell[0]}:${errCell[1]}`;
          return errCell !== cellError;
        });
        updateErrors[errorIndex] = {
          ...surveyError[errorIndex],
          cellErrors: errors,
        };
        setSurveyError(updateErrors);
      }
    }
  };

  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    const updateDeviationSurvey = rows.filter((row) => row.id !== id);
    updateWellConfig[configIndex].deviation_survey = [...updateDeviationSurvey];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    const errorIndex = surveyError?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    let errors = surveyError[errorIndex]?.cellErrors;
    const updateErrors = [...surveyError];
    errors = errors?.filter((er) => {
      let errCell = er.split(":")[0];
      return Number(errCell) !== id;
    });
    updateErrors[errorIndex] = {
      ...surveyError[errorIndex],
      cellErrors: errors,
    };
    setSurveyError(updateErrors);
  };

  const generateRenderCell = (field) => (params) => {
    const { id } = params.row;
    const value = params.row[field];
    if (params.row.editMode) {
      return (
        <InputBase
          id={`${params.row.id}_${field}`}
          name={field}
          value={value}
          onChange={(e) => handleInputChange(id, field, e.target.value)}
        />
      );
    } else {
      return value;
    }
  };
  const columns = useMemo(() => {
    return [
      {
        field: "md",
        headerName: "MD (ft)",
        type: "number",
        flex: 1,
        // width: 250,
        editable: true,
        renderCell: generateRenderCell("md"),
        headerAlign: "left",
        align: "left",
      },
      {
        field: "tvd",
        headerName: "TVD (ft)",
        type: "number",
        flex: 1,
        // width: 250,
        editable: true,
        renderCell: generateRenderCell("tvd"),
        headerAlign: "left",
        align: "left",
      },
      {
        width: 200,
        field: "editActions",
        headerName: "Actions",
        flex: 0.2,
        headerAlign: "right",
        align: "right",
        renderCell: (params) => (
          <Box>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              sx={{ padding: "0px" }}
              onClick={() => handleDelete(params.row.id)}
              color="inherit"
              disabled={rows?.length <= 2}
            />
          </Box>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const handleCreate = () => {
    const sortedRows = [...rows].sort(function (a, b) {
      return a.id - b.id;
    });
    const firstIndexValues = sortedRows[sortedRows?.length - 60];
    const lastRowId = sortedRows?.length
      ? sortedRows[sortedRows?.length - 1]?.id
      : 0;
    const newRow = {
      id: lastRowId + 1,
      md: firstIndexValues?.md,
      tvd: firstIndexValues?.tvd,
      editMode: true,
    };
    setRows([...rows, newRow]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].deviation_survey = [...rows, newRow];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    const rowsPerPage = 100;
    const totalRows = [...rows, newRow]?.length;
    const newPageNumber = Math.ceil(totalRows / rowsPerPage);
    setCurrentPage(newPageNumber - 1);
    // Calculate the index of the last row on the newly selected page
    const lastRowIndexOnNewPage =
      totalRows % rowsPerPage === 0
        ? rowsPerPage - 1
        : (totalRows % rowsPerPage) - 1;
    setLastRowIndex(lastRowIndexOnNewPage);
  };

  useEffect(() => {
    setTimeout(() => {
      const element = dataGridRef?.current?.querySelector(".MuiDataGrid-main");
      let scrollableElement = element && element.childNodes[1]?.firstChild;
      let gridLastIndex = (rows?.length - 1) % 100;
      if (scrollableElement && gridLastIndex === lastRowIndex) {
        const scrollHeight = scrollableElement.scrollHeight;
        const height = scrollableElement.clientHeight;
        const maxScrollTop = scrollHeight - height;
        scrollableElement.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        setScrollIndex(currentPage * 100 + lastRowIndex);
      }
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, currentPage, lastRowIndex]);

  useEffect(() => {
    setTimeout(() => {
      let focusElement = document.getElementsByClassName(
        "MuiDataGrid-virtualScrollerRenderZone"
      );
      if (focusElement && rows?.length - 1 === scrollIndex) {
        focusElement = focusElement[0];
        const newRowIndex = `[data-rowindex="${scrollIndex.toString()}"]`;
        focusElement = focusElement?.querySelectorAll(newRowIndex);
        focusElement = focusElement?.length && focusElement[0].firstChild;
        focusElement.focus();
      }
    }, 500);
  }, [rows, scrollIndex]);

  useEffect(() => {
    setTimeout(() => {
      const handleScroll = (event) => {
        setScroll(event.target.scrollTop);
      };
      const scrollbarThumb = dataGridRef?.current?.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (scrollbarThumb) {
        scrollbarThumb.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (scrollbarThumb) {
          scrollbarThumb.removeEventListener("scroll", handleScroll);
        }
      };
    }, 500);
  }, [dataGridRef]);

  useEffect(() => {
    setTimeout(() => {
      const errorIndex = surveyError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const errors = surveyError[errorIndex]?.cellErrors;
      if (errors?.length) {
        let focusElement =
          dataGridRef?.current?.querySelector(".MuiDataGrid-main");
        focusElement = focusElement && focusElement.childNodes[1]?.firstChild;
        focusElement = focusElement && focusElement.childNodes[0]?.firstChild;
        if (focusElement) {
          errors?.forEach((item) => {
            const elem = item.split(":");
            const id = Number(elem[0]);
            const field = elem[1];
            const rowId = `[data-id="${id.toString()}"]`;
            let errorElements = focusElement?.querySelectorAll(rowId);
            errorElements = errorElements?.length && errorElements[0];
            const cell = `[data-field="${field}"]`;

            if (errorElements) {
              const errorElement = errorElements.length
                ? errorElements[0]
                : errorElements;
              const cells = errorElement?.querySelectorAll(cell);

              if (cells) {
                cells[0]?.classList.add("error");
              }
            }
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
  }, [surveyError, selectedConfigDate, scroll]);

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
      const csvRowData = csvData.slice(1, csvData.length).filter((item) => {
        const values = item?.split(",");
        return !keys.some((key, keyIndex) => {
          return key === "tvd" || key === "md"
            ? values[keyIndex] === undefined ||
                values[keyIndex].trim() === "" ||
                values[0] < values[1] ||
                values[keyIndex] < 0
            : false;
        });
      });

      let deviationRows = csvRowData.map((item, index) => {
        const values = item?.split(",");
        let data = {
          id: index + 1,
          editMode: true,
        };
        keys?.forEach((key, keyIndex) => {
          data = { ...data, [key]: values[keyIndex] };
        });
        return data;
      });
      setRows(deviationRows);

      const deviationObj = {
        md: [],
        tvd: [],
      };
      if (deviationRows?.length) {
        deviationRows.forEach((item) => {
          keys?.forEach((key) => {
            deviationObj[key].push(item[key]);
          });
        });
      }
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      updateWellConfig[configIndex].deviation_survey = deviationObj;
      const input = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };
      setBHPInputConfig(input);
      toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
      const errorIndex = surveyError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateErrors = [...surveyError];
      updateErrors[errorIndex] = { ...surveyError[errorIndex], cellErrors: [] };
      setSurveyError(updateErrors);
    } else {
      toastCustomErrorMessage(
        Constants.UPLOAD_FILE_FORMAT_ERROR_MESSAGE,
        { style: { width: "400px" } },
        2000
      );
    }
  };

  const handleBhpProductionImport = (event) => {
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

  const handleBhpProductionExport = () => {
    let csv = "";
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const rowValues =
      bhpInputConfig.wellboreConfig[configIndex].deviation_survey;
    const dataRows = rowValues?.length
      ? rowValues
      : rowValues.md.map((mdValue, index) => ({
          md: mdValue,
          tvd: rowValues.tvd ? rowValues.tvd[index] : "",
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
    exportCsv(csv, Constants.EXPORT_BHP_DEVIATION_SURVEY_FILE_NAME);
  };
  const surveyChartConfig = useMemo(() => {
    let sortedRows = [...rows].sort(function (a, b) {
      return a.md - b.md;
    });
    const mdValues = sortedRows?.map((row) => parseFloat(row.md) || 0);
    const tvdValues = sortedRows?.map((row) => parseFloat(row.tvd) || 0);
    const minLength = Math.min(mdValues.length, tvdValues.length);
    const seriesData = Array.from({ length: minLength }, (_, index) => [
      tvdValues[index],
      mdValues[index],
    ]);
    const config = {
      chart: {
        inverted: true,
        zoomType: "x",
        type: "line",
        marginLeft: 75,
        marginRight: 10,
        marginTop: 15,
        zooming: {
          mouseWheel: false,
        },
      },
      xAxis: [
        {
          reversed: true,
          crosshair: true,
          gridLineWidth: 0,
          lineColor: "#9e9e9e",
          lineWidth: 1,
          title: {
            text: "TVD (ft)",
          },
          autoFormatAxis: {
            minValue: 0,
            maxValue: 99999,
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
      ],
      yAxis: {
        reversed: false,
        gridLineWidth: 0,
        lineColor: "#9e9e9e",
        lineWidth: 1,
        title: {
          text: "MD (ft)",
        },
        autoFormatAxis: {
          minValue: 0,
          maxValue: 99999,
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
      exporting: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        formatter: deviationsurveyTooltipFormatter(theme?.palette),
      },
      series: [
        {
          name: "MD",
          data: seriesData,
        },
      ],
      legend: {
        enabled: false,
        itemStyle: {
          color: [theme?.palette?.text?.primary],
          textDecoration: function () {
            return this.visible ? "none" : "none";
          },
        },
      },
    };
    return config;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const handleShowClearDialog = (show) => {
    if (isInputChanged) {
      setShowClearConfirmationDialog(show);
    } else {
      setShowClearConfirmationDialog(false);
    }
  };

  const handleClearModelInput = () => {
    setRows([]);
    setShowClearConfirmationDialog(false);
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
            params?.api?.startEditingCell({
              rowIndex: params?.node?.rowIndex,
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

  const columnDefs = [
    { headerName: "ID", field: "id", editable: false },
    { headerName: "MD", field: "md", editable: true },
    { headerName: "TVD", field: "tvd", editable: true },
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

  return (
    <Box width="calc(100vw - 475px)">
      <Box sx={{ height: tableError?.length ? erroritemHeight : itemHeight }}>
        <Box sx={{ display: "flex", mt: -5, mb: 1, justifyContent: "end" }}>
          {/* <Box sx={{ display:'flex' , alignItems:'baseline', justifyContent:'flex-end' , width: '41%'}}> */}
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
                  title={Constants.IMPORT_DEVIATION_SURVEY_DATA}
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
                  onChange={handleBhpProductionImport}
                  accept={".csv"}
                  hidden
                  style={{ width: "1px" }}
                />
              </Button>
            </Tooltip>
          </IconButton>

          <IconButton
            onClick={handleBhpProductionExport}
            disabled={bhpInputConfig.wellboreConfig.length > 0 ? false : true}
          >
            <Tooltip
              title={Constants.EXPORT_DEVIATION_SURVEY_DATA}
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
        <Box display="flex" height="100%">
          <Grid item md={6} className={classes?.cartbox}>
            <HighChartsWrapperV3
              options={surveyChartConfig}
              title={"Deviation Survey"}
              showDefaultLegend={false}
            />
          </Grid>
          <Grid item md={6} className={classes.cartbox} ml={1.5}>
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
                  ref={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
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
          </Grid>
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
    </Box>
  );
};

function deviationsurveyTooltipFormatter(color) {
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
            : point?.series?.options?.unit || "ft"
        }`
      );
    }, `<span style=' color: ${color?.text?.primary}'>TVD : </span>` +
      `<b style=' font-weight: 700; color: ${color?.text?.primary}'>` +
      (this?.x).toFixed(2) +
      "</b>" +
      `<span style=' color: ${color?.text?.primary}'> ft</span>`)}</div>`;
  };
}

export default ProductionTable;
