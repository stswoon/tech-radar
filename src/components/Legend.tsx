import {type FC} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";
import {strings} from "./strings.ts";


interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
}

export const Legend: FC<ModalProps> = ({rings, quadrants}) => {
    const downloadExcel = () => {
        const link = document.createElement("a");
        link.href = "techRadarSource.xlsx";
        link.download = "techRadarSource.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="legend">
            <h2>{strings.legend}</h2>

            <h4>{strings.rings}</h4>
            <ul className="legend__ul-circle">
                {rings.map((radarRings) => (
                    <li key={radarRings.name}>
                            <span className="legend__li-circle"
                                  style={{backgroundColor: radarRings.color}}
                            />
                        <span>{radarRings.name}</span>
                    </li>
                ))}
            </ul>

            <h4>{strings.quadrants}</h4>
            <ul className="legend__ul-circle">
                {quadrants.map((radarQuadrant, idx) => (
                    <li key={radarQuadrant.name}>{idx + 1}. {radarQuadrant.name}</li>
                ))}
            </ul>

            <button onClick={downloadExcel}>{strings.downloadSource}</button>
        </div>
    );
};
