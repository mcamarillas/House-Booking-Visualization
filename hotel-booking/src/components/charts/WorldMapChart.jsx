import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

function getProjection() {
  return d3.geoMercator().scale(67).translate([600 / 2, 280 / 1.4]);
}

function getColorScale() {
  const greenScale = d3.scaleLinear().domain([0, 30]).range(["#006400", "#90ee90"]);
  const redScale = d3.scaleLinear().domain([30, 60]).range(["#ffcccc", "#8b0000"]);

  return function (value) {
    return value <= 30 ? greenScale(value) : redScale(value);
  };
}

// Función que crea y maneja el tooltip
function createTooltip() {
  let tooltip = d3.select("body").select(".tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "6px")
      .style("background", "rgb(255, 255, 255)")
      .style("color", "#000")
      .style("border", "2px solid rgb(0, 0, 0)")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  }

  return {
    show: (htmlContent, event) => {
      tooltip.html(htmlContent)
        .style("opacity", 1)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    },
    move: (event) => {
      tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    },
    hide: () => {
      tooltip.style("opacity", 0);
    }
  };
}

function drawCountries(svg, countries, path, colorScale, data, tooltip) {
  svg.selectAll(".country")
    .data(countries)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", d => {
      const name = d.properties.name;
      const entry = data?.chart2?.[name];
      const value = entry?.cancelations_rate;
      return value !== undefined ? colorScale(value) : "#d3d3d3";
    })
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#ffffff");
      const name = d.properties.name;
      const entry = data?.chart2?.[name];
      const value = entry?.cancelations_rate;
      if (value !== undefined) {
        tooltip.show(
          `<b>${name}</b><br/>Cancelations Rate: ${value.toFixed(2) + "%"}`,
          event
        );
      } else {
        tooltip.show(
          `<b>${name}</b><br/>No hi ha dades disponibles`,
          event
        );
      }

    })
    .on("mousemove", function(event) {
      tooltip.move(event);
    })
    .on("mouseout", function (event, d) {
      const name = d.properties.name;
      const entry = data?.chart2?.[name];
      const value = entry?.cancelations_rate;
      const originalColor = value !== undefined ? colorScale(value) : "#d3d3d3";
      d3.select(this).attr("fill", originalColor);
      tooltip.hide();
    });
}

export default function WorldMapChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("viewBox", "0 0 600 280")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("responsive-svg", true);

    const tooltip = createTooltip();

    const projection = getProjection();
    const path = d3.geoPath().projection(projection);
    const colorScale = getColorScale();

    d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(worldData => {
        svg.selectAll(".country").remove(); // limpiar antes de dibujar
        const countries = feature(worldData, worldData.objects.countries).features;
        drawCountries(svg, countries, path, colorScale, data, tooltip);
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
