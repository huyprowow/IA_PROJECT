import { create } from "zustand";
type shareOptionsState = {
    shareOptions: any;
    setShareOptions: (shareOptions: any) => void;
};
export const useShareOptionsStore = create<shareOptionsState>((set) => ({
    shareOptions: {
            video: {
              cursor: "always",
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100,
            },
          }
    ,
    setShareOptions: (shareOptions: any) => set({ shareOptions }),
}));
