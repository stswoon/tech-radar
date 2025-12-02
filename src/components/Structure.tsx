import {type FC, useMemo} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";
import {QUADRANTS_WITH_ANGLE_LINE_WIDTH, RING_LINE_WIDTH} from "../const.ts";
import {quadrantsWithAnglesUtil} from "./utils.ts";


interface StructureProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    width: number;
    height: number;
}

export const Structure: FC<StructureProps> = ({rings, quadrants, width, height}) => {
    const viewBoxSize = Math.min(width, height);
    const cx = viewBoxSize / 2;
    const cy = viewBoxSize / 2;
    const padding = 40;
    const maxRadius = viewBoxSize / 2 - padding;

    const ringWidth = maxRadius / (Math.max(rings.length, 1) + 1);

    const quadrantsWithAngles = useMemo(() => {
        return quadrantsWithAnglesUtil(quadrants);
    }, [quadrants]);

    return (
        <>
            {rings.map((ring, index) => {
                const ringRadius = ringWidth * (index + 2);
                return (
                    <g key={ring.name}>
                        <circle
                            cx={cx}
                            cy={cy}
                            r={ringRadius}
                            fill="none"
                            stroke="#ddd"
                            strokeWidth={RING_LINE_WIDTH}
                        />
                        <text
                            x={cx}
                            y={cy - ringRadius + 16}
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
                        strokeWidth={QUADRANTS_WITH_ANGLE_LINE_WIDTH}
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
        </>
    );
};
