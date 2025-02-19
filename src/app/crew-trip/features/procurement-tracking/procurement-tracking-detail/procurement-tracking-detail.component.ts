import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanelContent } from '@angular/material/expansion';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { NgxControlError } from 'ngxtension/control-error';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { ProcurementTrackingService } from 'src/app/crew-trip/core/services/procurement-tracking.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { DatepickerComponent } from 'src/app/crew-trip/shared/component/datepicker/datepicker.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Authoritys, ContractPeriods, Fields, SelectionMethods, SelectionUnits } from '../procurement-tracking.model';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-procurement-tracking-detail',
  standalone: true,
  imports: [
    MatCard,
    RouterLink,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatCardModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterModule, MatMenuModule,
    MatExpansionModule, MatExpansionPanelContent, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    DatepickerComponent, NgxControlError, ClickOutside,
    SelectionComponent, ThousandsSeparatorDirective

  ],
  templateUrl: './procurement-tracking-detail.component.html',
  styleUrl: './procurement-tracking-detail.component.scss',
  providers: [DataTransformPipe]
})
export class ProcurementTrackingDetailComponent extends CommonComponent implements AfterViewChecked {
  override baseService = inject(ProcurementTrackingService);
  dataTransformPipe = inject(DataTransformPipe)
  router = inject(Router);
  viewDetail = input<string>("true", { alias: 'view-detail' });
  id = input<number>();

  diffHSDXKHLCFore = viewChild<ElementRef>('diffHSDXKHLCFore');
  diffHSDXKHLCVnd = viewChild<ElementRef>('diffHSDXKHLCVnd');
  diffKHLCHSDXVnd = viewChild<ElementRef>('diffKHLCHSDXVnd');
  diffKHLCHSDXFore = viewChild<ElementRef>('diffKHLCHSDXFore');
  diffHDKHLCFore = viewChild<ElementRef>('diffHDKHLCFore');
  diffHDKHLCVnd = viewChild<ElementRef>('diffHDKHLCVnd');


  override formGroupDetail = this.formBuilder.group(
    {
      id: [],
      type: ['HOTEL'],
      airportCode: ['', [Validators.required]],
      servicePkgName: ['', [Validators.required, Validators.maxLength(100)]],
      currency: ['', [Validators.maxLength(100)]],
      authority: ['', [Validators.required]],
      field: ['KT'],
      department: ['TTĐHKT'],
      note: ['', [Validators.maxLength(500)]],
      startDate: [],
      selectionMethod: [],
      contractPeriod: [],
      planNumber: ['', [Validators.maxLength(10)]],
      planSelectionUnit: [],
      planUnitPriceIncVAT: ['', [Validators.maxLength(12)]],
      planTotalValueFore: ['', [Validators.maxLength(12)]],
      planTotalValueVND: ['', [Validators.maxLength(12)]],
      proposalUnitPriceIncVAT: ['', [Validators.maxLength(12)]],
      proposalTotalValueFore: ['', [Validators.maxLength(12)]],
      proposalTotalValueVND: ['', [Validators.maxLength(12)]],
      resultNumber: ['', [Validators.maxLength(10)]],
      resultSelectionUnit: [],
      resultUnitPriceIncVAT: ['', [Validators.maxLength(12)]],
      resultTotalValueFore: ['', [Validators.maxLength(12)]],
      resultTotalValueVND: ['', [Validators.maxLength(12)]],
      supplierName: ['', [Validators.maxLength(100)]],
      contractUnitPriceIncVAT: ['', [Validators.maxLength(12)]],
      contractTotalValueFore: ['', [Validators.maxLength(12)]],
      contractTotalValueVND: ['', [Validators.maxLength(12)]],
      diff_HSDX_KHLC_fore: ['', [Validators.maxLength(12)]],
      diff_HSDX_KHLC_vnd: ['', [Validators.maxLength(12)]],
      diff_KHLC_HSDX_fore: ['', [Validators.maxLength(12)]],
      diff_KHLC_HSDX_vnd: ['', [Validators.maxLength(12)]],
      diff_HD_KHLC_fore: ['', [Validators.maxLength(12)]],
      diff_HD_KHLC_vnd: ['', [Validators.maxLength(12)]],
    }
  );

  authoritys = Authoritys;
  fields = Fields;
  selectionMethods = SelectionMethods;
  contractPeriods = ContractPeriods;
  selectionUnits = SelectionUnits;

