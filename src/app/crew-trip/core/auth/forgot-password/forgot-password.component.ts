import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import { MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatInputModule} from "@angular/material/input";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {HelperService} from "src/app/crew-trip/core/services/helper.service";
import {StorageService} from "src/app/crew-trip/core/services/storage.service";
import {MatIconModule} from "@angular/material/icon";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCard, MatCardHeader, MatCardContent, MatCheckbox, MatCardActions,
    TranslateModule, MatIconModule,NgxSpinnerModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  router = inject(Router);
  formGroup: FormGroup;
  spinner = inject(NgxSpinnerService);

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    public themeService: CustomizerSettingsService,
  ) {
    this.formGroup = this.fb.group({
      email: ['',  [Validators.required, Validators.email]],
    });
  }

 async requestForgotPassword() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    try {
      if (this.formGroup.valid) {
        await this.spinner.show();
        await this.usersService.forgotPassword(this.formGroup.value);
        this.successMessage = $localize`A password reset link has been sent to your email. Please check your email.`;
        this.formGroup.get('email')?.setErrors(null);
        this.errorMessage = null;
        this.formGroup.reset();
      }
    } catch (error: any) {
      if (error?.status === 404 && error.error?.error) {
        this.formGroup.get('email')?.setErrors({ incorrect: true });
        this.errorMessage = error?.error?.error;
      } else {
        this.errorMessage = $localize`An unexpected error occurred. Please try again.`;
      }
      this.successMessage = null;
    } finally {
      await this.spinner.hide();
    }
  }
}
