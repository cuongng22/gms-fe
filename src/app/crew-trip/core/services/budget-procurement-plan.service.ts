import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetProcurementPlanService extends BaseService {
  private _isUpdate = false;
  set isUpdate(value: boolean) {
    this._isUpdate = value;
  }

  get isUpdate(): boolean {
    return this._isUpdate;
  }

  constructor() {
    super();
    this.path = 'plan-budget-shopping';
  }

  reject<T = any>(id: any): Promise<T> {
    const url = `${this.api}/${this.path}/${id}`;
    return firstValueFrom(this.http.put<T>(url, this.httpOptions));
  }

  checkVersionExists(code: string): Observable<any> {
    const url = `${this.api}/${this.path}/check-code-exist?code=${code}`;
    return this.http.get<any>(url, this.httpOptions);
  }

}
