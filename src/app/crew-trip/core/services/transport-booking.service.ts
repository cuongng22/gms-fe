import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransportBookingService extends BaseService {
  constructor() {
    super();
    this.path = 'aves/transport-tracking';
  }
}
