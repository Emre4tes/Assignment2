// order-summary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, mergeMap, retry } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order/order.service';
import { ShippingService } from 'src/app/services/shipping/shipping.service';
import { TaxService } from 'src/app/services/tax/tax.service';
import { ApiConfig } from 'src/app/config/api.config';
import { IOrderSummary } from 'src/app/model/order-summary.model';

@Injectable({
  providedIn: 'root'
})
export class OrderSummaryService {
  private readonly RETRY_COUNT = 5;

  constructor(
    private orderService: OrderService,
    private shippingService: ShippingService,
    private taxService: TaxService
  ) {}

  getSummary(): Observable<IOrderSummary> {
    return forkJoin({
      order: this.orderService.getOrderItems().pipe(
        retry(this.RETRY_COUNT),
        catchError(error => {
          console.error('Error fetching order items', error);
          alert('Error occurred while fetching order items');
          return of([]);
        })
      ),
      tax: this.taxService.getTaxData().pipe(
        retry(this.RETRY_COUNT),
        catchError(error => {
          console.error('Error fetching tax', error);
          alert('Error occurred while fetching tax');
          return of({ amount: 0, description: 'No tax available' } as any);
        })
      )
    }).pipe(
      mergeMap(({ order, tax }) => {
        const totalWeight = order.reduce((acc, item) => acc + item.weight * item.qty, 0);

        return this.shippingService.getShippingData(totalWeight).pipe(
          retry(this.RETRY_COUNT),
          catchError(error => {
            console.error('Error fetching shipping cost', error);
            alert('Error occurred while fetching shipping cost');
            return of({ cost: 0, description: 'No shipping cost available', carrier: '', address: '' } as any);
          }),
          mergeMap(shipping => {
            return of({
              order,
              shipping,
              tax
            } as IOrderSummary);
          })
        );
      })
    );
  }
}
