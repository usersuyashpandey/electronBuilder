import React, {  useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import { TimeFormat } from '../../constants/TimeFormat';
import { FusionInputNumber } from '../Input';
import { DataGrid } from '@mui/x-data-grid';
import DatePickerV1 from '../DatePickerV1';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const useStyles = makeStyles((theme) => ({
    propSelector: {
        marginTop: "4px"
    },
    inputFields: {
        "& .MuiFormControl-root.MuiTextField-root": {
            width: "95%"
        },
        "& .MuiFormLabel-root.MuiInputLabel-root": {
            fontWeight: 450,
            lineHeight: "1em",
            fontSize: "20px" //"1.2rem"
        },
        "& .MuiInputBase-root.MuiOutlinedInput-root": {
            fontSize: "1.3rem"
        },
        "& .MuiInputBase-input.MuiOutlinedInput-input": {
            fontSize: "18px"
        }

    },
    inputField: {
        "@media (max-width: 840px)": {
            maxWidth: "90%",
            minWidth: "50%"
        }
    },
    inputError: {
        color: 'red',
        borderColor: 'red',
    },
    fluidTypeRow: {
        display: "flex",
        // paddingTop: "24px",
        flexDirection: "row",
        "@media (max-width: 690px)": {
            flexDirection: "column"
        }
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
            width: "35px"
        },
        "&:hover": {
            backgroundColor: theme.palette.background.header
        },
        [theme.breakpoints.down('900')]: {
            marginTop: 10,
        }
    },
    fileButton: {
        height: 35,
        marginTop: -4,
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
            width: "35px"
        },
        "&:hover": {
            backgroundColor: theme.palette.background.header
        },
        [theme.breakpoints.down('900')]: {
            marginTop: 10,
        }
    },
    fluidType: {
        display: "flex",
        flexDirection: "row",
        paddingLeft: "10px",
        flexGrow: 1,
        justifyContent: "space-between",
        "@media (max-width: 835px)": {
            flexDirection: "column"
        },
        "@media (max-width: 690px)": {
            flexDirection: "row",
            paddingLeft: "16px"
        }
    },

}));


