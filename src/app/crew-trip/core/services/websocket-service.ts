import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {Observable, Subject} from "rxjs";
import {environment} from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  // private socketUrl = environment.socketUrl;
  private socket!: WebSocket;
  private messageSubject = new Subject<string>();

  connect(username: string): void {
    const wsUrl = environment.socketUrl + `/notice-socket?username=${username}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    // Xử lý khi nhận message từ server
    this.socket.onmessage = (event) => {
      console.log('Received message from server:', event.data);
      this.messageSubject.next(event.data);
    };

    // Xử lý khi kết nối bị đóng
    this.socket.onclose = (event) => {
      console.log('WebSocket closed: ', event);
    };

    // Xử lý khi có lỗi
    this.socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open.');
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
