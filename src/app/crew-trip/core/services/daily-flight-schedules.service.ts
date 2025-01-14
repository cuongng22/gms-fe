import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class DailyFlightSchedulesService extends BaseService{

  constructor() {
    super();
    this.path = 'daily-flight-schedule';
  }
}
