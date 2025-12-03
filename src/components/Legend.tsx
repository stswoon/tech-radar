import {useCallback, useState, type FC} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";
import {strings} from "./strings.ts";


interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    onZoom: (enable: boolean) => void;
}

export const Legend: FC<ModalProps> = ({rings, quadrants, onZoom}) => {
    const downloadExcel = () => {
        const link = document.createElement("a");
        link.href = "techRadarSource.xlsx";
        link.download = "techRadarSource.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const [zoom, setZoom] = useState<boolean>(false);

    const handleZoomClick = useCallback(() => {
        setZoom(!zoom);
        onZoom(!zoom);
    }, [onZoom, zoom])

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

            <button className="normal-button" onClick={downloadExcel}>{strings.downloadSource}</button>

            <button className="normal-button"
                    onClick={handleZoomClick}>{zoom ? strings.zoomOut : strings.zoomIn}</button>
        </div>
    );
};
