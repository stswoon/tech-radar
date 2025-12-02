import {type FC, useMemo, useState} from "react";
import {type RadarEntry, type RadarQuadrant, type RadarRing} from "./types.ts";
import {hashStringToUnit, quadrantsWithAnglesUtil} from "./utils.ts";

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

    const ringWidth = maxRadius / Math.max(rings.length, 1);

    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const quadrantsWithAngles = useMemo(() => {
        return quadrantsWithAnglesUtil(quadrants);
    }, [quadrants]);

    const getQuadrantForItem = (entry: RadarEntry) =>
        quadrantsWithAngles.find((q) => q.name === entry.quadrant);

    const getRingIndex = (ring: string | undefined) => {
        if (!ring) {
            return -1;
            //TODO
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
                        onClick={() => onEntryClick(entry.name)}
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
        </>
    );
};
