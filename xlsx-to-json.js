import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_DEV = path.join(__dirname, 'public/techRadarSourceDev.xlsx');
const OUTPUT_FILE_DEV = path.join(__dirname, 'src/tech-radar-dev.json');
const INPUT_FILE_SA = path.join(__dirname, 'public/techRadarSourceSa.xlsx');
const OUTPUT_FILE_SA = path.join(__dirname, 'src/tech-radar-sa.json');

async function convert(inputFile, outputFile) {
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
        let dataEntries = sheetToJson(sheetRadar);

        // Filter out hidden entries
        dataEntries = dataEntries.filter(entry => String(entry.hide) !== "true");
        
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

        const sheetQuadrants = workbook.getWorksheet("quadrants");
        if (!sheetQuadrants) {
             throw new Error('Sheet "quadrants" not found');
        }
        const dataQuadrants = sheetToJson(sheetQuadrants);
        
        const sheetRings = workbook.getWorksheet("rings");
        if (!sheetRings) {
             throw new Error('Sheet "rings" not found');
        }
        const dataRings = sheetToJson(sheetRings);

        const data = {quadrants: dataQuadrants, rings: dataRings, entries: dataEntries};
        const jsonContent = JSON.stringify(data, null, 2);

        fs.writeFileSync(outputFile, jsonContent, 'utf8');
        console.log(`Successfully wrote data to: ${outputFile}`);
    } catch (error) {
        console.error('Error converting file:', error);
        process.exit(1);
    }
}

function sheetToJson(worksheet) {
    const data = [];
    const headers = [];


    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            // Capture headers
            row.eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
        } else {
            const rowData = {};
            let hasData = false;
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    let val = cell.value;
                    // Handle rich text and formulas
                    if (val && typeof val === 'object') {
                        if (val.richText) {
                            val = val.richText.map(t => t.text).join('');
                        } else if (val.text) {
                            val = val.text;
                        } else if (val.result !== undefined) {
                            val = val.result;
                        }
                    }
                    rowData[header] = val;
                    hasData = true;
                }
            });
            if (hasData) {
                data.push(rowData);
            }
        }
    });
    return data;
}

(async () => {
    await convert(INPUT_FILE_DEV, OUTPUT_FILE_DEV);
    await convert(INPUT_FILE_SA, OUTPUT_FILE_SA);
})();
