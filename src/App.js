import React, { useEffect, useState } from "react";
import "./App.css";
import { conn } from "./store/connect";

import { makeStyles } from "@material-ui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { getProjectionFromReferenceBuildings } from "./apicalls";
import PlotContainer from "./components/plotcontainer";
const theme = createTheme({
  palette: {
    secondary: {
      main: "#cf202e",
    },
    primary: {
      main: "#283759",
    },
  },
});

const useStyles = makeStyles({
  app: {},
});

const App = (props) => {
  const classes = useStyles();
  let { case_inputs, case_outputs } = props.cases;

  useEffect(() => {
    getProjectionFromReferenceBuildings(
      case_inputs,
      props.actions.setCaseResults
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <div>{JSON.stringify(case_inputs)}</div>
        <div>{JSON.stringify(case_outputs)}</div>
        <PlotContainer />
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
  };
};

export default conn(mapStateToProps)(App);
