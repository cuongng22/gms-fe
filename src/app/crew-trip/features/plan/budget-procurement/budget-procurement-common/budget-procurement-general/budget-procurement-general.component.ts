import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, DestroyRef, effect, ElementRef, inject, input, model, OnInit, output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { debounceTime, startWith, Subject } from 'rxjs';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { NgxControlError } from 'ngxtension/control-error';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { categories, CategoryEnum } from '../../budget-procurement.model';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { ifValidator } from 'ngxtension/if-validator';
import { ValidationErrors } from '@iplab/ngx-file-upload';
import moment from 'moment';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { el } from 'node_modules/@fullcalendar/core/internal-common';
import { BudgetProcurementPriceComponent } from '../budget-procurement-price/budget-procurement-price.component';
import { CurrencyService } from 'src/app/crew-trip/core/services/currency.service';
import { DatepickerComponent } from 'src/app/crew-trip/shared/component/datepicker/datepicker.component';

@Component({
  selector: 'app-budget-procurement-general',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    BudgetProcurementPriceComponent,DatepickerComponent
  ],
  templateUrl: './budget-procurement-general.component.html',
  styleUrl: './budget-procurement-general.component.scss',
  providers: [DataTransformPipe]
})
export class BudgetProcurementGeneralComponent extends CommonComponent implements OnInit, AfterViewChecked {
  cdRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly flightMarketService = inject(FlightMarketService);
  private readonly currencyService = inject(CurrencyService);
  @ViewChild('budgetProcurementPrice', { static: false }) budgetProcurementPrice: BudgetProcurementPriceComponent;


  category = input.required<CategoryEnum>(); //International,Domestic  loại quốc tế hay quốc nội
  formValueChanges = output<any>();
  exchangeRateChange = output<any>();
  priceChange = output<any[]>();

  categorys: any[] = categories.filter((item: any) => !!item.code).map((item: any) => item.code);
  version: string;
  _exchangeRate: any

  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;
  airports = model<any[]>([]);
  disabled = input<boolean>(false);

  CategoryEnum = CategoryEnum;
  currencyCodes: any[] = []

  constructor(private dataTransformPipe: DataTransformPipe) {
    super();
    effect(() => {
      if (this.disabled()) {
        this.formGroupDetail.disable();
      } else {
        this.formGroupDetail.enable();
      }
    }, { allowSignalWrites: true });
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    // this.formGroupDetail.controls.currencyCode.setValidators(ifValidator(() => this.checkRequiredCurrency(), Validators.required))
    // this.formGroupDetail.controls.currencyCode.updateValueAndValidity()

  }

  override formGroupDetail = this.formBuilder.group({
    budgetPlanFlag: new FormControl(true),
    category: new FormControl({ value: '', disabled: true }, Validators.required),
    airportCode: new FormControl({ value: '', disabled: true }, Validators.required),
    division: new FormControl('', [Validators.maxLength(100)]),
    // unitPriceHotel: new FormControl(''),
    // unitPriceDoubleHotel: new FormControl(''),
    rateForSingle: new FormControl(),
    procurementPlanFlag: new FormControl(false),
    procStartDate: new FormControl('', [ifValidator(() => !!this.procurementPlanFlag, Validators.required)]),
    procEndDate: new FormControl('', [ifValidator(() => !!this.procurementPlanFlag, Validators.required),
    this.endDateLessThanStartDate.bind(this)
    ]),
    totalTime: new FormControl('', [Validators.maxLength(3)]),
    estimateTime: new FormControl(''),
    time: new FormControl('', [Validators.maxLength(3)]),
    num: new FormControl(''),
    unit: new FormControl(''),
    supplierMethod: new FormControl('Chào giá/ Đàm phán'),
    earlyCheckinFlag: new FormControl(false),
    lateCheckoutFlag: new FormControl(false),
    // thêm trường để check hiển thị, ko làm gì cả
    earlyCheckinContractFlag: new FormControl(false),
    lateCheckoutContractFlag: new FormControl(false),
    haveContract: new FormControl(false),
    wetLeaseFlag: new FormControl(false),
    currencyCode: new FormControl('', [Validators.required])

  });
  _procurementPlanFlag: boolean = false;
  _haveContract: boolean = false;


  override ngOnInit(): void {
    this.flightMarketService.search({ option: 0, type: this.category(), page: 0, size: 99999 }).then((res: any) => {
      this.airports.set(res.data.content.map((item: any) => item.marketCode));
    });

    this.formGroupDetail.controls.procurementPlanFlag.valueChanges.subscribe((value: any) => {
      this.procurementPlanFlag = !!value;
    });

    this.formGroupDetail.controls.procEndDate.valueChanges.subscribe((value: any) => {
      this.formGroupDetail.controls.procEndDate.updateValueAndValidity({ emitEvent: false });
      this.calculateTotalTime();
    });
    this.formGroupDetail.controls.procStartDate.valueChanges.subscribe((value: any) => {
      this.formGroupDetail.controls.procEndDate.updateValueAndValidity({ emitEvent: false });
      this.calculateTotalTime();
    });

    this.formGroupDetail.valueChanges.pipe(debounceTime(1000)).subscribe((value: any) => {
      this.formValueChanges.emit(value);
    });
  }



  submit(): void {
    this.formGroupDetail.updateValueAndValidity();
    Object.keys(this.formGroupDetail.controls).forEach((key: string) => {
      this.formGroupDetail.get(key)?.markAsDirty();
      this.formGroupDetail.get(key)?.updateValueAndValidity();
    });
    console.log(this.formGroupDetail);
  }

