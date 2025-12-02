import {type FC} from "react";
import {type RadarEntry, type RadarQuadrant, type RadarRing} from "./types.ts";

interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    selectedItem?: RadarEntry
    onClose: () => void
}

export const Modal: FC<ModalProps> = ({selectedItem, onClose, quadrants, rings}) => {
    return (
        <>
            {/* Модалка по клику */}
            {selectedItem && (
                <div
                    // onClick={() => setSelectedId(null)}
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: 480,
                            width: "90%",
                            background: "#fff",
                            borderRadius: 12,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                            padding: 20,
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 12,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    marginRight: 12,
                                }}
                            >
                                {selectedItem.name}
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: 18,
                                    cursor: "pointer",
                                    lineHeight: 1,
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{fontSize: 13, color: "#444", lineHeight: 1.5}}>
                            <div>
                                <b>Квадрант:</b>{" "}
                                {quadrants.find((q) => q.name === selectedItem.quadrant)?.name}
                            </div>
                            <div>
                                <b>Ринг:</b>{" "}
                                {rings.find((r) => r.name === selectedItem.ring)?.name}
                            </div>

                            {selectedItem.description && (
                                <p style={{marginTop: 10}}>{selectedItem.description}</p>
                            )}
                            {selectedItem.link && (
                                <p style={{marginTop: 10}}>
                                    <a
                                        href={selectedItem.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Открыть ссылку
                                    </a>
                                </p>
                            )}
                            {!selectedItem.description && !selectedItem.link && (
                                <p style={{marginTop: 10, color: "#777"}}>
                                    Описание не заполнено. Можно добавить поле{" "}
                                    <code>description</code> в JSON.
                                </p>
                            )}
                        </div>

                        <div
                            style={{
                                marginTop: 18,
                                textAlign: "right",
                            }}
                        >
                            <button
                                onClick={onClose}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                    background: "#f5f5f5",
                                    cursor: "pointer",
                                    fontSize: 13,
                                }}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
