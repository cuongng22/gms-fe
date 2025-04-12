import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
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
import { DailyFlightSchedulesService } from 'src/app/crew-trip/core/services/daily-flight-schedules.service';
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
  override baseService = inject(DailyFlightSchedulesService);

  _displayedColumns: { label: string; value: string, type?: string, format?: string, class?: string }[] = [
    { label: $localize`:@@code:Code`, value: 'persCode', class: 'text-left' },
    { label: $localize`:@@fullName:Full Name`, value: 'fullName', class: 'text-left' },
    { label: $localize`:@@cmsName:CMS Name`, value: 'cmsname', class: 'text-left' },
    { label: $localize`:@@gender:Gender`, value: 'gender', class: 'text-left' },
    { label: $localize`:@@phone:Phone`, value: 'phone', class: 'text-center' },
    { label: $localize`:@@rank:Rank`, value: 'rank', class: 'text-left' },
    { label: $localize`:@@function:Function`, value: 'func', class: 'text-left' },
    { label: $localize`:@@base:Base`, value: 'base', class: 'text-center' },
    { label: $localize`:@@type:Type`, value: 'type', class: 'text-left' },
  ];
  flightInfo: any;
  override async ngOnInit() {
    this.displayedColumns = [(this.data?.isUpdate ? 'select' : 'stt'), ...this._displayedColumns.map(s => s.value)];
    if (!this.data?.isUpdate) {
      this.displayedColumns.push('overnight');
    }
    this.displayedColumns.push('nonOvernight')
    this.onSearch()
  }

  async onSearch() {
    const response = await super.search({ flightId: this.data.flightId, timeZone: this.data.timeZone }, false, this.baseService.flightCrewDetail.bind(this.baseService))
    this.dataSource.data = response.data.crewMembers;
    this.flightInfo = response.data.flightInfo;
  }

  close() {
    this.dialogRef.close()
  }

  async updateNonOvernight() {
    console.log(this.selection.selected)
    if (this.selection.selected.length <= 0) {
      this.showError($localize`:@@cannotUpdateOvernightStatusWhenNoRecordsAreSelected:Cannot update overnight status when no records are selected`)
    } else {
      this.toggleDialogDelete()
    }
  }

  async confirmUpdateNonOvernight() {
    console.log(this.selection.selected)
    if (this.selection.selected.length > 0) {
      try {
        await this.spinner.show();
        const bodyArr = this.selection.selected.map(item => {
          return {
            flightId: this.flightInfo.flightId,
            persCode: item.persCode,
            nonOverNight: "Y"
          }
        })
        let res = await this.baseService.updateNonOvernight(bodyArr);

        await this.onSearch();
        this.baseService.showSuccess(this.MESSAGE.UPDATE_SUCCESS);
        return res;
      } catch (e: any) {
        console.error(e)
        if ((e.status != HttpStatusCode.Conflict) && !(e.status == HttpStatusCode.InternalServerError && e.error?.error.includes('UNIQUE'))) {
          this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? this.MESSAGE.ERROR);
        }
        return e;
      } finally {
        await this.spinner.hide();
        this.toggleDialogDelete()
      }
    }
  }

  override async closeConfirmDelete() {
    this.toggleDialogDelete()
  }

}
