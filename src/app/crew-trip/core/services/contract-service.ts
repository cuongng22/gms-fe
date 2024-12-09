import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {firstValueFrom} from 'rxjs';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Response, Role} from 'src/app/crew-trip/features/system/users/users.model';
import {response} from 'express';
import {DetailResponse, ListResponse} from "src/app/crew-trip/shared/models/common.model";
import {removeNullValues} from "src/app/crew-trip/shared/utils/constant";

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseService {
  constructor() {
    super();
    this.path = 'contract';
  }

  getPartnerInfo(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/get-partner-info`;
    const params = new HttpParams({fromObject: removeNullValues(body)});
    return firstValueFrom(this.http.get<any>(url, {params}));
  }

  getMarket(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/load-market`;
    const params = new HttpParams({fromObject: removeNullValues(body)});
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
    const params = new HttpParams({fromObject: removeNullValues(body)});
    return firstValueFrom(this.http.get<ListResponse<T>>(url, {params}));
  }

  override uploadFile(form: FormData): Promise<any> {
    const url = `${this.api}/${this.path}/attachment`;
    const headers = {
      headers: new HttpHeaders()
    };
    return firstValueFrom(this.http.post(url, form, headers));
  }

  deleteFile(fileName: any, bizDocId: any): Promise<any> {
    const url = `${this.api}/${this.path}/delete-attachment`;
    const params = new HttpParams({fromObject: {fileName: fileName, bizDocId: bizDocId}});
    return firstValueFrom(this.http.delete(url, {params}));
  }

  override create<T = any>(body: any): Promise<T> {
    const url = `${this.api}/${this.path}/appendix`;
    return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
  }
}
