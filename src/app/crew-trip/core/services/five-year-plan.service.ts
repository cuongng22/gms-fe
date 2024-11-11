import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiveYearPlanService extends BaseService {
  constructor() {
    super();
    this.path = 'five-year-plan';
  }

  export(body: any) {
    const url = `${this.api}/${this.path}`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as 'json',
      params: new HttpParams({ fromObject: body })
    };
    return firstValueFrom(this.http.get<any>(url, httpOptionsExport));

  }
}
