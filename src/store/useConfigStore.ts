import {create} from 'zustand';
import {getDomains, getExpertise} from "../utils/config.ts";

interface ConfigState {
    domain: string;
    setDomain: (domain: string) => void;
    expertise: string;
    setExpertise: (expertise: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
    domain: getDomains()[0],
    setDomain: (domain) => set({domain: domain}),
    expertise: getExpertise(getDomains()[0])[0],
    setExpertise: (expertise) => set({expertise: expertise}),
}));
