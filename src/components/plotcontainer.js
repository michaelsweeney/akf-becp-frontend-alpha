import * as d3 from "d3";
import { color } from "d3";
import { useRef, useEffect } from "react";

import { conn } from "../store/connect";

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

    let berdo_color = "black";
    let ll97_color = "black";

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

    let node = container.current;
    let colorScale = d3.schemeTableau10;

    let fuelColors = {
      Electricity: "#1F77B4FF",
      "Natural Gas": "#FF7F0EFF",
    };

    let margins = {
      t: 50,
      b: 200,
      r: 50,
      l: 50,
    };

    let containerdims = {
      width: node
        ? node.getBoundingClientRect()["width"]
        : props.window.dims.width - 400,
      height: node
        ? node.getBoundingClientRect()["height"]
        : props.window.dims.height - 200,
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

    let titleg = svg
      .selectAll(".title-g")
      .data([0])
      .join("g")
      .attr("class", "title-g");

    let multilineg = svg
      .selectAll(".multiline-g")
      .data([0])
      .join("g")
      .attr("class", "multiline-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let stackedareag = svg
      .selectAll(".stacked-area-g")
      .data([0])
      .join("g")
      .attr("class", "stacked-area-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let berdog = svg
      .selectAll(".berdo-g")
      .data([0])
      .join("g")
      .attr("class", "berdo-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let ll97g = svg
      .selectAll(".ll97-g")
      .data([0])
      .join("g")
      .attr("class", "ll97-g")
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

    let topborderg = svg
      .selectAll(".top-border-g")
      .data([0])
      .join("g")
      .attr("class", "top-border-g")
      .attr("transform", `translate(${margins.l},${margins.t})`);

    let rightborderg = svg
      .selectAll(".right-border-g")
      .data([0])
      .join("g")
      .attr("class", "right-border-g")
      .attr(
        "transform",
        `translate(${margins.l + chartdims.width},${margins.t})`
      );

    let legendg = svg
      .selectAll(".legend-g")
      .data([0])
      .join("g")
      .attr("class", "legend-g")
      .attr(
        "transform",
        `translate(${margins.l},${margins.t + chartdims.height})`
      );

    let domain_x = [2022, 2050];

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

    let xScale = d3.scaleTime().range([0, chartdims.width]).domain(domain_x);
    let yScale = d3.scaleLinear().range([0, chartdims.height]).domain(domain_y);

    let xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0);
    let yAxis = d3.axisLeft().scale(yScale).ticks(5).tickSizeOuter(0);

    xaxisg.call(xAxis);
    yaxisg.call(yAxis);

    rightborderg.call(d3.axisRight().scale(yScale).ticks(0).tickSizeOuter(0));
    topborderg.call(d3.axisTop().scale(xScale).ticks(0).tickSizeOuter(0));

    let lineGen = d3
      .line()
      .x((d) => xScale(d["year"]))
      .y((d) => yScale(d["kg_co2_per_sf"]));
    multilineg
      .selectAll(".data-line")
      .data(emissions_projections)
      .join("path")
      .attr("class", "data-line")
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", (d, i) => colorScale[i])
      .attr("stroke-width", 3);

    // --- EMISSIONS THRESHOLDS

    // --- BERDO THRESHOLDS (from first alternate in array)

    berdog
      .selectAll(".berdo-threshold-circle")
      .data(berdo_thresholds[0])
      .join("circle")
      .attr("class", "berdo-threshold-circle")
      .attr("cx", (d) => xScale(d["period"].split("-")[0]))
      .attr("cy", (d) => yScale(d["val"]))
      .attr("r", 5)
      .attr("fill", d3.color(berdo_color).brighter(0.5))
      .attr("stroke", berdo_color);

    berdog
      .selectAll(".berdo-threshold-line")
      .data(berdo_thresholds[0])
      .join("line")
      .attr("class", "berdo-threshold-line")
      .attr("x1", (d) => xScale(d["period"].split("-")[0]) + 8)
      .attr("x2", (d) => xScale(2050))
      .attr("y1", (d) => yScale(d["val"]))
      .attr("y2", (d) => yScale(d["val"]))
      .attr("fill", berdo_color)
      .attr("stroke", berdo_color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", 4);

    //// --- LL97 THRESHOLDS (from first alternate in array)
    ll97g
      .selectAll(".ll97-threshold-circle")
      .data(ll97_thresholds[0])
      .join("circle")
      .attr("class", "ll97-threshold-circle")
      .attr("cx", (d) => xScale(d["period"].split("-")[0]))
      .attr("cy", (d) => yScale(d["val"]))
      .attr("r", 4)
      .attr("fill", ll97_color);
    ll97g
      .selectAll(".ll97-threshold-line")
      .data(ll97_thresholds[0])
      .join("line")
      .attr("class", "ll97-threshold-line")
      .attr("x1", (d) => xScale(d["period"].split("-")[0]))
      .attr("x2", (d) => xScale(2050))
      .attr("y1", (d) => yScale(d["val"]))
      .attr("y2", (d) => yScale(d["val"]))
      .attr("fill", ll97_color)
      .attr("stroke", ll97_color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", 4);

    // --- AREA PLOT THRESHOLDS
    // template source: https://www.d3-graph-gallery.com/graph/stackedarea_template.html

    let data = emissions_projections_by_fuel[stackedAreaIndex].map((d) => {
      return {
        fuel: d.fuel,
        year: d.year,
        kg_co2_per_sf: d.kg_co2_per_sf,
      };
    });

    let years = [...new Set(data.map((d) => d.year))];
    let fuel_types = [...new Set(data.map((d) => d.fuel))];

    let prestacked_data = [];
    years.forEach((year, i) => {
      let year_obj = {};

      year_obj["year"] = year;

      fuel_types.forEach((fuel) => {
        year_obj[fuel] = data.filter((d) => {
          return d.fuel == fuel && d.year == year;
        })[0]["kg_co2_per_sf"];
      });
      prestacked_data.push(year_obj);
    });

    let stackedData = d3.stack().keys(fuel_types)(prestacked_data);

    // Area generator
    let areaGen = d3
      .area()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    stackedareag.selectAll(".areas").remove();
    stackedareag
      .selectAll(".areas")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", "areas")
      .style("fill", (d) => fuelColors[d.key])
      .attr("d", areaGen);

    //// --- LEGENDS

    let legend_padding_top = 50;

    // multiline g

    let multiline_legend_g = legendg
      .selectAll(".multiline-legend-g")
      .data([0])
      .join("g")
      .attr("class", "multiline-legend-g")
      .attr("transform", `translate(0, ${legend_padding_top})`);

    let multiline_legend_case_lines = multiline_legend_g
      .selectAll(".multiline-legend-case-line")
      .data(case_results)
      .join("line")
      .attr("class", "multiline-legend-case-line")
      .attr("x1", 0)
      .attr("x2", 30)
      .attr("y1", (d, i) => 30 * i)
      .attr("y2", (d, i) => 30 * i)
      .attr("stroke", (d, i) => colorScale[i])
      .attr("stroke-width", 3);

    let multiline_legend_case_text = multiline_legend_g
      .selectAll(".multiline-legend-case-text")
      .data(case_results)
      .join("text")
      .attr("x", 40)
      .attr("y", (d, i) => 30 * i + 5)
      .attr("class", "multiline-legend-case-text")
      .text((d) => d.name);

    // stacked area g

    let stacked_legend_g = legendg
      .selectAll(".stacked-legend-g")
      .data([0])
      .join("g")
      .attr("class", "stacked-legend-g")
      .attr("transform", `translate(0, ${legend_padding_top})`);

    let stacked_legend_case_rects = stacked_legend_g
      .selectAll(".stacked-legend-case-rect")
      .data(fuel_types)
      .join("rect")
      .attr("class", "stacked-legend-case-rect")
      .attr("width", 25)
      .attr("height", 25)
      .attr("x", 0)
      .attr("y", (d, i) => 30 * i)
      .attr("fill", (d, i) => fuelColors[d]);

    let stacked_legend_case_text = stacked_legend_g
      .selectAll(".stacked-legend-case-text")
      .data(fuel_types)
      .join("text")
      .attr("x", 40)
      .attr("y", (d, i) => 30 * i + 20)
      .attr("class", "stacked-legend-case-text")
      .text((d) => d);

    // AXIS LABELS & TITLES

    titleg
      .selectAll(".chart-title-text")
      .data([0])
      .join("text")
      .attr("class", "chart-title-text")
      .attr(
        "transform",
        `translate(${margins.l + chartdims.width / 2},${margins.t / 2})`
      )
      .attr("text-anchor", "middle")
      .text("Carbon Intensity over Time")
      .style("font-weight", 600);

    titleg
      .selectAll(".x-axis-title-g")
      .data([0])
      .join("text")
      .attr("class", "x-axis-title-g")
      .attr(
        "transform",
        `translate(${margins.l / 2},${
          margins.t + chartdims.height / 2
        })rotate(-90)`
      )
      .attr("text-anchor", "middle")
      .text("Carbon Intensity (kg/sf/yr)")
      .style("font-weight", 600);

    // VIEW TOGGLE
    if (activePlot === "multiline") {
      stackedareag.remove();
      stacked_legend_g.remove();
    }

    if (activePlot === "stacked") {
      multilineg.remove();
      multiline_legend_g.remove();
    }
    if (thresholdView === "berdo") {
      ll97g.remove();
    }
    if (thresholdView === "ll97") {
      berdog.remove();
    }
    if (thresholdView === "none") {
      berdog.remove();
      ll97g.remove();
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
