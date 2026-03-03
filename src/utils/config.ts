import radarStructure from "../tech-radar.json";
import type {RadarData} from "../../xlsx-to-json/types.ts"; //TODO make common

// const SPECIAL_GROUP_ALL = "All";

export const getDomains = (): string[] => {
    const names = radarStructure.domains.map(item => item.name);
    return names;
    // return [SPECIAL_GROUP_ALL, ...names];
}

export const getExpertise = (domainName: string): string[] => {
    const domain = radarStructure.domains.find(item => item.name = domainName);
    if (!domain) {
        throw new Error(`Illegal Variable: domain ${domainName} not found`);
    }
    const names = domain.expertises.map(item => item.name);
    return names;
    // return [SPECIAL_GROUP_ALL, ...names];
}

export const getRadarData = (domainName: string, expertiseName: string): RadarData => {
    const domain = radarStructure.domains.find(item => item.name = domainName);
    if (!domain) {
        throw new Error(`Illegal Variable: domain ${domainName} not found`);
    }
    const expertise = domain.expertises.find(item => item.name = expertiseName);
    if (!expertise) {
        throw new Error(`Illegal Variable: expertise ${expertiseName} not found`);
    }
    return expertise.radarData as unknown as RadarData; //TODO
}


// export const getRadarDataForAll = (domainName: string, expertiseName: string): RadarData => {
//     if (domainName === SPECIAL_GROUP_ALL || expertiseName === SPECIAL_GROUP_ALL) {
//         const result: RadarData = {quadrants: [], entries: [], rings: []};
//
//         radarStructure.domains.forEach(domain => {
//             domain.expertises.forEach(expertises => {
//                 if (domainName === SPECIAL_GROUP_ALL && expertiseName === SPECIAL_GROUP_ALL) {
//                     expertises.radarData.rings.forEach(ring => {
//                         if (result.rings.find(item => item.name !== ring.name)) {
//                             result.rings.push(ring);
//                         }
//                     });
//                     expertises.radarData.quadrants.forEach(quadrant => {
//                         if (result.quadrants.find(item => item.name !== quadrant.name)) {
//                             result.quadrants.push(quadrant);
//                         }
//                     });
//                     expertises.radarData.entries.forEach(entry => {
//                         if (result.entries.find(item => item.name !== entry.name)) {
//                             //TODO: someday do concatenate description - because same entry may have different meanings in different expertise
//                             result.entries.push(entry);
//                         }
//                     });
//                 } else {
//                     //TODO: other cases
//                 }
//             })
//         })
//     }
// }