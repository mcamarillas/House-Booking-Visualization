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
                Visualització de Dades · UOC · Curs 2024-2025 <br></br>
                Marc Camarillas Parés
            </h3>
            <div className="intro-container">
                <div className="chart-box">
                    {<CancelationPieChart data={data['chart1']} title={true}/>}
                </div>
                <div className="chart-description"> 
                    <h2>
                        Sabies que el 37% de les reserves s'acaben cancel·lant? <br /><br />
                        Entenem per què passa això.
                    </h2>
                </div>
            </div>
            <div className="exploration-description"> 
                <h2>
                    Explorem què passa arreu del món. <br />
                    Ens centrem en països amb més de 100 reserves per entendre millor el fenomen.
                </h2>
            </div>
            <div className="world-map-chart">
                <WorldMapChart data={data}/>
            </div>
            <div className="exploration-description"> 
                <h2>
                    Què ens diuen les dades? <br />
                    Aprofundim en els patrons i comportaments.
                </h2>
            </div>
            <div className="intro-container">
                <div className="chart-container-2">
                    <OrderChart data={data['chart5']}/>
                </div>
                <div className="chart-container-2">
                    <BarChart data={data['chart4']} title={"Cancel·lacions en funció del grup i el país"}/>
                </div>
                <div className="chart-container-2">
                    <BarChart data={data['chart6']} title={"Cancel·lacions en funció del preu i el país"}/>
                </div>
                <div className="chart-container-2">
                    <MosaicChart data={data['chart3']}/>
                </div>
            </div>
            <div className="exploration-description">
                <h2> Conclusions </h2>
            </div>
                            <h3>
                    Al llarg d’aquesta exploració hem descobert que les cancel·lacions de reserves no són un fenomen aleatori. 
                    Factors com el país d’origen, el tipus de viatger o el preu de la reserva hi juguen un paper clau.
                    <br /><br />
                    Països amb taxes molt altes, patrons diferents segons si viatges sol o en família, i una relació directa amb el cost: 
                    tot plegat ens mostra que darrere cada cancel·lació hi ha context, comportaments i decisions.
                    <br /><br />
                    Entendre aquestes dades ens permet no només analitzar el passat, sinó també anticipar el futur: 
                    optimitzar la gestió d’allotjaments, personalitzar ofertes i, sobretot, millorar l’experiència dels usuaris.
                    <br /><br />
                    Les dades parlen. Només cal saber escoltar-les.
                </h3>
            <div className="footer">
            </div>
        </div>

    );
}