import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  constructor() {
    super();
    this.path = 'roles';
  }

}
