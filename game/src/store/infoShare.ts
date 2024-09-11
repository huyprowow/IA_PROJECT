import { create } from "zustand";
type infoShareState = {
    infoShare: any;
    setInfoShare: (infoShare: any) => void;
};
export const useInfoShareStore = create<infoShareState>((set) => ({
  infoShare: {
    shareSetting: "",
    shareConstraints: "",
  },
  setInfoShare: (infoShare: any) => set({ infoShare }),
}));
