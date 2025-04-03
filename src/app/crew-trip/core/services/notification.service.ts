import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  constructor() {
    super();
    this.path = 'notification'
  }

  maskAsRead(ids: any[]) {
    const url = `${this.api}/${this.path}`;
    return firstValueFrom(this.http.put(url, ids, this.httpOptions));
  }
}
