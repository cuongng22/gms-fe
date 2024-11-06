import { Injectable, model } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class HotelService extends BaseService {
  private _isUpdate = false;
  constructor() {
    super();
    this.path = 'hotel';
  }

  checkCodeExist(code: string): Observable<any> {
    console.log('Request checkCodeExist');
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
