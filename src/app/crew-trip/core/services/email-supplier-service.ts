import { Injectable, model } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { DetailResponse, ListResponse } from '../../shared/models/common.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailSupplierService extends BaseService {
  private _isUpdate = false;
  constructor() {
    super();
    this.path = 'email-config';
  }

  content<T = any>(body: any): Promise<DetailResponse<T> | any> {
    const url = `${this.api}/${this.path}/content`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }
}
