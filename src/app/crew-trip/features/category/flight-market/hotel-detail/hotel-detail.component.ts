import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, inject, Inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { debounce, debounceTime } from 'rxjs';
import { HotelService } from 'src/app/crew-trip/core/services/hotel-service';
import { AlreadyExistsValidator } from 'src/app/crew-trip/core/validator/already-exists';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, NgxTrimDirectiveModule, DataTransformPipe, NgxControlError,
    MatChipsModule, MatIconModule],
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss'
})
export class HotelDetailComponent extends CommonComponent implements OnInit {
  hotelService = inject(HotelService);

  readonlyDetail = model<boolean>(false);

  // danh sách mã code của khách sạn để check trùng khi nhập
  hotelCodes: string[] = [];

  override formGroupDetail = this.formBuilder.group({
    id: [],
    marketCode: [{ value: '', disabled: true }],
    hotelCode: ['', {
      validators: [Validators.required, Validators.maxLength(50)],
      asyncValidators: [],
      updateOn: 'blur'
    }],
    hotelName: ['', [Validators.required, Validators.maxLength(250)]],
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
    public dialogRef: MatDialogRef<HotelDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    console.log('this.data.hotelCodes: ', this.data.hotelCodes);
    if (this.data.hotel) {
      this.formGroupDetail.patchValue(this.data.hotel);
      this.emails.set(this.data.hotel.email ?? [])
      this.hotelCodes = this.data.hotelCodes;
      this.formGroupDetail.controls.hotelCode.setAsyncValidators(AlreadyExistsValidator.existsHotelCode(this.hotelService, this.data.hotel.marketCode, this.hotelCodes));
      if (this.data.hotel.id && this.data.hotel.id > 0) {
        this.formGroupDetail.controls.hotelCode.disable();
      }
      this.readonlyDetail.set(this.data.isViewDetail);

      if (this.readonlyDetail()) {
        Object.keys(this.formGroupDetail.controls).forEach(control => {
          this.formGroupDetail.get(control)?.disable();
        });
      }
    }
    this.hotelService.isUpdate = this.data.isViewDetail || (!!this.formGroupDetail.controls.id.value && this.formGroupDetail.controls.id.value > 0);

  }

  override async save(): Promise<any> {
    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      return;
    }
    const hotelCode = this.formGroupDetail.controls['hotelCode'].value as string;
    const email = (this.formGroupDetail.controls.email.value ?? []).join(";")
    console.log('email: ', email)
    const data = { ...this.formGroupDetail.value, hotelCode: hotelCode?.toUpperCase().trim(), email: email }
    this.dialogRef.close(data);
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
    this.mailFormatInvalid = false;
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
