import { Socket } from 'socket.io';

export interface IUserData {
  id?: string;
  model: string;
  color?: string;
  name?: string;
  x: number;
  y: number;
  z: number;
  action?: string;
}
export interface ICustomSocket extends Socket {
  userData: IUserData;
}
