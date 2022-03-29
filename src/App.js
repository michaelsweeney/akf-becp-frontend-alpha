import React, { useEffect, useState } from "react";
import "./App.css";
import { conn } from "./store/connect";

import { makeStyles } from "@material-ui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as api from "./apicalls";
import * as d3 from "d3";
import PlotContainer from "./components/plotcontainer";
import PlotControls from "./components/plotcontrols";
import ApiControls from "./components/apicontrols";
import { LoadingSpinner } from "./components/loadingspinner";
import { LoadingScreenError } from "./components/loadingerrorscreen";
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
  main: {
    padding: 25,
    display: "block",
    height: "calc(100vh)",
    width: "calc(100vw)",
  },
  left: {
    display: "inline-block",
    width: "300px",
    height: "100%",
    verticalAlign: "top",
  },
  right: {
    display: "inline-block",
    width: "calc(100% - 300px)",
    height: "100%",
    verticalAlign: "top",
  },
});

const App = (props) => {
  const classes = useStyles();
  let { case_inputs, case_results, isLoadingError } = props.cases;
  console.log(isLoadingError);
  let { isLoading } = props.ui;
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

  const updateResults = () => {
    api.getProjectionFromReferenceBuildings(
      props.cases.case_inputs,
      props.actions.setCaseResults,
      props.actions.setIsLoading
    );
  };

  useEffect(() => {
    updateResults();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LoadingSpinner isLoading={isLoading} />
      <div className={classes.app}>
        <div className={classes.main}>
          <div className={classes.left}>
            <h5>Case Controls</h5>
            <ApiControls />
            <div style={{ margin: 10, marginLeft: 20 }}>
              <a
                target="_blank"
                rel="noopener"
                href="https://akf-becp-pyapi.herokuapp.com/"
              >
                view api
              </a>
            </div>
            <h5>Plot Controls</h5>

            <PlotControls />
            {/*<h5>Raw editable (use at your own risk)</h5>

            <pre onBlur={handleRawInputChange} contentEditable="true">
              {JSON.stringify(case_inputs, undefined, 2)}
  </pre>*/}
          </div>
          <div className={classes.right}>
            {isLoadingError ? <LoadingScreenError /> : <PlotContainer />}
          </div>
        </div>
        <div></div>
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
    ui: { ...store.ui },
  };
};

export default conn(mapStateToProps)(App);
