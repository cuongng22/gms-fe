import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class ConfigOvernightRateService extends BaseService {
  constructor() {
    super();
    this.path = 'overnight-rate';
  }
}
