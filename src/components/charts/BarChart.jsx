import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Preparar datos para la gráfica
    const chartData = [];
    for (const country in data) {
      if (data.hasOwnProperty(country)) {
        const groups = data[country];
        for (const groupType in groups) {
          if (groups.hasOwnProperty(groupType)) {
            chartData.push({
              category: groupType,
              pais: country,
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
    const margin = { top: 70, right: 150, bottom: 70, left: 60 };

    // Categorías definidas acorde a los datos
    const categories = ["Familia", "Parella", "Grups", "Una Persona"];
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

    // Ejes
    const xAxisG = svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom + 2})`)
      .call(d3.axisBottom(x0).tickSize(5));

    xAxisG.selectAll("text").style("fill", "white").style("font-size", "14px");
    xAxisG.selectAll("line").attr("stroke", "white");
    xAxisG.select("path").attr("stroke", "white");

    const yAxisG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    yAxisG.selectAll("text").style("fill", "white").style("font-size", "14px");
    yAxisG.selectAll("line").attr("stroke", "white");
    yAxisG.select("path").attr("stroke", "white");

    // Grupos para cada categoría
    const group = svg
      .selectAll("g.barra")
      .data(categories)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x0(d)},0)`);

    // Barras por país dentro de cada grupo
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
        setTooltipData(d);
        setTooltipPosition({ x: event.clientX + 10, y: event.clientY - 70 });
      })
      .on("mousemove", (event) => {
        setTooltipPosition({ x: event.clientX + 10, y: event.clientY - 70 });
      })
      .on("mouseout", () => {
        setTooltipData(null);
      });

    // Título
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("fill", "white")
      .text("Ratio de Cancelación por Categoría y País");

    // Leyenda vertical a la derecha
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