  constructor() {
    super();

  }
  ngAfterViewChecked(): void {

  }

  override ngOnInit(): void {
    this.loadListFlightMarket({ status: 'Operational' });
    this.getDetailById(this.id())
    this.registerValueChange()
  }

  async getDetailById(id: number | undefined) {
    if (id) {
      let resDetail = await this.baseService.detail(this.id());
      this.formGroupDetail.patchValue({ ...resDetail.data }, { emitEvent: false });
      if (this.disable) {
        this.formGroupDetail.disable()
      }
    }
  }

  override async save(): Promise<any> {
    let body = this.formGroupDetail.getRawValue();
    if (this.formGroupDetail.controls.startDate.value) {
      body.startDate = this.dataTransformPipe.transform(this.formGroupDetail.controls.startDate.value, [this.Constant.DATE, this.Constant.DATE_FORMAT]);
    }
    try {
      await super.save(body);
      this.router.navigate(['/plan/est-plan/procurement-tracking'])
    } catch (e: any) {
      throw e
    }
  }

  registerValueChange() {
    // - Chênh lệch HSĐX - KHLC (ngoại tệ): Tự động tính lần đầu theo công thức: 
    // 'Tổng kế hoạch mua sắm (ngoại tệ) của mục III - Tổng kế hoạch mua sắm (ngoại tệ) của mục II'; 
    this.formGroupDetail.controls.proposalTotalValueFore.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('proposalTotalValueFore', value);
    })
    this.formGroupDetail.controls.planTotalValueFore.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('planTotalValueFore', value);
    })

    // - Chênh lệch HSĐX - KHLC (VND): Tự động tính lần đầu theo công thức: 
    // 'Tổng kế hoạch mua sắm (VND) của mục III - Tổng kế hoạch mua sắm (VND) của mục II'; 
    this.formGroupDetail.controls.proposalTotalValueVND.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('proposalTotalValueVND', value);
    })
    this.formGroupDetail.controls.planTotalValueVND.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('planTotalValueVND', value);
    })

    // - Chênh lệch KQLC - HSĐX (ngoại tệ): Tự động tính lần đầu theo công thức: 
    // 'Tổng kế hoạch mua sắm (ngoại tệ) của mục IV - Tổng kế hoạch mua sắm (ngoại tệ) của mục III'; 
    this.formGroupDetail.controls.resultTotalValueFore.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('resultTotalValueFore', value);
    })
    // this.formGroupDetail.controls.proposalTotalValueFore.valueChanges.pipe(
    //   debounceTime(1000)
    // ).subscribe(value => {
    //   this.changeValueCalculation('proposalTotalValueFore', value);
    // })

    // - Chênh lệch KQLC - HSĐX (VND): Tự động tính lần đầu theo công thức: 
    // 'Tổng kế hoạch mua sắm (VND) của mục IV - Tổng kế hoạch mua sắm (VND) của mục III'; 
    this.formGroupDetail.controls.resultTotalValueVND.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('resultTotalValueVND', value);
    })
    // this.formGroupDetail.controls.proposalTotalValueVND.valueChanges.pipe(
    //   debounceTime(1000)
    // ).subscribe(value => {
    //   this.changeValueCalculation('proposalTotalValueVND', value);
    // })

    // - Chênh lệch HĐ - KQLC (ngoại tệ): Tự động tính lần đầu theo công thức:
    //  'Tổng giá trị HĐ (ngoại tệ) của mục V - Tổng kế hoạch mua sắm (ngoại tệ) của mục IV';
    this.formGroupDetail.controls.contractTotalValueFore.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('contractTotalValueFore', value);
    })
    // this.formGroupDetail.controls.resultTotalValueFore.valueChanges.pipe(
    //   debounceTime(1000)
    // ).subscribe(value => {
    //   this.changeValueCalculation('resultTotalValueFore', value);
    // })

    // - Chênh lệch HĐ - KQLC (VND): Tự động tính lần đầu theo công thức: 
    // 'Tổng giá trị hợp đồng (VND) của mục V - Tổng kế hoạch mua sắm (VND) của mục IV';
    this.formGroupDetail.controls.contractTotalValueVND.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.changeValueCalculation('contractTotalValueVND', value);
    })
    // this.formGroupDetail.controls.resultTotalValueVND.valueChanges.pipe(
    //   debounceTime(1000)
    // ).subscribe(value => {
    //   this.changeValueCalculation('resultTotalValueVND', value);
    // })
  }
  // diffHSDXKHLCFore = viewChild<ElementRef>('diffHSDXKHLCFore');
  // diffHSDXKHLCVnd = viewChild<ElementRef>('diffHSDXKHLCVnd');
  // diffKHLCHSDXVnd = viewChild<ElementRef>('diffKHLCHSDXVnd');
  // diffKHLCHSDXFore = viewChild<ElementRef>('diffKHLCHSDXFore');
  // diffHDKHLCFore = viewChild<ElementRef>('diffHDKHLCFore');
  // diffHDKHLCVnd = viewChild<ElementRef>('diffHDKHLCVnd');

  changeValueCalculation(control: string, value: any) {
    if (control === 'proposalTotalValueFore' || control === 'planTotalValueFore') {
      const _value = (this.transformNumber(this.formGroupDetail.controls.proposalTotalValueFore.value)
        - this.transformNumber(this.formGroupDetail.controls.planTotalValueFore.value)).toString()
      this.formGroupDetail.controls.diff_HSDX_KHLC_fore.setValue(_value)
      const inputElement = this.diffHSDXKHLCFore()?.nativeElement;
      inputElement.value = this.formatNumber(_value)

    }

    if (control === 'proposalTotalValueVND' || control === 'planTotalValueVND') {
      const _value = (this.transformNumber(this.formGroupDetail.controls.proposalTotalValueVND.value)
        - this.transformNumber(this.formGroupDetail.controls.planTotalValueVND.value)).toString();
      this.formGroupDetail.controls.diff_HSDX_KHLC_vnd.setValue(_value);

      const inputElement = this.diffHSDXKHLCVnd()?.nativeElement;
      inputElement.value = this.formatNumber(_value)
    }

    if (control === 'resultTotalValueFore' || control === 'proposalTotalValueFore') {
      const _value = (this.transformNumber(this.formGroupDetail.controls.resultTotalValueFore.value)
        - this.transformNumber(this.formGroupDetail.controls.proposalTotalValueFore.value)).toString();
      this.formGroupDetail.controls.diff_KHLC_HSDX_fore.setValue(_value);

      const inputElement = this.diffKHLCHSDXFore()?.nativeElement;
      inputElement.value = this.formatNumber(_value)
    }

    if (control === 'resultTotalValueVND' || control === 'proposalTotalValueVND') {
      const _value = (this.transformNumber(this.formGroupDetail.controls.resultTotalValueVND.value)
        - this.transformNumber(this.formGroupDetail.controls.proposalTotalValueVND.value)).toString();
      this.formGroupDetail.controls.diff_KHLC_HSDX_vnd.setValue(_value);

      const inputElement = this.diffKHLCHSDXVnd()?.nativeElement;
      inputElement.value = this.formatNumber(_value)
    }

    if (control === 'contractTotalValueFore' || control === 'resultTotalValueFore') {
      const _value = (this.transformNumber(this.formGroupDetail.controls.contractTotalValueFore.value)
        - this.transformNumber(this.formGroupDetail.controls.resultTotalValueFore.value)).toString();
      this.formGroupDetail.controls.diff_HD_KHLC_fore.setValue(_value);

      const inputElement = this.diffHDKHLCFore()?.nativeElement;
      inputElement.value = this.formatNumber(_value)
    }

    if (control === 'contractTotalValueVND' || control === 'resultTotalValueVND') {
      const _value = (this.transformNumber(this.formGroupDetail.controls.contractTotalValueVND.value)
        - this.transformNumber(this.formGroupDetail.controls.resultTotalValueVND.value)).toString();
      this.formGroupDetail.controls.diff_HD_KHLC_vnd.setValue(_value)

      const inputElement = this.diffHDKHLCVnd()?.nativeElement;
      inputElement.value = this.formatNumber(_value)
    }

  }

  transformNumber(value: any) {
    if (value) {
      const _value = value.toString().replaceAll(',', '');
      return _value;
    }
    return 0;
  }


  get disable(): boolean {
    return (this.viewDetail() === 'true')
  }

  // Hàm định dạng số với dấu phân cách hàng nghìn
  private formatNumber(value: string | number): string {
    const parts = value.toString().split('.'); // Tách phần nguyên và thập phân
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-US'); // Thêm dấu phân cách hàng nghìn cho phần nguyên
    return parts.join('.'); // Ghép lại phần nguyên và thập phân
  }

}
