import React, { useRef, useState } from 'react';
import { Box, SelectChangeEvent } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { ChartTypes, xRangeChartType } from './FusionHighChartType';
import FusionHeader from './FusionHeader';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { HighchartsReact, HighchartsReactRefObject } from 'highcharts-react-official';
import HighchartsXrange from 'highcharts/modules/xrange';


HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
HighchartsXrange(Highcharts);

interface Axis {
    name: string;
    value: string;
}

type ChartComponentProps = {
    headerText?: string;
    chartOptions?: ChartTypes;
    refProps?: React.RefObject<HighchartsReactRefObject>;
    secondaryOptions?: xRangeChartType;
    axisSelection?: Axis[] | undefined;
    handleXAxisChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
    selectedXAxis?: Axis | null;
};
const StyledChartBox = styled(Box)(({ theme }) => ({
    // margin: 5,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    border: `1px solid ${theme.palette.background.chartborder}`,
    backgroundColor: theme.palette.background.screen,
    borderRadius: theme.components.borderRadius.small,
}));

const FusionHighChart: React.FC<ChartComponentProps> = ({
    headerText,
    chartOptions,
    refProps,
    secondaryOptions,
    axisSelection,
    handleXAxisChange,
    selectedXAxis
}) => {
    const theme = useTheme();

    const [isLegendVisible, setLegendVisible] = useState(true);
    const highchartsRef = useRef<Highcharts.Chart | null>(null);
    const [isFullScreen, setFullScreen] = useState(false);

    const toggleLegend = () => {
        setLegendVisible((prev) => !prev);
    };
    const chart = refProps ? refProps : useRef(null);

    const handleDownloadPNG = () => {
        const chartInstance = highchartsRef.current;
        if (chartInstance) {
            chartInstance.exportChart({ type: 'image/png' }, {});
        }
    };

    const toggleFullScreen = () => {
        const chartContainer = chart.current.chart.fullscreen.toggle()
        if (chartContainer) {
            if (isFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            } else {
                if (chartContainer.requestFullscreen) {
                    chartContainer.requestFullscreen();
                }
            }
            setFullScreen((prev) => !prev);
        }
    };
    const handleDownloadCSV = () => {
        const chartInstance = highchartsRef.current;
        if (chartInstance) {
            chartInstance.downloadCSV();
        }
    };

    const updatedChartOptions = {
        ...chartOptions,
        legend: {
            enabled: isLegendVisible,
            itemStyle: {
                color: theme?.palette?.text?.primary,
                textDecoration: function () {
                    return this.visible ? 'none' : 'none';
                },
            },
            itemHoverStyle: {
                color: theme?.palette?.text?.primary,
                textDecoration: 'none',
            },
            itemHiddenStyle: {
                color: '#999',
                textDecoration: 'none',
            },
        },
        exporting: {
            enabled: false
        },
        accessibility: {
            enabled: false,
        },
    };
    const updatedXRangeOptions = {
        ...secondaryOptions,
        exporting: {
            enabled: false
        },
        accessibility: {
            enabled: false,
        },
    };

    return (
        <StyledChartBox>
            <FusionHeader
                headerText={headerText}
                toggleLegend={toggleLegend}
                isLegendVisible={isLegendVisible}
                handleDownloadPNG={handleDownloadPNG}
                handleDownloadCSV={handleDownloadCSV}
                toggleFullScreen={toggleFullScreen}
                isFullScreen={true}
                showLegends={true}
                axisSelection={axisSelection}
                handleXAxisChange={handleXAxisChange}
                selectedXAxis={selectedXAxis}
            />
            <Box height="100%">
                {secondaryOptions &&
                    <Box height="25px" >
                        <HighchartsReact
                            data-testid="hight-charts-react"
                            ref={chart}
                            containerProps={{
                                style: { height: "100%", width: "100%" }
                            }}
                            highcharts={Highcharts}
                            options={updatedXRangeOptions || {}}
                        />
                    </Box>
                }
                <Box height={secondaryOptions ? "89%" : "99%"} pb={2} overflow="hidden"  >
                    <HighchartsReact
                        data-testid="high-charts-react"
                        highcharts={Highcharts}
                        options={updatedChartOptions || {}}
                        containerProps={{
                            style: { height: '100%', width: '100%' },
                        }}
                        callback={(chart: Highcharts.Chart) => {
                            highchartsRef.current = chart;
                        }}
                        ref={chart}
                    />
                </Box>
            </Box>
        </StyledChartBox>
    );
};

export default FusionHighChart;