import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { MatCheckbox } from '@angular/material/checkbox';
import { HelperService } from 'src/app/crew-trip/core/services/helper.service';
import { StorageService } from 'src/app/crew-trip/core/services/storage.service';
import { STORAGE_KEY } from 'src/app/crew-trip/core/constants/config';
import { CommonModule, Location } from '@angular/common';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCheckbox, NgxSpinnerComponent, NgxTrimDirectiveModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  baseService = inject(BaseService);
  router = inject(Router);
  location = inject(Location);
  spinner = inject(NgxSpinnerService);
  // Password Hide
  hide = true;
  // isToggled
  isToggled = false;
  errorMessage: string;
  formGroup: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService,
    public helperService: HelperService,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) {
    // this.usersService.showError('Token hết hạn hoặc không hợp lệ');
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      ldapAuth: [false]
    });
  }

  ngOnInit(): void {
    // this.emailValid = true;
    // this.passwordValid = true;
    // this.formGroup.controls['email'].updateValueAndValidity();
    // this.formGroup.controls['password'].updateValueAndValidity();
    // // this.emailValid = false;
    // this.passwordValid = false;
  }

  async login() {
    this.formGroup.get('email')?.setErrors(null);
    this.formGroup.get('password')?.setErrors(null);
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    try {
      if (this.formGroup.valid) {
        await this.spinner.show();
        const email = this.formGroup.get('email')?.value.toLowerCase();
        this.formGroup.patchValue({
          'email': email
        });
        const resp = await this.usersService.login(this.formGroup.value);
        this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, resp.data.token);
        this.storageService.set(STORAGE_KEY.USER_INFO, JSON.stringify(resp.data.userInfo));
        await this.usersService.loadUserPermissions(resp.data.userInfo.email);
        debugger
        this.route.fragment.subscribe(fragment => {
          if (fragment === '401') {
            const _url = this.location.path(false);
            console.log(_url)
            this.router.navigateByUrl(_url);
          } else {
            this.router.navigate(['category/crews']);
          }
        });
        this.spinner.hide();
      }
    } catch (error: any) {
      if (error.status === 401 && error.error?.error) {
        this.formGroup.get('password')?.setErrors({ incorrect: true });
        this.errorMessage = error.error.error;
      } else if (error.status === 404 && error.error?.error) {
        if (error.error.error.includes('email')) {
          this.formGroup.get('email')?.setErrors({ incorrect: true });
          this.errorMessage = error.error.error;
        } else {
          this.formGroup.get('password')?.setErrors({ incorrect: true });
          this.errorMessage = error.error.error;
        }
      } else if (error.status === 500) {
        this.baseService.showError(error.message);
        console.error('Server Error: ', error.message);
      } else {
        this.errorMessage = $localize`An unexpected error occurred. Please try again.`;
      }
    } finally {
      await this.spinner.hide();
    }
  }

  changeCheck(fn: any) {
    if (!fn.checked) {
      this.formGroup.get('email')?.setValidators(Validators.email);
      this.formGroup.get('email')?.updateValueAndValidity();
    } else {
      this.formGroup.get('email')?.setValidators(Validators.required);
      this.formGroup.get('email')?.updateValueAndValidity();
    }
  }
}
