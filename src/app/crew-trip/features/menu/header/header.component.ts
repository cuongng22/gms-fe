import {Component, HostListener, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {NgClass} from '@angular/common';
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {ToggleService} from "src/app/common/header/toggle.service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from "src/app/crew-trip/component/confirm-dialog/confirm-dialog.component";
import {UserLogin} from "src/app/crew-trip/shared/models/userInfo";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatMenuModule, NgClass,MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  toggleService = inject(ToggleService);
  themeService = inject(CustomizerSettingsService);
  userService = inject(UsersService);
  router = inject(Router);
  dialog = inject(MatDialog); // Inject MatDialog
  // isSidebarToggled
  isSidebarToggled = false;
  userInfo: UserLogin | null;
  // isToggled
  isToggled = false;

  constructor() {
    this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
      this.isSidebarToggled = isSidebarToggled;
    });
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
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
  isSticky: boolean = false;

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
  isFullscreen: boolean = false;

  ngOnInit() {
    // Listen for fullscreen change events to update the button text
    this.userInfo = this.userService.getUserLogin();
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this));
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
    const dialogData: ConfirmDialogData = {
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Logout',
      cancelText: 'Cancel'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.logout();
        this.router.navigate(['/auth/login']);
      } else {
      }
    });
  }
}
