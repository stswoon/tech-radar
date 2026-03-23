import {type FC, useMemo, useState} from "react";
import {type RadarEntry, type RadarQuadrant, type RadarRing} from "../utils/types.ts";
import {hashStringToUnit, quadrantsWithAnglesUtil} from "../utils/utils.ts";
import {FIST_RING_COUNT} from "../utils/const.ts";
import {forceCollide, forceSimulation, forceX, forceY} from "d3-force";

interface EntriesProps {
    quadrants: RadarQuadrant[];
    rings: RadarRing[];
    entries: RadarEntry[];
    width: number;
    height: number;
    onEntryClick: (entryName: string) => void;
}

interface EntryWithPosition extends RadarEntry {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    ringColor: string;
}

export const Entries: FC<EntriesProps> = ({entries, quadrants, rings, width, height, onEntryClick}) => {
    const cx = width / 2;
    const cy = height / 2;
    const padding = 40;
    const viewBoxSize = Math.min(width, height);
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
            // return -1;
            throw new Error('Illegal Ring State')
        }
        return rings.findIndex((r) => r.name === ring);
    }

    const entriesWithPositions = useMemo(() => {
        const initialEntries: EntryWithPosition[] = entries.map((entry) => {
            const quadrant = getQuadrantForItem(entry);
            const ringIndex = getRingIndex(entry.ring);

            if (!quadrant || ringIndex === -1) {
                return null as unknown as EntryWithPosition;
            }

            const outerRingIndex = ringIndex + FIST_RING_COUNT;
            let innerRingIndex = outerRingIndex - 1;
            if (ringIndex === 0) {
                innerRingIndex = 0;
            }
            const innerRadius = ringWidth * innerRingIndex;
            const outerRadius = ringWidth * outerRingIndex;

            const s = JSON.stringify(entry);
            const seed1 = hashStringToUnit(s);
            const seed2 = hashStringToUnit(s + "_2");

            const radius =
                innerRadius + (outerRadius - innerRadius) * (0.1 + 0.85 * seed2);

            let dR = 1 - radius * radius * 0.00006;
            dR = dR < 0 ? 0 : dR;
            const angle =
                (quadrant.startAngle + 0.4 * dR) +
                (quadrant.endAngle - quadrant.startAngle - 0.9 * dR) * seed1;


            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);

            return {
                ...entry,
                x,
                y,
                initialX: x,
                initialY: y,
                ringColor: rings[ringIndex].color
            };
        }).filter(e => e !== null);

        // Применяем d3-force для предотвращения наложений
        const simulation = forceSimulation(initialEntries)
            .force("x", forceX<EntryWithPosition>(d => d.initialX).strength(0.1))
            .force("y", forceY<EntryWithPosition>(d => d.initialY).strength(0.1))
            .force("collide", forceCollide().radius(25).iterations(2))
            .stop();

        // Запускаем симуляцию на фиксированное количество итераций
        for (let i = 0; i < 120; ++i) simulation.tick();

        return initialEntries;
    }, [entries, quadrantsWithAngles, rings, ringWidth, cx, cy]);

    return (
        <>
            {entriesWithPositions.map((entry) => {
                const isHovered = hoveredId === entry.name;

                return (
                    <g
                        key={entry.name}
                        onMouseEnter={() => setHoveredId(entry.name)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => onEntryClick(entry.name)}
                        style={{cursor: "pointer"}}
                    >
                        <circle
                            cx={entry.x} cy={entry.y} r={isHovered ? 6 : 4} fill={entry.ringColor}
                            stroke={isHovered ? "#000" : "#333"}
                            strokeWidth={isHovered ? 2 : 1}
                        />
                        <text x={entry.x + 10} y={entry.y + 4} fontSize={10} fill="#333">{entry.name}</text>
                    </g>
                );
            })}
        </>
    );
};
