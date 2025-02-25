import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { removeNullValues } from '../../shared/utils/constant';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService extends BaseService {
    constructor() {
        super();
        this.path = 'currency';
    }

    getAllCurrencyCode(version: string, type: string) {
        const url = `${this.api}/${this.path}/code`;
        const params = new HttpParams({ fromObject: removeNullValues({ version: version, type: type }) });
        return firstValueFrom(this.http.get<any>(url, { params }));
    }

    getExchangeRateByCurrencyCode(currencyCode: string, version: string, type: string) {
        const url = `${this.api}/${this.path}/code/${currencyCode}`;
        const params = new HttpParams({ fromObject: removeNullValues({ version: version, type: type }) });
        return firstValueFrom(this.http.get<any>(url, { params }));
    }

}
