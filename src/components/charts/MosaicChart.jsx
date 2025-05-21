import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const MosaicChart = ({ data }) => {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const transformedData = Array.isArray(data)
      ? data.map((d) => ({
          ...d,
          category: d.category ?? d.mes ?? "",
          total_books: d.total_books ?? d.value1 + d.value2,
        }))
      : Object.entries(data).map(([key, value]) => ({
          category: `${key[0]} mesos`,
          value1: value.cancelations,
          value2: value.confirmations,
          total_books: value.total_books,
          width: 40 + Math.floor(value.total_books / 1000),
        }));

    // 🎨 Colors suaus (pastel)
    const pastelColors = [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#D7BAFF",
      "#FFBAED",
    ];

    // 🔄 Netegem qualsevol render anterior
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    /**
     * 2️⃣ Config bàsica de mides
     */
    const baseWidth = 800;
    const height = 350;
    const margin = { top: 40, right: 20, bottom: 50, left: 80 };
    const barGap = 4;
    const xPadding = 0;
    const yPadding = 0;

    const chartHeight = height - margin.top - margin.bottom;
    const usableHeight = chartHeight - yPadding * 2;

    // Amplada real necessària per totes les barres + espais
    const totalContentWidth = transformedData.reduce(
      (sum, d) => sum + d.width + 10,
      xPadding * 2
    );
    const fullWidth = Math.max(baseWidth, totalContentWidth + margin.left + margin.right);

    // 3️⃣ Estructura bàsica SVG
    const g = svg
      .attr("width", fullWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 🏷️ Títol principal
    svg
      .append("text")
      .attr("x", fullWidth / 3 + 20)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", 16)
      .attr("fill", "white")
      .text("Distribució de Cancelacions i Confirmacions per Mes");

    /**
     * 4️⃣ Eixos (senzills, només línies i etiquetes)
     */
    const axisGroup = g.append("g");

    // Y
    axisGroup
      .append("line")
      .attr("x1", -40)
      .attr("y1", yPadding)
      .attr("x2", -40)
      .attr("y2", chartHeight - yPadding)
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    axisGroup
      .append("text")
      .attr("x", -50)
      .attr("y", yPadding + usableHeight / 4)
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", `rotate(-90, -50, ${yPadding + usableHeight / 4})`)
      .text("Cancel·lacions");

    axisGroup
      .append("text")
      .attr("x", -50)
      .attr("y", yPadding + (3 * usableHeight) / 4)
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr(
        "transform",
        `rotate(-90, -50, ${yPadding + (3 * usableHeight) / 4})`
      )
      .text("Confirmacions");

    // X
    g.append("line")
      .attr("x1", 0)
      .attr("y1", chartHeight - yPadding)
      .attr("x2", totalContentWidth - xPadding * 2)
      .attr("y2", chartHeight - yPadding)
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    svg
      .append("text")
      .attr("x", fullWidth / 3 + 20)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", "white")
      .text("Mesos d’antelació");

    /**
     * 5️⃣ Dibuixem les barres + mouse events per al tooltip
     */
    let xPos = xPadding;

    transformedData.forEach((d, i) => {
      const color = pastelColors[i % pastelColors.length];

      const group = g
        .append("g")
        .attr("transform", `translate(${xPos},0)`);

      const total = d.value1 + d.value2;
      const value1Height = (d.value1 / total) * usableHeight;
      const value2Height = (d.value2 / total) * usableHeight;

      group
        .append("rect")
        .attr("y", yPadding + usableHeight - value2Height)
        .attr("width", d.width)
        .attr("height", value2Height - barGap / 2)
        .attr("fill", color);

      group
        .append("rect")
        .attr("y", yPadding + usableHeight - value2Height - barGap - value1Height)
        .attr("width", d.width)
        .attr("height", value1Height - barGap / 2)
        .attr("fill", color);

      group
        .append("text")
        .attr("x", d.width / 2)
        .attr("y", chartHeight + 15)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("fill", "white")
        .text(d.category);

      // Tick a l’eix X
      g.append("line")
        .attr("x1", xPos + d.width / 2)
        .attr("y1", chartHeight - yPadding)
        .attr("x2", xPos + d.width / 2)
        .attr("y2", chartHeight - yPadding + 6)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      group
        .on("mouseover", function (event) {
          d3.select(this).attr("fill", "#ffff00");
          setTooltipData({
            category: d.category,
            totalBooks: d.total_books,
            chartData: {
              cancelations: d.value1,
              confirmations: d.value2,
            },
          });
          setTooltipPosition({ x: event.pageX + 10, y: event.pageY - 300 });
          console.log(event.pageX + 10, event.pageY - 300)
        })
        .on("mousemove", (event) => {
          setTooltipPosition({ x: event.pageX + 10, y: event.pageY - 70 });
        })
        .on("mouseout", () => {
          setTooltipData(null);
        });

      xPos += d.width + 10;
    });
  }, [data]);

  /**
   * 6️⃣ Render: SVG + Tooltip React (condicional)
   */
  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-auto" />

      {tooltipData && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: tooltipPosition.y - 80,
            left: tooltipPosition.x,
            background: "#fff",
            border: "1px solid #000",
            borderRadius: "6px",
            padding: "10px",
            pointerEvents: "none",
            zIndex: 9999
          }}
        >
          <strong>{tooltipData.category}</strong>
          <br />
          Reserves Totals: {tooltipData.totalBooks}
          <br />
          Cancel·lacions: {tooltipData.chartData['cancelations']}
          <br />
          Confirmacions: {tooltipData.chartData['confirmations']}
        </div>
      )}
    </div>
  );
};

export default MosaicChart;
