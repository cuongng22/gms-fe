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
import { Constant, round } from 'src/app/crew-trip/shared/utils/constant';
import { checkChange, checkVisibleColumn, FlagTypeEnum, formula, getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './international-budget-procurement-hotel.model';
import { truncateDate } from 'src/app/crew-trip/shared/utils/common';
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

  periodsSpan: {
    [key: string]: { count: number, firstIndex: number }
  } = {};

  aircraftTypeSpan: {
    [key: string]: { count: number, firstIndex: number }
  } = {}

  yearPlan = input<number>(2024); // năm kế hoạch
  updateBudgetPlan = input<boolean | undefined>(false); //tích chọn check box Lập kế hoạch sản lượng thay đổi
  type = input<PlanCategoryEnum>(PlanCategoryEnum.BUDGET); // Loại Ngân sách hoặc mua sắm (budget/procurement)
  data = input<any>();
  disabled = input<boolean>(false);

  PlanCategoryEnum = PlanCategoryEnum;

  singleRoomOtherChange = new Subject<any>();
  doubleRoomOtherChange = new Subject<any>();

  round = round;


  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      if (this.data() && Object.keys(this.data()).length > 0) {
        this.setPlanFlightByOvernight(this.data().planOverightRates ?? []);
        this.setPlanFlightPeriods(this.data().planFlightPeriods ?? []);
        this.setDataSource(this.data().planHotels ?? [], this.data().general, this.data().isSummary);
      }
    })
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  ngOnInit(): void {
    // this.singleRoomOtherChange.pipe(
    //   debounceTime(1000),
    //   startWith('')).
    //   subscribe((element: any) => {
    //     if (element) {
    //       console.log(element)
    //       this.calculate(element, 'totalAmountForeign');
    //       this.calculate(element, 'totalSingleRoom');
    //       this.calculateTotalByGroup(element, element.index, 'totalAmountForeign', 'totalAmountForeignGroup');
    //     }
    //   });

    // this.doubleRoomOtherChange.pipe(
    //   debounceTime(1000),
    //   startWith('')).
    //   subscribe((element: any) => {
    //     if (element) {
    //       console.log(element)
    //       this.calculate(element, 'totalAmountForeign');
    //       this.calculate(element, 'totalDoubleRoom');
    //       this.calculateTotalByGroup(element, element.index, 'totalAmountForeign', 'totalAmountForeignGroup');
    //     }
    //   })
  }

  setDataSource(data: any[], generalData?: any, isSummary?: boolean) {
    this.periods = []
    this.dataSource.data = [...data];
    this.generalData = { ...generalData };

    this.getRow();
    this.aircraftTypes = [];
    this.calculateSpan();
    this.dataSource.data.forEach((item: any, index) => {
      // this.calculatePeriodLabel(item, index);
      this.calculateData(item, index, isSummary);
    });
    this.calculateTotal()
  };

  getDataSource() {
    const _stringData = JSON.stringify(this.dataSource.data);
    let _jsonData = JSON.parse(_stringData);
    _jsonData.forEach((item: any, index: number) => {
      //Số chuyến bay theo tàu và đêm nghỉ
      item.numberOfFlights = round(item.numberOfFlights);
      //Số phòng đơn
      item.singleRoom = round(item.singleRoom);
      //Số phòng đôi
      item.doubleRoom = round(item.doubleRoom);
      //Số phòng đơn dự phòng do lẻ nam nữ
      item.singleRoomReserved = round(item.singleRoomReserved);
      //Số phòng đơn early-checkin dự kiến
      item.singleRoomEarly = round(item.singleRoomEarly);
      //Số phòng đôi early-checkin dự kiến
      item.doubleRoomEarly = round(item.doubleRoomEarly);
      //Số phòng đơn early-checkin dự kiến do lẻ nam nữ
      item.singleRoomEarlyReserved = round(item.singleRoomEarlyReserved);
      //Số phòng đơn late checkout dự kiến
      item.singleRoomLate = round(item.singleRoomLate);
      //Số phòng đôi late checkout dự kiến
      item.doubleRoomLate = round(item.doubleRoomLate);
      //Số phòng đơn late checkout dự kiến do lẻ nam nữ
      item.singleRoomLateReserved = round(item.singleRoomLateReserved);
      //Thành tiền ngoại tệ, - phòng đơn 
      // item.totalAmountForeignSingleRoom = round(item.totalAmountForeignSingleRoom);
      //Thành tiền ngoại tệ,  - phòng đôi
      // item.totalAmountForeignDoubleRoom = round(item.totalAmountForeignDoubleRoom);
      //Thành tiền ngoại tệ,  - phòng early-checkin
      // item.totalAmountForeignEarly = round(item.totalAmountForeignEarly);
      //Thành tiền ngoại tệ, - phòng late checkout
      // item.totalAmountForeignLate = round(item.totalAmountForeignLate);
      //Tổng tiền xe chở tổ bay (ngoại tệ)
      // item.totalAmountForeignTransport = round(item.totalAmountForeignTransport);

      //Tổng tiền theo loại máy bay
      // item.totalAmountAircraft = round(item.totalAmountAircraft);
      // Tổng tiền ngoại tệ - Chưa bao gồm VAT
      // item.totalAmountForeign = round(item.totalAmountForeign);
      // Tổng tiền ngoại tệ - bao gồm VAT
      // item.totalAmountForeignVat = round(item.totalAmountForeignVat);
      //Tổng tiền VND - chưa bao gồm VAT
      // item.totalAmount = round(item.totalAmount);
      //Tổng tiền VND - bao gồm VAT
      // item.totalAmountVat = round(item.totalAmountVat);
      //Tổng số phòng đơn
      item.totalSingleRoom = round(item.totalSingleRoom);
      //Tổng số phòng đôi
      item.totalDoubleRoom = round(item.totalDoubleRoom);
    })
    return _jsonData;
  }

  // calculatePeriodLabel(item: any, index: number) {

  // }


  calculateSpan() {
    this.periodsSpan = {}
    this.aircraftTypeSpan = {}
    this.dataSource.data.forEach((item: any, index) => {

      let period = '';
      if (this.type() === PlanCategoryEnum.PROCUREMENT) {
        period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      } else {
        period = `${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      }
      item.period = period;


      // tính toán rowspan cho cột giai đoạn
      if (this.periodsSpan.hasOwnProperty(item.period)) {
        this.periodsSpan[item.period].count += 1;
      } else {
        this.periodsSpan[item.period] = { count: 1, firstIndex: index };
      }

      // tính toán rowspan cho cột loại máy bay
      const aircraftTypeKey = `${item.period}_${item.aircraftType}`;
      if (this.aircraftTypeSpan.hasOwnProperty(aircraftTypeKey)) {
        this.aircraftTypeSpan[aircraftTypeKey].count += 1;
      } else {
        this.aircraftTypeSpan[aircraftTypeKey] = { count: 1, firstIndex: index };
      }
      item.aircraftTypeGroup = aircraftTypeKey;
    });
  }

  setGeneralData(data: any) {
    if (data && Object.keys(data).length > 0) {
      const isChangeRateForSingle = checkChange(this.generalData.rateForSingle, data.rateForSingle);
      if (isChangeRateForSingle) {
        this.generalData = { ...data };
        this.dataSource.data.forEach((item: any, index) => {
          this.calculateData(item, index, true);
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
  }

  setExchangeRate(exchangeRateData: any) {
    this.dataSource.data.forEach((item: any, index) => {
      if (PlanCategoryEnum.BUDGET === this.type()) {

        const _periodStart = moment(item.periodStart).locale('en');
        const _exchangeRate = exchangeRateData[_periodStart.format('MMMM').toLowerCase()]
        if (_exchangeRate) {
          item.rateInPeriod = _exchangeRate;
        }
      } else {
        item.rateInPeriod = exchangeRateData.average
      }
      this.calculateData(item, index, true);
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
      this.calculateData(item, index, true);
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
            this.calculateData(item, index, true);
          });
          this.calculateTotal();
        } else {
          // lấy id bản ghi cuối cùng để làm cơ sở ví trí thêm data
          if (planFlightByOvernight && planFlightByOvernight.length > 0) {
            this.setPlanFlightByOvernight(planFlightByOvernight);
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
              this.periodsSpan[(dataProcessHotel[i + 1] as any).period].count += 1;
              this.calculateData(dataProcessHotel[i + 1], i + 1, true);
            }
            this.calculateData(dataProcessHotel[i], i, true);
          }
          this.calculateTotal()
          this.dataSource.data = [...dataProcessHotel];
          if (length) {
            this.calculateSpan();
          }
          console.log(this.dataSource.data);
          console.log('periodRowspan: ', this.periodRowspan);
          console.log('aircraftTypeRowspan: ', this.aircraftTypeRowspan);
          console.log('overnightRowspan: ', this.overnightRowspan)
        }

        break;
      case 'delete':
        this.setPlanFlightByOvernight(planFlightByOvernight ?? []);
        this.calculateSpan();
        this.dataSource.data = [...this.dataSource.data.filter((itemFilter: any) => itemFilter.overnightId !== data.id)];
        if (length) {
          this.calculateSpan();
        }
        this.dataSource.data.forEach((item: any, index) => {
          this.calculateData(item, index, true);
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
  private calculateData(item: any, index: number, isSummary?: boolean) {
    // thêm tỉ lệ chuyến bay nghỉ đêm
    if (isSummary) {
      const _flightOvernightRate = this.planFlightByOvernight.filter(itemFilter => itemFilter.numberOfOverNight === item.overnight).map(item => item.flightRate);
      item.flightOvernightRate = Number(_flightOvernightRate)
      if (this.type() === PlanCategoryEnum.PROCUREMENT) {
        // thêm số chuyến bay theo giai đoạn
        const _planFlightPeriod = this.planFlightPeriods.filter(itemFilter => itemFilter.periodStart === item.periodStart && itemFilter.periodEnd === item.periodEnd && itemFilter.aircraftType === item.aircraftType).map(item => item.numberOfFlight).reduce((acc, value) => acc + value, 0);
        item.planFlightPeriod = Number(_planFlightPeriod)
      }
      item.noOfFlightOvernight = 1; // tổng số chuyến bay và số đêm nghỉ để nhóm sau đó chia cho số này vs tháng đã thực hiện monthInPerform
      item.noOfOvernight = this.planFlightByOvernight.length ?? 1
      // Thu bảo với tháng đã thực hiện thì số tiền sẽ phải chia ( số đêm nghỉ * loại máy bay) ==> loại ngân sách

      //Số chuyến bay theo tàu và đêm nghỉ
      this.calculate(item, 'numberOfFlights', true);
      if (item.monthIsPerform) {
        item.noOfFlightOvernight = this.periodsSpan[item.period].count ?? 1;
      } else {
        this.calculate(item, 'singleRoom', true);
        //Số phòng đôi
        this.calculate(item, 'doubleRoom', true);
        //Số phòng đơn dự phòng do lẻ nam nữ
        this.calculate(item, 'singleRoomReserved', true);

        //Số phòng đơn early-checkin dự kiến
        this.calculate(item, 'singleRoomEarly', true);
        //Số phòng đôi early-checkin dự kiến
        this.calculate(item, 'doubleRoomEarly', true);
        //Số phòng đơn early-checkin dự kiến do lẻ nam nữ
        this.calculate(item, 'singleRoomEarlyReserved', true);
        //Số phòng đơn late checkout dự kiến
        this.calculate(item, 'singleRoomLate', true);
        //Số phòng đôi late checkout dự kiến
        this.calculate(item, 'doubleRoomLate', true);
        //Số phòng đơn late checkout dự kiến do lẻ nam nữ
        this.calculate(item, 'singleRoomLateReserved', true);

      }
      //Tổng số phòng đơn
      this.calculate(item, 'totalSingleRoom');
      //Tổng số phòng đôi
      this.calculate(item, 'totalDoubleRoom');
      //Thành tiền ngoại tệ, - phòng đơn 
      this.calculate(item, 'totalAmountForeignSingleRoom');
      //Thành tiền ngoại tệ, - phòng đơn có vat
      this.calculate(item, 'totalAmountForeignSingleRoomVat');
      //Thành tiền ngoại tệ,  - phòng đôi
      this.calculate(item, 'totalAmountForeignDoubleRoom');
      //Thành tiền ngoại tệ,  - phòng đôi có Vat
      this.calculate(item, 'totalAmountForeignDoubleRoomVat');
      if (checkVisibleColumn(this.generalData, FlagTypeEnum.EARLY_CHECKIN, this.type())) {
        //Thành tiền ngoại tệ,  - phòng early-checkin
        this.calculate(item, 'totalAmountForeignEarly');
        //Thành tiền ngoại tệ,  - phòng early-checkin có vat
        this.calculate(item, 'totalAmountForeignEarlyVat');
      }
      if (checkVisibleColumn(this.generalData, FlagTypeEnum.LATE_CHECKOUT, this.type())) {
        //Thành tiền ngoại tệ, - phòng late checkout
        this.calculate(item, 'totalAmountForeignLate');
        //Thành tiền ngoại tệ, - phòng late checkout có vat
        this.calculate(item, 'totalAmountForeignLateVat');
      }
      if (this.generalData.crewTransportFeeFlag) {
        //Tổng tiền xe chở tổ bay (ngoại tệ)
        this.calculate(item, 'totalAmountForeignTransport');
        //Tổng tiền xe chở tổ bay (ngoại tệ) có vat
        this.calculate(item, 'totalAmountForeignTransVat');
      }

      if (!this.updateBudgetPlan()) {
        //Tổng tiền theo loại máy bay
        this.calculate(item, 'totalAmountAircraft');
      }
      if (this.type() === PlanCategoryEnum.BUDGET) {
        // Tổng tiền ngoại tệ - Chưa bao gồm VAT
        this.calculate(item, 'totalAmountForeign');
        // Tổng tiền ngoại tệ - bao gồm VAT
        this.calculate(item, 'totalAmountForeignVat');

        //Tổng tiền VND - chưa bao gồm VAT
        this.calculate(item, 'totalAmount');
        //Tổng tiền VND - bao gồm VAT
        this.calculate(item, 'totalAmountVat');
      } else if (this.type() === PlanCategoryEnum.PROCUREMENT) {
        // Tổng tiền ngoại tệ - bao gồm VAT
        this.calculate(item, 'totalAmountForeignVat');
        // Tổng tiền ngoại tệ - Chưa bao gồm VAT
        this.calculate(item, 'totalAmountForeign');
        //Tổng tiền VND - bao gồm VAT
        this.calculate(item, 'totalAmountVat');
        //Tổng tiền VND - chưa bao gồm VAT
        this.calculate(item, 'totalAmount');
      }

    }



    /**
   * TÍnh toán dòng tổng
   * @param item giá trị từng dòng dataSource
   */
    this.calculateTotalByGroup(item, index, 'totalAmountForeignTransVat', 'totalAmountForeignTransVatGroup');
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
  setTotal(control: string, monthIsPerform?: boolean) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025

    let totalValue = 0
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    if (this.type() === PlanCategoryEnum.BUDGET
      && ['totalAmountVat', 'totalAmountForeignVat', 'totalAmountForeignTransport'].includes(control)) {
      const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      totalValue = this.dataSource.data.map((t: any) => {
        if (truncateDate(new Date(t['periodStart'])) <= truncateDate(endDatePlanGroup)) {
          return round(Number(t[control]));
        }
        return 0;
      }).reduce((acc, value) => acc + value, 0);
      this.resultTotal[control] = totalValue;
      return
    }
    totalValue = this.dataSource.data.map((t: any) => {
      if (truncateDate(new Date(t['periodStart'])) >= truncateDate(startDatePlanGroup)) {
        // Nếu trường phải check tháng đã thực hiện thì sẽ check trong tháng đó đã thực hiện chưa
        let value = round(Number(t[control]));
        if (monthIsPerform) {
          value = t.monthIsPerform ? 0 : value;
        }
        return value;
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0);
    // Nếu các cột đc merge thì sẽ phải chia cho số đêm nghỉ
    if (['singleRoomEarly', 'doubleRoomEarly', 'singleRoomEarlyReserved', 'singleRoomLate', 'doubleRoomLate', 'singleRoomLateReserved'].includes(control)) {
      totalValue = round(totalValue / (this.planFlightByOvernight.length ?? 1))
    }
    this.resultTotal[control] = totalValue;
  }

  getTotal(control: string) {
    return round(this.resultTotal[control]) ?? 0
  }

  calculateTotal() {
    this.setTotal('numberOfFlights');
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoom', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoom', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomReserved', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomOther', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoomOther', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomEarly', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoomEarly', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomEarlyReserved', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomLate', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('doubleRoomLate', true) }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('singleRoomLateReserved', true) }
    this.setTotal('totalSingleRoom')
    this.setTotal('totalDoubleRoom')
    this.setTotal('totalAmountForeignTransport')
    this.setTotal('totalAmountForeign')
    this.setTotal('totalAmountForeignVat')
    this.setTotal('totalAmount')
    this.setTotal('totalAmountVat')

  }

  // hàm công thức tính chung
  calculate(item: any, key: string, isRound?: boolean, fractionDigits?: number) {
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
    // if (this.updateBudgetPlan()) {
    //   if (objFormula.formulaUpdateBudgetPlan) {
    //     strFomular = objFormula.formulaUpdateBudgetPlan;
    //   }
    // }
    if (!!strFomular) {
      item[key] = this.calculateFormula(item, strFomular, key);
    }
    if (isRound) {
      item[key] = round(item[key], fractionDigits);
    }
    return item[key];
  }

  // hàm tính tổng theo group (rowspan)
  calculateTotalByGroup(item: any, index: number, key: string, control: string) {
    const keyGroup = this.getTotalByGroupKey(item, formula[key].groupFormula); // cái này để làm key trong object Total sau này sẽ get để lấy data hiển thị ở table
    const filterData = this.dataSource.data.filter((itemFilter: any, indexFilter: number) =>
      this.groupFormula(itemFilter, item, formula[key].groupFormula));
    const result = filterData.map((t: any) => (t[key])).reduce((acc, value) => acc + value, 0);
    this.totalByGroup[keyGroup] = { ...this.totalByGroup[keyGroup], [control]: round(result) };
  }

  getTotalByGroup(item: any, key: string, control: string) {
    const keyGroup = this.getTotalByGroupKey(item, formula[key].groupFormula);
    return this.totalByGroup[keyGroup] ? this.totalByGroup[keyGroup][control] : 0;
  }

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string, control?: string): number {

    // --------- đoạn này để debug công thức ---------
    // Tạo một bản sao công thức để thay thế giá trị thực tế
    let replacedFormula = formula;

    // Danh sách các biến cần thay thế
    const variables = formula.match(/ctz\((.*?)\)/g);
    const matchMonthIsPerform = formula.match(/data.monthIsPerform/g);
    let field = '';
    let arr: any[] = [];
    variables?.forEach((match) => arr.push(match))
    matchMonthIsPerform?.forEach((match) => arr.push(match))
    if (arr) {
      arr.forEach((match) => {
        field = match
        const dynamicFunctionDebug = new Function(
          'data', 'generalData', 'ctz',
          `return ${field};`    // Công thức cần tính
        );
        // const field = match.replace(/ctz\(|\)/g, ""); // Lấy tên biến
        const value = dynamicFunctionDebug(data, this.generalData, this.ctz); // Lấy giá trị thực tế
        replacedFormula = replacedFormula.replace(match, (value + ''));
      });
    }
    // ---- end debug công thức-----

    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data', 'generalData', 'ctz',
      `return ${formula};`    // Công thức cần tính
    );
    const result = dynamicFunction(data, this.generalData, this.ctz);

    // Log công thức sau khi thay thế giá trị thực tế
    console.log(this.type(), data.period, control, formula, replacedFormula, result);
    return result;
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



  // vlcSingleRoomOther(index: number, element: any, value: any) {
  //   if (value) {
  //     element.index = index
  //     this.singleRoomOtherChange.next(element);
  //   }
  // }

  // vlcDoubleRoomOther(index: number, element: any, value: any) {
  //   if (value) {
  //     element.index = index
  //     this.doubleRoomOtherChange.next(element);
  //   }
  // }

  /**
   * Cập nhật giá trị cho các ô nhập trên table
   * @param data 
   * @param control 
   */
  updateValueForControl(data: any, control: string) {
    // cái này là sửa phần mua sắm
    if (this.type() === PlanCategoryEnum.PROCUREMENT &&
      (control === 'priceSingleRoomVatEditing'
        || control === 'priceDoubleRoomVatEditing'
        || control === 'priceSingleRoomEarlyVatEditing'
        || control === 'priceDoubleRoomEarlyVatEditing'
        || control === 'priceSingleRoomLateVatEditing'
        || control === 'priceDoubleRoomLateVatEditing'
        || control === 'priceCrewTransportVatEditing'
      )
    ) {
      this.dataSource.data.forEach((item: any, index: number) => {
        if (item.period === data.period) {
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

          this.calculateData(item, index, true);
        }

      });
      this.calculateTotal();
    } else if (
      (control === 'singleRoomOtherEditing' ||
        control === 'doubleRoomOtherEditing'
      )
    ) {
      this.calculateData(data, 0, true)
      this.calculateTotal()
      console.log('this.totalByGroup', this.totalByGroup)
    }
  }

  getNunberRound(value: any) {
    if (value) {
      if (!isNaN(value.toString().replace(/,/g, ''))) {
        return Math.round(Number(value));
      }
    }
    return null;
  }
}
