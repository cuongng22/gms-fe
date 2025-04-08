import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterModule } from '@angular/router';
import { Moment } from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxControlError } from 'ngxtension/control-error';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-email-notification-search',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    DataTransformPipe, RouterLink, RouterModule, AsyncPipe, SelectionSuggestComponent, SelectionComponent,
    SelectMultipleComponent, NgxControlError
  ],
  templateUrl: './email-notification-search.component.html',
  styleUrl: './email-notification-search.component.scss'
})
export class EmailNotificationSearchComponent extends CommonComponent {

  status = [
    { code: true, value: $localize`:@@success:Success` },
    { code: false, value: $localize`:@@failure:Failure` },
  ]

  searchEvent = output<any>();
  type = input()

  override formGroupSearch = this.formBuilder.group({
    title: [''],
    status: [''],
    startTimeSend: new FormControl<Moment | string | Date>(''),
    endTimeSend: new FormControl<Moment | string | Date>(''),
  });


  onSearch() {
    this.searchEvent.emit(this.formGroupSearch.getRawValue())
  }
}
