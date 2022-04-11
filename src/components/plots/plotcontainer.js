import * as d3 from "d3";
import { color } from "d3";

import { HeatPumpIconPath, ElectricityIconPath, GasIconPath } from "./svgicons";

import { useRef, useEffect } from "react";

import { conn } from "../../store/connect";

import { getIdealSpacing } from "./spacing";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
  },
});

const PlotContainer = (props) => {
  const classes = useStyles();
  const container = useRef(null);

  let { case_results: case_results, plot_config, window_dimensions } = props;

  let case_results_displayed = case_results.filter(
    (f) => f.is_displayed === true
  );

  useEffect(() => {
    if (case_results_displayed.length > 0) {
      createChart({
        ...plot_config,
        disable_transitions: true,
      });
    }
  }, [window_dimensions]);

  useEffect(() => {
    if (case_results_displayed.length > 0) {
      createChart(plot_config);
    }
  }, [case_results_displayed]);

  const createChart = (plot_config) => {
    let { thresholdView, disable_transitions } = plot_config;
    // handle / transform datasets
    let node = container.current;

    let margins = {
      t: 50,
      b: 150,
      r: 200,
      l: 50,
    };
    let containerdims = {
      width: 700,
      height: 500,
    };
    if (node) {
      let { width, height } = node.getBoundingClientRect();
      containerdims["width"] = width;
      containerdims["height"] = height;
    }

    let emissions_projections = case_results_displayed.map(
      (d) => d["case_results"]["emissions_projection"]
    );

    let emissions_projections_by_fuel = case_results_displayed.map(
      (d) => d["case_results"]["emissions_projection_by_fuel"]
    );

    let berdo_thresholds = case_results_displayed.map(
      (d) => d["berdo_results"]["emissions_thresholds_per_sf"]
    );
    let ll97_thresholds = case_results_displayed.map(
      (d) => d["ll97_results"]["emissions_thresholds_per_sf"]
    );

    let getCaseIcon = (fuel_type, cop) => {
      if (fuel_type == "Natural Gas") {
        return GasIconPath;
      } else if (fuel_type == "Electricity") {
        if (cop == 1) {
          return ElectricityIconPath;
        } else {
          return HeatPumpIconPath;
        }
      }
    };

    let icon_array = case_results_displayed.map((d, i) => {
      let { case_fuel_type, case_cop } = d;

      let case_icon = getCaseIcon(case_fuel_type, case_cop);
      return {
        case_color: d3.schemeCategory10[i],
        case_icon_d: case_icon,
      };
    });

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

    let colorScale = d3.schemeTableau10;

    let transition_duration = disable_transitions ? 0 : 500;

    let legend_padding_top = 50;

    let berdo_color = "black";
    let ll97_color = "black";

    let multiline_g = plot_g
      .selectAll(".multiline-g")
      .data([0])
      .join("g")
      .attr("class", "multiline-g");

    let multiline_ll97_g = plot_g
      .selectAll(".ll97-g")
      .data([0])
      .join("g")
      .attr("class", "ll97-g");

    let multiline_berdo_g = plot_g
      .selectAll(".berdo-g")
      .data([0])
      .join("g")
      .attr("class", "berdo-g");

    let xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0);
    let yAxis = d3.axisLeft().scale(yScale).ticks(5).tickSizeOuter(0);

    xaxis_g.transition().duration(transition_duration).call(xAxis);
    yaxis_g.transition().duration(transition_duration).call(yAxis);

    rightborder_g.call(d3.axisRight().scale(yScale).ticks(0).tickSizeOuter(0));

    topborder_g.call(d3.axisTop().scale(xScale).ticks(0).tickSizeOuter(0));

    let lineGen = d3
      .line()
      .x((d) => xScale(d["year"]))
      .y((d) => yScale(d["kg_co2_per_sf"]));

    multiline_g
      .selectAll(".data-line")
      .data(emissions_projections)
      .join("path")
      .attr("class", "data-line")
      .transition()
      .duration(transition_duration)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", (d, i) => icon_array[i].case_color)
      .attr("stroke-width", 3);

    multiline_berdo_g
      .selectAll(".berdo-threshold-circle")
      .data(berdo_thresholds[0])
      .join("circle")
      .attr("class", "berdo-threshold-circle")
      .attr("cx", (d) => xScale(d["period"].split("-")[0]))
      .attr("cy", (d) => yScale(d["val"]))
      .attr("r", 5)
      .attr("fill", d3.color(berdo_color).brighter(0.5))
      .attr("stroke", berdo_color);

    multiline_berdo_g
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

    multiline_ll97_g
      .selectAll(".ll97-threshold-circle")
      .data(ll97_thresholds[0])
      .join("circle")
      .attr("class", "ll97-threshold-circle")
      .attr("cx", (d) => xScale(d["period"].split("-")[0]))
      .attr("cy", (d) => yScale(d["val"]))
      .attr("r", 4)
      .attr("fill", ll97_color);

    multiline_ll97_g
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

    let multiline_legend_g = legend_g
      .selectAll(".multiline-legend-g")
      .data([0])
      .join("g")
      .attr("class", "multiline-legend-g")
      .attr("transform", `translate(0, ${legend_padding_top})`);

    let multiline_legend_icons = multiline_legend_g
      .selectAll(".multiline-legend-icon-g")
      .data(icon_array)
      .join("path")
      .attr("class", "multiline-legend-icon-g")
      .attr(
        "transform",
        (d, i) => `translate(0, ${i * 30 - 15}) scale(1.25 1.25)`
      )
      .attr("d", (d) => d.case_icon_d)
      .attr("fill", (d, i) => d.case_color);

    let multiline_legend_case_text = multiline_legend_g
      .selectAll(".multiline-legend-case-text")
      .data(case_results_displayed)
      .join("text")
      .attr("x", 40)
      .attr("y", (d, i) => 30 * i + 5)
      .attr("class", "multiline-legend-case-text")
      .text((d) => d.case_name);

    let multiline_icon_annotation_values = emissions_projections.map(
      (d) => d.filter((e) => e.year == "2050")[0]["kg_co2_per_sf"]
    );

    let multiline_icon_annotation_positions =
      multiline_icon_annotation_values.map((d) => yScale(d));

    let spaced_multiline_icon_annotation_positions = getIdealSpacing(
      multiline_icon_annotation_positions,
      30
    );

    let multiline_icon_annotations = annotation_g
      .selectAll(".multiline-icon-annotation")
      .data(spaced_multiline_icon_annotation_positions)
      .join("path")
      .attr("class", "multiline-icon-annotation")
      .attr("d", (d, i) => icon_array[i].case_icon_d)
      .attr("fill", (d, i) => icon_array[i].case_color)
      .transition()
      .duration(transition_duration)
      .attr("transform", (d, i) => {
        return `translate(${chartdims.width + margins.l + 15}, ${
          margins.t + d - 12
        }) scale(1.25 1.25)`;
      });

    let multiline_berdo_annotations = multiline_berdo_g
      .selectAll(".multiline-berdo-annotations")
      .data(berdo_thresholds[0])
      .join("text")
      .attr("class", "multiline-berdo-annotations")
      .attr("x", chartdims.width + 10)
      .attr("y", (d) => yScale(d.val))
      .text((d) => `${d.period}: ${d.val} kg/sf/yr`);

    let multiline_ll97_annotations = multiline_ll97_g
      .selectAll(".multiline-ll97-annotations")
      .data(ll97_thresholds[0])
      .join("text")
      .attr("class", "multiline-ll97-annotations")
      .attr("x", chartdims.width + 10)
      .attr("y", (d) => yScale(d.val))
      .text((d) => `${d.period}: ${d.val} kg/sf/yr`);

    title_g
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

    title_g
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

    /* -- HOVER EVENTS -- */
    // flatten for hover circles
    let emissions_projections_flat = [];
    emissions_projections.forEach((e, ei) => {
      e.forEach((o, oi) => {
        emissions_projections_flat.push({
          ...o,
          case_name: case_results_displayed[ei].case_name,
          nameidx: ei,
        });
      });
    });

    let hover_line = hover_g
      .selectAll(".hover-line")
      .data([0])
      .join("line")
      .attr("class", "hover-line")
      .attr("x1", xScale(2040))
      .attr("x2", xScale(2040))
      .attr("y1", yScale(yScale.domain()[0]))
      .attr("y2", yScale(yScale.domain()[1]))
      .attr("fill", "red")
      .attr("stroke-width", 2)
      .attr("stroke", "black")
      .attr("stroke-dasharray", 2)
      .attr("opacity", 0);

    let hover_circles = hover_g
      .selectAll(".hover-circle")
      .data(emissions_projections_flat)
      .join("circle")
      .attr("class", "hover-circle")
      .attr("r", 4)
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.kg_co2_per_sf))
      .attr("fill", (d, i) => icon_array[d.nameidx].case_color)
      .attr("opacity", 0);

    let rect_width = 325;
    let rect_height = 125;

    let hover_info_g = hover_g
      .selectAll(".hover-info-g")
      .data([0])
      .join("g")
      .attr("class", "hover-info-g")
      .attr("opacity", 0);

    let hover_info_rect = hover_info_g
      .selectAll(".hover-info-rect")
      .data([0])
      .join("rect")
      .attr("class", "hover-info-rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", rect_height)
      .attr("width", rect_width)
      .attr("fill", "gray")
      .attr("opacity", 0.9)
      .attr("rx", 0);

    let hover_info_year_text = hover_info_g
      .selectAll(".hover-info-year-text")
      .data([0])
      .join("text")
      .attr("class", "hover-info-year-text")
      .attr("x", 15)
      .attr("y", 30)
      .html("")
      .attr("font-weight", 700)
      .attr("fill", "white");

    let hover_info_text = hover_info_g
      .selectAll(".hover-info-text")
      .data(emissions_projections)
      .join("text")
      .attr("class", "hover-info-text")
      .attr("x", 15)
      .attr("y", (d, i) => i * 20 + 60)
      .html("")
      .attr("fill", "white");

    // this needs to be the last item appended
    let hover_rect = hover_g
      .selectAll(".hover-rect")
      .data([0])
      .join("rect")
      .attr("class", "hover-rect")
      .attr("width", chartdims.width)
      .attr("height", chartdims.height)
      .attr("opacity", 0);

    hover_rect.on("mousemove", function (e) {
      let mouse = d3.pointer(e);
      let mouseX = mouse[0];
      let mouseY = mouse[1];
      let xval = xScale.invert(mouseX);

      let years = emissions_projections[0].map((d) => d.year);
      let xval_bisect = d3.bisectLeft(years, xval);
      let selected_year = years[xval_bisect];

      hover_line
        .attr("opacity", 1)
        .attr("x1", xScale(selected_year))
        .attr("x2", xScale(selected_year));

      hover_info_g.attr("opacity", 1).attr(
        "transform",
        `translate(
          ${mouseX - (mouseX / chartdims.width) * rect_width}
          ,
          ${mouseY - rect_height - 10})`
      );

      hover_circles.attr("opacity", (d) => (d.year == selected_year ? 1 : 0));

      hover_info_year_text.text(selected_year);
      hover_info_text.text((d, i) => {
        let year = selected_year;
        let simname = case_results_displayed[i].case_name;
        let val = d3.format(".2f")(
          d.filter((a) => a.year === year)[0]["kg_co2_per_sf"]
        );
        return `${simname}: ${val} kg/sf/yr`;
      });
    });

    svg.on("mouseleave", function (e) {
      hover_line.attr("opacity", 0);
      hover_info_g.attr("opacity", 0);
    });

    // VIEW TOGGLE

    if (thresholdView === "berdo") {
      multiline_ll97_g.remove();
      multiline_icon_annotations.remove();
    }
    if (thresholdView === "ll97") {
      multiline_berdo_g.remove();
      multiline_icon_annotations.remove();
    }
    if (thresholdView === "none") {
      multiline_berdo_g.remove();
      multiline_ll97_g.remove();
    }
  };

  return <div className={classes.container} ref={container}></div>;
};

// PlotContainer.whyDidYouRender = true;

const mapStateToProps = (store) => {
  return {
    case_results: store.case_outputs.case_results,
    plot_config: store.plot_config,
    window_dimensions: store.ui.dims,
  };
};

export default conn(mapStateToProps)(PlotContainer);
