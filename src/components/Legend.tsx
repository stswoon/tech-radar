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


interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    onZoom: (enable: boolean) => void;
}

export const Legend: FC<ModalProps> = ({rings, quadrants, onZoom}) => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    //TODO:Fix!!
    // const downloadExcel = () => {
    //     setIsDownloading(true); //because of strange hangs between click and showing download system dialog
    //     const link = document.createElement("a");
    //     const name = `techRadarSource${configType === "dev" ? "Dev" : "Sa"}.xlsx`
    //     link.href = name;
    //     link.download = name;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     setIsDownloading(false);
    // }

    const [zoom, setZoom] = useState<boolean>(false);

    const handleZoomClick = useCallback(() => {
        setZoom(!zoom);
        onZoom(!zoom);
    }, [onZoom, zoom])

    const {domain, setDomain, expertise, setExpertise} = useConfigStore(); //TODO: const increasePopulation = useBear((state) => state.increasePopulation)

    // console.log(domain)

    const domainOptions: OptionShape[] = getDomains().map(name => ({key: name, content: name}))
    const expertiseOptions: OptionShape[] = getExpertise(domain).map(name => ({key: name, content: name}))

    console.log(domainOptions)


    return (
        <div className="legend">
            <Space direction="vertical" size={16}>
                <Select
                    // label='Квартал'
                    options={domainOptions}
                    selected={domain}
                    onChange={(payload) => setDomain(payload!.selected!.key)}
                    block
                    multiple={false}
                />

                <Select
                    options={expertiseOptions}
                    selected={expertise}
                    onChange={(payload) => setExpertise(payload!.selected!.key)}
                    block
                    multiple={false}
                />

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

                {/*<Button view="secondary" onClick={downloadExcel} loading={isDownloading} block>*/}
                {/*    {strings.downloadSource}*/}
                {/*</Button>*/}
            </Space>
        </div>
    );
};
