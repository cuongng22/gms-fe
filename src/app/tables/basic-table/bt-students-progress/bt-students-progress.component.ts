import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-bt-students-progress',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatProgressBarModule],
    templateUrl: './bt-students-progress.component.html',
    styleUrl: './bt-students-progress.component.scss'
})
export class BtStudentsProgressComponent {}