import { CommonModule } from '@angular/common';
import { Component, inject, Inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { VehicleService } from 'src/app/crew-trip/core/services/vehicle.service';
import { AlreadyExistsValidator } from 'src/app/crew-trip/core/validator/already-exists';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { MatIcon } from '@angular/material/icon';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipEditedEvent, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-car-rental-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, NgxTrimDirectiveModule, NgxControlError, DataTransformPipe, MatIcon,
    MatChipsModule],
  templateUrl: './car-rental-detail.component.html',
  styleUrl: './car-rental-detail.component.scss'
})
export class CarRentalDetailComponent extends CommonComponent implements OnInit {
  carRentalService = inject(VehicleService);

  readonlyDetail = model<boolean>(false);

  // danh sách mã code của nhà xe để check trùng khi nhập
  carRentalCodes: string[] = [];
  override formGroupDetail = this.formBuilder.group({
    id: [],
    marketCode: [{ value: '', disabled: true }],
    code: ['', {
      validators: [Validators.required, Validators.maxLength(50)],
      updateOn: 'blur'
    }],
    name: ['', [Validators.required, Validators.maxLength(250)]],
    address: ['', Validators.maxLength(500)],
    fullName: ['', Validators.maxLength(250)],
    email: [[],
    [
      Validators.required,
      // Validators.maxLength(250), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    ]
    ],
    phone: ['', [Validators.maxLength(20), Validators.pattern('^[0-9()+ ]+$')]],
    notes: ['', Validators.maxLength(500)],
    active: [true, Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<CarRentalDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    if (this.data.carRental) {
      if (this.data.carRental.id && this.data.carRental.id > 0) {
        this.formGroupDetail.controls.code.disable();
      }
      this.formGroupDetail.patchValue(this.data.carRental);
      this.emails.set(this.data.carRental.email ?? [])
      this.carRentalCodes = this.data.carRentalCodes;
      this.formGroupDetail.controls.code.addAsyncValidators(AlreadyExistsValidator.existsCarRentalCode(this.carRentalService, this.data.carRental.marketCode, this.carRentalCodes));
      this.readonlyDetail.set(this.data.isViewDetail);
    }

    if (this.readonlyDetail()) {
      Object.keys(this.formGroupDetail.controls).forEach(control => {
        this.formGroupDetail.get(control)?.disable();
      });
    }
    this.carRentalService.isUpdate = this.data.isViewDetail || (!!this.formGroupDetail.controls.id.value && this.formGroupDetail.controls.id.value > 0);
  }

  override async save(): Promise<any> {
    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      return;
    }
    const email = (this.formGroupDetail.controls.email.value ?? []).join(";")
    this.dialogRef.close({ ...this.formGroupDetail.value, code: this.formGroupDetail.controls.code.value?.toUpperCase().trim(), email: email });
  }

  close(): void {
    this.dialogRef.close();
  }



  readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON] as const;
  readonly emails = signal<string[]>([]);
  readonly announcer = inject(LiveAnnouncer);
  regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  mailFormatInvalid = false;

  emailInputChange(event: any) {
    this.mailFormatInvalid = false
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      if (this.regexEmail.test(value)) {
        this.emails.update(emails => [...emails, value]);
        // Clear the input value
        this.mailFormatInvalid = false;
        event.chipInput!.clear();
      } else {
        this.formGroupDetail.controls.email.markAsTouched()
        this.mailFormatInvalid = true;
      }
    }

  }

  remove(email: string): void {
    this.emails.update(emails => {
      const index = emails.indexOf(email);
      if (index < 0) {
        return emails;
      }

      emails.splice(index, 1);
      this.announcer.announce(`Removed ${emails}`);
      return [...emails];
    });
  }

  edit(email: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(email);
      return;
    }

    // Edit existing fruit
    this.emails.update(emails => {
      const index = emails.indexOf(email);
      if (index >= 0) {
        emails[index] = value;
        return [...emails];
      }
      return emails;
    });
  }
}
