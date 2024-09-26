import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "src/app/crew-trip/core/services/users-service";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  // Password Hide
  hide = true;

  // isToggled
  isToggled = false;

  formGroup!: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService
  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
    this.formGroup = this.fb.group({
      email: ['', Validators.required],
      password: ['',]
    });
  }

  login() {
    this.usersService.login(this.formGroup.value).then((res) => {
      /*
      todo:1.luu token vao storage
      2.goi api lay ds quyen > luu storage
       3.chuyen route sang trang default
      */
    });
  }
}
