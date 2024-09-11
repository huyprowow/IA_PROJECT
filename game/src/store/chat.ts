import { usersTyping } from './../service/socket/chat/chat';
import { create } from "zustand";
type chatState = {
  chats: IChat[];
  setChatInRoom: (chats: IChat[]) => void;
};
export const useChatStore = create<chatState>((set) => ({
  chats: [],
  setChatInRoom: (chats: IChat[]) => set({ chats }),
}));
