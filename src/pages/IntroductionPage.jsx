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
                        Sabies que a Portugal, gairebé 4 de cada 10 reserves d’allotjaments turístics acaben cancel·lades?<br />
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
            <h3 style={{margin:'2rem', fontSize:'20px'}}>
            L’anàlisi de les reserves turístiques a Portugal ens revela diversos patrons clau sobre les cancel·lacions: <br></br> <br></br>
            
            · El turisme local és el que presenta la taxa de cancel·lació més elevada i és la major font de turisme. <br></br>
            · L'altra major part del turisme que arriba a Portugal prové d’Europa, i aquest perfil cancel·la molt menys.<br></br>
            · Les reserves més cares tenen més probabilitats de ser cancel·lades. <br></br>
            · Com més antelació té la reserva, més risc hi ha que s’acabi cancel·lant. <br></br>
            · Els grups grans i les famílies cancel·len més sovint que les parelles o els viatgers solitaris. <br></br> <br></br>

            Per tant, tenim un petit punt de partida per començar a aplicar estratègies més personalitzades a les polítiques de cancel·lació.
            </h3>

            <div className="footer">
            </div>
        </div>

    );
}