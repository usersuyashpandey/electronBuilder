import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useWindowSize } from "../constant/getWindowSize";
import { useEffect } from "react";
import { useRef } from "react";
import {
  AddCircleOutline,
  Delete,
  DeleteForever,
  Edit,
  Publish,
  UploadFile,
} from "@mui/icons-material";
import FileDownload from "@mui/icons-material/FileDownload";
import { exportDateTimeCSV as exportCsv } from "../../utils/exportCSV";
import * as Constants from "../constant/ModelConstants";
import {
  toastCustomErrorMessage,
  toastCustomSuccessMessage,
} from "../../utils/toast";
import HighChartsWrapperV3 from "../HighChartsWrapperV3Poc";
import { useTheme } from "@emotion/react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";
import ConfirmationPopup from "../ConfirmationPopup";
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
    borderRadius: "15px",
    background: theme.palette.background.chart,
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
    marginRight: 4,
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
  fileButton: {
    height: 35,
    marginTop: 1.5,
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
    [theme.breakpoints.down("1290")]: {
      height: "92%",
    },
  },
}));

const ProductionTable = (props) => {
  const {
    isInputChanged,
    bhpInputConfig,
    selectedConfigDate,
    thermalError,
    setThermalError,
    setIsInputChanged,
    setBHPInputConfig,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const rowValues = bhpInputConfig.wellboreConfig?.find(
    (item) => item?.datetime === selectedConfigDate
  )?.geothermal_gradient;
  const initialRow = rowValues?.length
    ? rowValues
    : rowValues?.md?.map((mdValue, index) => ({
        id: index + 1,
        md: mdValue,
        tvd: (rowValues?.tvd || [])[index],
        temp: (rowValues?.temp || [])[index],
        editMode: true,
      }));
  const [rows, setRows] = useState(initialRow || []);
  const [tableError, setTableError] = useState([]);
  const { height: windowHeight } = useWindowSize();
  const pageRoute = useLocation();

  const itemHeight = useMemo(() => {
    return windowHeight - 290;
  }, [windowHeight]);
  const erroritemHeight = useMemo(() => {
    return windowHeight - 360;
  }, [windowHeight]);

  const thermalRef = useRef();
  const [gradientSeries, setGradientSeries] = useState();
  const [showClearConfirmationDialog, setShowClearConfirmationDialog] =
    useState(false);

  let sortedRows = [...rows].sort(function (a, b) {
    if (a.md === null || b.md === null) {
      return 0;
    }
    return a.md - b.md;
  });

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
      { headerName: "Temperature (F)", field: "temp", editable: true },
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
      // {
      //   field: "md",
      //   headerName: "MD (ft)",
      //   type: "number",
      //   flex: 1,
      //   editable: true,
      //   headerAlign: "left",
      //   align: "left",
      // },
      // {
      //   field: "temp",
      //   headerName: "Temperature (F)",
      //   type: "number",
      //   flex: 1,
      //   //  width: 300,
      //   editable: true,
      //   headerAlign: "left",
      //   align: "left",
      // },
      // {
      //   field: "editActions",
      //   headerName: "Actions",
      //   flex: 0.3,
      //   headerAlign: "right",
      //   align: "right",
      //   renderCell: (params) => (
      //     <Box>
      //       <GridActionsCellItem
      //         icon={<DeleteIcon />}
      //         label="Delete"
      //         // sx={{ padding: '0px' }}
      //         onClick={() => handleDelete(params.row.id)}
      //         color="inherit"
      //         disabled={rows?.length <= 2}
      //       />
      //     </Box>
      //   ),
      // },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rows,
    bhpInputConfig,
    selectedConfigDate,
    setBHPInputConfig,
    setIsInputChanged,
    setThermalError,
    thermalError,
  ]);

  const components = useMemo(() => {
    return {
      actionsRenderer: actionsRenderer,
    };
  }, []);

  const handleCreate = () => {
    // let defaultValues = rows?.length && rows[0];
    rows.sort(function (a, b) {
      return a.id - b.id;
    });
    const lastRowId = rows?.length ? rows[rows?.length - 1]?.id : 0;
    const firstIndexValues = sortedRows[sortedRows?.length - 2];
    const newRow = {
      id: lastRowId + 1,
      md: firstIndexValues?.md,
      temp: firstIndexValues?.temp,
      editMode: true,
    };
    setRows((prevRows) => [...prevRows, newRow]);
    const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
      (item) => item.datetime === selectedConfigDate
    );
    const updateWellConfig = bhpInputConfig.wellboreConfig;
    updateWellConfig[configIndex].geothermal_gradient = [...rows, newRow];
    const newBhpInputConfig = {
      ...bhpInputConfig,
      wellboreConfig: updateWellConfig,
    };
    setBHPInputConfig(newBhpInputConfig);
    setIsInputChanged(true);
    setTimeout(() => {
      const newRowId = lastRowId + 1;
      const cellElement = document.querySelector(
        `[data-id="${newRowId}"] [data-field="md"]`
      );

      if (cellElement) {
        cellElement.focus();
      }
    }, 0);
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
      const csvRowData = csvData.slice(1, csvData.length).filter((item) => {
        const values = item?.split(",");
        return !keys.some((key, keyIndex) => {
          return key === "temp" || key === "md"
            ? values[keyIndex] === undefined ||
                values[keyIndex].trim() === "" ||
                values[0] < 0 ||
                values[1] < -460
            : false;
        });
      });

      let geothermalRows = csvRowData.map((item, index) => {
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
      setRows(geothermalRows);

      const geothermalobj = {
        md: [],
        temp: [],
      };
      if (geothermalRows?.length) {
        geothermalRows.forEach((item) => {
          keys?.forEach((key) => {
            geothermalobj[key].push(item[key]);
          });
        });
      }
      const configIndex = bhpInputConfig.wellboreConfig?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateWellConfig = bhpInputConfig.wellboreConfig;
      updateWellConfig[configIndex].geothermal_gradient = geothermalobj;
      const input = {
        ...bhpInputConfig,
        wellboreConfig: updateWellConfig,
      };
      setBHPInputConfig(input);
      toastCustomSuccessMessage(Constants.UPLOAD_FILE_FORMAT_SUCCESS_MESSAGE);
      const errorIndex = thermalError?.findIndex(
        (item) => item.datetime === selectedConfigDate
      );
      const updateErrors = [...thermalError];
      updateErrors[errorIndex] = {
        ...thermalError[errorIndex],
        cellErrors: [],
      };
      setThermalError(updateErrors);
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
      bhpInputConfig.wellboreConfig[configIndex].geothermal_gradient;
    const dataRows = rowValues?.length
      ? rowValues
      : rowValues.md.map((mdValue, index) => ({
          id: index + 1,
          md: mdValue,
          temp: rowValues.temp ? rowValues.temp[index] : "",
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
    exportCsv(
      csv,
      pageRoute.pathname === "/bhp-calc"
        ? Constants.EXPORT_BHP_GEOTHERMAL_GREADIENT_FILE_NAME
        : Constants.EXPORT_LL_GEOTHERMAL_GREADIENT_FILE_NAME
    );
  };
  useEffect(() => {
    const mdValues = sortedRows.map((row) => parseFloat(row.md) || 0);
    const tempValues = sortedRows.map((row) => parseFloat(row.temp) || 0);
    const minLength = Math.min(mdValues.length, tempValues.length);
    const seriesData = Array.from({ length: minLength }, (_, index) => [
      tempValues[index],
      mdValues[index],
    ]);
    // seriesData.sort((a, b) => a[0] - b[0]);
    setGradientSeries(seriesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, thermalRef]);

  const gradientChartConfig = {
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
        crosshair: true,
        gridLineWidth: 0,
        lineColor: "#9e9e9e",
        lineWidth: 1,
        title: {
          text: "Temperature (F)",
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
      formatter: geothermalgradientTooltipFormatter(theme?.palette),
    },
    series: [
      {
        name: "MD",
        data: gradientSeries,
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
                    title={Constants.IMPORT_GEOTHERMAL_GREADIENT_DATA}
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
                title={Constants.EXPORT_GEOTHERMAL_GREADIENT_DATA}
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
          <Box container="true" display="flex" height="100%" width={"100%"}>
            <Grid item md={6} className={classes.cartbox}>
              <HighChartsWrapperV3
                options={gradientChartConfig}
                title={"Geothermal Gradient"}
                showDefaultLegend={false}
              />
            </Grid>
            <Grid item md={6} ml={1.5}>
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
                    ref={thermalRef}
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
    </>
  );
};

function geothermalgradientTooltipFormatter(color) {
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
    }, `<span style=' color: ${color?.text?.primary}'>Temperature : </span>` +
      `<b style=' font-weight: 700; color: ${color?.text?.primary}'>` +
      (this?.x).toFixed(2) +
      "</b>" +
      `<span style=' color: ${color?.text?.primary}'> F</span>`)}</div>`;
  };
}

export default ProductionTable;
