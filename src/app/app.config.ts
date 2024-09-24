import {ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {loggingInterceptor} from "src/app/crew-trip/core/auth/auth.interceptor";
import {NgxSpinnerModule} from "ngx-spinner";
import {registerLocaleData} from "@angular/common";
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeVi, 'vi-VN');
registerLocaleData(localeEn, 'en-US');
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(
      withInterceptors([loggingInterceptor]),
    ),
    importProvidersFrom(NgxSpinnerModule.forRoot()),
    [{provide: LOCALE_ID, useValue: 'vi-VN'}],
  ]
};
