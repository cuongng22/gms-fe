import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class AuthLogService extends BaseService {

  constructor() {
    super();
    this.path = 'authLog'
  }
}
