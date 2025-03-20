import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Validators } from 'ngx-editor';
import { NgxControlError } from 'ngxtension/control-error';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DatepickerComponent } from 'src/app/ui-elements/datepicker/datepicker.component';

@Component({
  selector: 'app-budget-procurement-cost-analysis',
  standalone: true,
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerComponent, DigitOnlyModule, ThousandsSeparatorDirective],
  templateUrl: './budget-procurement-cost-analysis.component.html',
  styleUrl: './budget-procurement-cost-analysis.component.scss'
})
export class BudgetProcurementCostAnalysisComponent extends CommonComponent implements OnInit {
  disabled = input<boolean>(false);
  data = input<any>();

  override formGroupDetail = this.formBuilder.group({
    planVsEstimate: new FormControl(),
    planVsEstimateRate: new FormControl(),
    ratePriceRoomBefore: new FormControl(),
    ratePriceCarBefore: new FormControl(),
    notes: new FormControl('', [Validators.maxLength(500)]),
  });

  constructor() {
    super();
    effect(() => {
      if (this.disabled()) {
        this.formGroupDetail.disable()
      } else {
        this.formGroupDetail.enable()
      }
    })

    effect(() => {
      if (this.data()) {
        this.formGroupDetail.patchValue(this.data());
      }
    })
  }
}
