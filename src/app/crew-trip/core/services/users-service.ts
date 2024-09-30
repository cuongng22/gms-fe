import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {firstValueFrom} from "rxjs";
import { HttpParams } from '@angular/common/http';
import { ResetPasswordRequest, Response, User } from '../../features/users/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {
  constructor() {
    super();
    this.path = 'user';
  }

  login(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/auth/login`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  logout() {
    localStorage.clear();
  }

  override update(body: any, resourcePath?: string): Promise<any> {
    const url = `${this.api}/${this.path}/${resourcePath ?? ''}`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  resetPassword(body: ResetPasswordRequest): Promise<any> {
    const url = `${this.api}/${this.path}/auth/reset-password`
    return firstValueFrom(this.http.put<any>(url, body, this.httpOptions));
  }

}
