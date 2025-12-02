import React, {type FC, useMemo, useState} from "react";
import {type RadarConfig, type RadarEntry} from "./types.ts";
import {hashStringToUnit} from "./utils.ts";

interface TechRadarProps extends RadarConfig {
    width: number;
    height: number;
}

export const TechRadar: FC<TechRadarProps> = ({entries, rings, quadrants, width, height}) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const viewBoxSize = Math.min(width, height);
    const cx = viewBoxSize / 2;
    const cy = viewBoxSize / 2;
    const padding = 40;
    const maxRadius = viewBoxSize / 2 - padding;

    const ringWidth = maxRadius / Math.max(rings.length, 1);

    const hoveredItem = useMemo(
        () => entries.find((i) => i.name === hoveredId) ?? null,
        [hoveredId, entries]
    );

    const selectedItem = useMemo(
        () => entries.find((i) => i.name === selectedId) ?? null,
        [selectedId, entries]
    );

    const quadrantsWithAngles = useMemo(() => {
        const angleStep = (2 * Math.PI) / Math.max(quadrants.length, 1);
        return quadrants.map((q, index) => ({
            ...q,
            startAngle: index * angleStep,
            endAngle: (index + 1) * angleStep,
        }));
    }, [quadrants]);

    const getQuadrantForItem = (entry: RadarEntry) =>
        quadrantsWithAngles.find((q) => q.name === entry.quadrant);

    const getRingIndex = (ring: string | undefined) => {
        if (!ring) {
            return -1;
        }
        return rings.findIndex((r) => r.name === ring);
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)",
                gap: "16px",
                alignItems: "start",
                position: "relative",
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    background: "#fafafa",
                }}
            >
                {/* Ринги */}
                {rings.map((ring, index) => {
                    const r = ringWidth * (index + 1);
                    return (
                        <g key={ring.name}>
                            <circle
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="none"
                                stroke="#ddd"
                                strokeWidth={1}
                            />
                            <text
                                x={cx}
                                y={cy - r + 16}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#666"
                            >
                                {ring.name}
                            </text>
                        </g>
                    );
                })}

                {/* Линии, разделяющие квадранты */}
                {quadrantsWithAngles.map((q) => {
                    const angle = q.startAngle;
                    const x2 = cx + maxRadius * Math.cos(angle);
                    const y2 = cy + maxRadius * Math.sin(angle);
                    return (
                        <line
                            key={q.name}
                            x1={cx}
                            y1={cy}
                            x2={x2}
                            y2={y2}
                            stroke="#e0e0e0"
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Названия квадрантов по внешнему кругу */}
                {quadrantsWithAngles.map((q, index) => {
                    const midAngle = (q.startAngle + q.endAngle) / 2;
                    const labelRadius = maxRadius + 20;
                    const x = cx + labelRadius * Math.cos(midAngle);
                    const y = cy + labelRadius * Math.sin(midAngle);
                    const anchor =
                        midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2
                            ? "end"
                            : "start";

                    return (
                        <text
                            key={q.name}
                            x={x}
                            y={y}
                            fontSize={12}
                            fill="#333"
                            textAnchor={anchor}
                        >
                            {index + 1}. {q.name}
                        </text>
                    );
                })}

                {/* Элементы (blips) */}
                {entries.map((entry) => {
                    const quadrant = getQuadrantForItem(entry);
                    if (!quadrant) return null;

                    const ringIndex = getRingIndex(entry.ring);
                    if (ringIndex === -1) {
                        return null;

                    }

                    const innerRadius = ringWidth * ringIndex;
                    const outerRadius = ringWidth * (ringIndex + 1);

                    const seed = hashStringToUnit(entry.name);
                    const seed2 = hashStringToUnit(entry.name + "_2");

                    const angle =
                        quadrant.startAngle +
                        (quadrant.endAngle - quadrant.startAngle) * seed;
                    const radius =
                        innerRadius + (outerRadius - innerRadius) * (0.15 + 0.7 * seed2);

                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);

                    const isHovered = hoveredId === entry.name;
                    const ring = rings[ringIndex];
                    const ringColor = ring.color;

                    return (
                        <g
                            key={entry.name}
                            onMouseEnter={() => setHoveredId(entry.name)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => setSelectedId(entry.name)}
                            style={{cursor: "pointer"}}
                        >
                            <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 8 : 6}
                                fill={ringColor}
                                stroke={isHovered ? "#000" : "#333"}
                                strokeWidth={isHovered ? 2 : 1}
                            />
                            <text x={x + 10} y={y + 4} fontSize={11} fill="#333">
                                {entry.name}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Панель справа: информация по элементу + легенда */}
            <div style={{fontFamily: "system-ui, -apple-system, sans-serif"}}>
                <div
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid #eee",
                        marginBottom: 12,
                        background: "#fff",
                    }}
                >
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 8,
                        }}
                    >
                        {hoveredItem ? hoveredItem.name : "Выберите элемент на радаре"}
                    </div>

                    {hoveredItem ? (
                        <div style={{fontSize: 13, color: "#444", lineHeight: 1.4}}>
                            <div>
                                <b>Квадрант:</b>{" "}
                                {
                                    quadrants.find((q) => q.name === hoveredItem.quadrant)
                                        ?.name
                                }
                            </div>
                            <div>
                                <b>Ринг:</b>{" "}
                                {rings.find((r) => r.name === hoveredItem.ring)?.name}
                            </div>
                            {hoveredItem.description && (
                                <p style={{marginTop: 8}}>{hoveredItem.description}</p>
                            )}
                            {hoveredItem.link && (
                                <p style={{marginTop: 8}}>
                                    <a
                                        href={hoveredItem.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Подробнее
                                    </a>
                                </p>
                            )}
                            {!hoveredItem.description && !hoveredItem.link && (
                                <p style={{marginTop: 8, color: "#777"}}>
                                    Описание не заполнено.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div style={{fontSize: 13, color: "#777"}}>
                            Наведи мышкой на любую точку, чтобы увидеть детали.
                        </div>
                    )}
                </div>

                {/* Легенда */}
                <div
                    style={
                        {
                            padding: 12,
                            borderRadius: 8,
                            border: "1px solid #eee",
                            background: "#fff",
                        } as React.CSSProperties
                    }
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

            {/* Модалка по клику */}
            {selectedItem && (
                <div
                    onClick={() => setSelectedId(null)}
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
                                onClick={() => setSelectedId(null)}
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
                                {
                                    quadrants.find((q) => q.name === selectedItem.quadrant)
                                        ?.name
                                }
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
                                onClick={() => setSelectedId(null)}
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
        </div>
    );
};
