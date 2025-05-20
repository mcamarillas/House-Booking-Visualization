import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MosaicChart = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const transformedData = Array.isArray(data)
      ? data
      : Object.entries(data).map(([key, value]) => ({
          category: `${key[0]} mesos`,
          value1: value.cancelations,
          value2: value.confirmations,
          width: 40 + Math.floor(value.total_books / 1000),
        }));

    const pastelColors = [
      '#FFB3BA',
      '#FFDFBA',
      '#FFFFBA',
      '#BAFFC9',
      '#BAE1FF',
      '#D7BAFF',
      '#FFBAED',
    ];

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const baseWidth = 800;
    const height = 350;
    const margin = { top: 40, right: 20, bottom: 50, left: 80 };
    const barGap = 4;
    const xPadding = 0;
    const yPadding = 0; // <-- nuevo padding vertical

    const chartHeight = height - margin.top - margin.bottom;
    const usableHeight = chartHeight - yPadding * 2;

    const totalContentWidth = transformedData.reduce(
      (sum, d) => sum + d.width + 10,
      xPadding * 2
    );
    const fullWidth = Math.max(baseWidth, totalContentWidth + margin.left + margin.right);

    svg.selectAll('*').remove();

    // Título
    svg
      .append('text')
      .attr('x', fullWidth / 3 + 20)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('fill', 'white')
      .text('Distribució de Cancelacions i Confirmacions per Mes');

    const g = svg
      .attr('width', fullWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const axisGroup = g.append('g');

    // Eje Y
    axisGroup
      .append('line')
      .attr('x1', -40)
      .attr('y1', yPadding)
      .attr('x2', -40)
      .attr('y2', chartHeight - yPadding)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    axisGroup
      .append('text')
      .attr('x', -50)
      .attr('y', yPadding + usableHeight / 4)
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', `rotate(-90, -50, ${yPadding + usableHeight / 4})`)
      .text('Cancelacions');

    axisGroup
      .append('text')
      .attr('x', -50)
      .attr('y', yPadding + (3 * usableHeight) / 4)
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', `rotate(-90, -50, ${yPadding + (3 * usableHeight) / 4})`)
      .text('Confirmacions');

    // Eje X
    g.append('line')
      .attr('x1', 0)
      .attr('y1', chartHeight - yPadding)
      .attr('x2', totalContentWidth - xPadding * 2)
      .attr('y2', chartHeight - yPadding)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    svg
      .append('text')
      .attr('x', fullWidth / 3 + 20)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'white')
      .text('Mesos d’antelació');

    let xPos = xPadding;

    transformedData.forEach((d, i) => {
      const color = pastelColors[i % pastelColors.length];
      const group = g.append('g').attr('transform', `translate(${xPos},0)`);

      const total = d.value1 + d.value2;
      const value1Height = (d.value1 / total) * usableHeight;
      const value2Height = (d.value2 / total) * usableHeight;

      group
        .append('rect')
        .attr('y', yPadding + usableHeight - value2Height)
        .attr('width', d.width)
        .attr('height', value2Height - barGap / 2)
        .attr('fill', color);

      group
        .append('rect')
        .attr('y', yPadding + usableHeight - value2Height - barGap - value1Height)
        .attr('width', d.width)
        .attr('height', value1Height - barGap / 2)
        .attr('fill', color);

      group
        .append('text')
        .attr('x', d.width / 2)
        .attr('y', chartHeight + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('fill', 'white')
        .text(d.category);

      // Tick en eje X
      g.append('line')
        .attr('x1', xPos + d.width / 2)
        .attr('y1', chartHeight - yPadding)
        .attr('x2', xPos + d.width / 2)
        .attr('y2', chartHeight - yPadding + 6)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);

      group
        .on('mouseover', (event) => {
          tooltip
            .style('opacity', 1)
            .html(
              `<strong>${d.category}</strong><br/>
               Cancelacions: ${d.value1}<br/>
               Confirmacions: ${d.value2}`
            );
        })
        .on('mousemove', (event) => {
          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });

      xPos += d.width + 10;
    });
  }, [data]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          padding: '5px 10px',
          border: '1px solid gray',
          borderRadius: '4px',
          pointerEvents: 'none',
          opacity: 0,
          color: 'black',
          fontSize: '12px',
        }}
      ></div>
    </div>
  );
};

export default MosaicChart;
