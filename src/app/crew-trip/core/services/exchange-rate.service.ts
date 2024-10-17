import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {HttpParams} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService extends BaseService {
  constructor() {
    super();
    this.path = 'currency';
  }

  actSearch(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/actual`
    let params = new HttpParams({ fromObject: body })
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

  actDetail(curCode: any): Promise<any> {
    const url = `${this.api}/${this.path}/actual/get-code?curCode=${curCode}`
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  uthSearch(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/uth`
    let params = new HttpParams({ fromObject: body })
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

}
