import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { CrewsService } from 'src/app/crew-trip/core/services/crews-service';
import { DailyFlightSchedulesService } from 'src/app/crew-trip/core/services/daily-flight-schedules.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DetailResponse, ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import { DialogOverviewExampleDialog, DialogData } from 'src/app/ui-elements/dialog/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-flight-crew-other',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, NgxTrimDirectiveModule, NgxControlError, DataTransformPipe, MatIcon,
    SelectionSuggestComponent, SelectionComponent
  ],
  templateUrl: './dialog-extra-crew.component.html',
  styleUrl: './dialog-extra-crew.component.scss'
})
export class DialogExtraCrewComponent extends CommonComponent {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly crewsService = inject(CrewsService);
  override baseService = inject(DailyFlightSchedulesService);

  override formGroupDetail = this.formBuilder.group({
    id: [''],
    persCode: ['', Validators.required],
    extra: ['', Validators.required],
    fltIdOut: ['', Validators.required],
    fltIdIn: ['', Validators.required],
    gender: [''],
    phoneNumber: [''],
    position: ['']
  })

  crews: any[] = [];
  types: any[] = [
    { value: 'CPT', display: 'Theo tiêu chuẩn phi công' },
    { value: 'X', display: 'Theo tiêu chuẩn tiếp viên' }
  ];

  arrives: any[] = [];
  departure: any[] = [];

  airport: string;
  timeZone: string;


  override ngOnInit(): void {
    this.formGroupDetail.controls.gender.disable();
    this.formGroupDetail.controls.phoneNumber.disable();
    this.formGroupDetail.controls.position.disable();

    this.airport = this.data.airport;
    this.timeZone = this.data.timeZone;

    this.crewsService.search<ListResponse<any>>({ type: 'Extra Crew' }).then((res: ListResponse<any>) => {
      this.crews = res.data.content.map(item => {
        return { ...item, fullNameDisplay: `${item.persCode}-${item.fullName}` }
      });
    });

    this.baseService.flightsList<DetailResponse<any[]>>({ type: 'in', airport: this.airport, timeZone: this.timeZone }).then((res: DetailResponse<any[]>) => {
      this.arrives = res.data;
    });

    this.baseService.flightsList<DetailResponse<any[]>>({ type: 'out', airport: this.airport, timeZone: this.timeZone }).then((res: DetailResponse<any[]>) => {
      this.departure = res.data;
    });

  }

  close() {
    this.dialogRef.close()
  }

  fullNameSelectionChange(event: any) {
    if (event.value) {
      const findItem = this.crews.find(item => item.persCode === event.value);
      if (findItem) {
        this.formGroupDetail.controls.gender.setValue(findItem.gender);
        this.formGroupDetail.controls.phoneNumber.setValue(findItem.phone);
        this.formGroupDetail.controls.position.setValue(findItem.function);
      }
    }
  }

  override async save() {
    try {
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        this.findInvalidControls(this.formGroupDetail);
        return;
      }
      const update = !!this.data.persCode;
      await this.spinner.show();
      let res;
      if (update) {
        const bodyUpdate = {
          persCode: this.data.persCode,
          oldFltIdIn: this.data.fltIdIn,
          oldFltIdOut: this.data.fltIdOut,
          newFltIdIn: this.formGroupDetail.getRawValue().fltIdIn,
          newFltIdOut: this.formGroupDetail.getRawValue().fltIdOut,
          extra: this.formGroupDetail.getRawValue().extra
        }
        res = await this.baseService.updateCrewsExtra(bodyUpdate);
      } else {
        res = await this.baseService.createExtraCrews(this.formGroupDetail.getRawValue());
      }
      await this.search();
      this.baseService.showSuccess(update ? this.MESSAGE.UPDATE_SUCCESS : this.MESSAGE.CREATE_SUCCESS);
      await this.closeDetail();
      return res;
    } catch (e: any) {
      debugger
      if ((e.status != HttpStatusCode.Conflict) && !(e.status == HttpStatusCode.InternalServerError && e.error?.error.includes('UNIQUE'))) {
        this.baseService.showError(e?.error?.data?.message ?? e.error?.data ?? e.error?.error ?? e.error ?? this.MESSAGE.ERROR);
      }
      return e;
    } finally {
      await this.spinner.hide();
    }
  }



}
