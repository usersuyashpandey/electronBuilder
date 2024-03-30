/* eslint-disable @typescript-eslint/no-explicit-any */
export type ChartData = {
    name?: string;
    data?: Array<[number, number | null]>;
    yAxis?: number;
    unit?: string;
    color?: string;
};
export type ProductionData = {
    datetime: number[];
    qo: number[];
    qw: number[];
    qg: number[];
    pres_casing: number[];
    pres_tubing: number[];
    measured_bhp: number[];
    qg_lift: number[];
};
export type CustomChartSelectionEvent = {
    xAxis: Array<{
        min: number;
        max: number;
    }>;
    target: Highcharts.Chart;
};

interface DataLabelsConfig {
    enabled: boolean;
    style: {
        textShadow: string;
        textOutline: string;
        color: string;
        fontWeight: number;
        fontSize: string;
    };
    formatter: () => string;
}

export type xRangeChartType = {
    chart: {
        type?: string;
        height?: string;
        marginTop?: number,
        marginLeft?: number,
        backgroundColor: string;
    };
    title: {
        text: string;
    };
    accessibility: {
        point: {
            descriptionFormat: string;
        };
    };
    xAxis: {
        gridLineWidth: number
        type: string;
    };
    yAxis: {
        gridLineWidth: number
        title: {
            text: string;
        };
        labels: {
            style: {
                color: string;
            },
        },
        categories: string[];
        reversed: boolean;
    };
    series: {
        name: string;
        borderColor: string;
        pointWidth: number;
        data: {
            x: number;
            x2: number;
            y: number;
            dataLabels: DataLabelsConfig;
            color: string
        }[];
        dataLabels: {
            enabled: boolean;
        };
    }[];
    tooltip?: {
        enabled: boolean;
        headerFormat: string;
        pointFormat: string;
        footerFormat: string;
        shared: boolean;
        useHTML: boolean;
    };
};

export type ChartTypes = {
    chart?: {
        type?: string;
        inverted?: boolean
        zoomType?: string,
        events?: {
            setExtremes: unknown;
        };
        zooming?: {
            mouseWheel: boolean;
        };
        backgroundColor?: string;
    };
    title?: {
        text: string;
    };
    tooltip?: {
        shared?: boolean;
        style?: {
            fontFamily?: string
        }
    };
    yAxis?: Array<{
        gridLineWidth?: number;
        lineWidth?: number;
        title?: {
            text?: string;
            style?: {
                color?: string;
            };
        };
        labels?: {
            style?: {
                color?: string;
            };
        };
        autoFormatAxis?: {
            minValue?: number;
            maxValue?: number;
        };
        crosshair?: boolean;
        endOnTick?: boolean;
        lineColor?: string;
        opposite?: boolean;
        events?: {
            click?: any
        },
    }>;
    xAxis?: Array<{
        gridLineWidth?: number;
        attribute?: string;
        type?: string;
        lineColor?: string;
        lineWidth?: number;
        crosshair?: boolean;
        plotLines?: any
        labels?: {
            style?: {
                color?: string;
            };
        };
    }>;
    plotOptions?: {
        series?: {
            lineWidth?: number;
            events?: {
                legendItemClick?: any,
            },
            marker?: {
                enabled?: boolean;
            };
        };
    };
    series?: ChartData[];
    legend: {
        itemStyle: {
            color: string,
            textDecoration?: string | ((this: Highcharts.Point) => string);
        },
        itemHoverStyle: {
            color: string,
            textDecoration: string,
        },
        itemHiddenStyle: {
            color: string,
            textDecoration: string,
        },
    }

};