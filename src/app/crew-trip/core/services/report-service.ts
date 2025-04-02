import {Injectable, model} from '@angular/core';
import {firstValueFrom, Observable, of} from 'rxjs';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';

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
    const url = `${this.api}/${this.path}?viewName=${reportCode}`;
    return firstValueFrom(this.http.get<any>(url));
  }
}
