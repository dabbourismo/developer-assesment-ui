import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { environment } from 'src/app/environments/environments';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  messageReceived = new EventEmitter<string>();
  public connectionId!: string;
  private hubConnection!: signalR.HubConnection;
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.notificationAddress, { accessTokenFactory: () => localStorage['jwt'] })
      .build();
    this.hubConnection
      .start()
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  public onRecieveServerNotification() {
    this.hubConnection.on('ReceiveNotification', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
  public stopConnection() {
    this.hubConnection.off("ReceiveNotification");
    this.hubConnection.stop();
  }
  private getConnectionId = () => {
    this.hubConnection.invoke('getUserId')
      .then((data) => {
        this.connectionId = data;
      });
  }
  constructor() { }
}
