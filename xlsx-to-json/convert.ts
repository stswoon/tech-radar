import ExcelJS from 'exceljs';
import fs from 'fs';
import {getSheetData} from "./utils";
import type {EntryDescriptionGroup, Expertise, Quadrant, RadarEntry, RawRadarEntry, Ring, Structure} from "./types.ts";
import * as console from "node:console";

const RADAR_SHEET_NAME = 'radar';
const QUADRANTS_SHEET_NAME = 'quadrants';
const RINGS_SHEET_NAME = 'rings';

export async function convertAll(structure: Structure) {
    structure._entryDescriptionGroups.forEach(group => {
        convertMd(group);
    });

    // used date from convertMd in convertExcel for marcos to get description

    for (const domain of structure.domains) {
        for (const expertise of domain.expertises) {
            await convertExcel(expertise, structure._entryDescriptionGroups);
        }
    }
}


async function convertMd(group: EntryDescriptionGroup) {
    const filePath = group.filePath;
    console.log(`Reading markdown file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Error: File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sections = fileContent.split(/^# /gm);

    sections.forEach(section => {
        // Разделяем заголовок и описание
        const lines = section.split('\n');
        if (lines.length === 0) return;
        // Первый элемент - заголовок
        const header = lines[0].trim();
        if (!header) return;
        // Остальные строки - описание
        const description = lines.slice(1).join('\n').trim();

        group.entryDescriptions.push({name: header, description: description});
    });
}

async function convertExcel(expertise: Expertise, entryDescriptionGroups: EntryDescriptionGroup[]) {
    const inputFile = expertise.filePath;
    console.log(`Reading file: ${inputFile}`);

    if (!fs.existsSync(inputFile)) {
        throw new Error(`Error: File not found: ${inputFile}`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFile);


    let rawDataEntries = getSheetData<RawRadarEntry>(workbook, RADAR_SHEET_NAME);
    trimRawDataEntries(rawDataEntries);
    rawDataEntries = rawDataEntries.filter(entry => entry.hide !== "true");
    removeNotValidDataEntries(rawDataEntries);
    //todo: assertDataEntries add to warnings
    const dataEntries: RadarEntry[] = rawDataEntries.map(rawEntry => {
        return ({
            name: rawEntry.name ?? '',
            ring: rawEntry.ring ?? '',
            quadrant: rawEntry.quadrant ?? '',
            isNew: rawEntry.isNew ?? '',
            description: resolveMacros(rawEntry.name ?? '', rawEntry.description ?? '', entryDescriptionGroups),
            tags: rawEntry.tags ? rawEntry.tags.split(',').map(item => item.trim()) : [],
            hide: rawEntry.hide === 'true'
        });
    });

    const dataQuadrants = getSheetData<Quadrant>(workbook, QUADRANTS_SHEET_NAME);
    const dataRings = getSheetData<Ring>(workbook, RINGS_SHEET_NAME);

    const data = {quadrants: dataQuadrants, rings: dataRings, entries: dataEntries};
    expertise.radarData = data;
}

function removeNotValidDataEntries(dataEntries: RawRadarEntry[]) {
    const originalLen = dataEntries.length;
    console.log(`Found ${originalLen} entries.`);
    dataEntries = dataEntries.filter(entry => {
        const valid = !!entry.name && !!entry.ring && !!entry.quadrant;
        if (!valid) {
            console.warn(`Not valid for entry.name=${entry.name}`);
        }
        return valid
    });
    console.log(`Found ${dataEntries.length} entries with ring and quadrant.`);
    if (originalLen !== dataEntries.length) {
        const s = "ERROR: some entries do not have quadrant and/or ring";
        console.error(s);
        throw new Error(s)
    }
}

function trimRawDataEntries(rawDataEntries: RawRadarEntry[]) {
    rawDataEntries.forEach(entry => {
        (Object.keys(entry) as (keyof RawRadarEntry)[]).forEach(key => {
            if (typeof entry[key] === 'string') {
                entry[key] = entry[key].trim();
            }
        });
    });
}

function resolveMacros(entryName: string, description: string, entryDescriptionGroups: EntryDescriptionGroup[]): string {
    if (!description.startsWith('$')) {
        return description;
    }

    const macroName = description.slice(1);
    const foundGroup = entryDescriptionGroups.find(group => group.name === macroName);
    if (!foundGroup) {
        console.warn(`Cannot resolve macros=${macroName}`);
        return description;
    }

    const foundEntryDescription = foundGroup.entryDescriptions.find(d => d.name === entryName);
    if (!foundEntryDescription) {
        console.warn(`Cannot resolve macros=${macroName}`);
        return description;
    }

    return foundEntryDescription.description;
}