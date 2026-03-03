import radarStructure from "../tech-radar.json";
import {useConfigStore} from "../store/useConfigStore";
import type {RadarConfig, RadarEntry, RadarQuadrant, RadarRing} from "./types.ts";
import {TechRadar} from "./TechRadar.tsx";

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
    const currentConfig = configType === 'dev' ? getConfig(radarStructure) : getConfig(radarDataSa);

    return (
        <div className="app" style={{height: "100vh"}}>
            {/*<Header configType={configType} setConfigType={setConfigType} />*/}
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