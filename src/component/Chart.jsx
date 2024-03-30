import React, { memo } from "react";
import Box from "@mui/material/Box";

import HighChartsWrapperV3Poc, {
  reflowCharts,
  REFLOW_DELAY,
} from "./HighChartsWrapperV3Poc";

export { reflowCharts, REFLOW_DELAY };

const Chart = memo(
  ({
    options,
    height = "100%",
    loading,
    error,
    classes,
    mx = 1,
    showHeader = true,
    width = "100%",
    showLegendToggler,
    showDefaultLegend,
    reflowDelay = 1000,
    headerDate,
    inputAxis,
    sortOrder,
    handleChangeSortOrder,
    excludeExportColumns = [],
    showInputFilter,
    filterInputParams,
    handleFilterInputChange,
    showDeltaIcon,
    handleChangeButton,
    shortHeader = false,
    displayChartEdit,
    handleOpenRangeModal,
    openRangModal,
    ChartOptions,
    currentSelectedChart,
    editChartOptions,
    handleCloseRangeModal,
    handleFieldSelection,
    fieldSelectionList,
    handleXAxisChange,
    selectedXAxis,
    axisSeletion,
    DateTimeFormat,
    selectField,
    showAxisPower = true,
    secondaryOptions = null,
  }) => (
    <Box
      sx={{
        mx,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        maxWidth: width,
        height: height,
      }}
      className={classes.card}
    >
      <Box style={{ height: height, maxWidth: width, overflow: "hidden" }}>
        <HighChartsWrapperV3Poc
          key="HighChartsWrapper"
          title={showHeader ? options?.headerName : null}
          options={options}
          secondaryOptions={secondaryOptions}
          // height={height}
          maxWidth={width}
          DateTimeFormat={DateTimeFormat}
          handleXAxisChange={handleXAxisChange}
          selectedXAxis={selectedXAxis}
          inputAxis={inputAxis}
          axisSeletion={axisSeletion}
          error={error}
          loading={loading}
          showHeader={showHeader}
          showLegendToggler={showLegendToggler}
          showDefaultLegend={showDefaultLegend}
          reflowDelay={reflowDelay}
          headerDate={headerDate}
          sortOrder={sortOrder}
          handleChangeButton={handleChangeButton}
          currentSelectedChart={currentSelectedChart}
          ChartOptions={ChartOptions}
          handleChangeSortOrder={handleChangeSortOrder}
          displayChartEdit={displayChartEdit}
          handleOpenRangeModal={handleOpenRangeModal}
          excludeExportColumns={excludeExportColumns}
          showInputFilter={showInputFilter}
          filterInputParams={filterInputParams}
          handleFilterInputChange={handleFilterInputChange}
          showDeltaIcon={showDeltaIcon}
          shortHeader={shortHeader}
          openRangModal={openRangModal}
          editChartOptions={editChartOptions}
          handleCloseRangeModal={handleCloseRangeModal}
          handleFieldSelection={handleFieldSelection}
          fieldSelectionList={fieldSelectionList}
          selectField={selectField}
          showAxisPower={showAxisPower}
        />
      </Box>
    </Box>
  )
);

export default Chart;
