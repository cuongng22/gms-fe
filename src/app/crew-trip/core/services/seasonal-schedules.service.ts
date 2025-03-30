import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { ListResponse } from '../../shared/models/common.model';

@Injectable({
    providedIn: 'root'
})
export class SeasonalSchedulesService extends BaseService {
    constructor() {
        super();
        this.path = 'season-flight';
    }

    override async exportData(body?: any): Promise<{ blob: Blob, fileName: string }> {
        const url = `${this.api}/${this.path}`;
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
    synchronize(body: any) {
        const url = `${this.api}/${this.path}/synchronize`;
        const params = new HttpParams({ fromObject: body });
        return firstValueFrom(this.http.get<any>(url, { params }));
    }
}