import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit } from '@angular/core';
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
import { truncateDate, truncateDateUTC } from 'src/app/crew-trip/shared/utils/common';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { CategoryEnum, PlanCategoryEnum } from '../../../budget-procurement.model';
import { el } from 'node_modules/@fullcalendar/core/internal-common';
import { debounceTime, map, startWith, Subject } from 'rxjs';
import moment from 'moment';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';

@Component({
  selector: 'app-international-budget-procurement-hotel',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule, ThousandsSeparatorDirective],
  templateUrl: './international-budget-procurement-hotel.component.html',
  styleUrl: './international-budget-procurement-hotel.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  resultTotal: { [key: string]: number } = {}; // dùng để lưu trữ giá trị tổng cho dòng cuối cùng trong bảng

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];

  yearPlan = input<number>(2024); // năm kế hoạch
  updateBudgetPlan = input<boolean | undefined>(false); //tích chọn check box Lập kế hoạch sản lượng thay đổi
  type = input<PlanCategoryEnum>(PlanCategoryEnum.BUDGET); // Loại Ngân sách hoặc mua sắm (budget/procurement)
  data = input<any>();
  disabled = input<boolean>(false);

  PlanCategoryEnum = PlanCategoryEnum;

  singleRoomOtherChange = new Subject<any>();
  doubleRoomOtherChange = new Subject<any>();

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      if (this.data()) {
        this.calculateSpan(this.data().aircraftTypeRowspan, this.data().overnightRowspan);
        this.setPlanFlightByOvernight(this.data().planOverightRates ?? []);
        this.setPlanFlightPeriods(this.data().planFlightPeriods ?? []);
        this.setDataSource(this.data().planHotels ?? [], this.data().general);
      }
    })
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  ngOnInit(): void {
    this.singleRoomOtherChange.pipe(
      debounceTime(1000),
      startWith('')).
      subscribe((element: any) => {
        if (element) {
          console.log(element)
          this.calculate(element, 'totalAmountForeign');
          this.calculate(element, 'totalSingleRoom');
          this.calculateTotalByGroup(element, element.index, 'totalAmountForeign', 'totalAmountForeignGroup');
        }
      });

    this.doubleRoomOtherChange.pipe(
      debounceTime(1000),
      startWith('')).
      subscribe((element: any) => {
        if (element) {
          console.log(element)
          this.calculate(element, 'totalAmountForeign');
          this.calculate(element, 'totalDoubleRoom');
          this.calculateTotalByGroup(element, element.index, 'totalAmountForeign', 'totalAmountForeignGroup');
        }
      })
  }

  setDataSource(data: any[], generalData?: any) {
    this.periods = []
    this.dataSource.data = [...data];
    this.generalData = { ...generalData };
    console.log('generalData in hotel: ', this.generalData)

    this.getRow();

    this.aircraftTypes = [];
    this.dataSource.data.forEach((item: any, index) => {
      this.calculatePeriodLabel(item, index);
      this.calculateAirCraftLabel(item, index);
      this.calculateData(item, index);
    });
    this.calculateTotal()
  };

  calculatePeriodLabel(item: any, index: number) {
    let period = '';
    if (this.type() === PlanCategoryEnum.PROCUREMENT) {
      period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;
    } else {
      period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
    }
    item.period = period;
    if (!this.periods.includes(period)) {
      this.periods.push(period);
      item.periodLabel = period;
    } else {
      item.periodLabel = '';
    }
  }

  calculateAirCraftLabel(item: any, index: number) {
    if (!this.aircraftTypes.includes(`${item.period}_${item.aircraftType}`)) {
      this.aircraftTypes.push(`${item.period}_${item.aircraftType}`)
      item.aircraftTypeLabel = item.aircraftType;
    } else {
      item.aircraftTypeLabel = '';
    }
  }

  calculateSpan(aircraftTypeRowspan: number, overnightRowspan: number) {
    this.periodRowspan = aircraftTypeRowspan * overnightRowspan;
    this.aircraftTypeRowspan = aircraftTypeRowspan;
    this.overnightRowspan = overnightRowspan;
  }

  setGeneralData(data: any) {
    const isChangeRateForSingle = checkChange(this.generalData.rateForSingle, data.rateForSingle);
    if (isChangeRateForSingle) {
      this.generalData = { ...data };
      this.dataSource.data.forEach((item: any, index) => {
        this.calculateData(item, index);
      });
      this.calculateTotal()
    }
    const earlyCheckinFlag = checkChange(this.generalData.earlyCheckinFlag, data.earlyCheckinFlag);
    const lateCheckoutFlag = checkChange(this.generalData.lateCheckoutFlag, data.lateCheckoutFlag);
    if (earlyCheckinFlag || lateCheckoutFlag) {
      this.generalData = { ...data };
      this.getRow();
    }

  }

  setExchangeRate(exchangeRateData: any) {
    this.dataSource.data.forEach((item: any, index) => {
      if (PlanCategoryEnum.BUDGET === this.type()) {

        const _periodStart = moment(item.periodStart).locale('en');
        const _exchangeRate = exchangeRateData[_periodStart.format('MMMM').toLowerCase()]
        console.log(_periodStart, _exchangeRate);
        if (_exchangeRate) {
          item.rateInPeriod = _exchangeRate;
        }
      } else {
        item.rateInPeriod = exchangeRateData.average
      }
      this.calculateData(item, index);
    });
    this.calculateTotal()
  }

  setPrice(priceData: any[]) {
    const _priceSingleRoom = priceData.find((item: any) => item.code === 'singleRoom') as any;
    const _priceDoubleRoom = priceData.find((item: any) => item.code === 'doubleRoom') as any;
    const _priceEarlyCheckinSingleRoom = priceData.find((item: any) => item.code === 'earlyCheckinSingleRoom') as any;
    const _priceEarlyCheckinDoubleRoom = priceData.find((item: any) => item.code === 'earlyCheckinDoubleRoom') as any;
    const _priceLateCheckoutSingleRoom = priceData.find((item: any) => item.code === 'lateCheckoutSingleRoom') as any;
    const _priceLateCheckoutDoubleRoom = priceData.find((item: any) => item.code === 'lateCheckoutDoubleRoom') as any;
    const _priceTransportation = priceData.find((item: any) => item.code === 'transportation') as any;
    this.dataSource.data.forEach((item: any, index: number) => {
      item.priceSingleRoom = _priceSingleRoom.priceBeforeTax;
      item.priceSingleRoomVat = _priceSingleRoom.priceAfterTax

      item.priceDoubleRoom = _priceDoubleRoom.priceBeforeTax;
      item.priceDoubleRoomVat = _priceDoubleRoom.priceAfterTax

      item.priceSingleRoomEarly = _priceEarlyCheckinSingleRoom.priceBeforeTax;
      item.priceSingleRoomEarlyVat = _priceEarlyCheckinSingleRoom.priceAfterTax;

      item.priceDoubleRoomEarly = _priceEarlyCheckinDoubleRoom.priceBeforeTax;
      item.priceDoubleRoomEarlyVat = _priceEarlyCheckinDoubleRoom.priceAfterTax;

      item.priceSingleRoomLate = _priceLateCheckoutSingleRoom.priceBeforeTax;
      item.priceSingleRoomLateVat = _priceLateCheckoutSingleRoom.priceAfterTax;

      item.priceDoubleRoomLate = _priceLateCheckoutDoubleRoom.priceBeforeTax;
      item.priceDoubleRoomLateVat = _priceLateCheckoutDoubleRoom.priceAfterTax;

      item.priceCrewTransport = _priceTransportation.priceBeforeTax;
      item.priceCrewTransportVat = _priceTransportation.priceAfterTax;
      this.calculateData(item, index);
    });
    this.calculateTotal()
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
          this.calculateTotal()
        } else {
          // lấy id bản ghi cuối cùng để làm cơ sở ví trí thêm data
          if (planFlightByOvernight && planFlightByOvernight.length) {
            this.setPlanFlightByOvernight(planFlightByOvernight);
          }

          const overnightId = (this.dataSource.data[this.dataSource.data.length - 1] as any).overnightId;
          const dataProcessHotel = [...this.dataSource.data];
          for (let i = dataProcessHotel.length - 1; i >= 0; i--) {
            const dataHotel = (this.dataSource.data[i] as any);
            if (dataHotel.overnightId == overnightId) {
              dataProcessHotel.splice(i + 1, 0, {
                ...dataHotel,
                periodLabel: '',
                aircraftTypeLabel: '',
                overnightId: data.id,
                overnight: Number(data.numberOfOverNight),
                flightOvernightRate: data.flightRate,
              });
              this.calculateData(dataProcessHotel[i + 1], i + 1);
            }
            this.calculateData(dataProcessHotel[i], i);
          }
          this.calculateTotal()
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
          this.setPlanFlightByOvernight(planFlightByOvernight);
          this.calculateSpan(this.aircraftTypeRowspan, planFlightByOvernight.length);
        }
        this.dataSource.data = [...this.dataSource.data.filter((itemFilter: any) => itemFilter.overnightId !== data.id)];
        if (length) {
          this.calculateSpan(this.aircraftTypeRowspan, length);
        }
        this.dataSource.data.forEach((item: any, index) => {
          this.calculateData(item, index);
        });
        this.calculateTotal()
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
    // thêm tỉ lệ chuyến bay nghỉ đêm
    const _flightOvernightRate = this.planFlightByOvernight.filter(itemFilter => itemFilter.numberOfOverNight === item.overnight).map(item => item.flightRate);
    item.flightOvernightRate = Number(_flightOvernightRate)
    if (this.type() === PlanCategoryEnum.PROCUREMENT) {
      // thêm số chuyến bay theo giai đoạn
      const _planFlightPeriod = this.planFlightPeriods.filter(itemFilter => itemFilter.periodStart === item.periodStart && itemFilter.periodEnd === item.periodEnd && itemFilter.aircraftType === item.aircraftType).map(item => item.numberOfFlight).reduce((acc, value) => acc + value, 0);
      item.planFlightPeriod = Number(_planFlightPeriod)
    }
    //Số chuyến bay theo tàu 
    this.calculate(item, 'totalFlightByAircraft');
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
    this.updateValueForControl(data, control);
  }


  // TÍnh dòng tổng 
  setTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    let totalValue = 0
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    if (control === 'totalAmountVat') {
      const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      totalValue = Math.round(this.dataSource.data.map((t: any) => {
        if (truncateDate(new Date(t['periodStart'])) <= truncateDate(endDatePlanGroup)) {
          return Number(t[control]);
        }
        return 0;
      }).reduce((acc, value) => acc + value, 0));
      this.resultTotal[control] = totalValue;
      return
    }
    totalValue = Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDate(new Date(t['periodStart'])) >= truncateDate(startDatePlanGroup)) {
        return Number(t[control]);
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));
    this.resultTotal[control] = totalValue;
  }

  getTotal(control: string) {
    return this.resultTotal[control] ?? 0
  }

  calculateTotal() {
    this.setTotal('totalFlightByAircraft');
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoom') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoom') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomReserved') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomOther') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoomOther') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomEarly') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoomEarly') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomEarlyReserved') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomLate') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoomLate') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomLateReserved') }
    this.setTotal('totalSingleRoom')
    this.setTotal('totalDoubleRoom')
    this.setTotal('totalAmountForeignTransport')
    this.setTotal('totalAmountForeign')
    this.setTotal('totalAmountForeignVat')
    this.setTotal('totalAmount')
    this.setTotal('totalAmountVat')

  }

  // hàm công thức tính chung
  calculate(item: any, key: string) {
    // let data: any = this.dataSource.data[index];
    // Check lập kế hoạch sản lượng thay đổi
    // Tháng nào đã thực hiện thì tính theo công thưc mới
    const objFormula = formula[key];
    let strFomular = objFormula.formula;
    if (this.type() === PlanCategoryEnum.PROCUREMENT) {
      if (objFormula.formulaProcurement) {
        strFomular = objFormula.formulaProcurement;
      }
    }
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
      'data', 'generalData', 'ctz',
      `return ${formula};`    // Công thức cần tính
    );
    const result = dynamicFunction(data, this.generalData, this.ctz);
    return Math.round(result);
  }
  // convertToZero
  ctz(value: any) {
    if (value) {
      return new Number(value.toString().replace(',', '.'));
    }
    return 0;
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



  vlcSingleRoomOther(index: number, element: any, value: any) {
    if (value) {
      element.index = index
      this.singleRoomOtherChange.next(element);
    }
  }

  vlcDoubleRoomOther(index: number, element: any, value: any) {
    if (value) {
      element.index = index
      this.doubleRoomOtherChange.next(element);
    }
  }

  /**
   * Cập nhật giá trị cho các ô nhập trên table
   * @param data 
   * @param control 
   */
  updateValueForControl(data: any, control: string) {
    if (control === 'priceSingleRoomVatEditing'
      || control === 'priceDoubleRoomVatEditing'
      || control === 'priceSingleRoomEarlyVatEditing'
      || control === 'priceDoubleRoomEarlyVatEditing'
      || control === 'priceSingleRoomLateVatEditing'
      || control === 'priceDoubleRoomLateVatEditing'
      || control === 'priceCrewTransportVatEditing'
    ) {
      this.dataSource.data.forEach((item: any, index: number) => {
        if (item.period === data.periodLabel) {
          item.priceSingleRoomVat = data.priceSingleRoomVat
          item.priceDoubleRoomVat = data.priceDoubleRoomVat
          item.priceSingleRoomEarlyVat = data.priceSingleRoomEarlyVat
          item.priceDoubleRoomEarlyVat = data.priceDoubleRoomEarlyVat
          item.priceSingleRoomLateVat = data.priceSingleRoomLateVat
          item.priceDoubleRoomLateVat = data.priceDoubleRoomLateVat
          item.priceCrewTransportVat = data.priceCrewTransportVat

          item.priceSingleRoom = Number(item.priceSingleRoomVat) / (1 + (Number(item.taxRate) / 100))
          item.priceDoubleRoom = Number(item.priceDoubleRoomVat) / (1 + (Number(item.taxRate) / 100))
          item.priceSingleRoomEarly = Number(item.priceSingleRoomEarlyVat) / (1 + (Number(item.taxRate) / 100))
          item.priceDoubleRoomEarly = Number(item.priceDoubleRoomEarlyVat) / (1 + (Number(item.taxRate) / 100))
          item.priceSingleRoomLate = Number(item.priceSingleRoomLateVat) / (1 + (Number(item.taxRate) / 100))
          item.priceDoubleRoomLate = Number(item.priceDoubleRoomLateVat) / (1 + (Number(item.taxRate) / 100))
          item.priceCrewTransport = Number(item.priceCrewTransportVat) / (1 + (Number(item.taxRate) / 100))

          this.calculateData(item, index);
        }

      });
    }
    this.calculateTotal()
  }
}
