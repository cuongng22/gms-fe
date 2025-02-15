import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
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
export class WetLeaseCharterComponent {

}
