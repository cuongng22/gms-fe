import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { firstValueFrom, Observable } from "rxjs";

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

    versions(): Promise<any> {
        const url = `${this.api}/${this.path}/versions`;
        return firstValueFrom(this.http.get<any>(url, this.httpOptions));
    }

    reject<T = any>(id: any): Promise<T> {
        const url = `${this.api}/${this.path}/${id}`;
        return firstValueFrom(this.http.put<T>(url, this.httpOptions));
    }

    summary<T = any>(id: any): Promise<T> {
        const url = `${this.api}/${this.path}/summary/${id}`;
        return firstValueFrom(this.http.get<T>(url, this.httpOptions));
    }
}