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
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const viewBoxSize = Math.min(width, height);

    const selectedItem = useMemo(
        () => entries.find((i) => i.name === selectedId),
        [selectedId, entries]
    );

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)",
                gap: "16px",
                alignItems: "start",
                position: "relative",
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    background: "#fafafa",
                }}
            >
                <Structure width={width} height={height} quadrants={quadrants} rings={rings}/>
                <Entries width={width} height={height} quadrants={quadrants} rings={rings} entries={entries}
                         onEntryClick={
                             (entryName) => {
                                 setSelectedId(entryName);
                             }
                         }
                />
            </svg>

            <Legend rings={rings} quadrants={quadrants}/>

            <Modal quadrants={quadrants} rings={rings} selectedItem={selectedItem}
                   onClose={() => setSelectedId(null)}/>
        </div>
    );
};
