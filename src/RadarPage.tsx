import React from "react";
import radarData from "./radar-data.json"; // тип ZalandoRadarConfig
import {
  TechRadarFromZalando,
  type ZalandoRadarConfig,
} from "./TechRadar";

const typedRadarData = radarData as ZalandoRadarConfig;

export const RadarPage: React.FC = () => (
  <div style={{ padding: 24 }}>
    <h1>Tech Radar</h1>
    <TechRadarFromZalando
      width={900}
      height={900}
      config={typedRadarData}
    />
  </div>
);
