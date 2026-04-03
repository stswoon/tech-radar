import {type FC, useMemo} from "react";
import {type RadarQuadrant, type RadarRing} from "./types.ts";
import {FIST_RING_COUNT, QUADRANTS_WITH_ANGLE_LINE_WIDTH, RING_LINE_WIDTH} from "./const.ts";
import {isApproximatelyEqual, quadrantsWithAnglesUtil} from "./utils.ts";

interface StructureProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    width: number;
    height: number;
}

function calcRadiusForRings(index: number, ringWidth: number) {
    const outerRingIndex = index + FIST_RING_COUNT;
    const innerRingIndex = index === 0 ? 0 : outerRingIndex - 1;
    const innerRadius = ringWidth * innerRingIndex;
    const outerRadius = ringWidth * outerRingIndex;
    return {innerRadius, outerRadius};
}

export const Structure: FC<StructureProps> = ({rings, quadrants, width, height}) => {
    const viewBoxSize = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const padding = 40;
    const maxRadius = viewBoxSize / 2 - padding;
    const ringWidth = maxRadius / (rings.length + FIST_RING_COUNT - 1);

    const quadrantsWithAngles = useMemo(() => {
        return quadrantsWithAnglesUtil(quadrants);
    }, [quadrants]);

    const axesAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const ringLayers = useMemo(() => rings.map((ring, index) => ({ring, index})).reverse(), [rings]);

    return (
        <>
            <circle cx={cx} cy={cy} r={maxRadius} fill="#f0f0f0"/>

            {/* Кольца */}
            {ringLayers.map(({ring, index}) => {
                const {innerRadius, outerRadius} = calcRadiusForRings(index, ringWidth);
                return (
                    <g key={ring.name}>
                        <circle cx={cx} cy={cy} r={outerRadius} fill={ring.color ?? "#ccc"} opacity={0.28}/>
                        {innerRadius > 0 && <circle cx={cx} cy={cy} r={innerRadius} fill="#fff"/>}

                        <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="#fff" strokeWidth={RING_LINE_WIDTH}/>
                        {innerRadius > 0 && (
                            <circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke="#fff" strokeWidth={RING_LINE_WIDTH}/>
                        )}
                    </g>
                );
            })}

            {/* Названия квадрантов по внешнему кругу */}
            {quadrantsWithAngles.map((q) => {
                const midAngle = (q.startAngle + q.endAngle) / 2;
                const labelRadius = maxRadius + 14;
                const x = cx + labelRadius * Math.cos(midAngle);
                const y = cy + labelRadius * Math.sin(midAngle);
                const deg = ((midAngle + Math.PI / 2 ) * 180) / Math.PI;
                return (
                    <text key={q.name} x={x} y={y} fontSize={16} fill="#999" textAnchor="middle" transform={`rotate(${deg} ${x} ${y})`}>
                        {q.name}
                    </text>
                );
            })}

            {/* Линии, разделяющие квадранты */}
            {quadrantsWithAngles.map((q) => {
                const angle = q.startAngle;
                const x2 = cx + maxRadius * Math.cos(angle);
                const y2 = cy + maxRadius * Math.sin(angle);
                return (
                    <line key={q.name} x1={cx} y1={cy} x2={x2} y2={y2}
                          stroke="#fff" strokeWidth={QUADRANTS_WITH_ANGLE_LINE_WIDTH}/>
                );
            })}

            {/* Названия колец после линий квадранта, чтобы быть выше и не прятаться за линиями */}
            {ringLayers.map(({ring, index}) => {
                const {innerRadius, outerRadius} = calcRadiusForRings(index, ringWidth);
                const shortName = ring.name.split("/")[0].toLowerCase();
                return (
                    <g key={ring.name} >
                        {axesAngles.map((angle) => {
                            const labelRadius = (innerRadius + outerRadius) / 2;
                            const x = cx + labelRadius * Math.cos(angle);
                            const y = cy + labelRadius * Math.sin(angle);
                            //const deg = (angle * 180) / Math.PI;
                            // console.log("angle="+angle)
                            let deg = (Math.PI / 2 * 180) / Math.PI;
                            if (isApproximatelyEqual(angle, 0) || isApproximatelyEqual(angle, 3.14159)) {
                                deg = 0;
                            }
                            return (
                                <text
                                    key={`${ring.name}-${angle}`}
                                    x={x+3}
                                    y={y+3}
                                    fontSize={12}
                                    fill="#666"
                                    textAnchor="middle"
                                    transform={`rotate(${deg} ${x} ${y})`}
                                >
                                    {shortName}
                                </text>
                            );
                        })}
                    </g>
                );
            })}
        </>
    );
};
