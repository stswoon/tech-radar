import {type FC} from "react";
import {type RadarConfig} from "./types.ts";
import {Radar} from "./Radar.tsx";

interface TechRadarProps {
    config: RadarConfig
}

export const TechRadar: FC<TechRadarProps> = ({config}) => {
    return (
        <Radar rings={config.rings} quadrants={config.quadrants} entries={config.entries} height={1000} width={1000}/>
    );
};
