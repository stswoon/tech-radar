import './Radar.css'

import {type FC, useCallback, useMemo, useState} from "react";
import {type RadarConfig} from "./types.ts";
import {Structure} from "./Structure.tsx";
import {Entries} from "./Entries.tsx";
import {Legend} from "./Legend.tsx";
import {Modal} from "./Modal.tsx";

interface RadarProps extends RadarConfig {
    width: number;
    height: number;
    configType: "dev" | "sa"
}

export const Radar: FC<RadarProps> = ({entries, rings, quadrants, width, height, configType}) => {
    const [selectedEntryName, setSelectedEntryName] = useState<string | null>(null);

    // const viewBoxSize = Math.min(width, height);

    const selectedItem = useMemo(
        () => entries.find((i) => i.name === selectedEntryName),
        [selectedEntryName, entries]
    );

    const [zoom, setZoom] = useState<string>("99%"); //TODO

    const handleZoom = useCallback((enable: boolean) => {
        if (enable) {
            setZoom("200%");
        } else {
            setZoom("99%"); //TODO
        }
    }, [])

    return (
        <div className="radar">
            <div style={{overflow: "auto"}}>
                <svg className="radar__svg" width={zoom} height={zoom}
                     viewBox={`0 0 ${width} ${height}`}>
                    <Structure width={width} height={height} quadrants={quadrants} rings={rings}/>
                    <Entries width={width} height={height} quadrants={quadrants} rings={rings} entries={entries}
                             onEntryClick={(entryName) => setSelectedEntryName(entryName)}/>
                </svg>
            </div>
            <Legend rings={rings} quadrants={quadrants} onZoom={handleZoom} configType={configType}/>
            <Modal quadrants={quadrants} rings={rings} selectedItem={selectedItem}
                   onClose={() => setSelectedEntryName(null)}/>

        </div>
    );
};
