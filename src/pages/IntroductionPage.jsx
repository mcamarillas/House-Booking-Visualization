import React from "react";
import CancelationPieChart from "../components/charts/CancelationPieChart";
import WorldMapChart from "../components/charts/WorldMapChart";
import MosaicChart from "../components/charts/MosaicChart";
import BarChart from "../components/charts/BarChart";

import '../styles/IntroductionPage.css'
import OrderChart from "../components/charts/OrderChart";

export default function IntroductionPage({ data }) {
    return (
        <div className="base-container">
            <header className="main-header">
                <img src='/House-Booking-Visualization/assets/logo-white.png' heigh='50px' width='50px'></img>
                <h2>PAC3: Storytelling</h2>
            </header>
            <h3>
                Visualització de Dades - UOC Curs 2024-2025 <br></br>
                Marc Camarillas Parés
            </h3>
            <div className="intro-container">
                <div className="chart-box">
                    {<CancelationPieChart data={data['chart1']} title={true}/>}
                </div>
                <div className="chart-description"> 
                    <h2>
                        El 37% de les reserves que es fan al nostre país acaben cancelades. <br></br> <br></br>
                        Quins son els principals motius?
                    </h2>
                </div>
            </div>
            <div className="exploration-description"> 
                <h2>
                    Anem a explorar les dades dels diferents païssos amb més de 100 reserves per veure poder identificar-ho
                </h2>
            </div>
            <div className="world-map-chart">
                <WorldMapChart data={data}/>
            </div>
            <div className="exploration-description"> 
                <h2>
                    Aqui tenim els insights
                </h2>
            </div>
                <div className="intro-container">
                    <div className="chart-container-2">
                        <OrderChart data={data['chart5']}/>
                    </div>
                    <div className="chart-container-2">
                        <BarChart data={data['chart4']}/>
                    </div>
                    <div className="chart-container-2">
                        <BarChart data={data['chart4']}/>
                    </div>
                    <div className="chart-container-2">
                        <MosaicChart data={data['chart3']}/>
                    </div>
                </div>
                <div className="footer">
                </div>
        </div>

    );
}