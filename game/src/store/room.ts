import { usersTyping } from './../service/socket/chat/chat';
import { create } from "zustand";
type roomState = {
  rooms: IRoom[];
  setRooms: (rooms: IRoom[]) => void;
  usersTyping: IUsersTyping;
  currentRoom: IRoom;
  setCurrentRoom: (currentRoom: IRoom) => void;
  setUsersTyping: (usersTyping: IUsersTyping) => void;
};

export const useRoomStore = create<roomState>((set) => ({
  rooms: [],
  setRooms: (rooms: IRoom[]) => set({ rooms }),
  currentRoom: {} as IRoom,
  setCurrentRoom: (currentRoom: IRoom) => set({ currentRoom }),
  usersTyping:{} as IUsersTyping,
  setUsersTyping: (usersTyping: IUsersTyping) => set({ usersTyping }),
}));
