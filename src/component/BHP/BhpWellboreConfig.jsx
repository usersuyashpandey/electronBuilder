import React, { useMemo, useState } from "react";
import { AppBar, Box, Grid, Tab, Tabs } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import BHPSurvey from "./BhpSurvey";
import BHPGeothermal from "./BhpGeothermal";
import BHPCasingTubing from "./BhpCasingTubing";
import BHPNodeDepth from "./BhpNodeDepth";
import DateStepper from "../constant/Stepper";
import clsx from "clsx";
import BhpGasLift from "./BhpGasLift";

const useStyles = makeStyles()((theme) => ({
  accordionHeader: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "grey.500",
    padding: "4px 16px",
    fontSize: "20px",
    backgroundColor: "#bea7e9",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    height: "38px",
  },
  headerName: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  chartWrapper: {
    marginTop: theme.spacing(1.5),
    // marginBottom: theme.spacing(1.5),
    "& > div:first-child": {},
    "& > div:last-child": {
      // paddingLeft: theme.spacing(0.25)
    },
    "& .noPadding": {
      paddingLeft: "unset !important",
      paddingRight: "unset !important",
    },
    "& .MuiPaper-root": {
      border: "1px solid" + theme.palette.grey[200],
      marginBottom: 4,
      borderRadius: 8,
      // borderRadius: 4
    },
    "& .css-11iy75e-MuiPaper-root-MuiAccordion-root:before": {
      display: "none",
    },
    [theme.breakpoints.down("1370")]: {
      marginTop: 50,
    },
  },
  appBar: {
    background: theme.palette.background.screen,
    // borderRadius: "7px",
    marginTop: "7px",
    overflow: "hidden",
    fontSize: "0.875rem",
    "& .MuiButtonBase-root.MuiTab-root": {
      fontWeight: 400,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.screen,
      "&:hover": {
        fontWeight: 400,
        backgroundColor: theme.palette.background.header,
      },
    },
    "& .tabError": {
      "&.MuiButtonBase-root.MuiTab-root": {
        fontWeight: 400,
        border: "2px solid #FF0000",
        zIndex: 1000,
      },
    },
    "& .Mui-selected": {
      fontWeight: 600 + "!important",
    },
  },
  card: {
    width: "100%",
    "& .xt-component-content": {
      background: theme.palette.background.paper,
    },
    "& > *": {
      backgroundColor: theme.palette.background.paper,
      border: "1px solid" + theme.palette.grey[200],
      borderRadius: 15,
    },
  },
  chartGrid: {
    // height: "100%",
    "& > *": {
      // overflow: "hidden",
      borderRadius: 15,
      // marginBottom: "8px",
    },
    "& .highcharts-plot-border": {
      strokeWidth: "0",
    },
    "& .highcharts-empty-series": {
      strokeWidth: "0",
    },
  },
  tabPanelContainer: {
    height: "100%",
  },
  header: {
    background: theme.palette.background.purple,
    overflow: "hidden",
    justifyContent: "space-between",
    border: "1px solid",
    borderColor: theme.palette.grey["200"],
    borderRadius: 15,
  },
  panelTopToggle: {
    minWidth: "110px",
    marginTop: "4px",
    marginLeft: "8px",
    height: "45px !important",
  },
  tableGrid: {
    // paddingLeft: "10px",
    // paddingRight: "10px",
    "& .xt-component-content": {
      background: theme.palette.background.paper,
    },
  },
  tabHover: {
    color: "black",
    backgroundColor: "whitesmoke",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#bea7e9",
    },
  },
  customDataGrid: {
    background: theme.palette.background.paper,
    overflow: "hidden",
    "& .MuiDataGrid-columnHeader": {
      background: theme.palette.background.paper,
      // color: theme.palette.primary.main,
      color: theme.palette.grey[800],
    },
  },
  containerMenuIcon: {
    color: theme.palette.primary.main,
    height: "30px",
    width: "30px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const BHP_WellboreConfig = (props) => {
  const {
    isInputChanged,
    scrollIndex,
    lastRowIndex,
    setLastRowIndex,
    setScrollIndex,
    setIsInputChanged,
    handleProd_GasLift,
    focusElem,
    setFocusElem,
    handleNewConfigDateErrors,
    nodeError,
    setNodeError,
    surveyError,
    setSurveyError,
    thermalError,
    setThermalError,
    gasLiftError,
    setGasLiftError,
    casingError,
    setCasingError,
    tubingError,
    setTubingError,
    selectedConfigDate,
    bhpInputConfig,
    setSelectedConfigDate,
    setBHPInputConfig,
    selectedInputSection,
    flowTypeOptions,
    liftTypeOptions,
    flowCorrelationOptions,
  } = props;
  const { classes } = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);

  const RESULT_TABS = useMemo(
    () => [
      {
        key: `tab-panel-0`,
        id: 0,
        name: "Deviation Survey",
        component: (
          <>
            <Grid
              item
              container
              className={classes.chartWrapper}
              md={12}
              direction="row"
            >
              <Box style={{ flex: 1 }}>
                <BHPSurvey
                  bhpInputConfig={bhpInputConfig}
                  selectedInputSection={selectedInputSection}
                  selectedConfigDate={selectedConfigDate}
                  setBHPInputConfig={setBHPInputConfig}
                  setIsInputChanged={setIsInputChanged}
                  isInputChanged={isInputChanged}
                  surveyError={surveyError}
                  setSurveyError={setSurveyError}
                  lastRowIndex={lastRowIndex}
                  setLastRowIndex={setLastRowIndex}
                  scrollIndex={scrollIndex}
                  setScrollIndex={setScrollIndex}
                />
              </Box>
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-1`,
        id: 1,
        name: "Geothermal Gradient",
        component: (
          <>
            <Grid
              item
              container
              className={classes.chartWrapper}
              md={12}
              direction="row"
              style={{ marginTop: "0px" }}
            >
              <Box style={{ flex: 1 }}>
                <BHPGeothermal
                  bhpInputConfig={bhpInputConfig}
                  selectedInputSection={selectedInputSection}
                  selectedConfigDate={selectedConfigDate}
                  setBHPInputConfig={setBHPInputConfig}
                  setIsInputChanged={setIsInputChanged}
                  isInputChanged={isInputChanged}
                  thermalError={thermalError}
                  setThermalError={setThermalError}
                />
              </Box>
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-2`,
        id: 2,
        name: "Casing/Tubing",
        component: (
          <>
            <Grid
              item
              container
              className={classes.chartWrapper}
              md={12}
              direction="row"
              style={{ marginTop: "0px" }}
            >
              <Box style={{ flex: 1 }}>
                <BHPCasingTubing
                  bhpInputConfig={bhpInputConfig}
                  flowTypeOptions={flowTypeOptions}
                  liftTypeOptions={liftTypeOptions}
                  flowCorrelationOptions={flowCorrelationOptions}
                  selectedConfigDate={selectedConfigDate}
                  setBHPInputConfig={setBHPInputConfig}
                  setIsInputChanged={setIsInputChanged}
                  isInputChanged={isInputChanged}
                  casingError={casingError}
                  setCasingError={setCasingError}
                  tubingError={tubingError}
                  setTubingError={setTubingError}
                  gasLiftError={gasLiftError}
                  setGasLiftError={setGasLiftError}
                  handleProd_GasLift={handleProd_GasLift}
                />
              </Box>
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-3`,
        id: 3,
        name: "Node Depth",
        component: (
          <>
            <Grid
              item
              container
              className={classes.chartWrapper}
              md={12}
              direction="row"
              style={{ marginTop: "0px" }}
            >
              <Box style={{ flex: 1 }}>
                <BHPNodeDepth
                  bhpInputConfig={bhpInputConfig}
                  selectedConfigDate={selectedConfigDate}
                  setBHPInputConfig={setBHPInputConfig}
                  setIsInputChanged={setIsInputChanged}
                  nodeError={nodeError}
                  setNodeError={setNodeError}
                  focusElem={focusElem}
                  setFocusElem={setFocusElem}
                />
              </Box>
            </Grid>
          </>
        ),
      },
      {
        key: `tab-panel-4`,
        id: 4,
        name: "Gas Lift",
        component: (
          <>
            <Grid
              item
              container
              className={classes.chartWrapper}
              md={12}
              direction="row"
              style={{ marginTop: "0px" }}
            >
              <Box style={{ flex: 1 }}>
                <BhpGasLift
                  bhpInputConfig={bhpInputConfig}
                  selectedInputSection={selectedInputSection}
                  selectedConfigDate={selectedConfigDate}
                  setBHPInputConfig={setBHPInputConfig}
                  setIsInputChanged={setIsInputChanged}
                  isInputChanged={isInputChanged}
                  gasLiftError={gasLiftError}
                  setGasLiftError={setGasLiftError}
                />
              </Box>
            </Grid>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedConfigDate,
      bhpInputConfig,
      lastRowIndex,
      scrollIndex,
      focusElem,
      bhpInputConfig,
      nodeError,
      surveyError,
      thermalError,
      gasLiftError,
      casingError,
      tubingError,
    ]
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`charts-tabpanel-${index}`}
        aria-labelledby={`charts-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Grid item xs={12} className={classes.tabPanelContainer}>
            {children}
          </Grid>
        )}
      </div>
    );
  };

  const a11yProps = (index) => {
    return {
      id: `charts-tab-${index}`,
      "aria-controls": `charts-tabpanel-${index}`,
    };
  };

  const isError = (tabId) => {
    let isErrorExist = false;
    if (tabId === 0) {
      isErrorExist = surveyError?.some(
        (cell) =>
          cell.datetime === selectedConfigDate && cell.cellErrors?.length > 0
      );
    }
    if (tabId === 1) {
      isErrorExist = thermalError?.some(
        (cell) =>
          cell.datetime === selectedConfigDate && cell.cellErrors?.length > 0
      );
    }
    if (tabId === 2) {
      const isCasingErrorExist = casingError?.some(
        (cell) =>
          cell.datetime === selectedConfigDate && cell.cellErrors?.length > 0
      );
      const isTubingErrorExist = tubingError?.some(
        (cell) =>
          cell.datetime === selectedConfigDate && cell.cellErrors?.length > 0
      );
      isErrorExist = isCasingErrorExist || isTubingErrorExist;
    }
    if (tabId === 3) {
      isErrorExist = nodeError?.some(
        (cell) =>
          cell.datetime === selectedConfigDate &&
          (cell.Gauge !== "" || cell.BHP !== "")
      );
    }
    if (tabId === 4) {
      isErrorExist = gasLiftError?.some(
        (cell) =>
          cell.datetime === selectedConfigDate && cell.cellErrors?.length > 0
      );
    }
    return isErrorExist;
  };

  const isDisabled = (tabId) => {
    let isDisabled = false;
    if (tabId === 4) {
      const liftType = bhpInputConfig.wellboreConfig?.find(
        (item) => item?.datetime === selectedConfigDate
      )?.lift_method;
      isDisabled = liftType === "NaturalFlow";
    }
    return isDisabled;
  };

  const tabNavigation = useMemo(() => {
    return (
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="charts-tabs"
      >
        {RESULT_TABS.map((tab) => (
          <Tab
            key={`tab-header-${tab?.id}`}
            hidden={isDisabled(tab.id)}
            className={clsx("", { tabError: isError(tab.id) })}
            label={tab.name}
            {...a11yProps(tab?.id)}
            disabled={bhpInputConfig.wellboreConfig.length > 0 ? false : true}
          />
        ))}
      </Tabs>
    );

    // eslint-disable-next-line
  }, [
    selectedTab,
    bhpInputConfig,
    selectedConfigDate,
    surveyError,
    thermalError,
    gasLiftError,
    casingError,
    tubingError,
    nodeError,
  ]);

  const tabPanels = useMemo(() => {
    return RESULT_TABS.map((tab) => (
      <TabPanel key={tab?.key} value={selectedTab} index={tab?.id}>
        {tab.component}
      </TabPanel>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RESULT_TABS, bhpInputConfig, selectedTab]);

  return (
    <>
      <Box m={0.6} width="calc(100vw - 475px)">
        <Grid
          container
          display="flex"
          ml={0.7}
          mr={0.7}
          mt={0.7}
          mb={0.5}
          justifyContent="center"
        >
          <Box>
            <DateStepper
              selectedConfigDate={selectedConfigDate}
              bhpInputConfig={bhpInputConfig}
              setSelectedConfigDate={setSelectedConfigDate}
              setBHPInputConfig={setBHPInputConfig}
              setIsInputChanged={setIsInputChanged}
              surveyError={surveyError}
              thermalError={thermalError}
              gasLiftError={gasLiftError}
              casingError={casingError}
              tubingError={tubingError}
              nodeError={nodeError}
              handleNewConfigDateErrors={handleNewConfigDateErrors}
            />
          </Box>
        </Grid>
        <Grid container display="flex" ml={0.7} mr={0.7} mt={0.7} mb={0.5}>
          <Box>
            <AppBar position="static" elevation={0} className={classes.appBar}>
              {tabNavigation}
            </AppBar>
          </Box>
        </Grid>
        {tabPanels}
      </Box>
    </>
  );
};

export default BHP_WellboreConfig;
