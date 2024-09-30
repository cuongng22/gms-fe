import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {firstValueFrom} from "rxjs";
import { ResetPasswordRequest, Response, User } from '../../features/users/users.model';
import {UserLogin} from "src/app/crew-trip/shared/models/userInfo";
import {StorageService} from "src/app/crew-trip/core/services/storage.service";
import {STORAGE_KEY} from "src/app/crew-trip/core/constants/config";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {
  constructor(private storageService: StorageService) {
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

  getUserLogin(): UserLogin | null{
    var userInfo = this.storageService.get(STORAGE_KEY.USER_INFO);
    return userInfo ? UserLogin.fromObject(JSON.parse(userInfo)) : null;
  }

}
