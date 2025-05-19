import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import '../../styles/CancelationPieChart.css';

export default function CancelationPieChart({ data }) {
  const chartData = data['chart1'];
  const confirmed = chartData['confirmed'];
  const canceled = chartData['canceled'];

  const pieData = {
    type: 'pie',
    values: [confirmed, canceled],
    labels: ['Confirmades', 'Cancel·lades'],
    textinfo: 'none',
    marker: { colors: ['#22c55e', '#ef4444'] },
    hole: .4,
    hoverinfo: 'label+percent+value',
  };

  const layoutData = {
    title: {
      text: 'Percentatge de reserves cancel·lades',
      font: {
        size: 26,
        color: '#fff',
        family: 'Poppins, sans-serif',
      },
      x: 0.5,
      xanchor: 'center',
    },
    height: 380,
    width: 500,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
  }
  

  return (
    <div className="chart-container">
      <Plot
        data={[ pieData ]}
        layout={ layoutData }
        config={{ displayModeBar: false }}
      />
    </div>
  );
}