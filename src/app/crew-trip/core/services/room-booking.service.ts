import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomBookingService extends BaseService {
  constructor() {
    super();
    this.path = 'aves/room-tracking';
  }

  async getFile(filePath: string): Promise<any> {
    const url = `${environment.baseUrl}/source/${filePath}`;
    return url;
  }

}
