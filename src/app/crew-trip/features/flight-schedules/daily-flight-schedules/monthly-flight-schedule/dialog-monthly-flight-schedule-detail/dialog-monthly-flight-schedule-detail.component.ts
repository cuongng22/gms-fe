import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DialogOverviewExampleDialog, DialogData } from 'src/app/ui-elements/dialog/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-dialog-monthly-flight-schedule-detail',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, NgxTrimDirectiveModule, NgxControlError, DataTransformPipe, MatIcon,
    SelectionSuggestComponent, MatCheckboxModule
  ],
  templateUrl: './dialog-monthly-flight-schedule-detail.component.html',
  styleUrl: './dialog-monthly-flight-schedule-detail.component.scss'
})
export class DialogMonthlyFlightScheduleDetailComponent extends CommonComponent {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  _displayedColumns: { label: string; value: string, type?: string, format?: string, class?: string }[] = [
    { label: $localize`:@@code:Code`, value: 'code', class: 'text-left' },
    { label: $localize`:@@fullName:Full Name`, value: 'fullName', class: 'text-left' },
    { label: $localize`:@@cmsName:CMS Name`, value: 'cmsName', class: 'text-left' },
    { label: $localize`:@@gender:Gender`, value: 'gender', class: 'text-left' },
    { label: $localize`:@@phone:Phone`, value: 'phone', class: 'text-center' },
    { label: $localize`:@@rank:Rank`, value: 'rank', class: 'text-left' },
    { label: $localize`:@@function:Function`, value: 'function', class: 'text-left' },
    { label: $localize`:@@base:Base`, value: 'base', class: 'text-center' },
    { label: $localize`:@@type:Type`, value: 'type', class: 'text-left' },
  ];

  override ngOnInit(): void {
    this.displayedColumns = [(this.data?.isUpdate ? 'select' : 'stt'), ...this._displayedColumns.map(s => s.value), 'nonOvernight'];
    this.dataSource.data = [
      { code: '213' }
    ]
  }

  close() {
    this.dialogRef.close()
  }

  updateNonOvernight() {
    console.log(this.selection.selected)
    if (this.selection.selected.length > 0) {
      this.toggleDialogDelete()
    }
  }

  override async closeConfirmDelete() {
    this.toggleDialogDelete()
  }
}
