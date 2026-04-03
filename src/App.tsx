import './App.css'

import radarData from "./tech-radar.json";

import {TechRadar} from "./components";
import type {RadarConfig, RadarEntry, RadarQuadrant, RadarRing} from "./components";
import {useConfigStore} from "./store/useConfigStore";

interface RawData {
    rings: unknown[];
    quadrants: unknown[];
    entries: unknown[];
}

const getConfig = (data: RawData): RadarConfig => ({
    rings: data.rings as RadarRing[],
    quadrants: data.quadrants as RadarQuadrant[],
    entries: data.entries as RadarEntry[]
});

function App() {
    const {configType} = useConfigStore();
    const currentConfig = getConfig(radarData);

    return (
        <div className="app" style={{height: "100vh"}}>
            <div className="center"
                 style={{
                     padding: 24,
                     // height: "calc(100vh - 40px)", //for Header
                     height: "100vh",
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: "center"
                 }}>
                <TechRadar key={configType} config={currentConfig}/>
            </div>
        </div>
    )
}

export default App