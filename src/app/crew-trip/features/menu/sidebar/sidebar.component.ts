import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from 'src/app/common/header/toggle.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { menu } from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NgScrollbarModule,
    MatExpansionModule,
    RouterLinkActive,
    RouterLink,
    NgClass,
    TranslateModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  router = inject(Router);

  menu = menu;

  // Mat Expansion
  readonly panelOpenState = signal(false);

  // isSidebarToggled
  isSidebarToggled = false;

  // isToggled
  isToggled = false;

  constructor(
		private toggleService: ToggleService,
		public themeService: CustomizerSettingsService,
  ) {
    this.toggleService.isSidebarToggled$.subscribe((isSidebarToggled) => {
      this.isSidebarToggled = isSidebarToggled;
    });
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {}

  // Burger Menu Toggle
  toggle() {
    this.toggleService.toggle();
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
    // return this.router.url === '/' + path;
  }
}
