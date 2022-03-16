import React, { useEffect, useState } from "react";
import "./App.css";
import { conn } from "./store/connect";

import { makeStyles } from "@material-ui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as api from "./apicalls";

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
  let { case_inputs, case_results } = props.cases;

  // handle resize
  useEffect(() => {
    const handleResize = () => {
      props.actions.setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [props.actions]);

  const handleCaseChange = (results) => {
    props.actions.setCaseResults(results);
  };

  useEffect(() => {
    api.getProjectionFromReferenceBuildings(case_inputs, handleCaseChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <a
          target="_blank"
          rel="noopener"
          href="https://akf-becp-pyapi.herokuapp.com/"
        >
          api
        </a>

        <PlotContainer />

        <div>{JSON.stringify(case_inputs)}</div>
        <div>{JSON.stringify(case_results)}</div>
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
