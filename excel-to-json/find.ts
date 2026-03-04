import fs, {Dirent} from "fs";
import path from "path";
import type {Expertise, RadarData, Structure} from "./types.ts";

const EMPTY_RADAR_DATA: RadarData = {rings: [], entries: [], quadrants: []};

export function processFoldersAndFiles(DATA_FOLDER: string): Structure {
    const structure: Structure = {domains: [], _entryDescriptionGroups: []};

    try {
        const entries = fs.readdirSync(DATA_FOLDER, {withFileTypes: true});
        readExcelFiles(DATA_FOLDER, entries, structure);
        readMarkdownFiles(DATA_FOLDER, entries, structure);
    } catch (error) {
        console.error('Error processing folders and files:', error);
        throw error;
    }

    return structure
}

function readExcelFiles(DATA_FOLDER: string, entries: Dirent[], structure: Structure) {
    const folders = entries.filter(entry => entry.isDirectory());
    for (const folder of folders) {
        const domainName = folder.name;
        const folderPath = path.join(DATA_FOLDER, folder.name);

        // Read files in the folder
        const expertises: Expertise[] = [];
        const files = fs.readdirSync(folderPath, {withFileTypes: true});
        const xlsxFiles = files
            .filter(file => file.isFile() && file.name.endsWith('.xlsx') && !file.name.startsWith('~$'));
        for (const file of xlsxFiles) {
            const expertiseName = file.name.replace('.xlsx', '');
            expertises.push({
                name: expertiseName,
                filePath: path.join(folderPath, file.name),
                radarData: EMPTY_RADAR_DATA
            });
            console.log(`Found expertise=${expertiseName} in domain=${domainName}`);
        }

        structure.domains.push({name: domainName, expertises});
    }
}

function readMarkdownFiles(DATA_FOLDER: string, entries: Dirent[], structure: Structure) {
    const mdFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith('.md'));

    for (const file of mdFiles) {
        const groupName = file.name.replace('.md', '');
        const filePath = path.join(DATA_FOLDER, file.name);
        structure._entryDescriptionGroups.push({name: groupName, filePath: filePath, entryDescriptions: []});
        console.log(`Found markdown=${groupName}`);
    }
}