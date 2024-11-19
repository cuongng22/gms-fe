import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class InfoPlaneService extends BaseService{
  constructor() {
    super();
    this.path = 'plane';
  }

}
