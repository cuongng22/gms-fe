import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {firstValueFrom} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  constructor() {
    super();
    this.path = 'roles';
  }

  override search(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/roles-list`
    let params = new HttpParams({fromObject: body})
    return firstValueFrom(this.http.get<any>(url, {params}));
  }

  override create(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/roles-add`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  override update(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/role-update/${body.id}`
    return firstValueFrom(this.http.put<any>(url, body, this.httpOptions));
  }

  override detail(id: any): Promise<any> {
    const url = `${this.api}/${this.path}/roles-function-view/${id}`
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  addFunction(id: any, body: any): Promise<any> {
    const url = `${this.api}/${this.path}/roles-function-add/${id}`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }
}
