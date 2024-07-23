import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private readonly AUTH_KEY = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.AUTH_KEY}`
      }
    });

    console.log('Intercepted Request:',clonedRequest);
    return next.handle(clonedRequest);
  }
}
