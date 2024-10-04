import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActionAlertComponent } from "src/app/crew-trip/shared/action-alert/action-alert.component";
import { environment } from 'src/environments/environment';

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
    const url = `${this.api}/${this.path}`
    let params = new HttpParams({ fromObject: body })
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

  detail(id: any): Promise<any> {
    const url = `${this.api}/${this.path}/${id}`
    return firstValueFrom(this.http.get<any>(url, this.httpOptions));
  }

  create(body: any): Promise<any> {
    const url = `${this.api}/${this.path}`
    return firstValueFrom(this.http.post<any>(url, body, this.httpOptions));
  }

  update(body: any): Promise<any> {
    const url = `${this.api}/${this.path}/${body.id}`
    return firstValueFrom(this.http.put<any>(url, body, this.httpOptions));
  }

  async exportData(sourcePath?: string): Promise<Blob> {
    const url = `${this.api}/${this.path}/${sourcePath ?? 'export'}`
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as 'json'
    };
    return await firstValueFrom(this.http.get<Blob>(url, httpOptionsExport));
  }

  async download(): Promise<Blob> {
    return this.exportData('download');
  }


  delete(id: any): Promise<any> {
    const url = `${this.api}/${this.path}/${id}`
    return firstValueFrom(this.http.delete<any>(url, this.httpOptions));
  }

  showNotification(message: string, options: any) {
    this.snackBar.openFromComponent(ActionAlertComponent, options);
  }

  showSuccess(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'success', message: message }
      })
    }
  }

  showError(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'error', message: message }
      })
    }
  }

  showWarning(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'warning', message: message }
      })
    }
  }

  showInfo(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'info', message: message }
      })
    }
  }
}
