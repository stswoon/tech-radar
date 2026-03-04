import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
import {processFoldersAndFiles} from "./find.ts";
import {convertAll} from "./convert.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FOLDER = path.join(__dirname, '../public/raw-entry-data');
const OUTPUT_FILE = path.join(__dirname, '../src/tech-radar.json');

async function main() {
    const structure = processFoldersAndFiles(DATA_FOLDER);

    await convertAll(structure);

    structure._entryDescriptionGroups = []; //TODO
    const jsonContent = JSON.stringify(structure, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf8');
    console.info(`Successfully wrote data to: ${OUTPUT_FILE}`);
}

(async () => {
    try {
        await main();
    } catch (error) {
        console.error('Error converting excel to tech radar structure', error);
        process.exit(1);
    }
})();