import * as d3 from "d3";
import { color } from "d3";

import { HeatPumpIconPath, ElectricityIconPath, GasIconPath } from "./svgicons";

import { useRef, useEffect } from "react";

import { conn } from "../../store/connect";

import { createMultiLineChart } from "./multiline";
import { createStackedAreaChart } from "./stackedarea";

import { getIdealSpacing } from "./spacing";

const PlotContainer = (props) => {
  const container = useRef(null);

  let { case_results } = props.cases;
  let { plot_config } = props;

  useEffect(() => {
    if (case_results.length > 0) {
      createChart(plot_config);
    }
  });

  const createChart = (plot_config) => {
    let { activePlot, stackedAreaIndex, thresholdView } = plot_config;
    // handle / transform datasets

    let node = container.current;

    let margins = {
      t: 50,
      b: 200,
      r: 100,
      l: 50,
    };

    let containerdims = {
      width: 700,
      height: 700,
    };

    let emissions_projections = case_results.map(
      (d) => d["case_results"]["emissions_projection"]
    );

    let emissions_projections_by_fuel = case_results.map(
      (d) => d["case_results"]["emissions_projection_by_fuel"]
    );

    let berdo_thresholds = case_results.map(
      (d) => d["berdo_results"]["emissions_thresholds_per_sf"]
    );
    let ll97_thresholds = case_results.map(
      (d) => d["ll97_results"]["emissions_thresholds_per_sf"]
    );

    let y_padding = 1.1;

    let max_threshold_val = d3.max([
      plot_config.thresholdView == "berdo" ? berdo_thresholds[0][0]["val"] : 0,
      plot_config.thresholdView == "ll97" ? ll97_thresholds[0][0]["val"] : 0,
    ]);

    let max_emission_val = () => {
      let max = 0;
      emissions_projections.forEach((ar) => {
        let vals = ar.map((e) => e["kg_co2_per_sf"]);
        max = d3.max([max, d3.max(vals)]);
      });
      return max;
    };

    let domain_y = [
      d3.max([max_threshold_val, max_emission_val()]) * y_padding,
      0,
    ];

    let domain_x = [2022, 2050];

    let chartdims = {
      width: containerdims.width - margins.l - margins.r,
      height: containerdims.height - margins.t - margins.b,
    };

    let svg = d3
      .select(node)
      .selectAll("svg")
      .data([0])
      .join("svg")
      .attr("width", containerdims.width)
      .attr("height", containerdims.height);

    let title_g = svg
      .selectAll(".title-g")
      .data([0])
      .join("g")
      .attr("class", "title-g");

    let plot_g = svg
      .selectAll(".plot-g")
      .data([0])
      .join("g")
      .attr("class", "plot-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let legend_g = svg
      .selectAll(".legend-g")
      .data([0])
      .join("g")
      .attr("class", "legend-g")
      .attr(
        "transform",
        `translate(${margins.l},${margins.t + chartdims.height})`
      );

    let xaxis_g = svg
      .selectAll(".x-axis-g")
      .data([0])
      .join("g")
      .attr("class", "x-axis-g")
      .attr(
        "transform",
        `translate(${margins.l},${margins.t + chartdims.height})`
      );
    let yaxis_g = svg
      .selectAll(".y-axis-g")
      .data([0])
      .join("g")
      .attr("class", "y-axis-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let topborder_g = svg
      .selectAll(".top-border-g")
      .data([0])
      .join("g")
      .attr("class", "top-border-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let rightborder_g = svg
      .selectAll(".right-border-g")
      .data([0])
      .join("g")
      .attr("class", "right-border-g")
      .attr(
        "transform",
        `translate(${margins.l + chartdims.width},${margins.t})`
      );

    let annotation_g = svg
      .selectAll(".annotation-g")
      .data([0])
      .join("g")
      .attr("class", "annotation-g");

    let hover_g = svg
      .selectAll(".hover-g")
      .data([0])
      .join("g")
      .attr("class", "hover-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let xScale = d3.scaleLinear().range([0, chartdims.width]).domain(domain_x);
    let yScale = d3.scaleLinear().range([0, chartdims.height]).domain(domain_y);

    let {
      multiline_g,
      multiline_legend_g,
      multiline_ll97_g,
      multiline_berdo_g,
    } = createMultiLineChart({
      chartdims,
      margins,
      svg,
      title_g,
      xaxis_g,
      yaxis_g,
      plot_g,
      rightborder_g,
      topborder_g,
      annotation_g,
      hover_g,
      legend_g,
      case_results,
      plot_config,
      berdo_thresholds,
      ll97_thresholds,
      xScale,
      yScale,
      emissions_projections,
    });

    let { stacked_area_g, stacked_legend_g } = createStackedAreaChart({
      chartdims,
      svg,
      title_g,
      xaxis_g,
      yaxis_g,
      plot_g,
      margins,
      rightborder_g,
      topborder_g,
      annotation_g,
      legend_g,
      plot_config,
      stackedAreaIndex,
      emissions_projections_by_fuel,
      xScale,
      yScale,
    });

    // VIEW TOGGLE
    if (activePlot === "multiline") {
      stacked_area_g.remove();
      stacked_legend_g.remove();
    }

    if (activePlot === "stacked") {
      multiline_g.remove();
      multiline_legend_g.remove();
    }
    if (thresholdView === "berdo") {
      multiline_ll97_g.remove();
    }
    if (thresholdView === "ll97") {
      multiline_berdo_g.remove();
    }
    if (thresholdView === "none") {
      multiline_berdo_g.remove();
      multiline_ll97_g.remove();
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
      ref={container}
    ></div>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
    plot_config: { ...store.plot_config },
  };
};

export default conn(mapStateToProps)(PlotContainer);
