import {Component, inject, OnInit} from '@angular/core';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatAnchor, MatButton, MatButtonModule} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTab, MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {CommonModule, NgIf} from '@angular/common';
import {PaymentEmailComponent} from 'src/app/crew-trip/features/system/config/payment-mail/payment-mail.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {MatDialog} from '@angular/material/dialog';
import {NgxEditorModule, Validators} from 'ngx-editor';
import {NotificationConfigService} from 'src/app/crew-trip/core/services/notification-config.service';
import {
  NotificationSetupComponent
} from 'src/app/crew-trip/features/system/config/notification-setup/notification-setup.component';
import {MatNativeDateModule, MatOption} from "@angular/material/core";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {RouterModule} from "@angular/router";
import {MatCheckbox} from "@angular/material/checkbox";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {SelectMultipleComponent} from "src/app/crew-trip/shared/component/select-multiple/select-multiple.component";
import {SelectOptions} from "src/app/crew-trip/shared/select-option";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";

@Component({
  selector: 'app-notification',
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
    NotificationSetupComponent,
    MatCheckbox,
    NgxEditorModule,
    NgxTrimDirectiveModule,
    SelectMultipleComponent,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent extends CommonComponent implements OnInit {
  override baseService = inject(NotificationConfigService);
  userService =  inject(UsersService);
  activeTab = 0;
  isView = false;
  notiConfigType = SelectOptions.NOTI_CONFIG_TYPE;

  users = [];
  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    {label: $localize`:@@name:Type`, value: 'type'},
    {label: $localize`:@@airportCode:Notification channel`, value: 'notiChannel'},
    {label: $localize`:@@note:Remark`, value: 'note'},
    {label: $localize`:@@note:User`, value: 'users'},
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
      this.getListUser(),
      this.search(),
    ]).then(() => {
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.index;
  }

  async getListUser() {
    this.userService.search({page: 0, limit: 99999, active: true}).then(res => {
      this.users = res.data.content.map((data: { email: any; }) => data.email);
    });
  }

  override async showDialogDetail(id?: any, type?: string) {
    this.isView = false;
    this.formGroupDetail.enable();
    if (id != null && type === 'index') {
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  override async detail(id: any) {
    try {
      await this.spinner.show();
      const res = await this.baseService.detail(id);
      if (res?.data) {
        if (typeof res.data.users === "string") {
          try {
            res.data.users = res.data.users.includes(",")
              ? res.data.users.split(",").map((item: string) => item.trim())
              : [res.data.users.trim()];
          } catch (error) {
            console.error("Failed to parse items field:", error);
            res.data.users = [];
          }
        }
        console.log("res?.data:",res?.data)
        this.formGroupDetail.patchValue(res?.data || res);
      }
    } catch (e: any) {
      this.baseService.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
      );
    } finally {
      await this.spinner.hide();
    }
  }
}
