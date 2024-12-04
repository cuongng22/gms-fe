import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {
  MatDatepickerActions,
  MatDatepickerApply, MatDatepickerCancel, MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";

@Component({
  selector: 'app-other-crew',
  standalone: true,
  imports: [
    FormsModule,
    InputSizeComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerActions,
    MatDatepickerApply,
    MatDatepickerCancel,
    MatDatepickerToggle,
    MatEndDate,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatStartDate,
    MatSuffix,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './other-crew.component.html',
  styleUrl: './other-crew.component.scss'
})
export class OtherCrewComponent  extends CommonComponent implements OnInit {
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: any[] = [];
  filteredOptionsMarket: any[];
  fb = inject(FormBuilder);


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      area: ['', [Validators.required]],
      code: ['', [Validators.required]],
      vniName: ['', [Validators.required, Validators.maxLength(250)]],
      engName: ['', [Validators.required, Validators.maxLength(250)]],
      curCode: [''],
      active: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }



  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket = this.markets;
    }
    this.filteredOptionsMarket = this.markets.filter(market => market.toLowerCase().includes(filterValue));
  }

  onFocusMarket(): void {
    this.filteredOptionsMarket = this.markets;
    this.autocompleteTrigger.openPanel();
  }
}
