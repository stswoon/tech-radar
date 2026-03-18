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
    expertise: getExpertise(getDomains()[0])[0],
    setDomain: (domain) => set((state) => {
        const expertises = getExpertise(domain);
        // Check if expertise exists in new domain
        const withFallbackExpertise = expertises.includes(state.expertise) ? state.expertise : expertises[0];
        return { domain, expertise: withFallbackExpertise };
    }),
    setExpertise: (expertise) => set({expertise: expertise}),
}));
