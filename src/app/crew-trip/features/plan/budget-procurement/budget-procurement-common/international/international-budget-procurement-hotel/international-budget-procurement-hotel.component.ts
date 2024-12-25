import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { checkChange, formula, getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './international-budget-procurement-hotel.model';
import { truncateDateUTC } from 'src/app/crew-trip/shared/utils/common';
import { DigitOnlyModule } from '@uiowa/digit-only';

@Component({
  selector: 'app-international-budget-procurement-hotel',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule],
  templateUrl: './international-budget-procurement-hotel.component.html',
  styleUrl: './international-budget-procurement-hotel.component.scss',
  providers: [DatePipe, DataTransformPipe]
})
export class InternationalBudgetProcurementHotelComponent implements OnInit, AfterViewChecked {
  dataTransformPipe = inject(DataTransformPipe);
  dataSource = new MatTableDataSource();
  periodRowspan = 0;
  aircraftTypeRowspan = 0;
  overnightRowspan = 0;
  periods: string[] = [];
  aircraftTypes: string[] = [];
  planFlightByOvernight: any[] = []; //tỉ lệ chuyến bay theo số đêm nghỉ
  planFlightPeriods: any[] = []; //Số chuyến bay theo giai đoạn

  generalData: any = {};
  totalByGroup: any = {};

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];

  yearPlan = input<number>(2024); // năm kế hoạch
  updateBudgetPlan = input<boolean | undefined>(false); //tích chọn check box Lập kế hoạch sản lượng thay đổi
  type = input<string>(''); // Loại Ngân sách hoặc mua sắm (budget/procurement)



  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  ngOnInit(): void {
  }

  setDataSource(data: any[], generalData?: any) {
    this.dataSource.data = [...data];
    this.generalData = { ...generalData };

    this.getRow();

    this.dataSource.data.forEach((item: any, index) => {
      let period = '';
      if (this.type() === 'PROCUREMENT') {
        period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      } else {
        period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      }
      item.period = period;
      if (!this.periods.includes(period)) {
        this.periods.push(period);
        item.periodLabel = period;
      }
      if (!this.aircraftTypes.includes(`${period}_${item.aircraftType}`)) {
        this.aircraftTypes.push(`${period}_${item.aircraftType}`)
        item.aircraftTypeLabel = item.aircraftType;
      }
      this.calculateData(item, index);
    });
  };

  calculateSpan(aircraftTypeRowspan: number, overnightRowspan: number) {
    this.periodRowspan = aircraftTypeRowspan * overnightRowspan;
    this.aircraftTypeRowspan = aircraftTypeRowspan;
    this.overnightRowspan = overnightRowspan;
  }

  setGeneralData(data: any) {
    const isChangeRateForSingle = checkChange(this.generalData.rateForSingle, data.rateForSingle);
    this.generalData = { ...data };
    if (isChangeRateForSingle) {
      this.dataSource.data.forEach((item: any, index) => {
        this.calculateData(item, index);
      });
    }
  }

  setOvernightRates(data: any, actionType: string, length?: number, planFlightByOvernight?: any[]) {
    let checkExists: boolean;
    switch (actionType) {
      case 'edit':
        // Kiểm tra xem đã tồn tại id của ngủ đêm nay chưa, nếu chưa chuyển sang thêm mới
        checkExists = this.dataSource.data.some((item: any, index) => item.overnightId == data.id);
        if (checkExists) {
          this.dataSource.data.forEach((item: any, index) => {
            if (item.overnightId === data.id) {
              item.overnight = Number(data.numberOfOverNight);
              item.flightOvernightRate = data.flightRate;
            }
            this.calculateData(item, index);
          });
        } else {
          // lấy id bản ghi cuối cùng để làm cơ sở ví trí thêm data
          if (planFlightByOvernight && planFlightByOvernight.length) {
            this.setPlanFlightByOvernight(planFlightByOvernight)
          }

          const overnightId = (this.dataSource.data[this.dataSource.data.length - 1] as any).overnightId;
          const dataProcessHotel = [...this.dataSource.data];
          for (let i = dataProcessHotel.length - 1; i >= 0; i--) {
            const dataHotel = (this.dataSource.data[i] as any);
            if (dataHotel.overnightId == overnightId) {
              dataProcessHotel.splice(i + 1, 0, {
                ...dataHotel,
                overnightId: data.id,
                overnight: Number(data.numberOfOverNight),
                flightOvernightRate: data.flightRate,
              });
              this.calculateData(dataProcessHotel[i + 1], i + 1);
            }
            this.calculateData(dataProcessHotel[i], i);
          }
          if (length) {
            this.calculateSpan(this.aircraftTypeRowspan, length);
          }
          this.dataSource.data = [...dataProcessHotel];
          console.log(this.dataSource.data);
          console.log('periodRowspan: ', this.periodRowspan);
          console.log('aircraftTypeRowspan: ', this.aircraftTypeRowspan);
          console.log('overnightRowspan: ', this.overnightRowspan)
        }

        break;
      case 'delete':
        if (planFlightByOvernight && planFlightByOvernight.length) {
          this.setPlanFlightByOvernight(planFlightByOvernight)
        }
        this.dataSource.data = [...this.dataSource.data.filter((itemFilter: any) => itemFilter.overnightId !== data.id)];
        if (length) {
          this.calculateSpan(this.aircraftTypeRowspan, length);
        }
        this.dataSource.data.forEach((item: any, index) => {
          this.calculateData(item, index);
        });
        break;
    }
  }

  setPlanFlightByOvernight(data: any[]) {
    this.planFlightByOvernight = [...data];
  }

  setPlanFlightPeriods(data: any[]) {
    this.planFlightPeriods = [...data];
  }

  /**
   * 
   * @param item Giá trị từng dòng của dataSource theo công thức
   */
  private calculateData(item: any, index: number) {

    if (this.type() === 'PROCUREMENT') {
      // thêm tỉ lệ chuyến bay nghỉ đêm
      item.flightOvernightRate = this.planFlightByOvernight.filter(itemFilter => itemFilter.numberOfOvernight === item.overnight).map(item => item.flightRate);

      // thêm số chuyến bay theo giai đoạn
      item.planFlightPeriod = this.planFlightPeriods.filter(itemFilter => itemFilter.periodStart === item.periodStart && itemFilter.periodEnd === item.periodEnd && itemFilter.aircraftType === item.aircraftType).map(item => item.numberOfFlight).reduce((acc, value) => acc + value, 0);
      //Số chuyến bay theo tàu 
      this.calculate(item, 'totalFlightByAircraft');
    }
    //Số phòng đơn
    this.calculate(item, 'singleRoom');
    //Số phòng đôi
    this.calculate(item, 'doubleRoom');
    //Số phòng đơn dự phòng do lẻ nam nữ
    this.calculate(item, 'singleRoomReserved');
    //Số phòng đơn early-checkin dự kiến
    this.calculate(item, 'singleRoomEarly');
    //Số phòng đôi early-checkin dự kiến
    this.calculate(item, 'doubleRoomEarly');
    //Số phòng đơn early-checkin dự kiến do lẻ nam nữ
    this.calculate(item, 'singleRoomEarlyReserved');
    //Số phòng đơn late checkout dự kiến
    this.calculate(item, 'singleRoomLate');
    //Số phòng đôi late checkout dự kiến
    this.calculate(item, 'doubleRoomLate');
    //Số phòng đơn late checkout dự kiến do lẻ nam nữ
    this.calculate(item, 'singleRoomLateReserved');
    //Thành tiền ngoại tệ, - phòng đơn 
    this.calculate(item, 'totalAmountForeignSingleRoom');
    //Thành tiền ngoại tệ,  - phòng đôi
    this.calculate(item, 'totalAmountForeignDoubleRoom');
    if (this.generalData.earlyCheckinFeeFlag) {
      //Thành tiền ngoại tệ,  - phòng early-checkin
      this.calculate(item, 'totalAmountForeignEarly');
    }
    if (this.generalData.lateCheckoutFeeFlag) {
      //Thành tiền ngoại tệ, - phòng late checkout
      this.calculate(item, 'totalAmountForeignLate');
    }
    //Tổng tiền xe chở tổ bay (ngoại tệ)
    this.calculate(item, 'totalAmountForeignTransport');

    if (!this.updateBudgetPlan()) {
      //Tổng tiền theo loại máy bay
      this.calculate(item, 'totalAmountAircraft');
    }

    // Tổng tiền ngoại tệ - Chưa bao gồm VAT
    this.calculate(item, 'totalAmountForeign');
    // Tổng tiền ngoại tệ - bao gồm VAT
    this.calculate(item, 'totalAmountForeignVat');
    //Tổng tiền VND - bao gồm VAT
    this.calculate(item, 'totalAmountVat');
    //Tổng tiền VND - chưa bao gồm VAT
    this.calculate(item, 'totalAmount');
    //Tổng số phòng đơn
    this.calculate(item, 'totalSingleRoom');
    //Tổng số phòng đôi
    this.calculate(item, 'totalDoubleRoom');


    /**
   * TÍnh toán dòng tổng
   * @param item giá trị từng dòng dataSource
   */
    this.calculateTotalByGroup(item, index, 'totalAmountForeignTransport', 'totalAmountForeignTransportGroup');
    this.calculateTotalByGroup(item, index, 'totalAmountForeign', 'totalAmountForeignGroup');
    this.calculateTotalByGroup(item, index, 'totalAmountForeignVat', 'totalAmountForeignVatGroup');
    this.calculateTotalByGroup(item, index, 'totalAmount', 'totalAmountGroup');
    this.calculateTotalByGroup(item, index, 'totalAmountVat', 'totalAmountVatGroup');
  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }


  // TÍnh dòng tổng 
  getTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    if (control === 'totalAmountVat') {
      const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      return Math.round(this.dataSource.data.map((t: any) => {
        if (truncateDateUTC(new Date(t['periodStart'])) <= truncateDateUTC(endDatePlanGroup)) {
          return Number(t[control]);
        }
        return 0;
      }).reduce((acc, value) => acc + value, 0));
    }
    return Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDateUTC(new Date(t['periodStart'])) >= truncateDateUTC(startDatePlanGroup)) {
        return Number(t[control]);
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));;
  }

  // hàm công thức tính chung
  calculate(item: any, key: string) {
    // let data: any = this.dataSource.data[index];
    // Check lập kế hoạch sản lượng thay đổi
    // Tháng nào đã thực hiện thì tính theo công thưc mới
    const objFormula = formula[key];
    let strFomular = objFormula.formula;
    if (this.updateBudgetPlan() && item.monthIsPerform) {
      if (objFormula.formulaUpdateBudgetPlan) {
        strFomular = objFormula.formulaUpdateBudgetPlan;
      }
    }
    if (!!strFomular) {
      item[key] = this.calculateFormula(item, strFomular);
    }
    return item[key];
  }

  // hàm tính tổng theo group (rowspan)
  calculateTotalByGroup(item: any, index: number, key: string, control: string) {
    const keyGroup = this.getTotalByGroupKey(item, formula[key].groupFormula); // cái này để làm key trong object Total sau này sẽ get để lấy data hiển thị ở table
    const filterData = this.dataSource.data.filter((itemFilter: any, indexFilter: number) => index >= indexFilter && this.groupFormula(itemFilter, item, formula[key].groupFormula));
    const result = filterData.map((t: any) => t[key]).reduce((acc, value) => acc + value, 0);
    this.totalByGroup[keyGroup] = { ...this.totalByGroup[keyGroup], [control]: result };
  }

  getTotalByGroup(item: any, key: string, control: string) {
    const keyGroup = this.getTotalByGroupKey(item, formula[key].groupFormula);
    return this.totalByGroup[keyGroup] ? this.totalByGroup[keyGroup][control] : 0;
  }

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string): number {
    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data', 'generalData',
      `return ${formula};`    // Công thức cần tính
    );
    const result = dynamicFunction(data, this.generalData);
    return Math.round(result);
  }

  // hàm filter theo group
  groupFormula(dataSource: any, dataTarget: any, formula: string): any {
    let formulaArr = formula.split(' ').map((item: string) => item.trim());
    if (formulaArr.length > 0) {
      formulaArr.forEach((item: string, index: number) => {
        if (!item.includes('&&') && !item.includes('||')) {
          formulaArr[index] = `dataSource.${item} === dataTarget.${item}`;
        }
      });
      formula = formulaArr.join(' ');
      const dynamicFunction = new Function(
        'dataSource', 'dataTarget', 'generalData',
        `return ${formula};`
      );
      const calFormular = dynamicFunction(dataSource, dataTarget, this.generalData);
      return calFormular;
    }
    return false
  }

  getTotalByGroupKey(item: any, formula: string) {
    let formulaArr = formula.split(' ').map((item: string) => item.trim());
    if (formulaArr.length > 0) {
      formulaArr.forEach((t: string, index: number) => {
        if (!t.includes('&&') && !t.includes('||')) {
          formulaArr[index] = `item.${t}`;
        } else {
          formulaArr[index] = `+ '_${t}_' +`;
        }
      });
      formula = formulaArr.join(' ');
      const dynamicFunction = new Function(
        'item',
        `return ${formula};`
      );
      const calFormular = dynamicFunction(item);
      return calFormular;
    }

    return null;
  }

  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1(this.generalData, this.type());
    this.headerRowDef2 = getHeaderRowDef2(this.generalData, this.type());
    this.rowDef = getRowDef(this.generalData, this.type());
  }
}
