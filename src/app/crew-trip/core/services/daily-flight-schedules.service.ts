import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { DetailResponse, ListResponse } from '../../shared/models/common.model';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyFlightSchedulesService extends BaseService {
  // api/daily-flight-schedule/flight-crew-detail?flightId=1305095&timeZone=Asia/Ho_Chi_Minh
  constructor() {
    super();
    this.path = 'daily-flight-schedule';
  }


  flightCrewDetail<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/flight-crew-detail`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }

  override search<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/plan`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }

  async exportInMonth(body: any): Promise<{ blob: Blob, fileName: string }> {
    const url = `${this.api}/${this.path}/in-month/export`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as 'json',
      params: new HttpParams({ fromObject: body })
    };
    const response = await firstValueFrom(this.http.get(url, { ...httpOptionsExport, observe: 'response' }));
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = 'downloaded-file.xlsx';
    if (contentDisposition) {
      const matches = /filename=([^"]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1];
      }
    }
    return { blob: response.body as Blob, fileName };
  }

  searchInMonth<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/in-month`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }


  searchExtraCrews<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/list-extra-crews`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }


  flightsList<T = any>(body: any): Promise<DetailResponse<T> | any> {
    const url = `${this.api}/${this.path}/flights-list`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<DetailResponse<T>>(url, { params }));
  }

  createExtraCrews<T = any>(body: any): Promise<T> {
    const url = `${this.api}/${this.path}/create-extra-crews`;
    return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
  }
  updateCrewsExtra<T = any>(body: any): Promise<T> {
    const url = `${this.api}/${this.path}/update-crews-extra`;
    return firstValueFrom(this.http.put<T>(url, body, this.httpOptions));
  }
  deleteCrewsExtra<T = any>(body: any): Promise<T> {
    const params = new HttpParams({ fromObject: body });
    const url = `${this.api}/${this.path}/delete-crews-extra`;
    return firstValueFrom(this.http.delete<T>(url, { params, ...this.httpOptions }));
  }


  searchFlightNonOvernight<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/flight-non-overnight`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }

  updateNonOvernight<T = any>(body: any[]): Promise<T> {
    const url = `${this.api}/${this.path}/update-non-overnight`;
    return firstValueFrom(this.http.put<T>(url, body, this.httpOptions));
  }
}
