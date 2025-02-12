import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomBookingService extends BaseService {
  constructor() {
    super();
    this.path = 'source';
  }

  async getFile(filePath: string): Promise<any> {
    const url = `${environment.baseUrl}/${this.path}/${filePath}`;
    return url;
  }
}
