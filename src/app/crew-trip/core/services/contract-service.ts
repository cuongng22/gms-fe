import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, of, throwError} from 'rxjs';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {environment} from 'src/environments/environment';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class ContractService extends BaseService {
  baseUrl = environment.baseUrl;

  constructor() {
    super();
    this.path = 'contract';
  }

  getPartnerInfo(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/get-partner-info`;
    const params = new HttpParams({fromObject: removeNullValues(body)});
    return firstValueFrom(this.http.get<any>(url, {params}));
  }

  async getMarket(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/load-market`;
    const params = new HttpParams({fromObject: removeNullValues(body)});
    return firstValueFrom(
      this.http.get<any>(url, {params}).pipe(catchError(e => of(e)))
    );
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
    const url = `${this.baseUrl}/api/${this.path}/attachment`;
    const headers = {
      headers: new HttpHeaders(),
    };
    return firstValueFrom(this.http.post(url, form, headers));
  }

  deleteFile(fileName: any, bizDocId: any, documentId: number): Promise<any> {
    // const url = `${this.api}/${this.path}/delete-attachment`;
    const url = `${this.baseUrl}/api/${this.path}/delete-attachment`;
    const params = new HttpParams({
      fromObject: {fileName: fileName, bizDocId: bizDocId, documentId},
    });
    return firstValueFrom(this.http.delete(url, {params}));
  }

  override create<T = any>(body: any): Promise<T> {
    const url = `${this.api}/${this.path}/appendix`;
    return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
  }

  export(body: any) {
    const url = `${this.api}/${this.path}`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/octet-stream',
      }),
      responseType: 'blob' as 'json',
      params: new HttpParams({fromObject: body}),
    };
    return firstValueFrom(this.http.get<any>(url, httpOptionsExport));
  }

  override delete<T = any>(id: any): Promise<T> {
    const url = `${this.api}/${this.path}/appendix/${id}`;
    return firstValueFrom(this.http.delete<T>(url, this.httpOptions));
  }
}
