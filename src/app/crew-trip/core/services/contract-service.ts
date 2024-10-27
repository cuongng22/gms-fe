import {Injectable} from '@angular/core';
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {firstValueFrom} from "rxjs";
import { HttpParams } from '@angular/common/http';
import { Response, Role } from 'src/app/crew-trip/features/system/users/users.model';
import {response} from "express";

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseService {
  constructor() {
    super();
    this.path = 'contract';
  }
}
