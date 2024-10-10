import { CommonModule } from '@angular/common';
import { Component, inject, Inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';

@Component({
  selector: 'app-car-rental-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule,],
  templateUrl: './car-rental-detail.component.html',
  styleUrl: './car-rental-detail.component.scss'
})
export class CarRentalDetailComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);

  readonlyDetail = model<boolean>(false);

  override formGroupDetail = this.formBuilder.group({
    airport: ['',],
    code: [''],
    name: [''],
    address: [''],
    fullName: [''],
    email: [''],
    phone: [''],
    notes: [''],
    active: [true],
    flightMarketId: [''],
  });

  constructor(
    public dialogRef: MatDialogRef<CarRentalDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    if (this.data.carRental) {
      console.log(this.data.carRental);
      this.formGroupDetail.patchValue(this.data.carRental);
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
