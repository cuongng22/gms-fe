import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {firstValueFrom} from 'rxjs';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {DetailResponse} from "src/app/crew-trip/shared/models/common.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceDocumentService extends BaseService {
  constructor() {
    super();
    this.path = 'invoice/document';
  }

  async exportFileData(body: any) {
    const url = `${this.api}/${this.path}/export`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as any,
      params: new HttpParams({fromObject: body})
    };
    return firstValueFrom(this.http.get<Blob>(url, httpOptionsExport));
  }

  async uploadFileData(form: FormData): Promise<any> {
    const url = `${this.api}/${this.path}/upload`;
    const headers = {
      headers: new HttpHeaders()
    };
    return firstValueFrom(this.http.post(url, form, headers));
  }

  getPartnerInfo(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/get-partner-info`;
    const params = new HttpParams({fromObject: removeNullValues(body)});
    return firstValueFrom(this.http.get<any>(url, {params}));
  }

  getContractByAirport(value: any): Promise<any> {
    const url = `${this.api}/invoice/common/contract-by-airport/${value}`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  listMaNghiepVu(): Promise<any> {
    const url = `${this.api}/${this.path}/list-ma-nghiep-vu`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  listKhoanMucKhns(): Promise<any> {
    const url = `${this.api}/${this.path}/list-khoan-muc-KHNS`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  export(body: any) {
    const url = `${this.api}/${this.path}`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as 'json',
      params: new HttpParams({fromObject: body})
    };
    return firstValueFrom(this.http.get<any>(url, httpOptionsExport));

  }

  async getFileData(body: any) {
    const url = `${this.api}/invoice/common/get-file`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as any,
      params:new HttpParams({fromObject: removeNullValues(body)})
    };
    return firstValueFrom(this.http.get<Blob>(url, httpOptionsExport));
  }

  async uploadFileCommon(form: FormData): Promise<any> {
    const url = `${this.api}/invoice/common/upload`;
    const headers = {
      headers: new HttpHeaders()
    };
    return firstValueFrom(this.http.post(url, form, headers));
  }
}
