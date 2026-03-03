import {useCallback, useState, type FC} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";
import {strings} from "./strings.ts";
import {useConfigStore} from "../store/useConfigStore.ts";
import {Button} from '@alfalab/core-components/button';
import {Typography} from '@alfalab/core-components/typography';
import {Space} from '@alfalab/core-components/space';
import {Select} from '@alfalab/core-components/select';
import type { OptionShape} from '@alfalab/core-components/select/typings';


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

    const radarOptions: OptionShape[] = [
        {key: 'dev', content: strings.devRadar},
        {key: 'sa', content: strings.saRadar}
    ];

    return (
        <div className="legend">
            <Space direction="vertical" size={16}>
                <Select
                    options={radarOptions}
                    selected={configType}
                    onChange={(payload) => setConfigType(payload?.selected?.key as 'dev' | 'sa')}
                    block
                />

                {/*<Select*/}
                {/*    options={radarOptions}*/}
                {/*    selected={configType}*/}
                {/*    onChange={(payload) => setConfigType(payload?.selected?.key as 'dev' | 'sa')}*/}
                {/*    block*/}
                {/*/>*/}

                <Typography.Title tag="h2" view="small">{strings.legend}</Typography.Title>

                <Typography.Title tag="h4" view="xsmall">{strings.rings}</Typography.Title>

                <ul className="legend__ul-circle">
                    {rings.map((radarRings) => (
                        <li key={radarRings.name} style={{display: 'flex', alignItems: 'center'}}>
                            <span className="legend__li-circle"
                                  style={{backgroundColor: radarRings.color}}
                            />
                            <Typography.Text view="primary-small">{radarRings.name}</Typography.Text>
                        </li>
                    ))}
                </ul>

                <Typography.Title tag="h4" view="xsmall">{strings.quadrants}</Typography.Title>
                <ul className="legend__ul-circle">
                    {quadrants.map((radarQuadrant, idx) => (
                        <li key={radarQuadrant.name}>
                            <Typography.Text view="primary-small">{idx + 1}. {radarQuadrant.name}</Typography.Text>
                        </li>
                    ))}
                </ul>

                <Button view="secondary" onClick={handleZoomClick} block>
                    {zoom ? strings.zoomOut : strings.zoomIn}
                </Button>

                <Button view="secondary" onClick={downloadExcel} loading={isDownloading} block>
                    {strings.downloadSource}
                </Button>
            </Space>
        </div>
    );
};
