import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, OnInit, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { CategoryEnum, PADDING_0 } from '../../budget-procurement.model';
import { DomesticPrice, InternationalPrice } from './budget-procurement-price.model';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';

@Component({
  selector: 'app-budget-procurement-price',
  standalone: true,
  imports: [
    MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule,
    ThousandsSeparatorDirective
  ],
  templateUrl: './budget-procurement-price.component.html',
  styleUrl: './budget-procurement-price.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetProcurementPriceComponent implements OnInit {
  column = ['type', 'priceBeforeTax', 'vat', 'priceAfterTax'];
  PADDING_0 = PADDING_0;
  dataSource = new MatTableDataSource();
  category = input.required<CategoryEnum>();
  data = input<string>('');
  priceChange = output<any[]>()

  ngOnInit(): void {

  }

  constructor() {
    effect(() => {
      console.log('budget-procurement-price data: ', this.data())
      if (this.data()) {
        this.setDataSource(this.data());
      } else {
        if (CategoryEnum.INTERNATIONAL === this.category()) {
          this.dataSource.data = JSON.parse(JSON.stringify(InternationalPrice));
        } else {
          this.dataSource.data = JSON.parse(JSON.stringify(DomesticPrice));
        }
      }
    })
  }

  setDataSource(value: any) {
    this.dataSource.data = JSON.parse(value);
  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
    switch (control) {
      case 'priceBeforeTaxEditing':
      case 'vatEditing':
        data.priceAfterTax = (Number(data.priceBeforeTax) * Number(data.vat) / 100) + Number(data.priceBeforeTax);
    }
    this.priceChange.emit(this.dataSource.data)
  }
}
