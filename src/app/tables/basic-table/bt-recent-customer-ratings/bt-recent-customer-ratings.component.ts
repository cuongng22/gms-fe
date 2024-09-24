import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-bt-recent-customer-ratings',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './bt-recent-customer-ratings.component.html',
    styleUrl: './bt-recent-customer-ratings.component.scss'
})
export class BtRecentCustomerRatingsComponent {}