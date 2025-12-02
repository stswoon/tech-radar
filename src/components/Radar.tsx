import './Radar.css'

import {type FC, useMemo, useState} from "react";
import {type RadarConfig} from "./types.ts";
import {Structure} from "./Structure.tsx";
import {Entries} from "./Entries.tsx";
import {Legend} from "./Legend.tsx";
import {Modal} from "./Modal.tsx";

interface RadarProps extends RadarConfig {
    width: number;
    height: number;
}

export const Radar: FC<RadarProps> = ({entries, rings, quadrants, width, height}) => {
    const [selectedEntryName, setSelectedEntryName] = useState<string | null>(null);

    const viewBoxSize = Math.min(width, height);

    const selectedItem = useMemo(
        () => entries.find((i) => i.name === selectedEntryName),
        [selectedEntryName, entries]
    );

    return (
        <div className="radar">
            <svg className="radar__svg" width={"100%"} height={"100%"}
                 viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                <Structure width={width} height={height} quadrants={quadrants} rings={rings}/>
                <Entries width={width} height={height} quadrants={quadrants} rings={rings} entries={entries}
                         onEntryClick={(entryName) => setSelectedEntryName(entryName)}/>
            </svg>
            <Legend rings={rings} quadrants={quadrants}/>
            <Modal quadrants={quadrants} rings={rings} selectedItem={selectedItem}
                   onClose={() => setSelectedEntryName(null)}/>
        </div>
    );
};
