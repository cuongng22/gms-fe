import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionAlertComponent} from "src/app/crew-trip/shared/action-alert/action-alert.component";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  api = 'http://192.168.1.80:8888/qlnv-hang';
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
}
