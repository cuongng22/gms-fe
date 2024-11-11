import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {firstValueFrom} from 'rxjs';
import { ResetPasswordRequest, Response, User } from 'src/app/crew-trip/features/system/users/users.model';
import {UserLogin} from 'src/app/crew-trip/shared/models/userInfo';
import {StorageService} from 'src/app/crew-trip/core/services/storage.service';
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {
  constructor(private storageService: StorageService) {
    super();
    this.path = 'user';
  }

  login(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/auth/login`;
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  forgotPassword(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/auth/request-reset-password`;
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  forgotResetPassword(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/auth/reset-password`;
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  logout() {
    localStorage.clear();
  }

  override update(body: any, resourcePath?: string): Promise<any> {
    const url = `${this.api}/${this.path}/${resourcePath ?? ''}/${body.id}`;
    return firstValueFrom(this.http.put<any>(url, body, this.httpOptions));
  }

  resetPassword(body: ResetPasswordRequest): Promise<any> {
    const url = `${this.api}/${this.path}/auth/reset-password`;
    return firstValueFrom(this.http.put<any>(url, body, this.httpOptions));
  }

  changePassword(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/auth/self-reset-password`;
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  getUserLogin(): UserLogin | null{
    const userInfo = this.storageService.get(STORAGE_KEY.USER_INFO);
    console.log('userInfouserInfo:',userInfo);
    return userInfo ? UserLogin.fromObject(JSON.parse(userInfo)) : null;
  }

  override create(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/auth/register`;
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  override search(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/get-all`;
    const params = new HttpParams({fromObject: body});
    return firstValueFrom(this.http.get<any>(url, {params}));
  }


  getUserById(id: any): Promise<any> {
    const url = `${this.api}/${this.path}/${id}`;
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  uploadAvatar(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/upload-avatar`;
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

}
