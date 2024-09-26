import {Component, inject, signal} from '@angular/core';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {ToggleService} from "src/app/common/header/toggle.service";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgScrollbarModule, MatExpansionModule, RouterLinkActive, RouterLink, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  router = inject(Router);

  // Mat Expansion
  readonly panelOpenState = signal(false);

  // isSidebarToggled
  isSidebarToggled = false;

  // isToggled
  isToggled = false;

  constructor(
    private toggleService: ToggleService,
    public themeService: CustomizerSettingsService
  ) {
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

  checkActiveRoute(panel: string) {
    let currentRoute = this.router.url.split('/');
    return currentRoute[1] === panel
  }
}
