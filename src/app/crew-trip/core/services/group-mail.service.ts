import { Injectable, model } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { DetailResponse, ListResponse } from '../../shared/models/common.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupMailService extends BaseService {
  constructor() {
    super();
    this.path = 'group-mail';
  }
  getEmails<T = any>(marketCode: string): Promise<DetailResponse<T> | any> {
    const url = `${this.api}/${this.path}/get-emails`;
    const params = new HttpParams({ fromObject: { marketCode: marketCode } });
    return firstValueFrom(this.http.get<DetailResponse<T>>(url, { params }));
  }
}
