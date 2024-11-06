import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {CustomizerSettingsService} from 'src/app/customizer-settings/customizer-settings.service';
import {HeaderComponent} from 'src/app/crew-trip/features/menu/header/header.component';
import {SidebarComponent} from 'src/app/crew-trip/features/menu/sidebar/sidebar.component';
import {FooterComponent} from 'src/app/crew-trip/features/menu/footer/footer.component';
import {NgxSpinnerComponent, NgxSpinnerService} from 'ngx-spinner';
import {ToggleService} from 'src/app/common/header/toggle.service';
import {CustomizerSettingsComponent} from 'src/app/customizer-settings/customizer-settings.component';
import {ActionAlertComponent} from 'src/app/crew-trip/shared/action-alert/action-alert.component';

@Component({
  selector: 'app-first-page',
  standalone: true,
  imports: [RouterOutlet, NgClass, HeaderComponent, SidebarComponent, FooterComponent, NgxSpinnerComponent, CustomizerSettingsComponent, ActionAlertComponent],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class FirstPageComponent {
  spinner = inject(NgxSpinnerService);
  toggleService = inject(ToggleService);
  themeService = inject(CustomizerSettingsService);
  // isSidebarToggled
  isSidebarToggled = false;

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
}
