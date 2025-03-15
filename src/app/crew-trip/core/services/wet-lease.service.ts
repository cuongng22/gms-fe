import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root',
})
export class WetLeaseService extends BaseService {
  constructor() {
    super();
    this.path = 'wet-lease';
  }
  private readonly exchangeRateSubject = new Subject<any>();
  exchangeRate$ = this.exchangeRateSubject.pipe(debounceTime(1000));

  private readonly rateVatSubject = new Subject<any>();
  rateVat$ = this.rateVatSubject.pipe(debounceTime(1000));

  private readonly roomPriceSubject = new Subject<any>();
  roomPrice$ = this.roomPriceSubject.pipe(debounceTime(1000));

  private readonly unitPriceTransportationSubject = new Subject<any>();
  unitPriceTransportation$ = this.unitPriceTransportationSubject.pipe(debounceTime(1000));


  exchangeRate(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/exchange-rate`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

  exchangeRateChange(data: any) {
    this.exchangeRateSubject.next(data);
  }

  rateVatChange(data: any) {
    this.rateVatSubject.next(data);
  }

  roomPriceChange(data: any) {
    this.roomPriceSubject.next(data);
  }

  unitPriceTransportationChange(data: any) {
    this.unitPriceTransportationSubject.next(data);
  }
}
