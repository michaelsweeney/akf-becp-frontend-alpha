import React, { useEffect, useState } from "react";
import "./App.css";
import { conn } from "./store/connect";

import { makeStyles } from "@material-ui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as api from "./apicalls";
import * as d3 from "d3";
import PlotContainer from "./components/plots/plotcontainer";
// import PlotControls from "./components/plotcontrols";
import CaseControls from "./components/casecontrols";
import GlobalControls from "./components/globalcontrols";
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
  root: {
    width: "calc(100vw)",
    height: "calc(100vh)",
    boxSizing: "border-box",
  },
  main: {
    width: "100%",
    height: "100%",
    // border: "black solid 1px",
    boxSizing: "border-box",
    padding: 10,
  },
  top: {
    display: "block",
    height: "calc(100% - 150px)",
    width: "calc(100%)",
    boxSizing: "border-box",
    padding: 10,
  },
  topLeft: {
    padding: 10,
    display: "inline-block",
    width: "250px",
    height: "100%",
    // border: "black solid 1px",
    boxSizing: "border-box",
    overflowY: "scroll",
    verticalAlign: "top",
  },
  topRight: {
    display: "inline-block",
    width: "calc(100% - 250px)",
    height: "100%",
    // border: "black solid 1px",
    boxSizing: "border-box",
    verticalAlign: "top",
  },

  bottom: {
    padding: 10,
    height: "150px",
    width: "calc(100%)",
    boxSizing: "border-box",
  },
  bottomMain: {
    display: "inline-block",
    width: "calc(100%)",
    height: "100%",
    boxSizing: "border-box",

    // border: "black solid 1px",
  },
});

const App = (props) => {
  const classes = useStyles();
  let { case_inputs, case_results, isLoadingError } = props.cases;
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
      <div className={classes.root}>
        <div className={classes.main}>
          <LoadingSpinner isLoading={isLoading} />
          <div className={classes.top}>
            <div className={classes.topLeft}>
              <h5>Global Controls</h5>
              <GlobalControls />
              <div style={{ margin: 10, marginLeft: 20 }}>
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://akf-becp-pyapi.herokuapp.com/"
                >
                  view api
                </a>
              </div>
            </div>
            <div className={classes.topRight}>
              {isLoadingError ? <LoadingScreenError /> : <PlotContainer />}
            </div>
          </div>
          <div className={classes.bottom}>
            <div className={classes.bottomMain}>
              <CaseControls />
            </div>
          </div>
        </div>
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
