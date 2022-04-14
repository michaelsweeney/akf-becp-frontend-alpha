import { HeatPumpIconPath, ElectricityIconPath, GasIconPath } from "./svgicons";

import { useRef, useEffect } from "react";

import { conn } from "../store/connect";
import * as d3 from "d3";
import { makeStyles } from "@material-ui/styles";

import {
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  Radio,
} from "@mui/material";

const useStyles = makeStyles({
  root: {
    // width: "500px",
    // height: "400px",
    position: "absolute",
    backgroundColor: "gray",
    left: 100,
    top: 100,
  },
});

const ResultsTable = (props) => {
  const {
    case_results_displayed,
    case_comparison_displayed,
    icon_array_displayed,
  } = props;
  console.log(case_results_displayed);
  console.log(case_comparison_displayed);
  console.log(icon_array_displayed);
  const formatFrac = d3.format(",.2");
  const formatPct = d3.format(",.1%");
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Case Name</TableCell>
            <TableCell>Case Icon</TableCell>
            <TableCell>2022 (kg/sf/yr)</TableCell>
            <TableCell>2050 (kg/sf/yr)</TableCell>
            <TableCell>2022 (% vs base)</TableCell>
            <TableCell>2050 (% vs base)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {case_comparison_displayed.map((alt, alt_i) => {
            console.log(alt);
            return (
              <TableRow key={alt_i}>
                <TableCell>{alt.name}</TableCell>
                <TableCell>
                  {() => {
                    // icon_array_displayed[alt_i].case_icon_d
                    return "tbd";
                  }}
                  tbd
                </TableCell>
                <TableCell>{formatFrac(alt.val_2022)}</TableCell>
                <TableCell>{formatFrac(alt.val_2050)}</TableCell>
                <TableCell>{formatPct(alt.pct_2022)}</TableCell>
                <TableCell>{formatPct(alt.pct_2050)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    case_comparison_displayed: store.case_outputs.case_comparison_displayed,
    case_results_displayed: store.case_outputs.case_results_displayed,
    icon_array_displayed: store.case_outputs.icon_array_displayed,
    plot_config: store.plot_config,
    window_dimensions: store.ui.dims,
  };
};

export default conn(mapStateToProps)(ResultsTable);
