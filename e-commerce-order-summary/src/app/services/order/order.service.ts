import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Order } from 'src/app/model/order.model';
import { environment } from 'src/environment/environment';
import { BaseService } from '../Base/base.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {
  protected apiUrl = `${environment.apiUrl}/order`;

  getOrderItems(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError('getOrderItems', []))
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

