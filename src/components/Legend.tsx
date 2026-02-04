import {useCallback, useState, type FC} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";
import {strings} from "./strings.ts";
import {useConfigStore} from "../store/useConfigStore.ts";


interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    onZoom: (enable: boolean) => void;
}

export const Legend: FC<ModalProps> = ({rings, quadrants, onZoom}) => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const downloadExcel = () => {
        setIsDownloading(true); //because of strange hangs between click and showing download system dialog
        const link = document.createElement("a");
        const name = `techRadarSource${configType === "dev" ? "Dev" : "Sa"}.xlsx`
        link.href = name;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloading(false);
    }

    const [zoom, setZoom] = useState<boolean>(false);

    const handleZoomClick = useCallback(() => {
        setZoom(!zoom);
        onZoom(!zoom);
    }, [onZoom, zoom])

    const {configType, setConfigType} = useConfigStore();

    return (
        <div className="legend stack">
            <div>
                <button className="normal-button" disabled={configType === 'dev'}
                        onClick={() => setConfigType('dev')}>
                    {strings.devRadar}
                </button>
                <button className="normal-button" disabled={configType === 'sa'}
                        onClick={() => setConfigType('sa')}>
                    {strings.saRadar}
                </button>
            </div>


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

            <button className="normal-button"
                    onClick={handleZoomClick}>{zoom ? strings.zoomOut : strings.zoomIn}</button>

            <button className="normal-button" onClick={downloadExcel} disabled={isDownloading}>
                {isDownloading ? strings.loading : strings.downloadSource}
            </button>
        </div>
    );
};
