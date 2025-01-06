import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {DetailResponse, ListResponse} from "src/app/crew-trip/shared/models/common.model";
import {firstValueFrom} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NationService extends BaseService {
  constructor() {
    super();
    this.path = 'nation';
  }

  getAirportByNation<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/${body.id}`;
    const params = new HttpParams({ fromObject: {option:body.option} });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }
}
