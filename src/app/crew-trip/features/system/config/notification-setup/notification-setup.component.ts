import {Component, inject, OnInit} from '@angular/core';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {NotificationConfigService} from 'src/app/crew-trip/core/services/notification-config.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NotificationSetupService} from 'src/app/crew-trip/core/services/notification-setup.service';
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAnchor, MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatNativeDateModule, MatOption} from "@angular/material/core";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {CommonModule, NgClass} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {NgxEditorModule, Validators} from "ngx-editor";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {RouterModule} from "@angular/router";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatCheckbox} from "@angular/material/checkbox";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {SelectMultipleComponent} from "src/app/crew-trip/shared/component/select-multiple/select-multiple.component";
import {SelectOptions} from "src/app/crew-trip/shared/select-option";

@Component({
  selector: 'app-notification-setup',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    InputSizeComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatAutocompleteModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    DataTransformPipe,
    RouterModule,
    MatTabGroup,
    MatTab,
    MatCheckbox,
    NgxEditorModule,
    NgxTrimDirectiveModule,
    SelectMultipleComponent,
  ],
  templateUrl: './notification-setup.component.html',
  styleUrl: './notification-setup.component.scss'
})
export class NotificationSetupComponent extends CommonComponent implements OnInit  {
  override baseService = inject(NotificationSetupService);
  notiConfigType = SelectOptions.NOTI_CONFIG_TYPE;


  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    {label: $localize`:@@name:Type`, value: 'type'},
    {label: $localize`:@@airportCode:Notification settings`, value: 'notiSetting'},
    {label: $localize`:@@note:Regular notification`, value: 'regularNoti'},
    {label: $localize`:@@note:Airport Code`, value: 'airportCode'},
    {label: $localize`:@@note:Remark`, value: 'note'},
    { label: $localize`:@@status:Status`, value: 'active' }
  ];

  constructor(public override dialog: MatDialog) {
    super();
    this.formGroupDetail = this.formBuilder.group({
      id: [],
      type: ['', Validators.required],
      notiChannel: ['', Validators.required],
      users: ['', Validators.required],
      note: [''],
      active: [true],
    });
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    active: ['']
  });

  override async  ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    await Promise.all([
      this.search(),
    ]).then(() => {
    });
  }

}
