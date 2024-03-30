import React, {
  //  useState,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";

// Material UI
import { styled } from "@mui/material/styles";

import { Box, Button, Grid, MenuItem, Switch, Typography } from "@mui/material";

// Icon
import SortIcon from "@mui/icons-material/Sort";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";

// Controls
import clsx from "clsx";
import DeltaNPVIcon from "../images/icons/triangleDeltaNPV.svg";
import FusionToggleButtonGroup from "./ToggleButtonGroup";
import FusionInputV2 from "./FusionInputV2";
import FusionTooltip from "./Tooltip";
import FusionMenuOptions from "./MenuOptions";
import SelectionAxis from "./selctionAxis";

// Style
const useStyles = styled((theme) => ({
  root: {
    borderTopRightRadius: "12px",
    borderTopLeftRadius: "12px",
    fontSize: "15px",
    height: (props) => (props.shortHeader ? 30 : 38),
    padding: "4px 16px",
    display: "flex",
    alignItems: "center",

    backgroundColor: theme.palette.background.border,
    "&.transparentBackground": {
      backgroundColor: "transparent",
    },
    "&.transparent": {
      backgroundColor: "transparent",
    },

    "& .MuiSwitch-root .MuiSwitch-thumb": {
      border: "1px solid #e1e1e1",
    },
    "& .MuiSwitch-root .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
      border: "none",
    },
    "& .css-uudke6-MuiGrid-root": {
      width: "35%",
    },
  },
  headerContainer: {
    overflow: "hidden",
    flex: "1 1 10px",
    display: "flex",
    marginRight: "10px",
    justifyContent: "start",
    alignItems: "center",
    "& .css-1vpwcmr-MuiGrid-root": {
      maxWidth: "fit-content",
    },
  },
  header: {
    verticalAlign: "middle",
    lineHeight: "28px",
    marginBottom: "unset",

    color: "grey",
  },
  headerBox: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  fullscreenButton: {
    marginRight: "7px",

    "& svg": {
      stroke: `${theme.palette.primary.main} !important`,
    },
  },
  EditChart: {
    marginRight: "7px",

    "& svg": {
      with: 24,
      height: 24,
      stroke: `${theme.palette.primary.main} !important`,
    },
  },
  removeChart: {
    marginBottom: 2,

    "& svg": {
      with: 26,
      height: 26,
      stroke: `${theme.palette.primary.main} !important`,
    },
  },
  title: {
    display: "flex",
    // Theme
    color: theme.palette.primary.main,
  },
  resetMapButton: {
    color: "Black",
  },
  headerDate: {
    position: "relative",
    left: "5px",
    fontSize: "13.7px",
  },
  checkboxWrapper: {
    marginRight: theme.spacing(0.5),
    color: theme.palette.grey[900],
    display: "flex",
  },
  panelTopToggle: {
    minWidth: 166,
    position: "absolute",
    height: 32,
    top: 3,
    left: "50%",
    transform: "translateX(-50%)",
  },
}));

