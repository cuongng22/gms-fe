import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { firstValueFrom, Observable } from "rxjs";
import { bo } from "node_modules/@fullcalendar/core/internal-common";
import { DataSummayRequest } from "../../features/plan/budget-procurement/budget-procurement-summary/budget-procurement-summary-detail/budget-procurement-summary-detail.model";

@Injectable({
    providedIn: 'root'
})
export class PlanBudgetProcurementService extends BaseService {

    private _isUpdate = false;
    constructor() {
        super();
        this.path = 'plan-budget-procurement';
    }

    set isUpdate(value: boolean) {
        this._isUpdate = value;
    }

    get isUpdate(): boolean {
        return this._isUpdate;
    }

    versions(type:string): Promise<any> {
        const url = `${this.api}/${this.path}/versions?type=${type}`;
        return firstValueFrom(this.http.get<any>(url, this.httpOptions));
    }

    updateStatus<T = any>(body: any): Promise<T> {
        const url = `${this.api}/${this.path}/update-status`;
        return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
    }

    summaryUpdateStatus<T = any>(body: any): Promise<T> {
        const url = `${this.api}/${this.path}/summary/update-status`;
        return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
    }

    summarySearch<T = any>(body: any): Promise<T> {
        const url = `${this.api}/${this.path}/summary/search`;
        return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
    }

    getDetailSummary<T = any>(id: number): Promise<T> {
        const url = `${this.api}/${this.path}/summary/${id}`;
        return firstValueFrom(this.http.get<T>(url, this.httpOptions));
    }

    dataSummary<T = any>(body: any): Promise<T> {
        const url = `${this.api}/${this.path}/summary`;
        return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
    }

    save(body: any): Promise<any> {
        const url = `${this.api}/${this.path}/summary/create`;
        return firstValueFrom(this.http.post(url, body, this.httpOptions));
    }
    summaryUpdateStatusMulti<T = any>(body: any): Promise<T> {
        const url = `${this.api}/${this.path}/summary/update-status-multi`;
        return firstValueFrom(this.http.post<T>(url, body, this.httpOptions));
    }

    summaryDelete<T = any>(id: any): Promise<T> {
        const url = `${this.api}/${this.path}/summary/${id}`;
        return firstValueFrom(this.http.delete<T>(url, this.httpOptions));
    }
}