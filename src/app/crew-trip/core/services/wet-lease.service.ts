import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root',
})
export class WetLeaseService extends BaseService {
  constructor() {
    super();
    this.path = 'wet-lease';
  }
}
