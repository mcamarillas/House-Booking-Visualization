import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import CancelationPieChart from "./CancelationPieChart"; // suponiendo que lo tienes

export default function WorldMapChart({ data }) {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("viewBox", "0 0 600 280")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("responsive-svg", true);

    const projection = d3.geoMercator().scale(67).translate([600 / 2, 280 / 1.4]);
    const path = d3.geoPath().projection(projection);
    const colorScale = d3.scaleLinear()
      .domain([0, 30, 60])
      .range(["#006400", "#90ee90", "#8b0000"]);

    d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(worldData => {
        const countries = feature(worldData, worldData.objects.countries).features;

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
            const name = d.properties.name;
            const entry = data?.chart2?.[name];
            const value = entry?.cancelations_rate;

            if (value !== undefined) {
              setTooltipData({
                name,
                value,
                chartData: entry // o lo que necesite tu <CancelationPieChart />
              });
              setTooltipPosition({ x: event.pageX + 10, y: event.pageY + 10 });
            }
          })
          .on("mousemove", function (event) {
            setTooltipPosition({ x: event.pageX + 10, y: event.pageY + 10 });
          })
          .on("mouseout", function () {
            setTooltipData(null);
          });
      });
  }, [data]);

  return (
    <>
      <svg ref={svgRef}></svg>
      {tooltipData && (
        <div
          className="react-tooltip"
          style={{
            position: "absolute",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            background: "#fff",
            border: "1px solid #000",
            borderRadius: "6px",
            padding: "10px",
            pointerEvents: "none",
            zIndex: 9999
          }}
        >
          <strong>{tooltipData.name}</strong>
          <br />
          Cancelations Rate: {tooltipData.value.toFixed(2)}%
          <CancelationPieChart data={data} />
        </div>
      )}
    </>
  );
}
