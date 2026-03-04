import {useCallback, useState, type FC} from "react";
import {type RadarQuadrant, type RadarRing} from "../utils/types.ts";
import {strings} from "../utils/strings.ts";
import {useConfigStore} from "../store/useConfigStore.ts";
import {Button} from '@alfalab/core-components/button';
import {Typography} from '@alfalab/core-components/typography';
import {Space} from '@alfalab/core-components/space';
import {Select} from '@alfalab/core-components/select';
import type {OptionShape} from '@alfalab/core-components/select/typings';
import {getDomains, getExpertise} from "../utils/config.ts";
import {Scrollbar} from '@alfalab/core-components/scrollbar';


interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    onZoom: (enable: boolean) => void;
}

export const Legend: FC<ModalProps> = ({rings, quadrants, onZoom}) => {
    const [isDownloading, setDownloading] = useState<boolean>(false);

    const downloadExcel = () => {
        setDownloading(true);
        const link = document.createElement("a");
        const name = `raw-entry-data/${domain}/${expertise}.xlsx`
        link.href = name;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setDownloading(false), 1000) //because of strange hangs between click and showing download system dialog

    }

    const [zoom, setZoom] = useState<boolean>(false);

    const handleZoomClick = useCallback(() => {
        setZoom(!zoom);
        onZoom(!zoom);
    }, [onZoom, zoom])

    const {domain, setDomain, expertise, setExpertise} = useConfigStore(); //TODO: const increasePopulation = useBear((state) => state.increasePopulation)

    const domainOptions: OptionShape[] = getDomains().map(name => ({key: name, content: name}))
    const expertiseOptions: OptionShape[] = getExpertise(domain).map(name => ({key: name, content: name}))

    return (
        <Scrollbar className="legend" style={{height: '100%'}}>
            <Space direction="vertical" size={16} fullWidth>
                <Select
                    label={strings.domains}
                    options={domainOptions}
                    selected={domain}
                    onChange={(payload) => setDomain(payload!.selected!.key)}
                    block
                    multiple={false}
                />

                <Select
                    label={strings.expertise}
                    options={expertiseOptions}
                    selected={expertise}
                    onChange={(payload) => setExpertise(payload!.selected!.key)}
                    block
                    multiple={false}
                />

                <Typography.Title tag="h2" view="medium">{strings.legend}</Typography.Title>

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
        </Scrollbar>
    );
};
