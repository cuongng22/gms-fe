import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root',
})
export class WetLeaseService extends BaseService {
  constructor() {
    super();
    this.path = 'wet-lease';
  }
  exchangeRate(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/exchange-rate`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<any>(url, { params }));
  }
}
