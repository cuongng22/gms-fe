import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {firstValueFrom} from 'rxjs';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Response, Role} from 'src/app/crew-trip/features/system/users/users.model';
import {response} from 'express';
import {DetailResponse, ListResponse} from "src/app/crew-trip/shared/models/common.model";

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

  listMaNghiepVu(): Promise<any> {
    const url = `${this.api}/${this.path}/list-ma-nghiep-vu`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  listKhoanMucKhns(): Promise<any> {
    const url = `${this.api}/${this.path}/list-khoan-muc-KHNS`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }


  getListAnnex<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/appendix`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }

  override uploadFile(form: FormData): Promise<any> {
    const url = `${this.api}/${this.path}/attachment`;
    const headers = {
      headers: new HttpHeaders()
    };
    return firstValueFrom(this.http.post(url, form, headers));
  }


}
