import ExcelJS, {type Worksheet, type CellValue } from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, 'public/techRadarSourceDev.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'src/tech-radar.json');

interface RowRadarEntry {
    name: string;
    ring: string;
    quadrant: string;
    isNew: string;
    description: string;
    tags: string;
    hide: string;
}

interface RadarEntry {
    name: string;
    ring: string;
    quadrant: string;
    isNew: string;
    description: string;
    tags: string[];
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

async function convert(inputFile: string, outputFile: string) {
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
            tags: (entry.tags ?? '').split(',').map(item => item.trim()),
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


function sheetToJson<T>(worksheet: Worksheet): T[] {
    const headers: string[] = [];
    worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber] = String(cell.value);
    });

    const data: T[] = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) { //skip headers
            const rowData: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
            let hasData = false;
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    let val: CellValue = cell.value;
                    // Handle rich text and formulas
                    if (val && typeof val === 'object') {
                        if ('richText' in val && val.richText) {
                            val = val.richText.map(t => t.text).join('');
                        } else if ('text' in val && val.text) {
                            val = val.text;
                        } else if ('result' in val && val.result !== undefined) {
                            val = val.result;
                        }
                    }
                    rowData[header] = val;
                    hasData = true;
                }
            });
            if (hasData) {
                data.push(rowData as T);
            }
        }
    });
    return data;
}

(async () => {
    await convert(INPUT_FILE, OUTPUT_FILE);
})();