  // cái này để lấy version để lấy tỉ giá
  setVerionRate(version: string) {
    if (version) {
      this.version = version;
      this.currencyService.getAllCurrencyCode(version, 'P').then((res: any) => {
        this.currencyCodes = res.data;
      })
    }
  }

  async currencyCodeChange(event: any, eventEmitter?: boolean) {
    if (event?.value) {
      const res = await this.currencyService.getExchangeRateByCurrencyCode(event.value, this.version, 'P');
      if (res.data) {
        if (eventEmitter) {
          this.exchangeRateChange.emit(res.data);
        }
        this.exchangeRate = res.data
      }
    }
  }

  get procurementPlanFlag(): boolean {
    return this._procurementPlanFlag;
  }
  set procurementPlanFlag(value: boolean) {
    this._procurementPlanFlag = value;
    this.setDefaultValueGeneral(this._procurementPlanFlag);
  }

  get haveContract(): boolean {
    return !!this.formGroupDetail?.controls.haveContract.value;
  }

  endDateLessThanStartDate(control: AbstractControl): ValidationErrors | null {
    const startDate = this.formGroupDetail?.controls?.procStartDate.value;
    const endDate = this.formGroupDetail?.controls?.procEndDate.value;
    if (endDate && startDate && moment(startDate).isAfter(endDate)) {
      return { endDateLessThanStartDate: true };
    }
    return null;
  }

  calculateTotalTime(): void {
    //Thời gian mua sắm đến - Thời gian mua sắm từ
    const startDate = this.formGroupDetail.controls.procStartDate.value;
    const endDate = this.formGroupDetail.controls.procEndDate.value;
    if (startDate && endDate && moment(startDate).isBefore(endDate)) {
      const totalTime = (moment(endDate).diff(moment(startDate), 'months')) + 1;
      this.formGroupDetail.controls.totalTime.setValue(totalTime.toString());
    } else {
      this.formGroupDetail.controls.totalTime.setValue(null);
    }
  }

  /**
   * 
   * @param isCheckProcurementPlan Để handle check lập kế hoạch mua sắm hoặc init giá trị mặc định khi load detail
   */
  setDefaultValueGeneral(isCheckProcurementPlan?: boolean): void {
    if (!!!this.formGroupDetail.controls.rateForSingle.value) {
      this.formGroupDetail.controls.rateForSingle.setValue('20');
    }
    if (!!!this.formGroupDetail.controls.division.value) {
      this.formGroupDetail.controls.division.setValue('Khai thác');
    }
    if (this.formGroupDetail.controls.budgetPlanFlag.value === null ||
      this.formGroupDetail.controls.budgetPlanFlag.value === undefined) {
      this.formGroupDetail.controls.budgetPlanFlag.setValue(true);
    }
    if (isCheckProcurementPlan) {
      this.formGroupDetail.controls.procStartDate.setValue(null);
      this.formGroupDetail.controls.procStartDate.markAsUntouched();
      this.formGroupDetail.controls.procEndDate.setValue(null);
      this.formGroupDetail.controls.procEndDate.markAsUntouched();
      this.formGroupDetail.controls.totalTime.setValue(null);
      this.formGroupDetail.controls.estimateTime.setValue(null);
      this.formGroupDetail.controls.time.setValue(null);
      this.formGroupDetail.controls.earlyCheckinFlag.setValue(
        this.formGroupDetail.controls.earlyCheckinFlag.value ?? !!this.formGroupDetail.controls.earlyCheckinContractFlag.value);
      this.formGroupDetail.controls.lateCheckoutFlag.setValue(
        this.formGroupDetail.controls.lateCheckoutFlag.value ?? !!this.formGroupDetail.controls.lateCheckoutContractFlag.value);
      this.formGroupDetail.controls.num.setValue(this.procurementPlanFlag ? '1' : null);
      this.formGroupDetail.controls.unit.setValue(this.procurementPlanFlag ? 'Gói HĐ/DV' : null);
      this.formGroupDetail.controls.supplierMethod.setValue(this.procurementPlanFlag ? 'Chào giá/ Đàm phán' : null);
    }
  }

  private _unitPriceDoubleHotel: string = '';
  get unitPriceDoubleHotel(): string {
    return this._unitPriceDoubleHotel;
  }
  set unitPriceDoubleHotel(value: string) {
    console.log('===> set unitPriceDoubleHotel: ', value)
    let result: string[] = [];
    if (value) {
      const entries = Object.entries(JSON.parse(value));
      for (const [key, value] of entries) {
        result.push(`${key} : ${this.dataTransformPipe.transform(value, [Constant.NUMBER])}`);
      }
    }
    this._unitPriceDoubleHotel = result.join('\n');
  }

  private _unitPriceSingleHotel: string = '';
  get unitPriceSingleHotel(): string {
    return this._unitPriceSingleHotel;
  }
  set unitPriceSingleHotel(value: string) {
    console.log('===> set unitPriceSingleHotel: ', value)
    let result: string[] = [];
    if (value) {
      const entries = Object.entries(JSON.parse(value));
      for (const [key, value] of entries) {
        result.push(`${key} : ${this.dataTransformPipe.transform(value, [Constant.NUMBER])}`);
      }
    }
    this._unitPriceSingleHotel = result.join('\n');
  }

  priceChangeEvent(data: any[]) {
    if (data && data.length > 0) {
      this.priceChange.emit(data)
    }
  }

  private _inputPrice: string = '';
  get inputPrice(): string {
    return this._inputPrice
  }

  set inputPrice(value: string) {
    this._inputPrice = value;
  }

  get exchangeRate() {
    return this._exchangeRate;
  }

  set exchangeRate(value: any) {
    this._exchangeRate = value;
  }

  checkRequiredCurrency(): boolean {
    return !this.haveContract && this.category() === CategoryEnum.INTERNATIONAL
  }
}
