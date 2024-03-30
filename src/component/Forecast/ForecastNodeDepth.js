import { Box, FormControl, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, {  useMemo, useState } from "react";
import { FusionInputNumber } from "../Input";



const useStyles = makeStyles((theme) => ({
    inputFields: {
        paddingLeft: 16,
        marginTop: 16,
        marginLeft: 16,
        flexDirection: "row",
        display: "flex",
        "& .MuiFormControl-root.MuiTextField-root": {
            width: "85%"
        },
        "& .MuiFormLabel-root.MuiInputLabel-root": {
            fontWeight: 450,
            lineHeight: "1.2em",
            fontSize: "20px" //"1.2rem"
        },
        "& .MuiInputBase-root.MuiOutlinedInput-root": {
            fontSize: "1.3rem"
        },
        "& .MuiInputBase-input.MuiOutlinedInput-input": {
            fontSize: "18px"
        }

    },
    refType: {
        marginTop: "10px"
    },
    inputField: {
        "@media (max-width: 840px)": {
            maxWidth: "90%",
            minWidth: "50%"
        }
    }
}));

function ForecastNodeDepth(props) {
    const { bhpInputConfig, nodeError, focusElem, setFocusElem, selectedConfigDate, setBHPInputConfig } = props;
    const classes = useStyles();
    const [selectedNode, setSelectedNode] = useState("Custom Node");
    const [inputValues, setInputValues] = useState({
        "Top Node": 0,
        "Bottom Node": 9322,
        "Custom Node": 0
    });

    const configIndex = bhpInputConfig.wellborConfig?.findIndex(item => item.datetime === selectedConfigDate);

    const nodeInputFields = useMemo(() => {
        if (configIndex !== -1) {
            const updateWellConfig = [...bhpInputConfig.wellborConfig];
            const updateNodes = { ...updateWellConfig[configIndex]?.nodes };
            const nodeIndex = updateNodes.name.findIndex(item => item === "BHP");
            const updateValues = [...updateNodes.md];
            updateValues[nodeIndex] = inputValues[selectedNode];
            updateNodes.md = updateValues;

            updateWellConfig[configIndex].nodes = { ...updateNodes };

            const newBhpInputConfig = {
                ...bhpInputConfig,
                wellborConfig: updateWellConfig
            };
            if (JSON.stringify(newBhpInputConfig) !== JSON.stringify(bhpInputConfig)) {
                setBHPInputConfig(newBhpInputConfig);
            }
        }
        const handleCustomNodeChange = (e) => {
            const value = e.target.value;
            let newErrorMsg = "";
            if (!value) {
                newErrorMsg = "Please enter a value";
            } else if (parseFloat(value) <= 0) {
                newErrorMsg = "Value cannot be less than Top Node";
            } else if (parseFloat(value) > 9322) {
                newErrorMsg = "Value cannot be greater than Bottom Node";
            }
            const nodeValue = parseFloat(value);
            setInputValues({
                ...inputValues,
                "Custom Node": nodeValue,
            });
            setFocusElem("BHP");
            const errorIndex = nodeError.findIndex(item => item.datetime === selectedConfigDate);

            const updatedNodeError = [...nodeError];
            updatedNodeError[errorIndex] = {
                ...updatedNodeError[errorIndex],
                "BHP": newErrorMsg,
            };
            // setNodeError(updatedNodeError);
        };
        return (
            <Grid
                item
                className={classes.inputField}
                md={12}
            >
                <FormControl style={{ display: 'flex', marginTop: "10px", flexDirection: 'row', alignItems: 'center' }}>
                    <input
                        type="radio"
                        name="nodeGroup"
                        value="Top Node"
                        checked={selectedNode === "Top Node"}
                        style={{ cursor: "pointer" }}
                        onChange={() => setSelectedNode("Top Node")}
                    />
                    Top Node
                    <FusionInputNumber
                        type="text"
                        style={{ marginLeft: "35px", width: "200px" }}
                        value={0}
                        onChange={handleCustomNodeChange}
                        disabled={true}
                    />
                </FormControl>
                <FormControl style={{ display: 'flex', marginTop: "10px", flexDirection: 'row', alignItems: 'center' }}>
                    <input
                        type="radio"
                        name="nodeGroup"
                        value="Bottom Node"
                        style={{ cursor: "pointer" }}
                        checked={selectedNode === "Bottom Node"}
                        onChange={() => setSelectedNode("Bottom Node")}
                    />
                    Bottom Node
                    <FusionInputNumber
                        type="text"
                        value={9322}

                        style={{ marginLeft: "10px", width: "200px" }}
                        onChange={handleCustomNodeChange}
                        disabled={true}
                    />
                </FormControl>
                <FormControl style={{ display: 'flex', marginTop: "10px", flexDirection: 'row', alignItems: 'center' }}>
                    <input
                        type="radio"
                        name="nodeGroup"
                        value="Custom Node"
                        style={{ cursor: "pointer" }}
                        checked={selectedNode === "Custom Node"}
                        onChange={() => setSelectedNode("Custom Node")}
                    />
                    Custom Node
                    <FusionInputNumber
                        type="text"
                        value={inputValues["Custom Node"]}
                        style={{ marginLeft: "10px", width: "200px" }}
                        onChange={handleCustomNodeChange}
                    />
                </FormControl>
                {/* <FusionInputNumber
                    type="text"
                    value={inputValues[selectedNode]}
                    style={{ marginLeft: "10px", width: "200px" }}
                /> */}
            </Grid>
        )
    }, [focusElem, inputValues, nodeError, selectedNode])


    return (
        <Box ml={2}>
            {nodeInputFields}
        </Box>
    );
}

export default ForecastNodeDepth;
