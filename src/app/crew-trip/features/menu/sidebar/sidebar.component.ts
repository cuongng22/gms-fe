import {CommonModule, NgClass} from '@angular/common';
import {Component, inject, OnInit, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {ToggleService} from 'src/app/common/header/toggle.service';
import {CustomizerSettingsService} from 'src/app/customizer-settings/customizer-settings.service';
import {menu} from './sidebar.model';
import {take} from 'rxjs';

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
    private route: ActivatedRoute
  ) {
    this.toggleService.isSidebarToggled$.subscribe((isSidebarToggled) => {
      this.isSidebarToggled = isSidebarToggled;
    });
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
  }

  // Burger Menu Toggle
  toggle() {
    this.toggleService.toggle();
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
    // return this.router.url === '/' + path;
  }

  reloadByFragment(uri: any) {
    this.route.fragment.pipe(take(1)).subscribe(fragment => {
      if (fragment) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([uri])
        });
      }
    });
  }
}
