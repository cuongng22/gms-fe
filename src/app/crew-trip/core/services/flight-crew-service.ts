import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {ListResponse} from "src/app/crew-trip/shared/models/common.model";
import {HttpParams} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FlightCrewService extends BaseService {
  constructor() {
    super();
    this.path = 'crew-flights';
  }

  getListFltNos<T = any>(): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}/flight-no`;
    return firstValueFrom(this.http.get<ListResponse<T>>(url, this.httpOptions));
  }
}
