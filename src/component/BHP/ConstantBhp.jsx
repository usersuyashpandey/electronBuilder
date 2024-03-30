export const fluidTypeOptions = [
    {
        label: "Saturated Oil",
        value: "liveOil",
        inputFields: ["oilGrav", "rsi", "gasGrav", "y_n2", "y_h2s", "y_co2", "wat_salinity"]
    },
    {
        label: "Dead Oil",
        value: "dreadOil",
        inputFields: ["oilGrav", "wat_salinity"]
    },
    {
        label: "Dry Gas",
        value: "dryGas",
        inputFields: ["gasGrav", "y_n2", "y_h2s", "y_co2", "wat_salinity"]
    }
]
export const defaultFluidTypeInputs = {
    oilGrav: { label: "Oil Gravity", min: 10, max: 60, unit: "api", error: "" },
    gasGrav: { label: "Gas Gravity", min: 0.6, max: 1.5, unit: "psia", error: "" },
    rsi: { label: "Solution GOR", min: 0, max: 10000, unit: "scf/stb", error: "" },
    wat_salinity: { label: "Water Salinity", min: 1000, max: 400000, unit: "ppm", error: "" },
    y_n2: { label: "Molar Fraction - N2", min: 0, max: 1, unit: "%", error: "" },
    y_h2s: { label: "Molar Fraction - H2S", min: 0, max: 1, unit: "%", error: "" },
    y_co2: { label: "Molar Fraction - CO2", min: 0, max: 1, unit: "%", error: "" }
}
export const referenceTypeOptions = [
    {
        value: "pressure",
        label: "Pressure",
        inputFields: ["min", "max", "increment", "temp"]
    },
    {
        value: "temperature",
        label: "Temperature",
        inputFields: ["min", "max", "increment", "pres"]
    }
]
export const defaultReferenceInputs = {
    pressure: {
        min: { label: "Min", min: 14.7, max: 30000, unit: "psia", error: "" },
        max: { label: "Max", min: 14.7, max: 30000, unit: "psia", error: "" },
        increment: { label: "Increment", min: 1, max: 30000, unit: "psia", error: "" },
        temp: { label: "Temperature", min: 60, max: 400, unit: "F", error: "" }
    },
    temperature: {
        min: { label: "Min", min: 60, max: 400, unit: "F", error: "" },
        max: { label: "Max", min: 60, max: 400, unit: "F", error: "" },
        increment: { label: "Increment", min: 1, max: 400, unit: "F", error: "" },
        pres: { label: "Pressure", min: 14.7, max: 30000, unit: "psia", error: "" }
    }
}
export const correlationTypeOptions = [
    {
        groupLabel: "Gas",
        groupOptions: [
            {
                label: "Pseudo-critical Pressure/Temperature (psi)",
                name: "ppctpc",
                options: [
                    { label: "Sutton", value: "sutton" },
                    { label: "Standing", value: "standing" }
                ]
            },
            {
                label: "Z Factor",
                name: "z",
                options: [
                    { label: "Hall and Yarborough", value: "hall_yarborough" },
                    { label: "Dranchuk and Abou-Kassem", value: "dranchuk_aboukassem" }
                ]
            },
            {
                label: "Gas Formation Volume Factor (bbl/scf)",
                name: "bg",
                options: [{ label: "Internal", value: "internal" }]
            },
            {
                label: "Gas Compressibility Factor (1/psi)",
                name: "cg",
                options: [
                    { label: "Hall and Yarborough", value: "hall_yarborough" },
                    { label: "Mattar et al.", value: "mattar" }
                ]
            },
            { label: "Gas Density (lb/ft3)", name: "deng", options: [{ label: "Internal", value: "internal" }] },
            {
                label: "Gas Viscosity (cp)",
                name: "mug",
                options: [
                    { label: "Lee et al.", value: "lee" },
                    { label: "Carr et al.", value: "carr" }
                ]
            }
        ]
    },
    {
        groupLabel: "Oil",
        groupOptions: [
            {
                label: "Saturation Pressures (psia)",
                name: "psat",
                options: [
                    { label: "Standing", value: "standing" },
                    { label: "Vazquez and Beggs", value: "vazquez_beggs" },
                    { label: "Lasater", value: "lasater" },
                    { label: "Glaso", value: "glaso" },
                    { label: "Glaso Volatile", value: "glaso_volatile" },
                    { label: "Glaso (corrected)", value: "glaso_corrected" },
                    { label: "Glaso Volatile (corrected)", value: "glaso_volatile_corrected" }
                ]
            },
            {
                label: "Solution Gas-Oil Ratio (scf/stb)",
                name: "rs",
                options: [
                    { label: "Standing", value: "standing" },
                    { label: "Vazquez and Beggs", value: "vazquez_beggs" },
                    { label: "Lasater", value: "lasater" },
                    { label: "Glaso", value: "glaso" },
                    { label: "Glaso Volatile", value: "glaso_volatile" },
                    { label: "Glaso (corrected)", value: "glaso_corrected" },
                    { label: "Glaso Volatile (corrected)", value: "glaso_volatile_corrected" }
                ]
            },
            {
                label: "Oil Formation Volume Factor (bbl/stb)",
                name: "bo",
                options: [
                    { label: "Standing", value: "standing" },
                    { label: "Vazquez and Beggs", value: "vazquez_beggs" },
                    { label: "Glaso", value: "glaso" }
                ]
            },
            {
                label: "Oil Compressibility Factor (1/psi)",
                name: "co",
                options: [{ label: "Vazquez and Beggs", value: "vazquez_beggs" }]
            },
            {
                label: "Oil Viscosity (cp)",
                name: "muo",
                options: [
                    { label: "Beal", value: "beal" },
                    { label: "Beggs and Robinson", value: "beggs_robinson" }
                ]
            },
            { label: "Oil Density (lb/ft3)", name: "deno", options: [{ label: "Internal", value: "internal" }] }
        ]
    },
    {
        groupLabel: "Water",
        groupOptions: [
            {
                label: "Solution Gas-Water Ratio (scf/stb)",
                name: "rsw",
                options: [
                    { label: "McCoy", value: "mccoy" },
                    { label: "Culbertson and McKetta", value: "culberson_mcketta" }
                ]
            },
            {
                label: "Water Formation Volume Factor (bbl/stb)",
                name: "bw",
                options: [
                    { label: "McCoy", value: "mccoy" },
                    { label: "McCain", value: "mccain" }
                ]
            },
            {
                label: "Water Compressibility Factor (1/psi)",
                name: "cw",
                options: [
                    { label: "Dodson and Standing", value: "dodson_standing" },
                    { label: "Osif", value: "osif" }
                ]
            },
            {
                label: "Water Viscosity (cp)",
                name: "muw",
                options: [
                    { label: "McCoy", value: "mccoy" },
                    { label: "Matthews and Russell", value: "matthews_russel" },
                    { label: "McCain", value: "mccain" },
                    { label: "Van-Wingen", value: "vanwingen" }
                ]
            },
            {
                label: "Water Density (lb/ft3)",
                name: "denw",
                options: [
                    { label: "McCain", value: "mccain" },
                    { label: "Internal", value: "internal" }
                ]
            }
        ]
    },
    {
        groupLabel: "Interfacial Tension",
        groupOptions: [
            {
                label: "Interfacial Tension Gas-Oil (dynes/cm)",
                name: "sigma_go",
                options: [
                    { label: "Abdul-Majeed", value: "abdul_majeed" },
                    { label: "Baker and Swerdlof", value: "baker_swerdloff" }
                ]
            },
            {
                label: "Interfacial Tension Gas-Water (dynes/cm)",
                name: "sigma_gw",
                options: [
                    { label: "Firoozabadi and Ramey", value: "firoozabadi_ramey" },
                    { label: "Jennings and Newman", value: "jennings_newman" }
                ]
            },
            {
                label: "Interfacial Tension Oil-Water (dynes/cm)",
                name: "sigma_ow",
                options: [{ label: "Firoozabadi and Ramey", value: "firoozabadi_ramey" }]
            }
        ]
    }
]
export const flowTypeOptions = [
    { label: "Tubing Flow", value: "TubingFlow" },
    { label: "Annular Flow", value: "AnnularFlow" },
    { label: "Casing Flow", value: "CasingFlow" }
]
export const liftTypeOptions = [
    { label: "Natural Flow", value: "NaturalFlow" },
    { label: "Rod Pump", value: "RodPump" },
    { label: "Gas Lift", value: "GasLift" },
    { label: "ESP", value: "ESP" }
]
export const flowCorrelationOptions = [
    { label: "Hagedorn and Brown", value: "hagedorn_brown" },
    { label: "Baxendell and Thomas", value: "baxendell_thomas" },
    { label: "Beggs and Brill", value: "beggs_brill" },
    { label: "Fancher and Brown", value: "fancher_brown" },
    { label: "Poettmann and Carpenter", value: "poettmann_carpenter" },
    { label: "Duns and Ros", value: "duns_ros" },
    { label: "Mukherjee and Brill", value: "mukherjee_brill" },
    { label: "Gray", value: "gray" },
    { label: "Orkiszewski", value: "orkiszewski" },
    { label: "Homogenous No Slip", value: "homogeneous_no_slip" },
    { label: "Homogenous Liquid", value: "homogeneous_liquid" },
    { label: "Homogenous No Slip No Friction", value: "homogeneous_no_slip_no_friction" },
    { label: "Single-phase Liquid", value: "singlephase_liquid" },
    { label: "Single-phase Gas", value: "singlephase_gas" },
    { label: "Godbey-Dimon", value: "godbey_dimon" },
    { label: "Podio", value: "podio" },
    { label: "Gilbert", value: "gilbert" },
    { label: "An", value: "an" },
]
export const outputCharts = [
    { tabID: 0, tabName: "Gas", numCharts: 6, chartProps: [{ attr: "ppctpc", attrName: "Pseudo-critical Pressure/Temperature", unit: "(psi/F)", multiSeries: [{ attr: "ppc", attrName: "Pseudo-critical Pressure", unit: "(psi)", opposite: false }, { attr: "tpc", attrName: "Pseudo-critical Temperature", unit: "(F)", opposite: true }] }, { attr: "z", attrName: "Z Factor", unit: "" }, { attr: "bg", attrName: "Gas Formation Volume Factor", unit: "(bbl/scf)" }, { attr: "deng", attrName: "Gas Density", unit: "(lb/ft3)" }, { attr: "cg", attrName: "Gas Compressibility Factor", unit: "(1/psi)" }, { attr: "mug", attrName: "Gas Viscosity", unit: "(cp)" }] },
    { tabID: 1, tabName: "Oil", numCharts: 6, chartProps: [{ attr: "bo", attrName: "Oil Formation Volume Factor", unit: "(bbl/stb)" }, { attr: "co", attrName: "Oil Compressibility Factor", unit: "(1/psi)" }, { attr: "muo", attrName: "Oil Viscosity", unit: "(cp)" }, { attr: "deno", attrName: "Oil Density", unit: "(lb/ft3)" }, { attr: "rs", attrName: "Solution Gas-Oil Ratio", unit: "(scf/stb)" }, { attr: "psat", attrName: "Saturation Pressures", unit: "(psia)" }] },
    { tabID: 2, tabName: "Water", numCharts: 5, chartProps: [{ attr: "bw", attrName: "Water Formation Volume Factor", unit: "(bbl/stb)" }, { attr: "cw", attrName: "Water Compressibility Factor", unit: "(1/psi)" }, { attr: "muw", attrName: "Water Viscosity", unit: "(cp)" }, { attr: "denw", attrName: "Water Density", unit: "(lb/ft3)" }, { attr: "rsw", attrName: "Solution Gas-Water Ratio", unit: "(scf/stb)" }] },
    { tabID: 3, tabName: "Inter-Phase", numCharts: 3, chartProps: [{ attr: "sigma_ow", attrName: "Interfacial Tension Oil-Water", unit: "(dynes/cm)" }, { attr: "sigma_go", attrName: "Interfacial Tension Gas-Oil", unit: "(dynes/cm)" }, { attr: "sigma_gw", attrName: "Interfacial Tension Gas-Water", unit: "(dynes/cm)" }] }

]
export const defaultChartConfig = {
    headerName: "Production Scenarios",
    chartJson: {
        chart: {
            type: "line",
            zoomType: "xy",
            marginLeft: 65,
            marginRight: 15
        },
        legend: {
            enabled: true
        },
        xAxis: {
            // id: 0,
            title: {
                text: " "
            },
            // lineColor: "#9e9e9e",
            // lineWidth: 1,
            gridLineWidth: 0,
            crosshair: false
        },
        yAxis: {
            // id: 0,
            title: {
                text: " "
            },
            // lineColor: "#9e9e9e",
            // lineWidth: 1,
            gridLineWidth: 0,
            crosshair: false
        },
        tooltip: {
            crosshair: false,
            shared: true
        },
        exporting: {
            enabled: false,
            filename: "rates-Data",
        },
        series: []
    }
}
export const timePickerWorkFlow = {
    headerName: "Time Picker",
    samplingInterval: false,
    relativeTime: ["1m", "3m", "6m", "1y", "5y"],
    dateTimeFormat: "mm/dd/yy",
    showTime: false,
    showSeconds: false
}
export const prodColumnOptions = {
    columns: [
        {
            field: 'editActions',
            headerName: 'Actions',
            width: 110
        },
        {
            field: 'datetime',
            headerName: 'Datetime',
            fileHeader: 'Datetime',
            type: 'dateTime',
            width: 200,
            editable: true,
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'pres_tubing',
            headerName: 'Pressure Tubing',
            unit: 'psia',
            fileHeader: 'Pressure Tubing (psia)',
            type: 'number',
            width: 200,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'pres_casing',
            headerName: 'Pressure Casing',
            unit: 'psia',
            fileHeader: 'Pressure Casing (psia)',
            type: 'number',
            width: 200,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'qo',
            headerName: 'Oil Rate',
            unit: 'STB/d',
            fileHeader: 'Oil Rate (STB/d)',
            type: 'number',
            width: 200,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'qg',
            headerName: 'Gas Rate',
            unit: 'SCF/d',
            fileHeader: 'Gas Rate (SCF/d)',
            type: 'number',
            width: 200,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'qw',
            headerName: 'Water Rate',
            unit: 'STB/d',
            fileHeader: 'Water Rate (STB/d)',
            type: 'number',
            width: 180,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'measured_bhp',
            headerName: 'Measured BHP',
            unit: 'psia',
            fileHeader: 'Measured BHP (psia)',
            type: 'number',
            width: 150,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'qg_lift',
            headerName: 'Gas Lift Injection Rate',
            unit: 'SCF/d',
            fileHeader: 'Gas Lift Injection Rate (SCF/d)',
            type: 'number',
            width: 180,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'esp_frequency',
            headerName: 'ESP Frequency',
            unit: 'Hz',
            fileHeader: 'ESP frequency (Hz)',
            type: 'number',
            width: 180,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'esp_suctionpresure',
            headerName: 'ESP Suction Pressure',
            unit: 'pisa',
            fileHeader: 'ESP Suction Pressure (pisa)',
            type: 'number',
            width: 180,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'esp_dischargepresure',
            headerName: 'ESP Discharge Pressure',
            unit: 'pisa',
            fileHeader: 'ESP Discharge Pressure (pisa)',
            type: 'number',
            width: 180,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'rod_pumpsdeed',
            headerName: 'Rod Pump Speed',
            unit: 'SPM',
            fileHeader: 'Rod Pump Speed (SPM)',
            type: 'number',
            width: 180,
            editable: true,
            headerAlign: 'left',
            align: 'left'
        },
    ]
}
export const youtubeVideoUrl = {
    headerName: "Video Plyer",
    videoUrl: "https://www.youtube.com/watch?v=Vj4gMLQS1ZA"
}
