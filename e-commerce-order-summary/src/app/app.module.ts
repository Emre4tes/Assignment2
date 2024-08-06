import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { OrderOperationsComponent } from './pages/order-operations/order-operations.component';
import { ErrorInterceptor } from './services/Http-interceptor/interceptor';
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service';

@NgModule({
  declarations: [AppComponent, OrderOperationsComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
