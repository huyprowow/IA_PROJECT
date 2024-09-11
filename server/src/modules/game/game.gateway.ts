import { Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ICustomSocket,
  IUserData,
} from 'src/shared/interfaces/CustomSocket.interface';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger: Logger = new Logger('MessageGateway');
  async afterInit(server: Server) {
    this.logger.log(server, 'Initialized!');
  }
  async handleConnection(client: ICustomSocket) {
    console.log(client.id, 'connected......');
    client.emit('player Connected', { id: client.id });
    client.userData = {
      model: undefined,
      x: 0,
      y: 0,
      z: 0,
    };
  }
  async handleDisconnect(client: ICustomSocket) {
    console.log(client.id, 'disconnected......');
    client.emit('player Disconnected', { id: client.id });
  }

  @SubscribeMessage('init')
  init(@ConnectedSocket() client: ICustomSocket, @MessageBody() data: any) {
    client.userData.model = data.model;
    client.userData.color = data.color;
    client.userData.name = data.name;
    client.userData.x = data.x;
    client.userData.y = data.y;
    client.userData.z = data.z;
    client.userData.action = data.action;
  }
  @SubscribeMessage('update')
  update(@ConnectedSocket() client: ICustomSocket, @MessageBody() data: any) {
    client.userData.model = data.model;
    client.userData.color = data.color;
    client.userData.name = data.name;
    client.userData.x = data.x;
    client.userData.y = data.y;
    client.userData.z = data.z;
    client.userData.action = data.action;
  }

  @Interval(40)
  updateRemoteData() {
    const pack: IUserData[] = [];
    this.logger.log('updateRemoteData');
    for (const id in this.server.sockets) {
      const socket: ICustomSocket = this.server.sockets[id];
      if (socket.userData.model !== undefined) {
        pack.push({
          id: socket.id,
          model: socket.userData.model,
          color: socket.userData.color,
          name: socket.userData.name,
          x: socket.userData.x,
          y: socket.userData.y,
          z: socket.userData.z,
          action: socket.userData.action,
        });
      }
    }
    this.server.emit('updateRemoteData', pack);
  }
}
