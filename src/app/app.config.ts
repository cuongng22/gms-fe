import {
	ApplicationConfig,
	importProvidersFrom,
	LOCALE_ID,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeVi from '@angular/common/locales/vi';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loggingInterceptor } from 'src/app/crew-trip/core/auth/auth.interceptor';
import { routes } from './app.routes';
import { LOCALE } from './crew-trip/shared/utils/constant';

registerLocaleData(localeVi, LOCALE.VN);
registerLocaleData(localeEn, LOCALE.EN);

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding()),
		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(withInterceptors([loggingInterceptor])),
		importProvidersFrom(NgxSpinnerModule.forRoot()),
		[{ provide: LOCALE_ID, useValue: LOCALE.EN }],
		// [{provide: LOCALE_ID, useValue: LOCALE.VN}],
	],
};
