import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {FormBuilder, FormGroup, Validators,ReactiveFormsModule} from "@angular/forms";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {HelperService} from "src/app/crew-trip/core/services/helper.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {StorageService} from "src/app/crew-trip/core/services/storage.service";
import {STORAGE_KEY} from "src/app/crew-trip/core/constants/config";
import {CommonModule} from "@angular/common";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {response} from "express";
import {BaseService} from "src/app/crew-trip/core/services/base-service";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCard, MatCardHeader, MatCardContent, MatCheckbox, MatCardActions,
    TranslateModule, NgxSpinnerComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  baseService = inject(BaseService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  // Password Hide
  hide = true;
  // isToggled
  isToggled = false;
  errorMessage :string;
  formGroup: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService,
    public helperService: HelperService,
    private translate: TranslateService,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) {
    this.usersService.showError("Token hết hạn hoặc không hợp lệ")
    this.translate.setDefaultLang('en');
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
    this.formGroup = this.fb.group({
      email: ['',  [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe : [false]
    });
  }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment === '401') {
        this.router.navigate(['auth/login'], {fragment: '401',skipLocationChange: true});
      }
    });
  }

 async login() {
   this.formGroup.get('username')?.setErrors(null);
   this.formGroup.get('password')?.setErrors(null);
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
   try {
     if (this.formGroup.valid) {
       `await this.spinner.show();`
       const resp = await this.usersService.login(this.formGroup.value)
       this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, resp.data.token);
       this.storageService.set(STORAGE_KEY.USER_INFO, JSON.stringify(resp.data.userInfo));
       this.router.navigate(['/ke-hoach']);
       this.spinner.hide();
     }
   } catch (error: any) {
     if (error.status === 401 && error.error?.error) {
       this.formGroup.get('password')?.setErrors({ incorrect: true });
       this.errorMessage = error.error.error;
     } else if (error.status === 404) {
       this.formGroup.get('email')?.setErrors({ incorrect: true });
       this.errorMessage = error.error.error;
     } else if (error.status === 500) {
       this.baseService.showError(error.message)
       console.error('Server Error: ', error.message);
     } else {
       this.errorMessage = $localize`An unexpected error occurred. Please try again.`;
     }
   } finally {
     await this.spinner.hide();
   }
  }
}
