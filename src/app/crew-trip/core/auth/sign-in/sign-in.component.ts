import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import {Router, RouterLink} from '@angular/router';
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {HelperService} from "src/app/crew-trip/core/services/helper.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {StorageService} from "src/app/crew-trip/core/services/storage.service";
import {STORAGE_KEY} from "src/app/crew-trip/core/constants/config";
import { DEFAULT_LANGUAGE } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormFieldModule,ReactiveFormsModule, MatInputModule, MatCard, MatCardHeader, MatCardContent, MatCheckbox, MatCardActions,
    TranslateModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  router = inject(Router);
  // Password Hide
  hide = true;
  // isToggled
  isToggled = false;

  formGroup: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService,
    public helperService: HelperService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {
    this.usersService.showWarning("Token hết hạn hoạc không hợp lệ")
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

  login() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const formValue = this.formGroup.value;
    this.usersService.login(this.formGroup.value).then((res) => {
      if (res.data) {
        this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, res.data.token);
        this.router.navigate(['/ke-hoach']);
      }
      /*
      todo:1.luu token vao storage
      2.goi api lay ds quyen > luu storage
       3.chuyen route sang trang default
      */
    });
  }
}
