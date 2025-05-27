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
  getVersion(type: number, year: any): Promise<any> {
    const url = `${this.api}/${this.path}/versions`;
    const params = { year: year, type: type };
    return firstValueFrom(this.http.get<any>(url, { params }));
  }

  /**
   * 
   * @param type P: kế hoạch ngân sách, E: ước thực hiện
   * @returns 
   */
  getNewsVersion(type: string) {
    const url = `${this.api}/${this.path}/versions-and-year?type=${type}`;
    return firstValueFrom(this.http.get<any>(url));
  }

  sync(): Promise<any> {
    const url = `${this.api}/${this.path}/sync`;
    // const params = new HttpParams({ fromObject: body });
    return firstValueFrom(this.http.get<any>(url));
  }

  listYear(): Promise<any> {
    const url = `${this.api}/${this.path}/list-years?type=0`;
    return firstValueFrom(this.http.get<any>(url));
  }
}
