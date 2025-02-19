import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";

@Injectable({
    providedIn: 'root'
})

export class ProcurementTrackingService extends BaseService {
    constructor() {
        super();
        this.path = 'procurement';
    }
}