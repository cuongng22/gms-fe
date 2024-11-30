import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionAlertComponent } from 'src/app/crew-trip/shared/action-alert/action-alert.component';
import { environment } from 'src/environments/environment';
import { DetailResponse, ListResponse } from '../../shared/models/common.model';

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

  search<T = any>(body: any): Promise<ListResponse<T> | any> {
    const url = `${this.api}/${this.path}`;
    const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<ListResponse<T>>(url, { params }));
  }

  detail<T = any>(id: any): Promise<DetailResponse<T> | any> {
    const url = `${this.api}/${this.path}/${id}`;
    return firstValueFrom(this.http.get<DetailResponse<T>>(url, this.httpOptions));
  }

  create<T = any>(body: any): Promise<T> {
    const url = `${this.api}/${this.path}`;
    return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
  }

  update<T = any>(body: any): Promise<T> {
    const url = `${this.api}/${this.path}/${body.id}`;
    return firstValueFrom(this.http.put<T>(url, body, this.httpOptions));
  }

  async exportData(body?: any, sourcePath?: string): Promise<{ blob: Blob, fileName: string }> {
    const url = `${this.api}/${this.path}/${sourcePath ?? 'export'}`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as 'json',
      params: new HttpParams({ fromObject: body })
    };
    const response = await firstValueFrom(this.http.get(url, { ...httpOptionsExport, observe: 'response' }));
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = 'downloaded-file.xlsx';
    if (contentDisposition) {
      const matches = /filename=([^"]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1];
      }
    }
    return { blob: response.body as Blob, fileName };
  }

  async exportDataOptions(body?: any, sourcePath?: string): Promise<{ blob: Blob, fileName: string }> {
    let url = `${this.api}/${this.path}/${sourcePath ?? ''}`;
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      }),
      responseType: 'blob' as 'json',
      params: new HttpParams({ fromObject: body })
    };
    const response = await firstValueFrom(this.http.get(url, { ...httpOptionsExport, observe: 'response' }));
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = 'downloaded-file.xlsx';
    if (contentDisposition) {
      const matches = /filename=([^"]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1];
      }
    }
    return { blob: response.body as Blob, fileName };
  }


  async download(): Promise<Blob> {
    return (await this.exportData('download')).blob;
  }


  delete<T = any>(id: any): Promise<T> {
    const url = `${this.api}/${this.path}/${id}`;
    return firstValueFrom(this.http.delete<T>(url, this.httpOptions));
  }

  async uploadFile(form: FormData): Promise<{ blob: Blob, fileName: string, totalErrors: string }> {
    const url = `${this.api}/${this.path}/import`;
    const httpOptionsExport = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream',
        'mimeType': 'multipart/form-data'
      }),
      responseType: 'blob' as 'json'
    };

    const response = await firstValueFrom(this.http.post(url, form, { ...httpOptionsExport, observe: 'response' }));
    const contentDisposition = response.headers.get('Content-Disposition');
    const totalErrors = response.headers.get('totalErrors');
    let fileName = 'error-file.xlsx';
    if (contentDisposition) {
      const matches = /filename=([^"]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1];
      }
    }
    return { blob: response.body as Blob, fileName, totalErrors: totalErrors ?? '' };
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
      });
    }
  }

  showError(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'error', message: message }
      });
    }
  }

  showWarning(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'warning', message: message }
      });
    }
  }

  showInfo(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'info', message: message }
      });
    }
  }
}
