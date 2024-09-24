import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-personal',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatMenuModule, MatButtonModule, MatCheckboxModule],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.scss'
})
export class PersonalComponent {}