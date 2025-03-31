import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { FlightMarketStatusEnum } from 'src/app/crew-trip/features/category/flight-market/flight-market.model';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';
import { DialogData } from 'src/app/ui-elements/dialog/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-dialog-export-scheduling-data',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, NgxTrimDirectiveModule, NgxControlError, DataTransformPipe, MatIcon,
    SelectionSuggestComponent, MatRadioModule
  ],
  templateUrl: './dialog-export-scheduling-data.component.html',
  styleUrl: './dialog-export-scheduling-data.component.scss',
  providers: [DataTransformPipe,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_DD_MM_YYYY },
  ],
})
export class DialogExportSchedulingDataComponent extends CommonComponent {
  readonly dialogRef = inject(MatDialogRef<DialogExportSchedulingDataComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  flightMarketService = inject(FlightMarketService)

  override formGroupDetail = this.formBuilder.group({
    airport: ['', [Validators.required]],
    exportStartDate: ['', [Validators.required]],
    exportEndDate: ['', [Validators.required]]
  });

  airports: any[] = [];

  override ngOnInit(): void {
    this.flightMarketService.search<any>({ option: 0, page: 0, size: 999999, status: FlightMarketStatusEnum.OPERATIONAL }).then((res: ListResponse<any>) => {
      this.airports = res.data.content.map((item: any) => {
        return {
          marketCode: item.marketCode,
          marketName: item.marketName,
          timezone: item.timezone
        }
      });
    });
  }

  close() {
    this.dialogRef.close()
  }

  export() {
    console.log(this, this.formGroupDetail)
  }

}
