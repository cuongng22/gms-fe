import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-working-schedule',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatDatepickerModule, CarouselModule, MatNativeDateModule],
    templateUrl: './working-schedule.component.html',
    styleUrl: './working-schedule.component.scss'
})
export class WorkingScheduleComponent {

	// Owl Carousel
    upcomingEventsSlides: OwlOptions = {
        items: 1,
		nav: false,
		loop: true,
		margin: 25,
		dots: true,
		autoplay: false,
		smartSpeed: 500,
		autoplayHoverPause: true,
		navText: [
			"<i class='ri-arrow-left-line'></i>",
			"<i class='ri-arrow-right-line'></i>"
		]
    }

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