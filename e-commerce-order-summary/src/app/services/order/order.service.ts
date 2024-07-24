import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from 'src/app/model/order.model';
import { ApiConfig } from 'src/app/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = `${ApiConfig.baseUrl}/order`;
  private readonly uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.uniqueIdentifier}`);
  }

  getOrderItems(): Observable<Order[]> {
    const headers = this.getHeaders();
    return this.http.get<Order[]>(this.orderUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {

    console.error('An error occurred:', error.message);

    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.status === 404) {
      errorMessage = 'Order not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
