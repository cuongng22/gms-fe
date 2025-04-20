import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
    providedIn: 'root'
})
export class EmailTrackingService extends BaseService {
    constructor() {
        super();
        this.path = 'email';
    }

    override  async uploadFile(form: FormData): Promise<any> {
        const url = `${this.api}/${this.path}/upload`;
        const httpOptionsExport = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/octet-stream',
                'mimeType': 'multipart/form-data'
            }),
            responseType: 'blob' as 'json'
        };

        const response = await firstValueFrom(this.http.post(url, form, { ...httpOptionsExport, observe: 'response' }));
        // const contentDisposition = response.headers.get('Content-Disposition');
        // const totalErrors = response.headers.get('totalErrors');
        // let fileName = 'error-file.xlsx';
        // if (contentDisposition) {
        //     const matches = /filename=([^"]*)/.exec(contentDisposition);
        //     if (matches != null && matches[1]) {
        //         fileName = matches[1];
        //     }
        // }
        // return { blob: response.body as Blob, fileName, totalErrors: totalErrors ?? '' };
        return response
    }
}
