import SortIcon from "@mui/icons-material/Sort";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import FusionSelect from "./Select";
import { Box, Button } from "@mui/material";

const FusionInputV2 = ({
  handleInputData,
  wellLevelSelection,
  FieldSelectionList,
}) => {
  const handleFieldSelection = (field, order) => {
    const selectedObj = FieldSelectionList.find((item) => item.value === field);
    handleInputData({
      ...selectedObj,
      field: selectedObj?.value,
      sortAsc: order,
    });
  };
  return (
    <>
      <FusionSelect
        name="well-selector"
        onChange={(e) =>
          handleFieldSelection(e.target.value, wellLevelSelection?.ascOrder)
        }
        options={FieldSelectionList}
        value={wellLevelSelection?.field}
        fullName={true}
        className={"wellLevel"}
      />
      <Button
        sx={{ height: "28px", px: 1, minWidth: "58px" }}
        variant="contained"
        onClick={(e) =>
          handleFieldSelection(
            wellLevelSelection?.field,
            !wellLevelSelection?.ascOrder
          )
        }
        startIcon={
          <Box
            sx={{
              height: "100%",
              justifyContent: "space-between",
              display: "flex",
              mr: -1.5,
            }}
          >
            {wellLevelSelection?.ascOrder ? <NorthIcon /> : <SouthIcon />}
            <SortIcon />
          </Box>
        }
      ></Button>
    </>
  );
};

export default FusionInputV2;
