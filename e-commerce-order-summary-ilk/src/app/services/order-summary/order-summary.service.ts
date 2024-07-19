import { IOrderSummary } from './../../model/order-summary.model';
import { Tax } from 'src/app/model/tax';
import { Shipping } from 'src/app/model/shipping';
import { Order } from 'src/app/model/order.model';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderSummaryService {
  private orderUrl = 'api/order';
  private shippingUrl = 'api/shipping';
  private taxUrl = 'api/tax';

  constructor(private http: HttpClient) {}

  getOrder(): Observable<Order> {
    return this.http.get<Order>(this.orderUrl);
  }

  getShipping(totalWeight: number): Observable<Shipping> {
    return this.http.get<Shipping>(`${this.shippingUrl}?weight=${totalWeight}`);
  }

  getTax(): Observable<Tax> {
    return this.http.get<Tax>(this.taxUrl);
  }

  getSummary(): Observable<IOrderSummary> {
    return this.getOrder().pipe(
      mergeMap(order => {
        const totalWeight = order.order.reduce((acc: number, item: { weight: number; qty: number; }) => acc + item.weight * item.qty, 0);

        return forkJoin({
          order: of(order),
          shipping: this.getShipping(totalWeight),
          tax: this.getTax()
        });
      })
    );
  }

}
