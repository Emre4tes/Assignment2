import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { Order } from 'src/app/model/order.model';
import { environment } from 'src/environment/environment';
import { BaseService } from '../Base/base.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {
  private readonly RETRY_COUNT = 5;
  private readonly DELAY_MS = 1000;
  protected apiUrl = `${environment.apiUrl}/order`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  private applyRetryAndDelay<T>(observable: Observable<T>, operation: string, result: T): Observable<T> {
    return observable.pipe(
      retry(this.RETRY_COUNT),
      delay(this.DELAY_MS),
      catchError(this.handleError(operation, result))
    );
  }

  getOrderItems(): Observable<Order[]> {
    return this.applyRetryAndDelay(
      this.http.get<Order[]>(this.apiUrl, { headers: this.getHeaders() }),
      'getOrderItems',
      []
    );
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

