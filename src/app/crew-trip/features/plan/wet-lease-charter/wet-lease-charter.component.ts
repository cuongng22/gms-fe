import { Component, inject, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WetLeaseComponent } from './wet-lease/wet-lease.component';
import { CharterComponent } from './charter/charter.component';

@Component({
  selector: 'app-wet-lease-charter',
  standalone: true,
  imports: [
    RouterLink, MatCardModule, MatTabsModule, WetLeaseComponent, CharterComponent
  ],
  templateUrl: './wet-lease-charter.component.html',
  styleUrl: './wet-lease-charter.component.scss'
})
export class WetLeaseCharterComponent implements OnInit {
  router = inject(ActivatedRoute);
  selectedTab: number; // dùng để active tab


  ngOnInit(): void {
    this.router.fragment.subscribe(res => {
      if (res === 'wet-lease') {
        this.selectedTab = 0
      } else if (res === 'charter') {
        this.selectedTab = 1
      } else {
        this.selectedTab = 0
      }
    })
  }
}
