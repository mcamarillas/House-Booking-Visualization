import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ data, title }) => {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const chartData = [];
    for (const currentD in data) {
      if (data.hasOwnProperty(currentD)) {
        const groups = data[currentD];
        for (const groupType in groups) {
          if (groups.hasOwnProperty(groupType)) {
            chartData.push({
              category: groupType,
              pais: currentD,
              ratio: groups[groupType].cancelations_rate,
            });
          }
        }
      }
    }

    if (!chartData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const pastelColors = [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
    ];

    const width = 600;
    const height = 400;
    const margin = { top: 70, right: 150, bottom: 75, left: 60 };

    const categories = Object.keys(data[Object.keys(data)[0]]);
    const paises = Array.from(new Set(chartData.map((d) => d.pais)));

    const x0 = d3
      .scaleBand()
      .domain(categories)
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(paises)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.ratio)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal().domain(paises).range(pastelColors);

    // Eje X
    const xAxisG = svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom + 2})`)
      .call(d3.axisBottom(x0).tickSize(5));

    xAxisG.selectAll("text").style("fill", "white").style("font-size", "14px");
    xAxisG.selectAll("line").attr("stroke", "white");
    xAxisG.select("path").attr("stroke", "white");

    // Eje Y
    const yAxisG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    yAxisG.selectAll("text").style("fill", "white").style("font-size", "14px");
    yAxisG.selectAll("line").attr("stroke", "white");
    yAxisG.select("path").attr("stroke", "white");

    // Título del eje Y
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .text("Percentatge de Cancel·lacions (%)");

    // Grupos por categoría
    const group = svg
      .selectAll("g.barra")
      .data(categories)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x0(d)},0)`);

    // Barras por país dentro de cada categoría
    group
      .selectAll("rect")
      .data((cat) => chartData.filter((d) => d.category === cat))
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.pais))
      .attr("y", (d) => y(d.ratio))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => y(0) - y(d.ratio))
      .attr("fill", (d) => color(d.pais))
      .on("mouseover", (event, d) => {
        const [x, yPos] = d3.pointer(event);
        const svgRect = svgRef.current.getBoundingClientRect();
        setTooltipData(d);
        setTooltipPosition({
          x: svgRect.left + x + 10,
          y: svgRect.top + yPos - 40,
        });
      })
      .on("mousemove", (event) => {
        const [x, yPos] = d3.pointer(event);
        const svgRect = svgRef.current.getBoundingClientRect();
        setTooltipPosition({
          x: svgRect.left + x + 10,
          y: svgRect.top + yPos - 40,
        });
      })
      .on("mouseout", () => {
        setTooltipData(null);
      });

    // Título del gráfico
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", 24)
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text(title);

    // Leyenda
    const legend = svg.append("g").attr(
      "transform",
      `translate(${width - margin.right + 20}, ${margin.top + 80})`
    );

    paises.forEach((pais, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      legendRow
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", color(pais));

      legendRow
        .append("text")
        .attr("x", 24)
        .attr("y", 14)
        .text(pais)
        .style("fill", "white")
        .style("font-size", "13px");
    });
  }, [data]);

  return (
    <div className="relative">
      <svg ref={svgRef} width={600} height={350} />
      {tooltipData && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            background: "#fff",
            border: "1px solid #000",
            borderRadius: "6px",
            padding: "10px",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <strong>{tooltipData.pais}</strong> - {tooltipData.category}
          <br />
          Ratio: {tooltipData.ratio}
        </div>
      )}
    </div>
  );
};

export default BarChart;
