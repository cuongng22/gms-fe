import { Injectable, model } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseService } from "src/app/crew-trip/core/services/base-service";

@Injectable({
  providedIn: 'root'
})
export class GroupMailService extends BaseService {
  constructor() {
    super();
    this.path = 'group-mail';
  }

}
