import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from 'src/app/model/order.model';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = `${environment.apiUrl}/order`;
  private readonly uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.uniqueIdentifier}`);
  }

  getOrderItems(): Observable<Order[]> {
    const headers = this.getHeaders();
    return this.http.get<Order[]>(this.orderUrl, { headers }).pipe(
      catchError(this.handleError('getOrderItems', []))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Error during ${operation}:`, error.message);

      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error.status === 404) {
        errorMessage = 'Order not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      alert(errorMessage);
      return of(result as T);
    };
  }
}



//Alternatif olarak Promise kullanırsak
  /*
  async getOrderItems(): Promise<Order[]> {
    const headers = this.getHeaders();
    try {
      const response = await this.http.get<Order[]>(this.orderUrl, { headers }).toPromise();
      return response ?? [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error.message);

    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.status === 404) {
      errorMessage = 'Order not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    console.error(errorMessage);
  }
    */

