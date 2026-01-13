import {type FC, useMemo, useState} from "react";
import {type RadarEntry, type RadarQuadrant, type RadarRing} from "./types.ts";
import {hashStringToUnit, quadrantsWithAnglesUtil} from "./utils.ts";
import {FIST_RING_COUNT} from "./const.ts";

interface EntriesProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    entries: RadarEntry[];
    width: number;
    height: number;
    onEntryClick: (entryName: string) => void;
}

export const Entries: FC<EntriesProps> = ({entries, quadrants, rings, width, height, onEntryClick}) => {
    const viewBoxSize = Math.min(width, height);
    const cx = viewBoxSize / 2;
    const cy = viewBoxSize / 2;
    const padding = 40;
    const maxRadius = viewBoxSize / 2 - padding;

    const ringWidth = maxRadius / (rings.length + FIST_RING_COUNT - 1);

    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const quadrantsWithAngles = useMemo(() => {
        return quadrantsWithAnglesUtil(quadrants);
    }, [quadrants]);

    const getQuadrantForItem = (entry: RadarEntry) =>
        quadrantsWithAngles.find((q) => q.name === entry.quadrant);

    const getRingIndex = (ring: string | undefined) => {
        if (!ring) {
            return -1; //TODO
        }
        return rings.findIndex((r) => r.name === ring);
    }

    return (
        <>
            {entries.map((entry) => {
                const quadrant = getQuadrantForItem(entry);
                if (!quadrant) return null;

                const ringIndex = getRingIndex(entry.ring);
                if (ringIndex === -1) {
                    return null;
                }

                const outerRingIndex = ringIndex + FIST_RING_COUNT;
                let innerRingIndex = outerRingIndex - 1;
                if (ringIndex == 0) {
                    innerRingIndex = 0;
                }
                const innerRadius = ringWidth * innerRingIndex;
                const outerRadius = ringWidth * outerRingIndex;

                //const s = entry.name;
                const s = JSON.stringify(entry);
                const seed1 = hashStringToUnit(s);
                const seed2 = hashStringToUnit(s + "_2");

                const angle =
                    (quadrant.startAngle + 0.1) +
                    (quadrant.endAngle - quadrant.startAngle - 0.1) * seed1;
                const radius =
                    innerRadius + (outerRadius - innerRadius) * (0.1 + 0.85 * seed2);

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
                        onClick={() => onEntryClick(entry.name)}
                        style={{cursor: "pointer"}}
                    >
                        <circle
                            cx={x} cy={y} r={isHovered ? 6 : 4} fill={ringColor}
                            stroke={isHovered ? "#000" : "#333"}
                            strokeWidth={isHovered ? 2 : 1}
                        />
                        <text x={x + 10} y={y + 4} fontSize={10} fill="#333">{entry.name}</text>
                    </g>
                );
            })}
        </>
    );
};
