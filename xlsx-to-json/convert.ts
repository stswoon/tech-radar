import ExcelJS from 'exceljs';
import fs from 'fs';
import {sheetToJson} from "./utils";


interface RadarEntry {
    name: string;
    ring: string;
    quadrant: string;
    isNew: string;
    description: string;
    tags: string[];
    hide: string;
}

interface RowRadarEntry {
    name: string;
    ring: string;
    quadrant: string;
    isNew: string;
    description: string;
    tags: string;
    hide: string;
}

interface Quadrant {
    id: string;
    name: string;
}

interface Ring {
    id: string;
    name: string;
    color: string;
}

export async function convert(inputFile: string, outputFile: string) {
    console.log(`Reading file: ${inputFile}`);

    try {
        if (!fs.existsSync(inputFile)) {
            console.error(`Error: File not found: ${inputFile}`);
            process.exit(1);
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFile);

        const sheetRadar = workbook.getWorksheet("radar");
        if (!sheetRadar) {
            throw new Error('Sheet "radar" not found');
        }

        // Convert sheet to JSON. header==0 means use the first row as keys
        const rowDataEntries = sheetToJson<RowRadarEntry>(sheetRadar);
        let dataEntries: RadarEntry[] = rowDataEntries.map(entry => ({
            name: entry.name,
            ring: entry.ring,
            quadrant: entry.quadrant,
            isNew: entry.isNew,
            description: entry.description,
            tags: entry.tags.split(',').map(item => item.trim()),
            hide: entry.hide
        }));

        // Filter out hidden entries
        dataEntries = dataEntries.filter(entry => entry.hide !== "true");

        const originalLen = dataEntries.length;
        console.log(`Found ${originalLen} entries.`);

        dataEntries = dataEntries.filter(entry => !!entry.name && !!entry.ring && !!entry.quadrant);
        console.log(`Found ${dataEntries.length} entries with ring and quadrant.`);

        if (originalLen !== dataEntries.length) {
            const s = "ERROR: some entries do not have quadrant and/or ring";
            console.error(s);
            throw new Error(s)
        }

        const sheetQuadrants = workbook.getWorksheet("quadrants");
        if (!sheetQuadrants) {
            throw new Error('Sheet "quadrants" not found');
        }
        const dataQuadrants = sheetToJson<Quadrant>(sheetQuadrants);

        const sheetRings = workbook.getWorksheet("rings");
        if (!sheetRings) {
            throw new Error('Sheet "rings" not found');
        }
        const dataRings = sheetToJson<Ring>(sheetRings);

        const data = {quadrants: dataQuadrants, rings: dataRings, entries: dataEntries};
        const jsonContent = JSON.stringify(data, null, 2);

        fs.writeFileSync(outputFile, jsonContent, 'utf8');
        console.log(`Successfully wrote data to: ${outputFile}`);
    } catch (error) {
        console.error('Error converting file:', error);
        process.exit(1);
    }
}