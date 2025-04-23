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
import { formula } from './wet-lease-car-rental.model';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { WetLeaseService } from 'src/app/crew-trip/core/services/wet-lease.service';

@Component({
  selector: 'app-wet-lease-car-rental',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    DatepickerComponent, MatDatepickerModule, NgxControlError, ClickOutside, ThousandsSeparatorDirective
  ],
  templateUrl: './wet-lease-car-rental.component.html',
  styleUrl: './wet-lease-car-rental.component.scss',
  providers: [DataTransformPipe]
})
export class WetLeaseCarRentalComponent extends CommonComponent implements OnDestroy {
  override baseService: WetLeaseService = inject(WetLeaseService);
  CategoryEnum = CategoryEnum;
  headerRowDef1 = ['transportName', 'numberOfTrip', 'totalAmountForex', 'totalAmount'];
  headerRowDef2 = ['totalAmountExcVAT', 'totalAmountIncVAT'];
  rowDef = ['transportName', 'numberOfTrip', 'totalAmountForex', 'totalAmountExcVAT', 'totalAmountIncVAT'];
  totalRowDef = ['total', 'numberOfTrip', 'totalAmountForex', 'totalAmountExcVAT', 'totalAmountIncVAT'];
  totalPlanRowDef = ['totalPlan', 'totalAmountForexPlan', 'totalAmountExcVATPlan', 'totalAmountIncVATPlan'];
  data = input<any[]>()
  category = input.required<CategoryEnum>(); // quốc tế hoặc quốc nội
  dataGeneral = input<any>();
  disabled = input<boolean>(false);
  totalPlan: any = {};

  exchangeRateSubscription: Subscription;
  rateVatSubscription: Subscription;
  unitPriceTransportationSubscription: Subscription;

  constructor() {
    super();
    effect(() => {
      if (this.data() && (this.data()?.length ?? 0) > 0) {
        this.setDataSource(this.data() ?? []);
      }
    });
  }
  override ngOnInit(): void {
    this.exchangeRateSubscription = this.baseService.exchangeRate$.subscribe(data => {
      if (data) {
        const _exchangeRate = Number(data);
        if (this.dataGeneral()) {
          this.dataGeneral().exchangeRate = _exchangeRate;
          this.calculationAll()
        }
      }
    });

    this.rateVatSubscription = this.baseService.rateVat$.subscribe(data => {

      const _rateVat = Number(data ?? 0);
      if (this.dataGeneral()) {
        this.dataGeneral().rateVat = _rateVat;
        this.calculationAll()
      }

    });

    this.unitPriceTransportationSubscription = this.baseService.unitPriceTransportation$.subscribe(data => {
      if (data) {
        this.dataSource.data.forEach(element => {
          if (element.transportCode === data.carRentalCode) {
            element.unitPrice = Number(data.unitPrice);
            this.calculationAll()
          }
        });
      }
    });
  }


  setDataSource(value: any[]) {
    this.dataSource.data = [...value];
    this.calculationAll()
  }
  calculationAll() {
    this.dataSource.data.forEach(element => {
      this.calculationItem('totalAmountForex', element)
      this.calculationItem('totalAmountIncVAT', element)
      this.calculationItem('totalAmountExcVAT', element)
    });

    this.setTotal('numberOfTrip')
    this.setTotal('totalAmountForex')
    this.setTotal('totalAmountExcVAT')
    this.setTotal('totalAmountIncVAT')
  }

  getTotal(control: string) {
    return Math.round(this.totalPlan[control])
  }

  setTotal(control: string) {
    const result = (this.dataSource.data.map((item: any) => {
      const total = Number(this.calWithFormula(`item.${control}`, item));
      return total;
    }).reduce((acc, value) => acc + value, 0));
    this.totalPlan[control] = Math.round(result);
  }

  calWithFormula(formula: string, item: any) {
    const formulaFunction = new Function(
      'item', 'dataGeneral',
      `return ${formula};`
    );
    return Math.round(formulaFunction(item, this.dataGeneral()));
  }

  calculationItem(control: string, item: any) {
    const _formula = formula[control].formula;
    item[control] = this.calWithFormula(_formula, item)
  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
    this.calculationItem('totalAmountForex', data)
    this.calculationItem('totalAmountIncVAT', data)
    this.calculationItem('totalAmountExcVAT', data)
    this.setTotal('numberOfTrip')
    this.setTotal('totalAmountForex')
    this.setTotal('totalAmountExcVAT')
    this.setTotal('totalAmountIncVAT')
  }

  ngOnDestroy() {
    this.exchangeRateSubscription.unsubscribe();
    this.rateVatSubscription.unsubscribe();
    this.unitPriceTransportationSubscription.unsubscribe();
  }
}
