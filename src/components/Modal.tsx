import {type FC} from "react";
import {type RadarEntry, type RadarQuadrant, type RadarRing} from "./types.ts";
import {Markdown} from "./Markdown.tsx";
import {strings} from "./strings.ts";

interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    selectedItem?: RadarEntry
    onClose: () => void
}

export const Modal: FC<ModalProps> = ({selectedItem, onClose, quadrants, rings}) => {
    return (
        <>
            {selectedItem && (
                <div className="modal" onClick={onClose}>
                    <div className="modal__inner" onClick={e => e.stopPropagation()}>

                        <div className="modal__header">
                            <div>{selectedItem.name}</div>
                            <button className="link-button" onClick={onClose}>{strings.X}</button>
                        </div>

                        <div className="modal__body">
                            {!!selectedItem.tags?.length && (
                                <div>
                                    <b>{strings.tags}</b>{" "}
                                    {selectedItem.tags.join(", ")}
                                </div>
                            )}

                            <div>
                                <b>{strings.quadrant}</b>{" "}
                                {quadrants.find((q) => q.name === selectedItem.quadrant)?.name}
                            </div>

                            <div>
                                <b>{strings.ring}</b>{" "}
                                {rings.find((r) => r.name === selectedItem.ring)?.name}
                            </div>

                            {selectedItem.description && (
                                <div style={{marginTop: 10}}>
                                    <Markdown text={selectedItem.description}/>
                                </div>
                            )}

                            {selectedItem.link && (
                                <div style={{marginTop: 10}}>
                                    <a href={selectedItem.link} target="_blank">{selectedItem.link}</a>
                                </div>
                            )}

                            {!selectedItem.description && !selectedItem.link && (
                                <div style={{marginTop: 10}}>{strings.noDescription}</div>
                            )}
                        </div>

                        <div className="modal__footer">
                            <button className="normal-button" onClick={onClose}>{strings.close}</button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
