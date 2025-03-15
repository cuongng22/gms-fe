import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { NgxControlError } from 'ngxtension/control-error';
import { CategoryEnum } from 'src/app/crew-trip/features/plan/budget-procurement/budget-procurement.model';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DatepickerComponent } from 'src/app/ui-elements/datepicker/datepicker.component';
import { formula } from './wet-lease-hotel.model';
import { forEach } from 'lodash';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { WetLeaseService } from 'src/app/crew-trip/core/services/wet-lease.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wet-lease-hotel',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    DatepickerComponent, MatDatepickerModule, NgxControlError, ClickOutside
  ],
  templateUrl: './wet-lease-hotel.component.html',
  styleUrl: './wet-lease-hotel.component.scss',
  providers: [DataTransformPipe]
})
export class WetLeaseHotelComponent extends CommonComponent implements OnDestroy {
  override baseService: WetLeaseService = inject(WetLeaseService);
  CategoryEnum = CategoryEnum;
  headerRowDef1Common = ['stt', 'leaseDate', 'totalRoom', 'totalCountForeign', 'totalAmount'];
  headerRowDef2Common = ['totalQtySingleRoom', 'totalQtyTwinRoom', 'totalExcVAT', 'totalIncVAT'];
  rowDefCommon = ['stt', 'leaseDate', 'totalQtySingleRoom', 'totalQtyTwinRoom', 'totalCountForeign', 'totalExcVAT', 'totalIncVAT'];
  totalRowDefCommon = ['total', 'totalQtySingleRoom', 'totalQtyTwinRoom', 'totalCountForeign', 'totalExcVAT', 'totalIncVAT'];
  totalPlannedBudgetRowDefCommon = ['plannedBudget', 'ft2TotalQtySingleRoom', 'ft2TotalQtyTwinRoom', 'ft2TotalCountForeign', 'ft2TotalExcVAT', 'ft2TotalIncVAT'];

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];
  totalRowDef: string[] = [];
  totalPlannedBudgetRowDef: string[] = [];

  hotelHeaderRowDef1: any[] = [];//[{ code: 'HOTEL_1', name: 'Hotel 1' }, { code: 'HOTEL_3', name: 'Hotel 3' }];
  hotelHeaderRowDef2: any[] = [];//['totalSingleRoom_HOTEL_1', 'totalTwinRoom_HOTEL_1', 'totalSingleRoom_HOTEL_3', 'totalTwinRoom_HOTEL_3'];

  totalPlannedBudget: any = {}; // object lưu giá trị kế hoạch của từng KS

  category = input.required<CategoryEnum>(); // quốc tế hoặc quốc nội
  exchangeRate = input<number>(1);
  data = input<any[]>()
  priceHotel = input<any[]>();
  dataGeneral = input<any>()
  disabled = input<boolean>(false);

  exchangeRateSubscription: Subscription;
  rateVatSubscription: Subscription;
  roomPriceSubscription: Subscription;

  Math = Math;

  constructor() {
    super();
    effect(() => {
      if (this.data() && (this.data()?.length ?? 0) > 0) {
        this.setDataSource(this.data() ?? []);
      }
    });

    effect(() => {
      if (this.priceHotel() && (this.priceHotel()?.length ?? 0) > 0) {
        const _hotelHeaderRowDef1 = ((this.priceHotel() ?? []).map((item: any) => {
          return {
            hotelCode: item.hotelCode,
            hotelName: item.hotelName,
          }
        }))
        this.hotelHeaderRowDef1 = [..._hotelHeaderRowDef1];

        const _hotelHeaderRowDef2 = ((this.priceHotel() ?? []).map((item: any) => {
          return [`totalSingleRoom_${item.hotelCode}`, `totalTwinRoom_${item.hotelCode}`]
        }))
        this.hotelHeaderRowDef2 = [..._hotelHeaderRowDef2.flat()];
        this.processColumnTable();
        this.calculation();
      }
    })
  }
  override ngOnInit(): void {
    this.processColumnTable()

    this.exchangeRateSubscription = this.baseService.exchangeRate$.subscribe(data => {
      if (data) {
        const _exchangeRate = Number(data);
        if (this.dataGeneral()) {
          this.dataGeneral().exchangeRate = _exchangeRate;
          this.calculation()
        }
      }
    });

    this.rateVatSubscription = this.baseService.rateVat$.subscribe(data => {
      if (data) {
        const _rateVat = Number(data);
        if (this.dataGeneral()) {
          this.dataGeneral().rateVat = _rateVat;
          this.calculation()
        }
      }
    });

    this.roomPriceSubscription = this.baseService.roomPrice$.subscribe(data => {
      if (data) {
        this.totalPlannedBudget = {};
        this.dataSource.data.forEach(element => {
          Object.entries<any>(element.hotelItem).forEach(([_hotelCode, _hotelValue]) => {
            if (data.hotelCode === _hotelCode) {
              _hotelValue.singleRoomPrice = Number(data.singleRoomPrice);
              _hotelValue.twinRoomPrice = Number(data.twinRoomPrice);
            }
          })

          this.getTotalRoom(element);
          this.calTotalCountForeign(element);
          this.calTotalAmount(element);
          this.calTotalPlanBudget(element);
        });
      }
    });
  }

  setDataSource(value: any[]) {
    this.dataSource.data = [...value];
  }

  processColumnTable() {
    let _headerRowDef1Common = [...this.headerRowDef1Common];
    let _hotelHeaderRowDef1: string[] = [...this.hotelHeaderRowDef1.map(item => item.hotelCode)];
    let _rowDefCommon = [...this.rowDefCommon];
    let _totalRowDefCommon = [...this.totalRowDefCommon];
    let _totalPlannedBudgetRowDefCommon = [...this.totalPlannedBudgetRowDefCommon];

    _headerRowDef1Common.splice(2, 0, ..._hotelHeaderRowDef1);
    this.headerRowDef1 = [..._headerRowDef1Common]

    this.headerRowDef2 = this.hotelHeaderRowDef2.concat(this.headerRowDef2Common);

    _rowDefCommon.splice(2, 0, ...this.hotelHeaderRowDef2);
    this.rowDef = [..._rowDefCommon]

    _totalRowDefCommon.splice(1, 0, ...this.hotelHeaderRowDef2);
    this.totalRowDef = [..._totalRowDefCommon];

    _totalPlannedBudgetRowDefCommon.splice(1, 0, ...this.hotelHeaderRowDef2.filter(item => item.includes('totalSingleRoom')).map(item => 'ft2' + item));
    this.totalPlannedBudgetRowDef = [..._totalPlannedBudgetRowDefCommon]

    console.log(this.totalPlannedBudgetRowDef);
  }


  getTotal(formula: string) {
    return (this.dataSource.data.map((item: any) => {
      return Number(this.calWithFormula(formula, item));
    }).reduce((acc, value) => acc + value, 0)).toFixed(3);
  }

  calculation() {
    console.log(this.dataSource.data)
    this.totalPlannedBudgetRowDef.forEach(rowDef => {
      this.totalPlannedBudget[rowDef] = 0;
    });
    this.totalPlannedBudget = {}
    this.dataSource.data.forEach(element => {
      this.getTotalRoom(element);
      this.calTotalCountForeign(element);
      this.calTotalAmount(element);
      this.calTotalPlanBudget(element);
    });
  }

  calTotalPlanBudget(element: any) {
    this.totalPlannedBudgetRowDef.forEach(rowDef => {
      if (rowDef !== 'plannedBudget') {
        this.setTotalPlannedBudget(rowDef, element);
      }
    });
  }

  getTotalPlannedBudget(control: any) {
    return Math.round(this.totalPlannedBudget[control]);
  }

  setTotalPlannedBudget(control: string, element: any) {
    let _formula = formula[control]?.formula;
    if (control.includes('_')) {
      const hotelCode = control.slice(control.indexOf('_') + 1);
      _formula = formula['totalAmountPlanHotel']?.formula;
      if (_formula) {
        const _hotelItem = element.hotelItem[hotelCode];
        const result = this.calWithFormula(_formula, _hotelItem, this.dataGeneral());
        this.totalPlannedBudget[control] = (this.totalPlannedBudget[control] ?? 0) + Number(result);
      }
    } else if (['ft2TotalExcVAT', 'ft2TotalIncVAT', 'ft2TotalCountForeign'].includes(control)) {
      if (_formula) {
        this.totalPlannedBudget[control] = (this.totalPlannedBudget[control] ?? 0) + Number(this.calWithFormula(_formula, element, this.dataGeneral()));
      }
    } else {
      this.totalPlannedBudget[control] = null
    }
    // });
  }

  calWithFormula(formula: string, item: any, dataGeneral?: any) {
    const formulaFunction = new Function(
      'item', 'dataGeneral',
      `return ${formula};`
    );
    return formulaFunction(item, dataGeneral);
  }

  // tính toán tổng số phòng
  getTotalRoom(element: any) {
    element.totalQtySingleRoom = Object.entries(element.hotelItem).map(
      (t: any[]) => Number(t[1].totalSingleRoom ?? 0)).reduce((acc, value) => acc + value, 0);
    element.totalQtyTwinRoom = Object.entries(element.hotelItem).map((t: any[]) => Number(t[1].totalTwinRoom ?? 0))
      .reduce((acc, value) => acc + value, 0);
  }

  // tính tiền ngoại tệ
  calTotalCountForeign(element: any) {
    const _totalForex = Object.entries<any>(element.hotelItem).map(([_hotelCode, _hotelValue]) => {
      return Number(_hotelValue.singleRoomPrice ?? 0) * Number(_hotelValue.totalSingleRoom ?? 0) + Number(_hotelValue.twinRoomPrice ?? 0) * Number(_hotelValue.totalTwinRoom ?? 0)
    }).reduce((acc, value) => acc + value, 0)
    if (this.category() === CategoryEnum.INTERNATIONAL) {
      element.totalCountForeign = _totalForex
    } else {
      element.totalCountForeign = 0;
    }
    return _totalForex;
  }

  // tính thành tiền chưa vat và có vat
  calTotalAmount(element: any) {
    // element.totalExcVAT = _totalCountForeign * (this.dataGeneral().exchangeRate ?? 1);
    // element.totalIncVAT = (element.totalExcVAT) + (element.totalExcVAT * (this.dataGeneral().rateVat ?? 0) / 100)
    element.totalIncVAT = this.calTotalCountForeign(element) * (this.dataGeneral().exchangeRate ?? 1);
    element.totalExcVAT = element.totalIncVAT / (1 + (this.dataGeneral().rateVat ?? 0) / 100)
  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string, parrentData: any) {
    data[control] = false;
    this.getTotalRoom(parrentData);
    this.calTotalCountForeign(parrentData);
    this.calTotalAmount(parrentData);
    this.totalPlannedBudget = {}
    this.dataSource.data.forEach(element => {
      this.calTotalPlanBudget(element);
    });
  }

  ngOnDestroy() {
    this.exchangeRateSubscription.unsubscribe();
    this.rateVatSubscription.unsubscribe();
    this.roomPriceSubscription.unsubscribe();
  }
}
