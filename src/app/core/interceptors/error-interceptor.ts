import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notification: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {

        let message = 'Something went wrong. Please try again.';

        if (error.status === 400) {
          message = error.error?.message || 'Invalid request';
        } 
        else if (error.status === 401) {
          message = 'Session expired. Please login again.';
        } 
        else if (error.status === 403) {
          message = 'You are not allowed to perform this action.';
        } 
        else if (error.status === 404) {
          message = 'Data not found.';
        } 
        else if (error.status === 500) {
          message = 'Server error. Please try later.';
        }

        // 🔥 Show notification globally
        this.notification.error(message);

        return throwError(() => error);
      })

    );
  }
}