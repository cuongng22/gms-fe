import {Component, inject, OnInit} from '@angular/core';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {
  MatCardModule,
} from '@angular/material/card';
import {
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule, MatOption} from '@angular/material/autocomplete';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {CrewsService} from 'src/app/crew-trip/core/services/crews-service';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {Validators} from 'ngx-editor';
import {CrewsDetailComponent} from 'src/app/crew-trip/features/category/crews/crews-detail/crews-detail.component';
import {MatDialog} from '@angular/material/dialog';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {
  GroupMailDetailComponent
} from 'src/app/crew-trip/features/system/config/group-mail/group-mail-detail/group-mail-detail.component';

@Component({
  selector: 'app-group-mail',
  standalone: true,
  imports: [
    MatCardModule,  MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule
  ],
  templateUrl: './group-mail.component.html',
  styleUrl: './group-mail.component.scss'
})
export class GroupMailComponent extends CommonComponent implements OnInit {
  override baseService = inject(GroupMailService);
  formBuilder = inject(FormBuilder);


  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    // { label: $localize`:@@pid:PID`, value: 'pid' },
    { label: $localize`:@@name:Name`, value: 'groupName' },
    { label: $localize`:@@airportCode:Airport code`, value: 'marketCode' },
    { label: $localize`:@@note:Description`, value: 'notes' },
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

  async grMailDetail(id?: any,mode?:string) {
    let response;
    if(id){
      response = await this.baseService.detail(id);
    }
    const dialogRef = this.dialog.open(GroupMailDetailComponent, {
      data: response ? { grMail: { ...response.data }, mode:mode } : null,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }
}
