import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {firstValueFrom} from 'rxjs';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {DetailResponse} from "src/app/crew-trip/shared/models/common.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceActualCostService extends BaseService {
  constructor() {
    super();
    this.path = 'invoice/actual-cost';
  }

}
