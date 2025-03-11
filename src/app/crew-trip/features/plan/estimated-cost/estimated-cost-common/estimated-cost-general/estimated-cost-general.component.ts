import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, ElementRef, inject, input, model, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
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
import { DigitOnlyModule } from '@uiowa/digit-only';
import moment from 'moment';
import { NgxControlError } from 'ngxtension/control-error';
import { ifValidator } from 'ngxtension/if-validator';
import { debounceTime } from 'rxjs';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { categories } from '../../../budget-procurement/budget-procurement.model';
import { CategoriesEnum } from '../../estimated-cost.model';

@Component({
  selector: 'app-estimated-cost-general',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent
  ],
  templateUrl: './estimated-cost-general.component.html',
  styleUrl: './estimated-cost-general.component.scss'
})
export class EstimatedCostGeneralComponent extends CommonComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly flightMarketService = inject(FlightMarketService);

  category = input<string>(''); //International,Domestic  loại quốc tế hay quốc nội
  formValueChanges = output<any>();

  categorys: any[] = categories.filter((item: any) => !!item.code).map((item: any) => item.code);

  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;
  airports = model<any[]>([]);
  disabled = input<boolean>(false);

  CategoriesEnum = CategoriesEnum;

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

  override formGroupDetail = this.formBuilder.group({
    category: new FormControl({ value: '', disabled: true }, Validators.required),
    airportCode: new FormControl('', Validators.required),
    rateForSingle: new FormControl(),
    notes: new FormControl('', [Validators.maxLength(500)])
  });


  override ngOnInit(): void {
    this.flightMarketService.search({ option: 1, type: this.category() }).then((res: any) => {
      this.airports.set(res.data);
    });

    this.formGroupDetail.valueChanges.pipe(debounceTime(1000)).subscribe((value: any) => {
      this.formValueChanges.emit(value);
    })
  }



  submit(): void {
    this.formGroupDetail.updateValueAndValidity();
    Object.keys(this.formGroupDetail.controls).forEach((key: string) => {
      this.formGroupDetail.get(key)?.markAsDirty();
      this.formGroupDetail.get(key)?.updateValueAndValidity();
    });
    console.log(this.formGroupDetail);
  }




  /**
   * 
   * @param isCheckProcurementPlan Để handle check lập kế hoạch mua sắm hoặc init giá trị mặc định khi load detail
   */
  setDefaultValueGeneral(): void {
    if (!this.formGroupDetail.controls.rateForSingle.value) {
      this.formGroupDetail.controls.rateForSingle.setValue('20');
    }

  }

  private _unitPriceDoubleHotel: string = '';
  get unitPriceDoubleHotel(): string {
    return this._unitPriceDoubleHotel;
  }
  set unitPriceDoubleHotel(value: string) {
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
    let result: string[] = [];
    if (value) {
      const entries = Object.entries(JSON.parse(value));
      for (const [key, value] of entries) {
        result.push(`${key} : ${this.dataTransformPipe.transform(value, [Constant.NUMBER])}`);
      }
    }
    this._unitPriceSingleHotel = result.join('\n');
  }
}
