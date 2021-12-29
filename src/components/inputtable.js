import { DataGrid } from "@mui/x-data-grid";
import { conn } from "../store/connect";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";

const InputTable = () => {
  /* do i really need multiple cases for state, cz, proj case, & standard ? */
  let cases = [
    {
      label: "case 1 (elec DHW)",
      state: "NY",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "ApartmentHighRise",
          area: 200000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 2.5,
          dhw_cop: 2.5,
          ashrae_standard: "STD2013",
        },
        {
          type: "OfficeSmall",
          area: 10000,
          heating_fuel: "Natural Gas",
          dhw_fuel: "Natural Gas",
          heating_cop: 0.8,
          dhw_cop: 0.8,
          ashrae_standard: "STD2013",
        },
      ],
    },
    {
      label: "case 2 (VRF Htg)",
      state: "NY",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "ApartmentHighRise",
          area: 200000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 2.5,
          dhw_cop: 2.5,
          ashrae_standard: "STD2013",
        },
        {
          type: "OfficeSmall",
          area: 10000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 2.3,
          dhw_cop: 2.3,
          ashrae_standard: "STD2013",
        },
      ],
    },
  ];

  const rows_top = [
    { label: "State", case1: "NY", case2: "NY" },
    { label: "Climate Zone", case1: "4A", case2: "4A" },
    { label: "Projection Case", case1: "MidCase", case2: "MidCase" },
    { label: "Standard", case1: "STD-2013", case2: "STD-2013" },
  ];

  const rows_bottom = [
    { label: "Gross Area (SF)", case1: 2000, case2: 2000 },
    { label: "Heating Fuel", case1: "Electricity", case2: "Natural Gas" },
    { label: "Heating COP", case1: 2.5, case2: 0.8 },
    { label: "DHW Fuel", case1: "Natural Gas", case2: "Natural Gas" },
    { label: "DHW COP", case1: 2.5, case2: 0.8 },
  ];

  return (
    <div style={{ height: 400, width: "80%", padding: 100 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Case 1</TableCell>
              <TableCell>Case 2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows_top.map((row) => {
              return (
                <TableRow>
                  {Object.values(row).map((e) => {
                    return <TableCell>{e}</TableCell>;
                  })}
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3}> </TableCell>
            </TableRow>
            {rows_bottom.map((row) => {
              return (
                <TableRow>
                  {Object.values(row).map((e) => {
                    return <TableCell>{e}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
  };
};

export default conn(mapStateToProps)(InputTable);
