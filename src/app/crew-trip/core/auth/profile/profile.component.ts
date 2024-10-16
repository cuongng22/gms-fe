import {Component, inject, OnInit} from '@angular/core';
import {MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import { FileUploadModule} from "@iplab/ngx-file-upload";
import { MatDatepickerModule} from "@angular/material/datepicker";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatCardModule,FormsModule,MatButtonModule,ReactiveFormsModule,CommonModule,NgClass,MatFormField, MatSelectModule, InputSizeComponent,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  fb = inject(FormBuilder);
  userService = inject(UsersService);
  baseService = inject(BaseService);
  formGroup: FormGroup;
  router = inject(Router);
  isEditMode = false;
  spinner = inject(NgxSpinnerService);
  userCurrent = this.userService.getUserLogin();
  constructor() {
    console.log("this.userCurrentthis.userCurrent:",this.userCurrent)
    this.formGroup = this.fb.group({
      id:[this.userCurrent?.id, Validators.required],
      fullName: [this.userCurrent?.fullName,Validators.required],
      department: [this.userCurrent?.department,Validators.required],
      email: [this.userCurrent?.email, [Validators.required,Validators.email]],
      phone: [this.userCurrent?.phone],
      gender: [this.userCurrent?.gender ? 1 : 0,Validators.required],
      avatar_url: [this.userCurrent?.avatar_url]
    });
  }

  ngOnInit(): void {
    this.formGroup.disable()
  }


updateEditMode() {
    this.isEditMode = !this.isEditMode;
    if(this.isEditMode){
      this.formGroup.get('id')?.enable();
      this.formGroup.get('department')?.enable();
      this.formGroup.get('fullName')?.enable();
      this.formGroup.get('phone')?.enable();
      this.formGroup.get('gender')?.enable();
    }else {
      this.formGroup.get('department')?.disable();
      this.formGroup.get('fullName')?.disable();
      this.formGroup.get('phone')?.disable();
      this.formGroup.get('gender')?.disable();
    }
  }


  onCancel(): void {
    this.formGroup.reset(this.userCurrent);
    this.updateEditMode();
  }


 async saveProfile() {
    this.formGroup.markAllAsTouched();
    Object.keys(this.formGroup.controls).forEach(key => {
      (this.formGroup.get(key) as FormControl).markAsTouched();
    });
    if (this.formGroup.valid) {
      // Thực hiện logic lưu dữ liệu ở đây
      try {
        await this.spinner.show();
        await this.userService.update(this.formGroup.value, 'update');
        this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
        this.updateEditMode();
      } catch (error: any) {
        if (error?.status === 401 && error.error?.error) {
          this.baseService.showError(error?.error?.error);
        } else {
          console.log(error)
        }
      } finally {
        await this.spinner.hide();
      }
    }
  }

}
