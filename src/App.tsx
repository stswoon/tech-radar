import './App.css'

import radarStructure from "./tech-radar-structure.json";
import radarEntries from "./tech-radar-entries.json";

import {TechRadar} from "./components";
import type {RadarConfig, RadarEntry, RadarQuadrant, RadarRing} from "./components";

const radarConfig: RadarConfig = {
    rings: radarStructure.rings as RadarRing[],
    quadrants: radarStructure.quadrants as RadarQuadrant[],
    entries: radarEntries as RadarEntry[]
};

function App() {
    return (
        <div className="app" style={{padding: 24, height: "100vh"}}>
            <TechRadar config={radarConfig}/>
        </div>
    )
}

export default App
