import './App.css'

import radarStructure from "./tech-radar-structure.json";
import radarEntries from "./tech-radar-entries.json";

import {TechRadar} from "./components/TechRadar.tsx";
import type {RadarConfig, RadarEntry, RadarQuadrant, RadarRing} from "./types.ts";

const radarConfig: RadarConfig = {
    rings: radarStructure.rings as RadarRing[],
    quadrants: radarStructure.quadrants as RadarQuadrant[],
    entries: radarEntries as RadarEntry[]
};

function App() {
    return (
        <>
            <div style={{padding: 24}}>
                <TechRadar entries={radarConfig.entries} rings={radarConfig.rings} quadrants={radarConfig.quadrants}
                           width={800} height={800}/>
            </div>
        </>
    )
}

export default App
