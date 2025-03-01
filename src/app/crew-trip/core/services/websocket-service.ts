import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<string>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000;
  private username!: string;

  connect(username: string): void {
    this.username = username;
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    const wsUrl = `${environment.socketUrl}/notice-socket?username=${this.username}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.reconnectAttempts = 0; // Reset lại số lần thử kết nối
    };

    this.socket.onmessage = (event) => {
      console.log('Received message from server:', event.data);
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
      this.handleReconnect(); // Gọi hàm thử kết nối lại
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleReconnect(); // Gọi hàm thử kết nối lại
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay + Math.random() * 2000;
      console.log(`WebSocket reconnecting in ${delay / 1000} seconds...`);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, delay);
    } else {
      console.error('Max reconnect attempts reached. Stopping WebSocket reconnect.');
    }
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
