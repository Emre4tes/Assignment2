import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { Order } from 'src/app/model/order.model';
import { environment } from 'src/environment/environment';
import { BaseService } from '../Base/base.service';
import { Shipping } from 'src/app/model/shipping';

@Injectable({
  providedIn: 'root'
})
export class ShippingService extends BaseService {
  private readonly RETRY_COUNT = 5;
  private readonly DELAY_MS = 100;
  protected apiUrl = `${environment.apiUrl}/shipping`;

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

  getShippingData(weight: number): Observable<Shipping> {
    return this.applyRetryAndDelay(
      this.http.get<Shipping>(this.apiUrl, { headers: this.getHeaders() }),
      'getShippingData',
      {
        cost: 0,
        description: 'No shipping cost available',
        carrier: '',
        address: '',
      }
    );
  }

}





// Alternatif olarak Promise kullanırsak
  /*
  async getShippingData(weight: number): Promise<any> {
    const headers = this.getHeaders();
    try {
      const response = await this.http.get<any>(`${this.shippingUrl}?weight=${weight}`, { headers }).toPromise();
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error.message);
*/
