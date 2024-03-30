import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useTheme } from '@mui/system';
import { format } from 'date-fns';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import {
  AddCircleOutline,
  DeleteForever,
  FileDownload,
  Publish,
} from '@mui/icons-material';

const BhpProduction = ({ data }) => {
  const theme = useTheme();
  const prodData = data?.productionData;
  const initialGridRows = prodData?.datetime?.map((timestamp, index) => ({
    datetime: format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss'),
    qo: parseFloat(prodData.qo[index].toFixed(2)),
    qg: parseFloat(prodData.qg[index].toFixed(2)),
    qw: parseFloat(prodData.qw[index].toFixed(2)),
    pres_casing: parseFloat(prodData.pres_casing[index].toFixed(2)),
    pres_tubing: parseFloat(prodData.pres_tubing[index].toFixed(2)),
    // measured_bhp: parseFloat(prodData?.measured_bhp[index].toFixed(2)),
    qg_lift: parseFloat(prodData.qg_lift[index].toFixed(2)),
  }));

  const [gridRows, setGridRows] = useState(initialGridRows);

  const columnDefs = [
    {
      headerName: 'Datetime',
      field: 'datetime',
      pinned: 'left',
      flex: 1,
      minWidth: 140,
      editable: true,
    },
    {
      headerName: 'Oil Rate (STB/d)',
      field: 'qo',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      headerName: 'Gas Rate (SCF/d)',
      field: 'qg',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      headerName: 'Water Rate (STB/d)',
      field: 'qw',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      headerName: 'Pressure Casing (psia)',
      field: 'pres_casing',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      headerName: 'Pressure Tubing (psia)',
      field: 'pres_tubing',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      headerName: 'Measured BHP (psia)',
      field: 'measured_bhp',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      headerName: 'Gas Lift Injection Rate (SCF/d)',
      field: 'qg_lift',
      flex: 1,
      minWidth: 100,
      editable: true,
    },
  ];

  const handleExport = () => {
    const exportData = gridRows?.map((row) => ({
      datetime: row.datetime,
      qo: row.qo,
      qg: row.qg,
      qw: row.qw,
      pres_casing: row.pres_casing,
      pres_tubing: row.pres_tubing,
      measured_bhp: row.measured_bhp,
      qg_lift: row.qg_lift,
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      Object.keys(exportData[0]).join(',') +
      '\n' +
      exportData.map((row) => Object.values(row).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'exported_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddRow = () => {
    const rowValues = data?.productionData;
    const newRow = {
      datetime: format(
        new Date(rowValues?.datetime[0] * 1000),
        'yyyy-MM-dd HH:mm:ss',
      ),
      pres_casing: rowValues.pres_casing && rowValues.pres_casing[0],
      pres_tubing: rowValues.pres_tubing && rowValues.pres_tubing[0],
      qg: rowValues.qg && rowValues.qg[0],
      qo: rowValues.qo && rowValues.qo[0],
      qw: rowValues.qw && rowValues.qw[0],
      measured_bhp: rowValues.measured_bhp && rowValues.measured_bhp[0],
      qg_lift: rowValues.qg_lift && rowValues.qg_lift[0],
    };
    setGridRows((prevRows) => [...prevRows, newRow]);
  };

  const handleClear = () => {
    setGridRows(initialGridRows);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImportedFileInputs = (fileContent) => {
    const csvData = fileContent?.split('\n');
    if (csvData?.length) {
      while (csvData?.length > 0 && !csvData[csvData?.length - 1].trim()) {
        csvData.pop();
      }
      const headerKeys = columnDefs.map((el) => el.field);
      const fileKeys = csvData[0]?.split(',');

      if (headerKeys.length === fileKeys.length) {
        const keys = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fileKeys?.forEach((item) => {
          const key = headerKeys.find((h) => h === item.trim());
          keys?.push(key);
        });

        const csvRowData = csvData.slice(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredCsvRowData = csvRowData.filter(
          (row) =>
            !row.split(',').some((value) => value === null || value === 'null'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productionRows = filteredCsvRowData.map((item) => {
          const values = item.split(',');

          // Create the data object dynamically with type assertion
          const data = headerKeys.reduce((acc, key, index) => {
            return {
              ...acc,
              [key]:
                key === 'datetime'
                  ? format(new Date(values[index]), 'yyyy-MM-dd HH:mm:ss')
                  : parseFloat(values[index]),
            };
          }, {});

          return data;
        });
        setGridRows(productionRows);
      } else {
        console.error(
          'Number of columns in the file does not match the expected columns.',
        );
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBhpProductionImport = (event) => {
    if (event?.target?.files?.length) {
      const selectedFile = event?.target?.files[0];
      if (selectedFile.type === 'text/csv') {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const fileContent = reader?.result;

          handleImportedFileInputs(fileContent);
        };
      }
      event.target.value = '';
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
    };
  }, []);

  return (
    <Box margin="12px" height="100%" pb={1}>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          justifyContent: 'space-between',
          height: '5%',
        }}
      >
        <Typography
          style={theme?.components?.typography?.body3Large}
          align="center"
        >
          Production Table
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '155px',
          }}
        >
          <IconButton onClick={handleClear}>
            <Tooltip
              title="clear All"
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
                  minWidth: '20px',
                }}
              >
                <Tooltip
                  title="Import"
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
                  accept={'.csv'}
                  hidden
                  style={{ width: '1px' }}
                />
              </Button>
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleExport}>
            <Tooltip title="Export" placement="bottom" arrow enterDelay={100}>
              <FileDownload sx={{ color: theme.palette.text.primary }} />
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleAddRow}>
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
      </Box>
      <Box
        className={`${
          theme.palette.mode === 'dark'
            ? 'ag-theme-alpine-dark'
            : 'ag-theme-alpine'
        } custom-ag-grid`}
        style={{
          paddingBottom: '6px',
          height: '85%',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'auto',
          fontFamily: 'Poppins',
        }}
      >
        <AgGridReact
          rowData={gridRows}
          columnDefs={columnDefs}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
        />
      </Box>
    </Box>
  );
};

export default BhpProduction;
