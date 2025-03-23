import {Injectable, model} from '@angular/core';
import {firstValueFrom, Observable, of} from 'rxjs';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {HttpParams} from "@angular/common/http";
import {removeNullValues} from "src/app/crew-trip/shared/utils/constant";

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  private _isUpdate = false;

  constructor() {
    super();
    this.path = 'report';
  }

  getReportLink(reportCode: string) {
    const url = `${this.api}/${this.path}/viewName=${reportCode}`;
    return firstValueFrom(this.http.get<any>(url));
  }
}
