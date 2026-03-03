import {fileURLToPath} from "url";
import path from "path";
import {convert} from "./convert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_DEV = path.join(__dirname, '../public/techRadarSourceDev.xlsx');
const OUTPUT_FILE_DEV = path.join(__dirname, '../src/entry-data/tech-radar-dev.json');
const INPUT_FILE_SA = path.join(__dirname, '../public/techRadarSourceSa.xlsx');
const OUTPUT_FILE_SA = path.join(__dirname, '../src/entry-data/tech-radar-sa.json');

(async () => {
    await convert(INPUT_FILE_DEV, OUTPUT_FILE_DEV);
    await convert(INPUT_FILE_SA, OUTPUT_FILE_SA);
})();