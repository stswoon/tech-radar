import {create} from 'zustand';
import {getDomains, getExpertise} from "../utils/config.ts";

interface ConfigState {
    domain: string;
    setDomain: (domain: string) => void;
    expertise: string;
    setExpertise: (expertise: string) => void;
}

const DOMAIN_KEY = 'domain';
const EXPERTISE_KEY = 'expertise';

const getInitialState = (): { domain: string, expertise: string } => {
    const params = new URLSearchParams(window.location.search);
    const domains = getDomains();

    let domain = params.get(DOMAIN_KEY) || localStorage.getItem(DOMAIN_KEY);
    if (!domain || !domains.includes(domain)) {
        domain = domains[0];
    }

    const expertises = getExpertise(domain);
    let expertise = params.get(EXPERTISE_KEY) || localStorage.getItem(EXPERTISE_KEY);
    if (!expertise || !expertises.includes(expertise)) {
        expertise = expertises[0];
    }

    return { domain, expertise };
}

const updateUrl = (domain: string, expertise: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(DOMAIN_KEY, domain);
    url.searchParams.set(EXPERTISE_KEY, expertise);
    window.history.replaceState({}, '', url);
}

const initialState = getInitialState();
updateUrl(initialState.domain, initialState.expertise);

export const useConfigStore = create<ConfigState>((set) => ({
    ...initialState,
    setDomain: (domain) => set((state) => {
        const expertises = getExpertise(domain);
        // Check if expertise exists in new domain
        const withFallbackExpertise = expertises.includes(state.expertise) ? state.expertise : expertises[0];
        
        localStorage.setItem(DOMAIN_KEY, domain);
        localStorage.setItem(EXPERTISE_KEY, withFallbackExpertise);
        updateUrl(domain, withFallbackExpertise);
        
        return { domain, expertise: withFallbackExpertise };
    }),
    setExpertise: (expertise) => set((state) => {
        localStorage.setItem(EXPERTISE_KEY, expertise);
        updateUrl(state.domain, expertise);
        return { expertise };
    }),
}));
