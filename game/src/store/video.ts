import { create } from "zustand";
type videoDevicesState = {
    videoDevices: MediaDeviceInfo[];
    setVideoDevices: (videoDevices: MediaDeviceInfo[]) => void;
};
export const useVideoDevicesStore = create<videoDevicesState>((set) => ({
    videoDevices: [],
    setVideoDevices: (videoDevices: MediaDeviceInfo[]) => set({ videoDevices }),
}));