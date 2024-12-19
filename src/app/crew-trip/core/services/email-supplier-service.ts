import { Injectable, model } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class EmailSupplierService extends BaseService {
  private _isUpdate = false;
  constructor() {
    super();
    this.path = 'email-config';
  }
}
