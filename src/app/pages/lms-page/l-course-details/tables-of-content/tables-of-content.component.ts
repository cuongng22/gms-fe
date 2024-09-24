import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-tables-of-content',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatExpansionModule],
    templateUrl: './tables-of-content.component.html',
    styleUrl: './tables-of-content.component.scss'
})
export class TablesOfContentComponent {

    // Expansion
    readonly panelOpenState = signal(false);

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}