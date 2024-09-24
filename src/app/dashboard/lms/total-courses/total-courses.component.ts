import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-total-courses',
    standalone: true,
    imports: [RouterLink, MatCardModule],
    templateUrl: './total-courses.component.html',
    styleUrl: './total-courses.component.scss'
})
export class TotalCoursesComponent {}