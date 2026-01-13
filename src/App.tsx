import {useState} from 'react';
import './App.css'

import radarDataDev from "./tech-radar-dev.json";
import radarDataSa from "./tech-radar-sa.json";

import {TechRadar} from "./components";
import type {RadarConfig, RadarEntry, RadarQuadrant, RadarRing} from "./components";

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
    const [configType, setConfigType] = useState<'dev' | 'sa'>('dev');

    const currentConfig = configType === 'dev' ? getConfig(radarDataDev) : getConfig(radarDataSa);

    return (
        <div className="app" style={{height: "100vh"}}>
            <header style={{marginBottom: 4, display: 'flex', gap: 4}}>
                <button
                    onClick={() => setConfigType('dev')}
                    disabled={configType === 'dev'}
                >
                    Dev Radar
                </button>
                <button
                    onClick={() => setConfigType('sa')}
                    disabled={configType === 'sa'}
                >
                    SA Radar
                </button>
            </header>
            <div className="center"
                 style={{
                     padding: 24,
                     height: "calc(100vh - 40px)",
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: "center"
                 }}>
                <TechRadar key={configType} configType={configType} config={currentConfig}/>
            </div>
        </div>
    )
}

export default App
