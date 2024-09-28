import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {firstValueFrom} from "rxjs";
import { Response, User } from '../../features/users/users.model';
import { HttpParams } from '@angular/common/http';

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



  getUsers(body: any): Promise<Response<User>> {
    const url = `${this.api}/${this.path}/get-all`
    let params = new HttpParams({ fromObject: body })
    return firstValueFrom(this.http.get<Response<User>>(url, { params }));
  }
}
