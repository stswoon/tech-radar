import React, { useMemo, useState } from "react";

type RadarMovement = -1 | 0 | 1 | 2; 
// -1 down, 0 none, 1 up, 2 new (как у Zalando)

export interface RadarRing {
  id: string;
  name: string;
  color?: string;
}

export interface RadarQuadrant {
  id: string;
  name: string;
}

export interface RadarItem {
  id: string;
  name: string;
  quadrantId: string;
  ringId: string;
  description?: string;
  moved?: RadarMovement; // -1,0,1,2
  link?: string;
}

/**
 * JSON-формат "как у Zalando"
 * https://github.com/zalando/tech-radar
 */
export interface ZalandoRadarConfig {
  quadrants: { name: string }[];
  rings: { name: string; color?: string }[];
  entries: {
    label: string;
    quadrant: number; // index в quadrants
    ring: number;     // index в rings
    moved?: RadarMovement;
    active?: boolean;
    link?: string;
    url?: string;
    description?: string; // наше расширение, Zalando это не требует
  }[];
}

export interface TechRadarProps {
  width?: number;
  height?: number;
  rings: RadarRing[];
  quadrants: RadarQuadrant[];
  items: RadarItem[];
}

export interface TechRadarFromZalandoProps {
  width?: number;
  height?: number;
  config: ZalandoRadarConfig;
}

/**
 * Простой детерминированный «рандом» по строке,
 * чтобы точки всегда ставились одинаково при одном и том же id.
 */
function hashStringToUnit(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const result = hash / 0xffffffff;
  return result;
}

/**
 * Маппинг Zalando JSON -> внутренние структуры
 */
function mapZalandoToInternal(config: ZalandoRadarConfig) {
  const quadrants: RadarQuadrant[] = config.quadrants.map((q, index) => ({
    id: `q${index}`,
    name: q.name,
  }));

  const rings: RadarRing[] = config.rings.map((r, index) => ({
    id: `r${index}`,
    name: r.name,
    color: r.color,
  }));

  const items: RadarItem[] = config.entries
    .filter((e) => e.active !== false) // если active === false, скрываем
    .map((e, index) => {
      const quadrant = quadrants[e.quadrant];
      const ring = rings[e.ring];

      if (!quadrant || !ring) {
        return null;
      }

      const id =
        `entry-${index}-${e.label.toLowerCase().replace(/\s+/g, "-")}`;

      const moved =
        e.moved === -1 || e.moved === 0 || e.moved === 1 || e.moved === 2
          ? e.moved
          : undefined;

      return {
        id,
        name: e.label,
        quadrantId: quadrant.id,
        ringId: ring.id,
        moved,
        description: e.description,
        link: e.link ?? e.url,
      } as RadarItem;
    })
    .filter((x): x is RadarItem => Boolean(x));

  return { rings, quadrants, items };
}

/**
 * Цвет кольца (и точек) по имени ринга:
 * ADOPT — зелёный, TRIAL — синий, ASSESS — жёлтый, HOLD — красный.
 * Если в JSON задан color у rings[i], используем его.
 */
function getRingColor(ring: RadarRing, index: number): string {
  const name = ring.name.toUpperCase();

  const semanticMap: Record<string, string> = {
    ADOPT: "#2e7d32",
    TRIAL: "#1565c0",
    ASSESS: "#f9a825",
    HOLD: "#c62828",
  };

  const fallbackPalette = ["#2e7d32", "#1565c0", "#f9a825", "#6a1b9a"];

  return (
    ring.color ??
    semanticMap[name] ??
    fallbackPalette[index % fallbackPalette.length]
  );
}

