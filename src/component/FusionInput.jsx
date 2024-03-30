import { useState } from "react";
import SortIcon from "@mui/icons-material/Sort";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import FusionSelect from "./Select";
import FusionInputBtn from "./Input";
import { useEffect } from "react";
import { Box, Button } from "@mui/material";

const fieldSelectionList = [
  { label: "Gas", value: "rateGas" },
  { label: "Oil", value: "rateOil" },
  { label: "Water", value: "rateWater" },
];

const FusionInput = ({ wells, handleInputData, wellLevelSelection }) => {
  const [input, setInput] = useState(wellLevelSelection.well);
  const [selectField, setSelectedField] = useState({
    value: wellLevelSelection.field,
    label: wellLevelSelection.label,
  });
  const [sortAsc, setSort] = useState(wellLevelSelection.ascOrder);
  const handleFieldSelection = (e) => {
    const selectedObj = fieldSelectionList.find(
      (item) => item.value === e.target.value
    );
    setSelectedField(selectedObj);
  };
  useEffect(() => {
    handleInputData({ selectField, input, sortAsc });
    // eslint-disable-next-line
  }, [selectField, input, sortAsc]);

  useEffect(() => {
    setInput(wellLevelSelection.well);
  }, [wellLevelSelection]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (+value < 1 || +value > wells) {
      // toastErrorMessage("Invalid value");
      setInput(+value);
    } else {
      setInput(+value);
    }
  };

  return (
    <>
      <span style={{ fontSize: "15px", marginRight: "6px" }}>Display</span>
      <FusionInputBtn
        value={input}
        minValue={5}
        onChange={handleChange}
        style={{
          width: "75px",
          height: 32,
          marginRight: "3px",
          textAlign: "center",
          fontSize: "18px",
        }}
        disabled={!wells}
      />
      <span
        style={{ fontSize: "15px", marginRight: "10px" }}
      >{`of ${wells} wells`}</span>
      <FusionSelect
        name="well-selector"
        onChange={(e) => handleFieldSelection(e)}
        options={fieldSelectionList}
        value={selectField.value}
        fullName={true}
        className={"wellLevel"}
      />
      <Button
        sx={{ height: "28px", px: 1, minWidth: "58px" }}
        variant="contained"
        onClick={(e) => setSort(!sortAsc)}
        startIcon={
          <Box
            sx={{
              height: "100%",
              justifyContent: "space-between",
              display: "flex",
              mr: -1.5,
            }}
          >
            {sortAsc ? <NorthIcon /> : <SouthIcon />}
            <SortIcon />
          </Box>
        }
      ></Button>
    </>
  );
};

export default FusionInput;
