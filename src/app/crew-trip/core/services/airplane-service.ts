import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class AirplaneService extends BaseService {

  constructor() {
    super();
    this.path = 'airplane';
  }

  /**
     * 
     * @param type AC_TYPE, AC_GROUP
     * @returns 
     */
  listAirplanes(type: string): Promise<any> {
    const url = `${this.api}/${this.path}/list-airplane?type=${type}`;
    return firstValueFrom(this.http.get<any>(url));
  }
}