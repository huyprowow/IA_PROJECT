import { create } from "zustand";
type constraintsState = {
    constraints: any;
    setConstraints: (constraints: any) => void;
};
export const useConstraintsStore = create<constraintsState>((set) => ({
    constraints:{
            video: {
              width: {
                // min: 1280,
                ideal: 1920,
                max: 2560,
              },
              height: {
                // min: 720,
                ideal: 1080,
                max: 1440,
              },
              frameRate: {
                min: 10,
                ideal: 30,
                max: 60,
              },
              //mobile
              // facingMode:  "user" cam trc // "environment" cam sau
            },
            audio: {
              sampleSize: 16,
              channelCount: 2,
            },
          }
    ,
    setConstraints: (constraints: any) => set({ constraints }),
}));