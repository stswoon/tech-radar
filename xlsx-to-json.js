import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_DEV = path.join(__dirname, 'public/techRadarSourceDev.xlsx');
const OUTPUT_FILE_DEV = path.join(__dirname, 'src/tech-radar-dev.json');
const INPUT_FILE_SA = path.join(__dirname, 'public/techRadarSourceSa.xlsx');
const OUTPUT_FILE_SA = path.join(__dirname, 'src/tech-radar-sa.json');

function convert(inputFile, outputFile) {
    console.log(`Reading file: ${inputFile}`);

    try {
        if (!fs.existsSync(inputFile)) {
            console.error(`Error: File not found: ${inputFile}`);
            process.exit(1);
        }

        const workbook = XLSX.readFile(inputFile);

        const sheetRadar = workbook.Sheets["radar"];
        // Convert sheet to JSON. header==0 means use the first row as keys
        let dataEntries = XLSX.utils.sheet_to_json(sheetRadar, {header: 0});
        // console.log("data[1]", data[1])
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

        dataEntries.forEach(entry => {
            if (entry?.tags) {
                entry.tags = entry.tags.split(',').map(item => item.trim());
            }
        });

        const sheetQuadrants = workbook.Sheets["quadrants"];
        const dataQuadrants = XLSX.utils.sheet_to_json(sheetQuadrants, {header: 0});
        const sheetRings = workbook.Sheets["rings"];
        const dataRings = XLSX.utils.sheet_to_json(sheetRings, {header: 0});

        const data = {quadrants: dataQuadrants, rings: dataRings, entries: dataEntries};
        const jsonContent = JSON.stringify(data, null, 2);

        fs.writeFileSync(outputFile, jsonContent, 'utf8');
        console.log(`Successfully wrote data to: ${outputFile}`);
    } catch (error) {
        console.error('Error converting file:', error);
        process.exit(1);
    }
}

convert(INPUT_FILE_DEV, OUTPUT_FILE_DEV);
convert(INPUT_FILE_SA, OUTPUT_FILE_SA);
