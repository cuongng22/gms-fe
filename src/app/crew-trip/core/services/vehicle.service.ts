import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { firstValueFrom, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseService {
  private _isUpdate: boolean = false;
  constructor() {
    super();
    this.path = 'vehicles';
  }

  checkCodeExist(code: string): Observable<any> {
    const url = `${this.api}/${this.path}/check-code-exist?code=${code}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  set isUpdate(value: boolean) {
    this._isUpdate = value;
  }

  get isUpdate(): boolean {
    return this._isUpdate;
  }
}