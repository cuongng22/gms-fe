import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaymentMailService extends BaseService {
  constructor() {
    super();
    this.path = 'payment-mail';
  }

  getAirportEmail(marketCode: string, type?: string): Promise<any> {
    const url = `${this.api}/${this.path}/market-email/${marketCode}`;
    const params = new HttpParams().set('type', type ?? 'HOTEL');
    return firstValueFrom(this.http.get<any>(url, {params}));
  }
}
