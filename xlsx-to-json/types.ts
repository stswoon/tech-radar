export interface Structure {
    domains: Domain[];
    _entryDescriptionGroups: EntryDescriptionGroup[]
}

interface Domain {
    name: string;
    expertises: Expertise[];
}

export interface Expertise {
    name: string;
    filePath: string;
    radarData: RadarData;
    warnings?: string[];
}

export interface RadarData {
    quadrants: Quadrant[],
    rings: Ring[],
    entries: RadarEntry[]
}

export interface EntryDescriptionGroup {
    name: string;
    filePath: string;
    entryDescriptions: EntryDescription[];
}

// from markdown
interface EntryDescription {
    name: string;
    description: string;
}


//-------


interface CommonRadarEntry {
    name: string;
    ring: string;
    quadrant: string;
    description: string;
    isNew: string;
}

export interface RadarEntry extends CommonRadarEntry {
    tags: string[];
    hide: boolean
}

export interface RawRadarEntry extends Partial<CommonRadarEntry> {
    tags?: string;
    hide?: string
}

export interface Quadrant {
    id: string;
    name: string;
}

export interface Ring {
    id: string;
    name: string;
    color: string;
}

