import { create } from "zustand";
type audioDevicesState = {
  audioDevices: MediaDeviceInfo[];
  setAudioDevices: (audioDevices: MediaDeviceInfo[]) => void;
};
export const useAudioDevicesStore = create<audioDevicesState>((set) => ({
  audioDevices: [],
  setAudioDevices: (audioDevices: MediaDeviceInfo[]) => set({ audioDevices }),
}));
// import { combine } from 'zustand/middleware'

// type InitialState = { audioDevices: MediaDeviceInfo[]}
// type SetState = { setAudioDevices: (audioDevices: MediaDeviceInfo[]) => void}

// const audioDevicesState = create(
//   combine<InitialState, SetState>(
//     { audioDevices: [] },
//     (set) => ({ 
//         setAudioDevices: (audioDevices: MediaDeviceInfo[]) => set({ audioDevices })
//     })
//   ),
// )