import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, 'public/techRadarSource.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'src/tech-radar-entries.json');

console.log(`Reading file: ${INPUT_FILE}`);

try {

    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: File not found: ${INPUT_FILE}`);
        process.exit(1);
    }

    const workbook = XLSX.readFile(INPUT_FILE);
    const sheetName = workbook.SheetNames[0];
    console.log(`Processing sheet: ${sheetName}`);

    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON
    // header: 0 means use the first row as keys
    let data = XLSX.utils.sheet_to_json(sheet, { header: 0 });
    // console.log("data[1]", data[1])
    data = data.filter(entry => entry.hide !== "true");
    const originalLen = data.length;
    console.log(`Found ${originalLen} entries.`);
    data = data.filter(entry => !!entry.name && !!entry.ring && !!entry.quadrant);
    console.log(`Found ${data.length} entries with ring and quadrant.`);
    if (originalLen !== data.length) {
        const s = "ERROR: some entries do not have quadrant and/or ring";
        console.error(s);
        throw new Error(s)
    }

    data.forEach(entry => {
        if (entry?.tags) {
            entry.tags = entry.tags.split(',').map(item => item.trim());
        }
    });

    const jsonContent = JSON.stringify(data, null, 2);

    fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf8');
    console.log(`Successfully wrote data to: ${OUTPUT_FILE}`);

} catch (error) {
    console.error('Error converting file:', error);
    process.exit(1);
}
