import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Kullanıcıya gösterilecek genel bir hata mesajı
        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (error.status === 404) {
          errorMessage = 'Requested resource not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred.';
        } else if (error.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        }

        console.log(errorMessage);
        return throwError(error);
      })
    );
  }
}
