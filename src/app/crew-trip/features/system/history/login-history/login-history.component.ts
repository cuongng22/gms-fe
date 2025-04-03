import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput, MatDateRangePicker, MatDatepickerToggle, MatDatepickerCancel, MatDatepickerActions, MatDatepickerApply, MatDatepickerModule } from '@angular/material/datepicker';
import { MatLabel, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatCell, MatCellDef, MatFooterRow, MatFooterRowDef, MatFooterCell, MatFooterCellDef } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import moment, { Moment } from 'moment';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { bo } from 'node_modules/@fullcalendar/core/internal-common';
import { AuthLogService } from 'src/app/crew-trip/core/services/auth-log.service';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [
    FormsModule, InputSizeComponent, MatCard, MatCardContent, ReactiveFormsModule, MatDateRangeInput,
    MatDateRangePicker, MatLabel, MatFormFieldModule, MatDatepickerToggle,
    NgxTrimDirectiveModule, MatButton, MatDatepickerCancel, MatDatepickerActions,
    MatDatepickerApply, NgxControlError, NgxEditorModule, MatMenuModule,
    MatDatepickerModule, MatCardModule, MatAnchor, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatCell, MatCellDef, MatFooterRow, MatFooterRowDef, MatFooterCell, MatFooterCellDef, DecimalPipe, DataCalculateTotal, SelectMultipleComponent, MatPaginator, RouterLink, DataTransformPipe,
    MatFormField, MatInputModule,
    MatSelectModule, MatButtonModule,
    MatFormField, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    DataTransformPipe, RouterLink, RouterModule, AsyncPipe, SelectionSuggestComponent, SelectionComponent,
    SelectMultipleComponent, NgxControlError
  ],
  templateUrl: './login-history.component.html',
  styleUrl: './login-history.component.scss',
  providers: [
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY, { useUtc: true })
  ]
})
export class LoginHistoryComponent extends CommonComponent {
  override baseService: BaseService = inject(AuthLogService);

  //   {
  //     "createdByUsername": "dxhop@gimasys.com",
  //     "createdAt": "Sun Mar 23 10:53:02 ICT 2025",
  //     "actionDetail": "User logged in by email: dxhop@gimasys.com",
  //     "ipConfig": null
  // }
  override displayedColumns: string[] = ['stt', 'createdByUsername', 'device', 'ipConfig', 'loginTime'];
  override formGroupSearch = this.formBuilder.group({
    createdByUsername: [],
    startTimeSend: new FormControl<Moment | string | Date>(''),
    endTimeSend: new FormControl<Moment | string | Date>(''),
  });

  override ngOnInit(): void {
    this.search()
  }

  onSearch() {
    let body = this.formGroupSearch.getRawValue();
    body.startTimeSend = ((body.startTimeSend) ? (body.startTimeSend as Moment).format(this.Constant.DATE_FORMAT_YYYYMMDD) : '');
    body.endTimeSend = ((body.endTimeSend) ? (body.endTimeSend as Moment).format(this.Constant.DATE_FORMAT_YYYYMMDD) : '');

    this.search(body)
  }
}
