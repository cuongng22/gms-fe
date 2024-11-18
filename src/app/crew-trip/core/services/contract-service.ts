import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {firstValueFrom} from 'rxjs';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Response, Role} from 'src/app/crew-trip/features/system/users/users.model';
import {response} from 'express';
import {ListResponse} from "src/app/crew-trip/shared/models/common.model";

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseService {
  constructor() {
    super();
    this.path = 'contract';
  }

  getPartnerInfo(): Promise<any> {
    const url = `${this.api}/${this.path}/get-partner-info`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  getMarket(): Promise<any> {
    const url = `${this.api}/${this.path}/load-market`;
    const params = new HttpParams({fromObject: {marketCode: 'CBP'}});
    return firstValueFrom(this.http.get<any>(url, {params}));
  }

  override uploadFile(form: FormData): Promise<any> {
    const url = `${this.api}/${this.path}/attachment`;
    const headers = {
      headers: new HttpHeaders()
    };
    return firstValueFrom(this.http.post(url, form, headers));
  }
}
