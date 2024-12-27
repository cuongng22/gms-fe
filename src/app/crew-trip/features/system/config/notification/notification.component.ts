import {Component, inject, OnInit} from '@angular/core';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatPaginator} from '@angular/material/paginator';
import {MatTab, MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {NgIf} from '@angular/common';
import {PaymentEmailComponent} from 'src/app/crew-trip/features/system/config/payment-mail/payment-mail.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from 'ngx-editor';
import {NotificationConfigService} from 'src/app/crew-trip/core/services/notification-config.service';
import {
  NotificationSetupComponent
} from 'src/app/crew-trip/features/system/config/notification-setup/notification-setup.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    DataTransformPipe,
    InputSizeComponent,
    MatAnchor,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatInput,
    MatLabel,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTab,
    MatTabGroup,
    MatTable,
    NgIf,
    PaymentEmailComponent,
    ReactiveFormsModule,
    NotificationSetupComponent
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent extends CommonComponent implements OnInit {
  override baseService = inject(NotificationConfigService);
  formBuilder = inject(FormBuilder);
  activeTab = 0;


  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    {label: $localize`:@@name:Name`, value: 'groupName'},
    {label: $localize`:@@airportCode:Airport code`, value: 'marketCode'},
    {label: $localize`:@@note:Description`, value: 'notes'},
    // { label: $localize`:@@status:Status`, value: 'status' }
  ];

  constructor(public dialog: MatDialog) {
    super();
  }

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    type: ['']
  });


  override formGroupDetail = this.formBuilder.group({
    id: [],
    groupName: ['', Validators.required],
    marketCode: [''],
    notes: ['', Validators.required],
    groupEmail: ['', Validators.required],
  });

  override ngOnInit(): void {
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    this.search();

  }

  onTabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.index;
  }
}
