import * as d3 from "d3";
import { color } from "d3";
import { useRef, useEffect } from "react";

import { conn } from "../store/connect";

const PlotContainer = (props) => {
  const container = useRef(null);

  let { case_results } = props.cases;

  useEffect(() => {
    if (case_results.length > 0) {
      createChart();
    }
  });

  const createChart = () => {
    // handle / transform datasets

    let case_names = case_results.map((d) => d.name);

    let emissions_projections = case_results.map(
      (d) => d["case_results"]["emissions_projection"]
    );
    let berdo_thresholds = case_results.map(
      (d) => d["berdo_results"]["emissions_thresholds_per_sf"]
    );

    let ll97_thresholds = case_results.map(
      (d) => d["ll97_results"]["emissions_thresholds_per_sf"]
    );

    let node = container.current;
    let colorScale = d3.schemeTableau10;

    let margins = {
      t: 50,
      b: 50,
      r: 50,
      l: 50,
    };

    let containerdims = {
      width: node
        ? node.getBoundingClientRect()["width"]
        : props.window.dims.width - 200,
      height: node
        ? node.getBoundingClientRect()["height"]
        : props.window.dims.height - 225,
    };

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

    d3.select(node).selectAll("svg").data([0]).join("svg");

    let plotg = svg
      .selectAll(".plot-g")
      .data([0])
      .join("g")
      .attr("class", "plot-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let thresholdg = svg
      .selectAll(".threshold-g")
      .data([0])
      .join("g")
      .attr("class", "threshold-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let xaxisg = svg
      .selectAll(".x-axis-g")
      .data([0])
      .join("g")
      .attr("class", "x-axis-g")
      .attr(
        "transform",
        `translate(${margins.l},${margins.t + chartdims.height})`
      );
    let yaxisg = svg
      .selectAll(".y-axis-g")
      .data([0])
      .join("g")
      .attr("class", "y-axis-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let domain_x = [2022, 2050];

    let y_padding = 1.1;

    let max_threshold_val = d3.max([
      berdo_thresholds[0][0]["val"],
      ll97_thresholds[0][0]["val"],
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

    let xScale = d3.scaleTime().range([0, chartdims.width]).domain(domain_x);
    let yScale = d3.scaleLinear().range([0, chartdims.height]).domain(domain_y);

    let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    let yAxis = d3.axisLeft().scale(yScale).ticks(5);

    xaxisg.call(xAxis);
    yaxisg.call(yAxis);

    let lineGen = d3
      .line()
      .x((d) => xScale(d["year"]))
      .y((d) => yScale(d["kg_co2_per_sf"]));

    plotg
      .selectAll(".data-line")
      .data(emissions_projections)
      .join("path")
      .attr("class", "data-line")
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", (d, i) => colorScale[i])
      .attr("stroke-width", 3);

    // --- EMISSIONS THRESHOLDS

    // ------ BERDO THRESHOLDS (from first alternate in array)
    thresholdg
      .selectAll(".berdo-threshold-circle")
      .data(berdo_thresholds[0])
      .join("circle")
      .attr("class", "berdo-threshold-circle")
      .attr("cx", (d) => xScale(d["period"].split("-")[0]))
      .attr("cy", (d) => yScale(d["val"]))
      .attr("r", 4)
      .attr("fill", "green");

    thresholdg
      .selectAll(".berdo-threshold-line")
      .data(berdo_thresholds[0])
      .join("line")
      .attr("class", "berdo-threshold-line")
      .attr("x1", (d) => xScale(d["period"].split("-")[0]))
      .attr("x2", (d) => xScale(2050))
      .attr("y1", (d) => yScale(d["val"]))
      .attr("y2", (d) => yScale(d["val"]))
      .attr("fill", "green")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", 4);

    // ------ LL97 THRESHOLDS (from first alternate in array)
    thresholdg
      .selectAll(".ll97-threshold-circle")
      .data(ll97_thresholds[0])
      .join("circle")
      .attr("class", "ll97-threshold-circle")
      .attr("cx", (d) => xScale(d["period"].split("-")[0]))
      .attr("cy", (d) => yScale(d["val"]))
      .attr("r", 4)
      .attr("fill", "blue");

    thresholdg
      .selectAll(".ll97-threshold-line")
      .data(ll97_thresholds[0])
      .join("line")
      .attr("class", "ll97-threshold-line")
      .attr("x1", (d) => xScale(d["period"].split("-")[0]))
      .attr("x2", (d) => xScale(2050))
      .attr("y1", (d) => yScale(d["val"]))
      .attr("y2", (d) => yScale(d["val"]))
      .attr("fill", "blue")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", 4);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 200px)",
        width: "calc(100vw - 200px)",
      }}
      ref={container}
    ></div>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
  };
};

export default conn(mapStateToProps)(PlotContainer);
