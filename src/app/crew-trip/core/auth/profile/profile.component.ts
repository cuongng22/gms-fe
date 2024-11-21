import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, NgClass} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {UsersService} from 'src/app/crew-trip/core/services/users-service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {StorageService} from "src/app/crew-trip/core/services/storage.service";
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {InputSmComponent} from "src/app/crew-trip/component/input-sm/input-sm.component";
import {SharedModule} from "src/app/crew-trip/component/shared.module";
import {SelectionComponent} from "src/app/crew-trip/component/selection/selection.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatButtonModule, ReactiveFormsModule, CommonModule, NgClass, MatFormField, MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule, NgxTrimDirectiveModule, InputSmComponent, SharedModule, SelectionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  fb = inject(FormBuilder);
  userService = inject(UsersService);
  baseService = inject(BaseService);
  formGroup: FormGroup;
  router = inject(Router);
  readonly = true;
  spinner = inject(NgxSpinnerService);
  userCurrent = this.userService.getUserLogin();
  // multiple: any;
  avatarUrl: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  @Output() fileUploaded = new EventEmitter<string>();
  genderOptions = [
    { value: null, display: 'Select gender' },
    { value: 0, display: 'Female' },
    { value: 1, display: 'Male' },
  ];

  constructor(private storageService: StorageService) {
    this.formGroup = this.fb.group({
      id: [this.userCurrent?.id, Validators.required],
      fullName: [this.userCurrent?.fullName, [Validators.required, Validators.maxLength(250)]],
      department: [this.userCurrent?.department, [Validators.required, Validators.maxLength(250)]],
      email: [this.userCurrent?.email, [Validators.required, Validators.email, Validators.maxLength(250)]],
      phone: [this.userCurrent?.phone, [Validators.maxLength(20)]],
      description: [this.userCurrent?.description],
      gender: [this.userCurrent?.gender ? 1 : 0, Validators.required],
      avartarUrl: [this.userCurrent?.avartarUrl],
      testF: ['']
    });
  }

  ngOnInit(): void {
    this.avatarUrl = this.userCurrent?.avartarUrl ?? null;
    this.formGroup.disable();
  }


  updateEditMode() {
    this.formGroup.get('id')?.enable();
    this.readonly = !this.readonly;
  }


  onCancel(): void {
    this.formGroup.reset(this.userCurrent);
    this.updateEditMode();
  }

  async saveProfile() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      try {
        await this.spinner.show();
        await this.userService.update(this.formGroup.value, 'update');
        this.baseService.showSuccess("Profile " + MESSAGE.UPDATE_SUCCESS);
        this.updateEditMode();
        let userInfo = JSON.parse(this.storageService.get(STORAGE_KEY.USER_INFO));
        Object.keys(this.formGroup.controls).forEach(key => {
          const value = this.formGroup.get(key)?.value;
          if (value !== null && value !== undefined && value !== '') {
            userInfo[key] = value;
          }
        });
        this.storageService.set(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));
        this.userService.userInfoSubject.next(userInfo);
      } catch (error: any) {
        if (error?.status === 401 && error.error?.error) {
          this.baseService.showError(error?.error?.error);
        } else {
          console.log(error);
        }
      } finally {
        await this.spinner.hide();
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const validExtensions = ['image/jpeg', 'image/png'];
      // Validate file type
      if (!validExtensions.includes(file.type)) {
        this.fileError = $localize`Invalid file type. Only JPG and PNG files are allowed.`;
        return;
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.fileError = $localize`File is too large. Maximum size is 2MB.`;
        return;
      }
      this.fileError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.uploadFile(file);
    }
  }

  async uploadFile(file: File) {
    try {
      await this.spinner.show();
      const formData = new FormData();
      const email = this.userCurrent?.email;
      if (!email) {
        await this.router.navigate(['auth/login'], {fragment: '401', skipLocationChange: true});
        return;
      }
      formData.append('file', file);
      formData.append('email', email);
      const res = await this.userService.uploadAvatar(formData);
      if (res) {
        let userInfo = JSON.parse(this.storageService.get(STORAGE_KEY.USER_INFO));
        userInfo.avartarUrl = res.data;
        this.storageService.set(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));
        this.userService.userInfoSubject.next(userInfo);
      }
    } catch (error: any) {
      if (error?.status === 401 && error.error?.error) {
        this.baseService.showError(error?.error?.error);
      } else {
        console.log(error);
      }
    } finally {
      await this.spinner.hide();
    }
  }

  protected readonly FormControl = FormControl;
}
