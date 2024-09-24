import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-bt-performance-of-agents',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule],
    templateUrl: './bt-performance-of-agents.component.html',
    styleUrl: './bt-performance-of-agents.component.scss'
})
export class BtPerformanceOfAgentsComponent {}