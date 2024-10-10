import { CommonModule } from '@angular/common';
import { Component, inject, Inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule,],
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss'
})
export class HotelDetailComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);

  readonlyDetail = model<boolean>(false);

  override formGroupDetail = this.formBuilder.group({
    airport: ['',],
    hotelCode: [''],
    hotelName: [''],
    address: [''],
    fullName: [''],
    email: [''],
    phone: [''],
    notes: [''],
    active: [true],
    flightMarketId: [''],
  });

  constructor(
    public dialogRef: MatDialogRef<HotelDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    if (this.data.hotel) {
      console.log(this.data.hotel);
      this.formGroupDetail.patchValue(this.data.hotel);
      this.readonlyDetail.set(true)
    }
  }

  override save(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  close(): void {
    this.dialogRef.close();
  }
}
