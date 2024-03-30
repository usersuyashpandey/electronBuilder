import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const InterferenceTable = ({ data, ...props }) => {
  const theme = useTheme();
  const [rows, setRows] = React.useState([
    { name: "Oil Rate" },
    { name: "Gas Rate" },
    { name: "Oil Cumulative" },
    { name: "Gas Cumulative" },
  ]);

  React.useEffect(() => {
    if (data) {
      const preDeltaForecastRateOil = data[1]?.deltaForecastRateOil;
      const preDeltaForecastRateGas = data[1]?.deltaForecastRateGas;
      const preDeltaForecastCumOil = data[1]?.deltaForecastCumOil;
      const preDeltaForecastCumGas = data[1]?.deltaForecastCumGas;

      const preData = data[0]?.data_fcast;
      const postData = data[1]?.data_fcast;

      const preCumGasRate = preData?.cum_gas[preData?.cum_gas.length - 1];
      const postCumGasRate = postData?.cum_gas[postData?.cum_gas.length - 1];

      const preCumOilRate = preData?.cum_oil[preData?.cum_oil.length - 1];
      const postcumOilRate = postData?.cum_oil[postData?.cum_oil.length - 1];

      const preOilRate = preData?.q_oil[preData?.q_oil.length - 1];
      const postOilRate = postData?.q_oil[postData?.q_oil.length - 1];

      const preGasRate = preData?.q_gas[preData?.q_gas.length - 1];
      const postGasRate = postData?.q_gas[postData?.q_gas.length - 1];
      setRows([
        {
          name: "Oil Rate (STB/d)",
          preValue: preOilRate?.toFixed(1),
          postValue: postOilRate ? postOilRate?.toFixed(1) : "",
          diff: preDeltaForecastRateOil
            ? preDeltaForecastRateOil?.toFixed(1)
            : "",
        },
        {
          name: "Gas Rate (Mscf/d)",
          preValue: (preGasRate / 1000).toFixed(1),
          postValue: postGasRate ? (postGasRate / 1000).toFixed(1) : "",
          diff: preDeltaForecastRateGas
            ? (preDeltaForecastRateGas / 1000).toFixed(1)
            : "",
        },
        {
          name: "Oil Cumulative (MMSTB)",
          preValue: (preCumOilRate / 1000000).toFixed(2),
          postValue: postcumOilRate
            ? (postcumOilRate / 1000000).toFixed(2)
            : "",
          diff: preDeltaForecastCumOil
            ? (preDeltaForecastCumOil / 1000000).toFixed(2)
            : "",
        },
        {
          name: "Gas Cumulative (MMscf)",
          preValue: (preCumGasRate / 1000000).toFixed(1),
          postValue: postCumGasRate
            ? (postCumGasRate / 1000000).toFixed(1)
            : "",
          diff: preDeltaForecastCumGas
            ? (preDeltaForecastCumGas / 1000000).toFixed(1)
            : "",
        },
      ]);
    }
  }, [data]);

  return (
    <TableContainer
      component={Paper}
      style={{
        border: `1px solid ${theme.palette.background.border}`,
        backgroundColor: theme.palette.background.screen,
        borderRadius: "12px",
        height: props.height,
      }}
    >
      <Table aria-label="simple table">
        <TableHead
          sx={{
            "& .MuiTableCell-root": { padding: "5px" },
            backgroundColor: theme.palette.background.header,
          }}
        >
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="center">Pre Interference</TableCell>
            <TableCell align="center">Post Interference</TableCell>
            <TableCell align="center">Difference</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            "& .MuiTableCell-root": { padding: "8px" },
            backgroundColor: theme.palette.background.screen,
          }}
        >
          {rows.map((row, index) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Typography
                  variant="h5"
                  sx={{
                    fontStyle: "normal",
                    fontWeight: "bold",
                    fontSize: "14px",
                    fontFamily: "Poppins",
                  }}
                >
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell align="center">{row?.preValue}</TableCell>
              <TableCell align="center">{row?.postValue}</TableCell>
              <TableCell align="center">{row?.diff}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default InterferenceTable;
