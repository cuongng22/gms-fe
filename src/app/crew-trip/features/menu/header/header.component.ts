import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  NO_ERRORS_SCHEMA, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {CustomizerSettingsService} from 'src/app/customizer-settings/customizer-settings.service';
import {ToggleService} from 'src/app/common/header/toggle.service';
import {UsersService} from 'src/app/crew-trip/core/services/users-service';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {UserLogin} from 'src/app/crew-trip/shared/models/userInfo';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {format} from 'date-fns';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {Constant, MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {LanguageService} from 'src/app/crew-trip/core/services/language.service';
import {Observable, Subscription} from 'rxjs';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {HttpStatusCode} from "@angular/common/http";
import {WebsocketService} from "src/app/crew-trip/core/services/websocket-service";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, NgxTrimDirectiveModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLanguage!: Observable<string>;
  fb = inject(FormBuilder);
  toggleService = inject(ToggleService);
  // baseService = inject(BaseService);
  themeService = inject(CustomizerSettingsService);
  userService = inject(UsersService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  dialog = inject(MatDialog); // Inject MatDialog
  // isSidebarToggled
  isSidebarToggled = false;
  userInfo: UserLogin | null;
  baseService = new BaseService();
  // isToggled
  isToggled = false;
  showDialogConfirm = false;
  passwordInputType = 'password';
  dialogResetPassword = false;
  formGroup: FormGroup;
  errorMessage: string | null = null;
  correctPassword: boolean = false;

  messagesNotice: any[] = [];
  private subscription!: Subscription;

  constructor(private languageService: LanguageService, private webSocketService: WebsocketService) {
    this.userService.userInfo$.subscribe(user => {
      this.userInfo = user;
    });
    this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
      this.isSidebarToggled = isSidebarToggled;
    });
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });

    this.formGroup = this.fb.group({
      email: ['', [Validators.required]],
      oldPassword: ['', [Validators.required, this.existCodeValidator.bind(this)]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]],
    });
  }

  changeLanguage(language: string) {
    this.languageService.setLanguage(language);
  }

  // Burger Menu Toggle
  toggle() {
    this.toggleService.toggle();
  }

  // Settings Button Toggle
  settingsButtonToggle() {
    this.themeService.toggle();
  }

  // Dark Mode
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  // Header Sticky
  isSticky = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= 50) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  // Fullscreen
  isFullscreen = false;

  ngOnInit() {
    // Listen for fullscreen change events to update the button text
    this.currentLanguage = this.languageService.currentLanguage$;
    this.userInfo = this.userService.getUserLogin();
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this));

    let username = this.userInfo?.email; // Thay bằng username thực tế
    if (username) {
      this.webSocketService.connect(username);
    } else {
      console.error('Username is undefined');
    }

    this.subscription = this.webSocketService.getMessages().subscribe({
      next: (message) => {
        let mes = JSON.parse(message);
        this.messagesNotice.push(mes);
        this.baseService.showNotification("New notification", {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          data: {type: 'info', message: mes.content}
        });
        if (this.messagesNotice.length > 5) {
          this.messagesNotice = this.messagesNotice.slice(-5);
        }
        this.messagesNotice = this.messagesNotice.map(item => {
          item.sendTimeFormatted = format(new Date(item.timeSend), 'dd/MM/yyyy HH:mm:ss');
          return item;
        });
      },
      error: (err) => console.error(err),
    });

  }

  clearAllNoti() {
    this.messagesNotice = [];
  }

  toggleFullscreen() {
    if (!this.isFullscreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }

  openFullscreen() {
    const element = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    const doc = document as Document & {
      mozCancelFullScreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (doc.mozCancelFullScreen) { // Firefox
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) { // Chrome, Safari, and Opera
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) { // IE/Edge
      doc.msExitFullscreen();
    }
  }

  onFullscreenChange() {
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };
    this.isFullscreen = !!(document.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
  }

  logOut() {
    this.showDialogConfirm = true;
  }

  onConfirm(): void {
    this.toggleDialogConfirm();
    this.userService.logout();
    this.router.navigate(['/auth/login']);
  }

  onCancel(): void {
    this.toggleDialogConfirm();
  }

  toggleDialogConfirm() {
    this.showDialogConfirm = !this.showDialogConfirm;
  }

  openDialogResetPassword(email: string) {
    this.dialogResetPassword = !this.dialogResetPassword;
    this.formGroup?.reset();
    this.formGroup.patchValue({
      email: email
    });
  }

  async confirmChangePassword() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    if (!this.passwordsMatch()) {
      this.formGroup.get('confirmNewPassword')?.setErrors({incorrect: true});
      this.errorMessage = $localize`Passwords do not match`;
      return;
    }
    try {
      if (this.formGroup.valid) {
        this.spinner.show();
        await this.userService.changePassword(this.formGroup.value);
        this.userService.showSuccess("Change password successfully");
      }
    } catch (error: any) {
      if (error?.status === HttpStatusCode.Conflict && error?.error?.error) {
        this.formGroup.get('oldPassword')?.setErrors({incorrect: true});
        this.errorMessage = error?.error?.error;
      } else {
        this.errorMessage = $localize`An unexpected error occurred. Please try again.`;
      }
    } finally {
      this.spinner.hide();
      // this.dialogResetPassword = false;
    }
  }

  private passwordsMatch(): boolean {
    return this.formGroup.get('newPassword')?.value === this.formGroup.get('confirmNewPassword')?.value;
  }

  existCodeValidator(control: AbstractControl): ValidationErrors | null {
    return this.correctPassword ? {correctPassword: true} : null
  }

  protected readonly MESSAGE = MESSAGE;
  protected readonly Constant = Constant;

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }
}
