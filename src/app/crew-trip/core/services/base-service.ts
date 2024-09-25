import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionAlertComponent} from "src/app/crew-trip/shared/action-alert/action-alert.component";
import {environment} from 'src/environments/environment';

fetch(environment.apiUrl);

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  api = environment.apiUrl;
  path = '';
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  constructor() {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  search(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/tra-cuu`
    // const url = `http://192.168.1.80:8888/qlnv-hang/kh-cn-bq/tra-cuu`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  create(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/them-moi`
    // const url = `http://192.168.1.80:8888/qlnv-hang/kh-cn-bq/tra-cuu`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  update(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/cap-nhat`
    // const url = `http://192.168.1.80:8888/qlnv-hang/kh-cn-bq/tra-cuu`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  delete(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/xoa`
    // const url = `http://192.168.1.80:8888/qlnv-hang/kh-cn-bq/tra-cuu`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  showNotification(message: string, options: any) {
    this.snackBar.openFromComponent(ActionAlertComponent, options);
  }

  showSuccess(message: string) {
    this.showNotification(message, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: {type: 'success', message: message}
    })
  }

  showError(message: string) {
    this.showNotification(message, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: {type: 'error', message: message}
    })
  }

  getAll(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/get-all`
    let params = new HttpParams({fromObject: body})
    return firstValueFrom(this.http.get<any>(url, {params}));
  }

  detail(id: any): Promise<any> {
    const url = `${this.api}/${this.path}/${id}`
    return firstValueFrom(this.http.get<any>(url));
  }
}
