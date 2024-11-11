import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService extends BaseService {
  constructor() {
    super();
    this.path = 'currency';
  }

  actSearch(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/actual`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

  actDetail(curCode: any): Promise<any> {
    const url = `${this.api}/${this.path}/actual/get-code?curCode=${curCode}`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  uthSearch(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/uth`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

  getListVersion(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/versions`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<any>(url, { params }));
  }


  async uploadFileUTH(form: FormData): Promise<{ blob: Blob, fileName: string, totalErrors: string }> {
    const url = `${this.api}/${this.path}/uth/import`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream',
        'mimeType': 'multipart/form-data'
      }),
      responseType: 'blob' as 'json'
    };
    const response = await firstValueFrom(this.http.post(url, form, { ...httpOptionsExport, observe: 'response' }));
    const contentDisposition = response.headers.get('Content-Disposition');
    const totalErrors = response.headers.get('totalErrors');
    let fileName = 'error-file.xlsx';
    if (contentDisposition) {
      const matches = /filename=([^"]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1];
      }
    }
    return { blob: response.body as Blob, fileName, totalErrors: totalErrors ?? '' };
  }

}
