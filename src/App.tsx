import './App.css'

import radarDataDev from "./tech-radar-dev.json";
import radarDataSa from "./tech-radar-sa.json";

import {TechRadar} from "./components";
import type {RadarConfig, RadarEntry, RadarQuadrant, RadarRing} from "./components";

const radarConfig: RadarConfig = {
    rings: radarDataDev.rings as RadarRing[],
    quadrants: radarDataDev.quadrants as RadarQuadrant[],
    entries: radarDataDev.entries as RadarEntry[]
};

function App() {
    return (
        <div className="app" style={{padding: 24, height: "100vh"}}>
            <TechRadar config={radarConfig}/>
        </div>
    )
}

export default App
