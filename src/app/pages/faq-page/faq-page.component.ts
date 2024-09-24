import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-faq-page',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatExpansionModule],
    templateUrl: './faq-page.component.html',
    styleUrl: './faq-page.component.scss'
})
export class FaqPageComponent {

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