const ForecastModelConfigParameter = ({
    bhpInputConfig,
    setBHPInputConfig,
    setIsInputChanged,
    modelInputs,
    setSelectedValue,
    selectedValue,
    modelOutputData
}) => {
    const classes = useStyles();
    const [isToggled, setIsToggled] = useState(false);
    const [rows, setRows] = useState([
        // { id: 1, dateTime: '', bhp: '' },
        // { id: 2, dateTime: '', bhp: '' },
    ]);
    const [forecastStartDate, setForecastStartDate] = useState(moment.unix(bhpInputConfig?.forecast_settings?.forecastEndDate)?.utc()?.add(1, 'day')?.format(TimeFormat?.dateShort));
    const [forecastEndDate, setForecastEndDate] = useState(moment.unix(bhpInputConfig?.forecast_settings?.forecastEndDate)?.utc()?.add(1, 'year')?.add(1, 'day')?.format(TimeFormat?.dateShort));
    const [arpParameters, setArpParameters] = useState({
        BHPi: bhpInputConfig.pwf_sensitivity.fit_params.yi,
        Di: bhpInputConfig.pwf_sensitivity.fit_params.logdi,
        B: bhpInputConfig.pwf_sensitivity.fit_params.b,
    });

    const handleInputChange = (event, inputField) => {
        const value = event.target.value;
        setIsInputChanged(true);
        setArpParameters(prevState => ({
            ...prevState,
            [inputField]: value,
        }));
    };
    const handleModelInputChange = (event) => {
        const value = event;
        if (value) {
            setIsInputChanged(true);
            setSelectedValue(value);
            if (value === 'auto') {
                const updatedBHPInputConfig = {
                    ...bhpInputConfig,
                    auto_generate_pwf_forecast: true,
                };
                setBHPInputConfig(updatedBHPInputConfig);
            } else if (value === 'parameter') {
                const updatedBHPInputConfig = {
                    ...bhpInputConfig,
                    auto_generate_pwf_forecast: false,
                    forecast_settings: {
                        ...bhpInputConfig?.forecast_settings,
                        forecast_methods: {
                            ...bhpInputConfig?.forecast_settings?.forecast_methods,
                            pwf: "arps"
                        }
                    },
                    pwf_sensitivity: {
                        ...bhpInputConfig?.pwf_sensitivity,
                        fit_params: {
                            ...bhpInputConfig?.pwf_sensitivity?.fit_params,
                            yi: arpParameters?.BHPi,
                            logdi: arpParameters?.Di,
                            b: arpParameters?.B
                        }
                    }
                };
                setBHPInputConfig(updatedBHPInputConfig);
            } else {
                const updatedPwfFcastArray = modelOutputData?.forecast[1]?.data_fcast?.pwf;
                const updatedBHPInputConfig = {
                    ...bhpInputConfig,
                    auto_generate_pwf_forecast: false,
                    forecast_settings: {
                        ...bhpInputConfig?.forecast_settings,
                        forecast_methods: {
                            ...bhpInputConfig?.forecast_settings?.forecast_methods,
                            pwf: "custom"
                        }
                    },
                    pwf_sensitivity: {
                        ...bhpInputConfig?.pwf_sensitivity,
                        pwf_fcast_array: updatedPwfFcastArray
                    }
                };
                setBHPInputConfig(updatedBHPInputConfig);
            }
        }
    };

    const handleToggle = (el) => {
        const updatedBHPInputConfig = {
            ...bhpInputConfig,
            multisegmentPIFitParams: {
                ...bhpInputConfig?.multisegmentPIFitParams,
                num_breakpoints: isToggled === true ? 0 : 4,
            }
        };
        setBHPInputConfig(updatedBHPInputConfig);
        setIsToggled(!isToggled);
        setIsInputChanged(true);
    };

    const columns = [
        // { field: 'id', headerName: 'ID', flex: 1, },
        {
            field: 'dateTime',
            headerName: 'DateTime',
            flex: 1,
            editable: true,
            type: 'dateTime',
            headerAlign: 'left',
            align: 'left',
            valueFormatter: (params) => {
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                return new Date(params.value).toLocaleDateString(undefined, options);
            }
        },
        { field: 'bhp', headerName: 'BHP', type: 'number', headerAlign: 'left', align: 'left', flex: 1, editable: true },
    ];

    const handleCellEditCommit = (params, forecastStartDate) => {
        const updatedRows = rows.map(row => ({ ...row }));

        const { id, field, value } = params;
        const updatedRow = updatedRows.find((row) => row.id === id);
        if (updatedRow) {
            if (field === 'dateTime') {
                const convertDateFormat = moment(value, 'MM-DD-YYYY HH:MM:SS').format('DD-MMM-YY');
                if (Math?.floor(new Date(convertDateFormat)?.getTime() / 1000) > Math.floor(new Date(forecastStartDate).getTime() / 1000)) {
                    updatedRow[field] = moment(convertDateFormat, 'DD-MMM-YY').format('DD-MM-YYYY HH:MM:SS');
                    updatedRow.error = false;

                }
                else {
                    updatedRow.error = true;
                }
            } else {
                updatedRow[field] = value;
            }
        }

        setRows(updatedRows);
    };

    const handleAddRow = () => {
        const newRowId = rows.length + 1;
        const newEmptyRow = {
            id: newRowId, dateTime: moment(forecastStartDate).format('DD-MM-YYYY HH:MM:SS'),
            bhp: 0
        };

        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows.push(newEmptyRow);
            return updatedRows;
        });
    };
    const handleForecastStartDateChange = (date) => {
        setForecastStartDate(date?.target?.value);
    };

    const handleForecastEndDateChange = (date) => {
        const selectedEndDate = moment(date?.target?.value, 'YYYY-MM-DD').format('DD-MMM-YY');
        if (Math?.floor(new Date(selectedEndDate)?.getTime() / 1000) < Math.floor(new Date(forecastStartDate).getTime() / 1000)) {
            setForecastEndDate(forecastStartDate);
            setIsInputChanged(true);
        } else {
            setForecastEndDate(selectedEndDate);
        }
    };

    const handleExport = () => {
        const headerNames = ['DateTime', 'BHP'];
        const rowsWithHeaders = [headerNames.join(',')];
        rows.forEach(row => {
            rowsWithHeaders.push(`${row.dateTime},${row.bhp}`);
        });
        const rowsAsCSV = rowsWithHeaders.join('\n');
        const blob = new Blob([rowsAsCSV], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const importedRows = content.split('\n').map((row, index) => {
                if (index === 0) return null; // Skip the header row
                const [dateTime, bhp] = row.split(',');
                return { dateTime, bhp: Number(bhp) };
            }).filter(Boolean);
            setRows(importedRows);
        };
        reader.readAsText(file);
    };

    return (
        <>
            <Box mr={4} mt={1} pl={1}>
                <Box>
                    <Typography variant="body3Large" >
                        Forecast Setting :
                    </Typography>
                    <Box display="flex" ml={4} mt={2}>
                        <Grid container md={12} spacing={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} lg={4}>
                                    <DatePickerV1
                                        label="StartDate: "
                                        date={forecastStartDate}
                                        minWidth="50px"
                                        onChange={handleForecastStartDateChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    <DatePickerV1
                                        label="EndDate: "
                                        date={forecastEndDate}
                                        minWidth="50px"
                                        onChange={handleForecastEndDateChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    <Box display="flex" alignItems="center" ml={2}>
                                        <input
                                            type="checkbox"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '2px solid #999',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                display: 'inline-block',
                                                marginRight: '8px',
                                            }}
                                            checked={isToggled}
                                            onChange={handleToggle}
                                        />
                                        <Typography variant="body3Large">Multi Segment</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    <FormControl
                        className={classes.inputFields}
                        component="fieldset"
                        sx={{
                            pl: 2,
                            // mt: 1,
                            ml: 4.5,
                            flexDirection: 'row',
                            display: 'flex',
                        }}
                    >
                    </FormControl>
                </Box>
                <Box mt={3}>
                    <Typography variant="body3Large" mt={1}>
                        Model Configuration :
                    </Typography>
                    <FormControl
                        className={classes.inputFields}
                        component="fieldset"
                        sx={{
                            pl: 2,
                            mt: 1,
                            ml: 4.5,
                            flexDirection: 'row',
                            display: 'flex',
                        }}
                    >
                        <RadioGroup
                            aria-label="radio-buttons"
                            name="radio-buttons-group"
                            value={selectedValue}
                            onChange={(e) =>
                                handleModelInputChange(e.target.value)
                            }
                        >
                            <FormControlLabel
                                value="auto"
                                control={<Radio />}
                                label="Auto"
                            />
                            <FormControlLabel
                                value="parameter"
                                control={<Radio />}
                                label="Arp's Parameter"
                            />
                            <FormControlLabel
                                value="bhp"
                                control={<Radio />}
                                label="Array of BHP"
                            />
                        </RadioGroup>
                    </FormControl>
                    {selectedValue === "parameter" &&
                        <Grid item className={classes.inputField} sm={11} md={6} lg={4} xl={3}>
                            <Typography variant="body3Large" mt={1}>
                                Arp's Parameter:
                            </Typography>
                            <Grid className={classes.inputFields} display="flex" mr={8} mt={2}>
                                <FusionInputNumber
                                    label="BHPi (psia)"
                                    value={arpParameters.BHPi}
                                    onChange={(e) => handleInputChange(e, 'BHPi')}
                                />
                                <FusionInputNumber
                                    label="Di"
                                    value={arpParameters.Di}
                                    onChange={(e) => handleInputChange(e, 'Di')}
                                />
                                <FusionInputNumber
                                    label="B"
                                    value={arpParameters.B}
                                    onChange={(e) => handleInputChange(e, 'B')}
                                />
                            </Grid>
                        </Grid>
                    }
                    {selectedValue === "bhp" &&
                        <Box style={{ height: 370 }} mt={2}>
                            <Box sx={{ display: "flex", mt: -6, mb: 1, justifyContent: "end" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", pr: 1.5, mt: 0.5, width: "90px" }}>
                                    <Button
                                        variant="transparant"
                                        component="label"
                                        className={classes.fileButton}
                                    >
                                        <Tooltip
                                            title="Import"
                                            placement="top"
                                            arrow
                                            enterDelay={100}
                                        >
                                            <UploadFileIcon />
                                        </Tooltip>
                                        <input
                                            type="file"
                                            accept={".csv"}
                                            hidden
                                            onChange={handleImport}
                                        />
                                    </Button>
                                    <IconButton sx={{ padding: "0px 3px 3px 3px" }}
                                        className={classes.fileButton}
                                        onClick={handleExport}
                                    >
                                        <Tooltip
                                            title="Export"
                                            placement="top"
                                            arrow
                                            enterDelay={100}
                                        >
                                            <FileDownloadIcon />
                                        </Tooltip>
                                    </IconButton>
                                </Box>
                                <IconButton
                                    onClick={handleAddRow}
                                    className={classes.addRow}
                                >
                                    <Tooltip
                                        title="Add new row"
                                        placement="top"
                                        arrow
                                        enterDelay={100}
                                    >
                                        <AddCircleOutline />
                                    </Tooltip>
                                </IconButton>
                            </Box>
                            <DataGrid
                                rows={rows}
                                columns={columns.map((column) => ({
                                    ...column,
                                    renderCell: (params) => {
                                        const { field, value } = params;
                                        const rowError = field === 'dateTime' && (params.row.error || false);

                                        return (
                                            <div style={{ border: rowError ? '1px solid red' : 'none' }}>
                                                {field === 'dateTime' ? (
                                                    <>
                                                        {!rowError && <span>{value}</span>}
                                                        {rowError && <span style={{ color: "white" }}>Date should be greater than Start Date</span>}
                                                    </>
                                                ) : (
                                                    value
                                                )}
                                            </div>
                                        );
                                    },
                                }))}
                                onCellEditCommit={(e) => handleCellEditCommit(e, forecastStartDate)}
                            />

                        </Box>
                    }
                </Box>
            </Box >
        </>
    );
};

export default ForecastModelConfigParameter;
