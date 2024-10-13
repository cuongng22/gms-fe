import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {BaseService} from "src/app/crew-trip/core/services/base-service";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCard, MatCardHeader, MatCardContent, MatCheckbox, MatCardActions,
    TranslateModule, MatIconModule,NgxSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent{
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  baseService = inject(BaseService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  formGroup: FormGroup;
  spinner = inject(NgxSpinnerService);
  token: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  hide = true;
  constructor(
    public themeService: CustomizerSettingsService,
  ) {
    this.formGroup = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.passwordMatchValidator(this.formGroup);
    });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }


  async resetPassword() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    try {
      await this.spinner.show();
      await this.usersService.forgotResetPassword({token:this.token,newPassword: this.formGroup.value.newPassword});
      this.successMessage = 'Your password has been reset successfully!';
      this.errorMessage = null;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    } catch (error: any) {
      if (error?.status === 400 && error.error?.error) {
        this.baseService.showError(error?.error?.error);
      } else {
        this.errorMessage = $localize`An unexpected error occurred. Please try again.`;
      }
      this.successMessage = null;
    } finally {
      await this.spinner.hide();
    }
  }
}
