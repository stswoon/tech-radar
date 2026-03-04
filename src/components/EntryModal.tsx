import {type FC} from "react";
import {type RadarEntry, type RadarQuadrant, type RadarRing} from "../utils/types.ts";
import {Markdown} from "./Markdown.tsx";
import {strings} from "../utils/strings.ts";
import { Modal } from '@alfalab/core-components/modal';
import { Button } from '@alfalab/core-components/button';
import { Typography } from '@alfalab/core-components/typography';
import { Link } from '@alfalab/core-components/link';

interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    selectedItem?: RadarEntry
    onClose: () => void
}

export const EntryModal: FC<ModalProps> = ({selectedItem, onClose, quadrants, rings}) => {
    return (
        <Modal open={!!selectedItem} onClose={onClose} hasCloser={true}>
            {selectedItem && (
                <>
                    <Modal.Header hasCloser={true} title={selectedItem.name} />

                    <Modal.Content>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {!!selectedItem.tags?.length && (
                                <Typography.Text view="primary-medium">
                                    <span style={{ fontWeight: 'bold' }}>{strings.tags}</span>{" "}
                                    {selectedItem.tags.join(", ")}
                                </Typography.Text>
                            )}

                            <Typography.Text view="primary-medium">
                                <span style={{ fontWeight: 'bold' }}>{strings.quadrant}</span>{" "}
                                {quadrants.find((q) => q.name === selectedItem.quadrant)?.name}
                            </Typography.Text>

                            <Typography.Text view="primary-medium">
                                <span style={{ fontWeight: 'bold' }}>{strings.ring}</span>{" "}
                                {rings.find((r) => r.name === selectedItem.ring)?.name}
                            </Typography.Text>

                            {selectedItem.description && (
                                <div style={{marginTop: 10}}>
                                    <Markdown text={selectedItem.description}/>
                                </div>
                            )}

                            {selectedItem.link && (
                                <div style={{marginTop: 10}}>
                                    <Link href={selectedItem.link} target="_blank" view="default">
                                        {selectedItem.link}
                                    </Link>
                                </div>
                            )}

                            {!selectedItem.description && !selectedItem.link && (
                                <div style={{marginTop: 10}}>
                                    <Typography.Text view="primary-medium">{strings.noDescription}</Typography.Text>
                                </div>
                            )}
                        </div>
                    </Modal.Content>

                    <Modal.Footer>
                        <Button view="primary" onClick={onClose}>{strings.close}</Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};
