import { AfterViewChecked, ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { InputSizeComponent } from '../../input/input-size.component';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxControlError } from 'ngxtension/control-error';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DATE_FORMAT_DD_MM_YYYY, MESSAGE } from '../../utils/constant';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatAutocompleteModule, CommonModule, NgxControlError,
    MatIconModule, MatDatepickerModule
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  hostDirectives: [NgxControlValueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [
  //   provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY)
  // ]

})
export class DatepickerComponent implements OnInit {
  MESSAGE = MESSAGE;
  size = input<string>('sm');
  label = input<string>('');

  protected datepickerControl = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor
  );
  get formControl(): FormControl {
    return (this.datepickerControl?.ngControl?.control as FormControl) ?? new FormControl();
  }

  get requiredControl(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  ngOnInit(): void {
  }

}
