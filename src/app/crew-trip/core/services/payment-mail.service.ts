import { Injectable, model } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import {HttpParams} from "@angular/common/http";
import {removeNullValues} from "src/app/crew-trip/shared/utils/constant";

@Injectable({
  providedIn: 'root'
})
export class PaymentMailService extends BaseService {
  constructor() {
    super();
    this.path = 'payment-mail';
  }

  getAirportEmail(marketCode: string): Promise<any> {
    const url = `${this.api}/${this.path}/market-email/${marketCode}`;
    const params = new HttpParams();
    return firstValueFrom(this.http.get<any>(url, {params}));
  }
}
