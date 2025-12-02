export interface RadarRing {
  name: string;
  color?: string;
}

export interface RadarQuadrant {
  name: string;
}

export interface RadarEntry {
  name: string;
  quadrant: string;
  ring?: string;
  description?: string; //support markdown
  link?: string;
  tags?: string[];
}

export interface RadarConfig {
  quadrants: RadarQuadrant[];
  rings: RadarRing[];
  entries: RadarEntry[];
}