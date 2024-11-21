import {ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {loggingInterceptor} from "src/app/crew-trip/core/auth/auth.interceptor";
import {NgxSpinnerModule} from "ngx-spinner";
import {registerLocaleData} from "@angular/common";
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { LOCALE } from './crew-trip/shared/utils/constant';
import 'moment/locale/es'
import moment from "moment";
import  "moment/locale/vi";
moment.locale('vi')
registerLocaleData(localeVi, LOCALE.VN);
registerLocaleData(localeEn, LOCALE.EN);


// Factory để tạo HttpLoader cho TranslateModule
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './language/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([loggingInterceptor]),
    ),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    importProvidersFrom(NgxSpinnerModule.forRoot()),
    // [{provide: LOCALE_ID, useValue: 'en-US'}],
    [{provide: LOCALE_ID, useValue: 'vi-VN'}],
  ]
};
