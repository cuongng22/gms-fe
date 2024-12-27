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
import  { jwtDecode } from 'jwt-decode';
import {StorageService} from 'src/app/crew-trip/core/services/storage.service';
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {InputComponent} from 'src/app/crew-trip/shared/component/input/input.component';
import {SharedModule} from 'src/app/crew-trip/shared/component/shared.module';
import {SelectionComponent} from 'src/app/crew-trip/shared/component/selection/selection.component';
import {SelectOptions} from 'src/app/crew-trip/shared/select-option';
import {environment} from 'src/environments/environment';
import {HttpStatusCode} from '@angular/common/http';
import {decodeToken} from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatButtonModule, ReactiveFormsModule, CommonModule, NgClass, MatFormField, MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule, NgxTrimDirectiveModule, InputComponent, SharedModule, SelectionComponent],
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
  selectedFile: File | null = null;
  avatarUrl: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  genderOptions = SelectOptions.GENDER;
  @Output() fileUploaded = new EventEmitter<string>();

  constructor(private storageService: StorageService) {
    this.formGroup = this.fb.group({
      id: [this.userCurrent?.id, Validators.required],
      fullName: [this.userCurrent?.fullName, [Validators.required, Validators.maxLength(250)]],
      department: [this.userCurrent?.department, [Validators.required, Validators.maxLength(250)]],
      email: [this.userCurrent?.email, [Validators.required, Validators.email, Validators.maxLength(250)]],
      phone: [this.userCurrent?.phone, [Validators.maxLength(20), Validators.pattern('^[0-9()+ ]+$')]],
      description: [this.userCurrent?.description, [Validators.maxLength(500)]],
      gender: [this.userCurrent?.gender ? 1 : 0],
      avartarUrl: [this.userCurrent?.avartarUrl],
      testF: ['']
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    if (!token || !this.userCurrent || this.isTokenExpired(token)) {
      this.userService.logout();
      this.router.navigate(['auth/login'], { fragment: HttpStatusCode.Unauthorized.toString(), skipLocationChange: true });
    }
    this.avatarUrl = this.userCurrent?.avartarUrl ?? null;
    this.formGroup.disable();
  }


  updateEditMode() {
    this.formGroup.get('id')?.enable();
    this.readonly = !this.readonly;
  }


  onCancel(): void {
    this.formGroup.reset(this.userCurrent);
    if (this.selectedFile) {
      this.avatarUrl = this.userCurrent?.avartarUrl ?? null;
      this.selectedFile = null;
    }
    this.updateEditMode();
  }

  async saveProfile() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      try {
        await this.spinner.show();
        await this.userService.update(this.formGroup.value, 'update');
        const userInfo = JSON.parse(this.storageService.get(STORAGE_KEY.USER_INFO));
        if (this.selectedFile) {
          const resp = await this.uploadFile(this.selectedFile);
          if (resp && resp.data) {
            userInfo.avartarUrl = `${environment.baseUrl}/${resp.data}`;
          }
          this.selectedFile = null;
        }
        Object.keys(this.formGroup.controls).forEach(key => {
          const value = this.formGroup.get(key)?.value;
          if (key !== 'avartarUrl') {
            userInfo[key] = value;
          }
        });
        this.storageService.set(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));
        this.userService.userInfoSubject.next(userInfo);
        this.updateEditMode();
        this.baseService.showSuccess('Profile updated successfully');
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
      this.selectedFile = file;
      this.fileError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result;
      };
      reader.readAsDataURL(file);
      // this.uploadFile(file);
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
      formData.append('email',email);
      return await this.userService.uploadAvatar(formData);
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

  isTokenExpired(token: string): boolean {
    const decodedToken: any = decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

}