export const TechRadar: React.FC<TechRadarProps> = ({
  width = 800,
  height = 800,
  rings,
  quadrants,
  items,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const viewBoxSize = Math.min(width, height);
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const padding = 40;
  const maxRadius = viewBoxSize / 2 - padding;

  const ringWidth = maxRadius / Math.max(rings.length, 1);

  const hoveredItem = useMemo(
    () => items.find((i) => i.id === hoveredId) ?? null,
    [hoveredId, items]
  );

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [selectedId, items]
  );

  const quadrantsWithAngles = useMemo(() => {
    const angleStep = (2 * Math.PI) / Math.max(quadrants.length, 1);
    return quadrants.map((q, index) => ({
      ...q,
      startAngle: index * angleStep,
      endAngle: (index + 1) * angleStep,
    }));
  }, [quadrants]);

  const getQuadrantForItem = (item: RadarItem) =>
    quadrantsWithAngles.find((q) => q.id === item.quadrantId);

  const getRingIndex = (ringId: string) =>
    rings.findIndex((r) => r.id === ringId);

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
            <g key={ring.id}>
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
              key={q.id}
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
              key={q.id}
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
        {items.map((item) => {
          const quadrant = getQuadrantForItem(item);
          if (!quadrant) return null;

          const ringIndex = getRingIndex(item.ringId);
          if (ringIndex === -1) return null;

          const innerRadius = ringWidth * ringIndex;
          const outerRadius = ringWidth * (ringIndex + 1);

          const seed = hashStringToUnit(item.id);
          const seed2 = hashStringToUnit(item.id + "_2");

          const angle =
            quadrant.startAngle +
            (quadrant.endAngle - quadrant.startAngle) * seed;
          const radius =
            innerRadius + (outerRadius - innerRadius) * (0.15 + 0.7 * seed2);

          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);

          const isHovered = hoveredId === item.id;
          const ring = rings[ringIndex];
          const ringColor = getRingColor(ring, ringIndex);

          let movementSymbol = "";
          if (item.moved === 1) movementSymbol = "▲";
          if (item.moved === -1) movementSymbol = "▼";
          if (item.moved === 2) movementSymbol = "★";

          return (
            <g
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(item.id)}
              style={{ cursor: "pointer" }}
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
                {item.name}
                {movementSymbol && ` ${movementSymbol}`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Панель справа: информация по элементу + легенда */}
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
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
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.4 }}>
              <div>
                <b>Квадрант:</b>{" "}
                {
                  quadrants.find((q) => q.id === hoveredItem.quadrantId)
                    ?.name
                }
              </div>
              <div>
                <b>Ринг:</b>{" "}
                {rings.find((r) => r.id === hoveredItem.ringId)?.name}
              </div>
              {hoveredItem.moved !== undefined &&
                hoveredItem.moved !== 0 && (
                  <div>
                    <b>Движение:</b>{" "}
                    {hoveredItem.moved === 1
                      ? "вверх ▲"
                      : hoveredItem.moved === -1
                      ? "вниз ▼"
                      : "новое ★"}
                  </div>
                )}
              {hoveredItem.description && (
                <p style={{ marginTop: 8 }}>{hoveredItem.description}</p>
              )}
              {hoveredItem.link && (
                <p style={{ marginTop: 8 }}>
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
                <p style={{ marginTop: 8, color: "#777" }}>
                  Описание не заполнено.
                </p>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#777" }}>
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
          <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>
            <div>
              <b>Ринги:</b>
            </div>
            <ul style={{ paddingLeft: 18, margin: "4px 0 8px" }}>
              {rings.map((r, idx) => (
                <li key={r.id}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      marginRight: 6,
                      backgroundColor: getRingColor(r, idx),
                    }}
                  />
                  {idx + 1}. {r.name}
                </li>
              ))}
            </ul>
            <div>
              <b>Квадранты:</b>
            </div>
            <ul style={{ paddingLeft: 18, margin: "4px 0 8px" }}>
              {quadrants.map((q, idx) => (
                <li key={q.id}>
                  {idx + 1}. {q.name}
                </li>
              ))}
            </ul>
            <div>
              <b>Обозначения движения:</b> ▲ — поднялось, ▼ — опустилось,
              ★ — новое.
            </div>
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

            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>
              <div>
                <b>Квадрант:</b>{" "}
                {
                  quadrants.find((q) => q.id === selectedItem.quadrantId)
                    ?.name
                }
              </div>
              <div>
                <b>Ринг:</b>{" "}
                {rings.find((r) => r.id === selectedItem.ringId)?.name}
              </div>
              {selectedItem.moved !== undefined &&
                selectedItem.moved !== 0 && (
                  <div>
                    <b>Движение:</b>{" "}
                    {selectedItem.moved === 1
                      ? "вверх ▲"
                      : selectedItem.moved === -1
                      ? "вниз ▼"
                      : "новое ★"}
                  </div>
                )}

              {selectedItem.description && (
                <p style={{ marginTop: 10 }}>{selectedItem.description}</p>
              )}
              {selectedItem.link && (
                <p style={{ marginTop: 10 }}>
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
                <p style={{ marginTop: 10, color: "#777" }}>
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

/**
 * Обёртка: принимает JSON как у Zalando и рендерит наш радар
 */
export const TechRadarFromZalando: React.FC<TechRadarFromZalandoProps> = ({
  width,
  height,
  config,
}) => {
  const { rings, quadrants, items } = useMemo(
    () => mapZalandoToInternal(config),
    [config]
  );

  return (
    <TechRadar
      width={width}
      height={height}
      rings={rings}
      quadrants={quadrants}
      items={items}
    />
  );
};
