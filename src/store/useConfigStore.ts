import { create } from 'zustand';

export type ConfigType = 'dev' | 'sa';

interface ConfigState {
  configType: ConfigType;
  setConfigType: (type: ConfigType) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  configType: 'dev',
  setConfigType: (type) => set({ configType: type }),
}));
