import React from 'react';
import Plot from 'react-plotly.js';
import '../../styles/CancelationPieChart.css';

export default function CancelationPieChart({ data, title = false, info = false }) {
  const confirmed = data['confirmations'];
  const canceled = data['cancelations'];

  const pieData = {
    type: 'pie',
    values: [confirmed, canceled],
    labels: ['Confirmades', 'Cancel·lades'],
    textinfo: info ? 'percent' : 'none',
    textfont: {
      family: 'Segoe UI, sans-serif',
      size: 16,
      color: '#000',
      weight: 'bold'
    },
    marker: { colors: ['#22c55e', '#ef4444'] },
    hole: 0.4,
    hoverinfo: 'label+percent+value',
  };

  const layoutData = {
    title: title
      ? {
          text: 'Percentatge de reserves cancel·lades',
          font: {
            size: 26,
            color: '#fff',
            family: 'Segoe UI, sans-serif',
          },
          x: 0.5,
          xanchor: 'center',
        }
      : undefined,
    height: 380,
    width: 500,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
  };

  return (
    <div className="chart-container">
      <Plot
        data={[pieData]}
        layout={layoutData}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
