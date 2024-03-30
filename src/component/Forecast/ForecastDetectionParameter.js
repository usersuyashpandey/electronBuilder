import { Box, FormControl, Grid, Tooltip, Typography } from '@mui/material'
import React from 'react'
// import InputLabelSelect from '../InputLabelSelect'
import * as Constants from "../../constants/ModelConstants";
import { makeStyles } from '@mui/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FusionInputNumber } from '../Input';


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


const DetectionParameter = ({ modelOutputData, headerText, enableReset, setModelInputs, setBHPInputConfig, setIsInputChanged, setEnableReset, bhpInputConfig, modelInputs }) => {
    const classes = useStyles();

    const initialInputValues = { ...modelInputs };
    const handleModelInputChange = (value, name) => {
        const { min, max } = modelInputs[name];
        const inputError = [];

        if (!value) {
            inputError.push(Constants.EMPTY_INPUT_MESSAGE);
        } else {
            if (name === "stepsize") {
                const maxStepsize = bhpInputConfig.liqloading_settings.window;
                if (value < min) {
                    inputError.push(`Value should be greater than or equal to ${min}`);
                }
                if (value > maxStepsize) {
                    inputError.push(`Value should be less than or equal to ${maxStepsize}`);
                }
            } else if (name === "window" || name === "alpha" || name === "threshold_p_alpha_times_qmax") {
                if (value <= min) {
                    inputError.push(`Value should be greater than or equal to ${min}`);
                }
                if (value > max) {
                    inputError.push(`Value should be less than or equal to ${max}`);
                }
            } else if (name === "minDataPoints") {
                if (value < min) {
                    inputError.push(`Value should be greater than or equal to ${min}`);
                }
            } else if (name === "NoLL_shift_mult") {
                if (value < min) {
                    inputError.push(`Value should be greater than or equal to ${min}`);
                }
                else if (max !== undefined && value >= max) {
                    inputError.push(`Value should be less than ${max}`);
                }
            } else {
                if (value < min) {
                    inputError.push(`Value should be greater than or equal to ${min}`);
                }

            }
        }
        if (value === '0' || value === 0) {
            value = '0';
        }
        if (!enableReset) {
            setEnableReset(true);
        }
        setIsInputChanged(true);

        const updatedModelInputs = {
            ...modelInputs,
            [name]: { ...modelInputs[name], error: inputError.join(' ') },
        };
        const updatedBHPInputConfig = {
            ...bhpInputConfig,
            liqloading_settings: {
                ...bhpInputConfig.liqloading_settings,
                [name]: !value ? '' : (name === "stepsize" ? Number(value.replace(/^0+/, '')) : Number(value)),
            },
        };
        setModelInputs(updatedModelInputs);
        setBHPInputConfig(updatedBHPInputConfig);
    };


    return (
        <>
            <Box mr={4} mt={4}>
                <Typography variant="body3Large">{headerText} :</Typography>
                <FormControl
                    className={classes.inputFields}
                    component="fieldset"
                    sx={{ pl: 2, mt: 1, ml: 4.5, flexDirection: "row", display: "flex" }}
                >
                    <Grid container item rowSpacing={4}>
                        {Object?.keys(initialInputValues)?.map((propertyName, index) => {
                            const { label, tooltip, unit } = modelInputs[propertyName];
                            const value = bhpInputConfig?.liqloading_settings[propertyName] === 0 ? 0 : bhpInputConfig?.liqloading_settings[propertyName] || "";
                            const step = propertyName === "alpha" || propertyName === "threshold_z_qg" || propertyName === "threshold_z_qw" || propertyName === "threshold_p_alpha_times_qmax" ? 0.1 : propertyName === "noll_shift_mult" || propertyName === "threshold_z_Pwh" ? 0.01 : 1;
                            return (
                                <Grid item className={classes.inputField} key={index} sm={12} md={6} lg={4} xl={3}>
                                    <FusionInputNumber
                                        style={{ paddingTop: '10px' }}
                                        label={
                                            <>
                                                {label}{unit} <Tooltip title={tooltip} placement="top">
                                                    <InfoOutlinedIcon style={{
                                                        color: modelInputs[propertyName].error ? '#d32f2f' : "#616161",
                                                        marginTop: "10px",
                                                        cursor: "pointer",
                                                        verticalAlign: "bottom",
                                                        alignItems: "center",
                                                    }} />
                                                </Tooltip>
                                            </>
                                        } value={value}
                                        step={step}
                                        errorMessage={modelInputs[propertyName]?.error}
                                        onChange={(e) => handleModelInputChange(e?.target?.value, propertyName)}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </FormControl>
            </Box>
        </>
    );
};


export default DetectionParameter