import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-blank-page',
    standalone: true,
    imports: [RouterLink, MatCardModule],
    templateUrl: './blank-page.component.html',
    styleUrl: './blank-page.component.scss'
})
export class BlankPageComponent {}