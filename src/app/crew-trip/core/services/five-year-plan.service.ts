import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";

@Injectable({
  providedIn: 'root'
})
export class FiveYearPlanService extends BaseService {
  constructor() {
    super();
    this.path = 'five-year-plan';
  }
}
