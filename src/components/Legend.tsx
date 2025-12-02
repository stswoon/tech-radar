import {type FC} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";


interface ModalProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
}

export const Legend: FC<ModalProps> = ({rings, quadrants}) => {
    return (
        <div>
            <div
                style={{
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #eee",
                    background: "#fff",
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 8,
                    }}
                >
                    Легенда
                </div>
                <div style={{fontSize: 12, color: "#444", lineHeight: 1.6}}>
                    <div>
                        <b>Ринги:</b>
                    </div>
                    <ul style={{paddingLeft: 18, margin: "4px 0 8px"}}>
                        {rings.map((r, idx) => (
                            <li key={r.name}>
                                <span
                                  style={{
                                      display: "inline-block",
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      marginRight: 6,
                                      backgroundColor: r.color,
                                  }}
                                />
                                {idx + 1}. {r.name}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <b>Квадранты:</b>
                    </div>
                    <ul style={{paddingLeft: 18, margin: "4px 0 8px"}}>
                        {quadrants.map((q, idx) => (
                            <li key={q.name}>
                                {idx + 1}. {q.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
