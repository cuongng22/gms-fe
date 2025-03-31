import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class EmailHistoryService extends BaseService {

  constructor() {
    super();
    this.path = 'email-history';
  }
}
