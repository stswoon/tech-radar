import {type FC} from "react";
import {type RadarConfig} from "./types.ts";
import {Radar} from "./Radar.tsx";

interface TechRadarProps {
    config: RadarConfig,
    configType: "dev" | "sa"
}

export const TechRadar: FC<TechRadarProps> = ({config, configType}) => {
    return (
        <Radar rings={config.rings} quadrants={config.quadrants} entries={config.entries} height={1000} width={1200}
               configType={configType}/>
    );
};
