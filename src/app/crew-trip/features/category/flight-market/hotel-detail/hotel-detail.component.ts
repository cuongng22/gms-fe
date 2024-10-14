import { CommonModule } from '@angular/common';
import { Component, inject, Inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { debounce, debounceTime } from 'rxjs';
import { HotelService } from 'src/app/crew-trip/core/services/hotel-service';
import { AlreadyExistsValidator } from 'src/app/crew-trip/core/validator/already-exists';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule,],
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss'
})
export class HotelDetailComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  hotelService = inject(HotelService)

  readonlyDetail = model<boolean>(false);

  override formGroupDetail = this.formBuilder.group({
    id: [],
    marketCode: [{ value: '', disabled: true }],
    hotelCode: ['', {
      validators: [Validators.required],
      asyncValidators: [AlreadyExistsValidator.existsHotelCode(this.hotelService)],
      updateOn: 'blur'
    }],
    hotelName: ['', Validators.required],
    address: [''],
    fullName: [''],
    email: ['', Validators.required],
    phone: [''],
    notes: [''],
    active: [true, Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<HotelDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    if (this.data.hotel) {
      this.formGroupDetail.patchValue(this.data.hotel);
      this.readonlyDetail.set(this.data.isViewDetail);

      if (this.readonlyDetail()) {
        Object.keys(this.formGroupDetail.controls).forEach(control => {
            this.formGroupDetail.get(control)?.disable()
        })
      }
    }
    this.hotelService.isUpdate = this.data.isViewDetail || !!this.formGroupDetail.controls.id.value;
  }

  override async save(): Promise<any> {
    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      return;
    }
    const hotelCode = this.formGroupDetail.controls['hotelCode'].value as string;
    this.dialogRef.close({ ...this.formGroupDetail.value, hotelCode: hotelCode?.toUpperCase().trim() });
  }

  close(): void {
    this.dialogRef.close();
  }
}
