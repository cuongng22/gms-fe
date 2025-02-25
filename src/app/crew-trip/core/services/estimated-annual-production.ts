import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class EstimatedAnnualProductionService extends BaseService {
  constructor() {
    super();
    this.path = 'productivity';
  }

  /**
   * Lấy danh sách version
   * @param type 1: Sản lượng plan, 0: sản lượng ước
   * @returns any
   */
  getVersion(type: number): Promise<any> {
    const url = `${this.api}/${this.path}/versions?type=${type}`;
    return firstValueFrom(this.http.get<any>(url));
  }

  getNewsVersion() {
    const url = `${this.api}/${this.path}/versions-and-year?type=P`;
    return firstValueFrom(this.http.get<any>(url));
  }
}