const HeaderComponent = ({
  header,
  displayFullscreen,
  displayVisualSettings,
  visualSettingsCallback,
  options = [],
  template,
  handlerResetMap,
  handleInputData,
  wellLevelSelection,
  wells,
  timePicker,
  timePickerAnalysisConfig,
  handleTimePickerUpdated,
  shoWellCount,
  showTimePicker,
  inputAxis,
  handleXAxisChange,
  selectedXAxis,
  axisSeletion,
  showLegendToggler,
  toggleLegend,
  showLegend,
  handlerToShowAllColumns = () => {},
  isShowHideColumnsApplied = false,
  displayChartEdit = false,
  handleOpenRangeModal = () => {},
  headerDate,
  sortOrder,
  handleChangeSortOrder = () => {},
  handleFilterInputChange = () => {},
  showInputFilter = false,
  loading = false,
  filterInputParams = { filterInput: 0, text: "Threshold" },
  removeChart = false,
  handleRemoveChart = () => {},
  showDeltaIcon = false,
  ChartOptions,
  currentSelectedChart,
  handleChangeButton = () => {},
  ChartButtonOptions,
  handleChangeGroupButton,
  showtoggleGrpBtn = false,
  handleFieldSelection,
  fieldSelectionList,
  selectField,
  isFullScreen = true,
  handleFullScreenToggleNetwork,
  defermentTitle,
  showSorting,
  FieldSelectionList,
  ...props
}) => {
  const [optionsAnchor, setOptionsAnchor] = useState(null);
  const headerRef = useRef();
  const classes = useStyles(props);
  const GRID_DETAILS = { event: false };

  const handleOptionsClose = () => {
    setOptionsAnchor(null);
  };

  const cleanHandler = () => {
    if (GRID_DETAILS["element"]) {
      GRID_DETAILS["element"]?.removeEventListener(
        "fullscreenchange",
        handleFullScreenToggle
      );
    }
  };

  useEffect(() => {
    let currentContainer = headerRef?.current;
    let parentContainer = currentContainer?.parentNode;
    let componentToFullScreenGrid = parentContainer?.querySelector(
      "[class*='p-datatable-scrollable-body']"
    );

    // Case: Data Grid
    if (componentToFullScreenGrid) {
      // Add listener
      if (GRID_DETAILS["event"] === false) {
        handleResizeComponent();
      }
    }

    return () => {
      cleanHandler();
    };
    // eslint-disable-next-line
  }, []);

  const handleResizeComponent = () => {
    let currentContainer = headerRef?.current;
    let parentContainer = currentContainer?.parentNode;
    let element = parentContainer?.querySelector(
      "[class*='xt-component-content']"
    );

    if (element && GRID_DETAILS["event"] === false) {
      element.addEventListener("fullscreenchange", handleFullScreenToggle);

      GRID_DETAILS["event"] = true;
      GRID_DETAILS["element"] = element;
    }
  };

  const handleFullScreenToggle = () => {
    let currentContainer = headerRef?.current;
    let parentContainer = currentContainer?.parentNode;
    let element = parentContainer?.querySelector(
      "[class*='xt-component-content']"
    );
    let multiBody = element?.querySelectorAll(".p-datatable-scrollable-body");

    if (document.fullscreenElement) {
      // Check size of the datatable scrollable header
      const elementHeaderScrollable = element?.querySelector(
        ".p-datatable-scrollable-header"
      )?.offsetHeight;

      // Chek size of the datatable header
      const elementHeader = element?.querySelector(
        ".p-datatable-header"
      )?.offsetHeight;

      const heightReduce =
        Number(elementHeaderScrollable) + Number(elementHeader);

      // Set minHeight
      if (multiBody && multiBody?.length > 0) {
        for (let i = 0; i < multiBody?.length; i++) {
          if (multiBody[i]) {
            multiBody[i].style.minHeight =
              "calc(100vh - " + heightReduce + "px)";
          }
        }
      }
    } else {
      // Unset minHeight
      if (multiBody && multiBody?.length > 0) {
        for (let i = 0; i < multiBody?.length; i++) {
          if (multiBody[i]) {
            multiBody[i].style.minHeight = "unset";
          }
        }
      }
    }
  };

  return (
    <Fragment>
      <div
        ref={headerRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className={clsx(classes.root, template)}
      >
        <div className={classes.headerContainer}>
          <Grid
            container
            marginLeft="10px"
            marginTop="5px"
            p={1}
            direction="column"
          >
            <Grid item className={classes.title}>
              <Typography variant="h2">
                {showDeltaIcon ? (
                  <span>
                    <DeltaNPVIcon width="12px" height="12px" /> {header}
                  </span>
                ) : (
                  header
                )}
              </Typography>
              <Typography className={classes.headerDate}>
                {headerDate}
              </Typography>
              <Typography className={classes.headerDate}>
                {" "}
                {defermentTitle}
              </Typography>
            </Grid>
          </Grid>
        </div>
        {Boolean(ChartOptions) && (
          <FusionToggleButtonGroup
            className={classes.panelTopToggle}
            onChange={handleChangeButton}
            value={currentSelectedChart}
            options={ChartOptions}
          />
        )}

        {inputAxis === true && (
          <SelectionAxis
            handleXAxisChange={handleXAxisChange}
            selectedXAxis={selectedXAxis}
            axisSeletion={axisSeletion}
          />
        )}
        {showSorting && (
          <FusionInputV2
            wells={wells}
            handleInputData={handleInputData}
            wellLevelSelection={wellLevelSelection}
            FieldSelectionList={FieldSelectionList}
          />
        )}

        {sortOrder && (
          <Button
            sx={{ height: "24px", px: 1, pr: 1, minWidth: "44px" }}
            variant="contained"
            onClick={handleChangeSortOrder}
            startIcon={
              <Box
                sx={{
                  height: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                  mr: -1.5,
                }}
              >
                {sortOrder === "asc" ? <NorthIcon /> : <SouthIcon />}
                <SortIcon />
              </Box>
            }
          ></Button>
        )}
        {showtoggleGrpBtn && (
          <FusionToggleButtonGroup
            className={classes.panelTopToggle}
            onChange={handleChangeGroupButton}
            value={currentSelectedChart}
            options={ChartButtonOptions}
          />
        )}
        {showLegendToggler && (
          <FusionTooltip title="Show/Hide Chart Legends" arrow placement="top">
            <Switch
              size="small"
              checked={showLegend}
              onClick={toggleLegend}
              sx={{ marginRight: "7px" }}
            />
          </FusionTooltip>
        )}
      </div>
      {options.length > 0 && (
        <FusionMenuOptions
          anchorEl={optionsAnchor}
          open={!!optionsAnchor}
          onClose={handleOptionsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          getcontentanchorel={null}
        >
          {options.map(({ label, callback }) => (
            <MenuItem
              key={label}
              disableRipple
              onClick={() => {
                callback();
                handleOptionsClose();
              }}
            >
              {label}
            </MenuItem>
          ))}
        </FusionMenuOptions>
      )}
    </Fragment>
  );
};

export default HeaderComponent;
