import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {NgClass} from "@angular/common";
import {ToggleService} from "src/app/common/header/toggle.service";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
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
