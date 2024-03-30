const SAMPLING_MASTER_LIST = [
    {
        maxSeconds: 3600,
        samplingSeconds: 1,
        dataPoints: 3600
    },
    {
        maxSeconds: 21600,
        samplingSeconds: 5,
        dataPoints: 4320
    },
    {
        maxSeconds: 86400,
        samplingSeconds: 20,
        dataPoints: 4320
    },
    {
        maxSeconds: 604800,
        samplingSeconds: 120,
        dataPoints: 5040
    },
    {
        maxSeconds: 2628000,
        samplingSeconds: 600,
        dataPoints: 4380
    },
    {
        maxSeconds: 7884000,
        samplingSeconds: 1800,
        dataPoints: 4380
    },
    {
        maxSeconds: 31540000,
        samplingSeconds: 7200,
        dataPoints: 4381
    },
    {
        maxSeconds: 63080000,
        samplingSeconds: 14400,
        dataPoints: 4381
    },

    {
        maxSeconds: 157700000,
        samplingSeconds: 43200,
        dataPoints: 3650
    },
    {
        maxSeconds: 315400000,
        samplingSeconds: 86400,
        dataPoints: 3650
    },
    {
        maxSeconds: 630700000,
        samplingSeconds: 172800,
        dataPoints: 3650
    },
    {
        maxSeconds: 1261400000,
        samplingSeconds: 172800,
        dataPoints: 3650
    }
];

export default SAMPLING_MASTER_LIST;
