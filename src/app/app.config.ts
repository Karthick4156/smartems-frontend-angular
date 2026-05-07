import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error-interceptor';

ModuleRegistry.registerModules([AllCommunityModule]);


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(),
    MatSnackBarModule,

  ]
};
