import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
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
import { getHeaderRowDef1, getRowDef, planHotels } from './charter-hotel.model';

@Component({
  selector: 'app-charter-hotel',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    DatepickerComponent, MatDatepickerModule, NgxControlError, ClickOutside
  ],
  templateUrl: './charter-hotel.component.html',
  styleUrl: './charter-hotel.component.scss'
})
export class CharterHotelComponent extends CommonComponent {
  disabled = input<boolean>(false);
  category = input.required<CategoryEnum>(); // quốc tế hoặc quốc nội
  dataGeneral = input<any>()
  CategoryEnum = CategoryEnum;
  headerRowDef1: string[] = [];
  headerRowDef2 = ['totalIncVAT', 'totalExcVAT'];
  rowDef: string[] = [];
  totalRowDef = ['total', 'totalForex', 'totalExcVAT', 'totalIncVAT',];
  data = input<any[]>();

  constructor() {
    super();
    effect(() => {
      if (this.data()) {
        this.setDataSource(this.data() ?? {});
      }
    });

    effect(() => {
      if (this.dataGeneral()) {
        this.headerRowDef1 = getHeaderRowDef1(this.dataGeneral());
        this.rowDef = getRowDef(this.dataGeneral());
      }
    })
  }
  override ngOnInit(): void {
    // this.dataSource.data = Object.entries(planHotels);
  }

  setDataSource(value: any) {
    this.dataSource.data = Object.entries(value);
    this.dataSource.data.forEach(element => {
      this.calTotalCountForeign(element[1]);
      this.calTotalAmount(element[1]);
    })
  }


  getTotal(formula: string) {
    return Math.round(this.dataSource.data.map((item: any) => {
      return Number(this.calWithFormula(formula, item));
    }).reduce((acc, value) => acc + value, 0));
  }

  calWithFormula(formula: string, item: any, dataGeneral?: any) {
    const formulaFunction = new Function(
      'item', 'dataGeneral',
      `return ${formula};`
    );
    return formulaFunction(item, dataGeneral);
  }

  // tính tiền ngoại tệ
  calTotalCountForeign(element: any) {
    element.totalForex = Number(element.priceRoom ?? 0) * Number(element.totalNormalRoom ?? 0) * Number(element.numberOfNight ?? 0)
      + Number(element.priceRoomECI ?? 0) * Number(element.totalECIRoom ?? 0)
      + Number(element.priceRoomLCO ?? 0) * Number(element.totalLCORoom ?? 0);
  }

  // tính thành tiền chưa vat và có vat					
  calTotalAmount(element: any) {
    element.totalExcVAT = element.totalForex * (element.exchangeRate ?? 1);
    element.totalIncVAT = (element.totalExcVAT) + (element.totalExcVAT * (element.rateVat ?? 0) / 100)
  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
    this.calTotalCountForeign(data);
    this.calTotalAmount(data);
  }



}
