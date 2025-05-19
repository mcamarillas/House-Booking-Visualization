import React from "react";
import CancelationPieChart from "../components/charts/CancelationPieChart";
import WorldMapChart from "../components/charts/WorldMapChart";
import '../styles/IntroductionPage.css'

export default function IntroductionPage({ data }) {
    return (
        <div className="base-container">
            <header className="main-header">
                <img src='/assets/logo-white.png' heigh='50px' width='50px'></img>
                <h2>PAC3: Storytelling</h2>
            </header>
            <h3>
                Visualització de Dades - UOC Curs 2024-2025 <br></br>
                Marc Camarillas Parés
            </h3>
            <div className="intro-container">
                <div className="chart-box">
                    {<CancelationPieChart data={data} />}
                </div>
                <div className="chart-description"> 
                    <h2>
                        El 37% de les reserves que es fan al nostre país acaben cancelades. <br></br> <br></br>
                        Quins son els principals motius?
                    </h2>
                </div>
            </div>
            <div className="world-map-chart">
                <WorldMapChart data={data}/>
            </div>
        </div>

    );
}