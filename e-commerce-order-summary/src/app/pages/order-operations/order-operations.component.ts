import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order.model';
import { Tax } from 'src/app/model/tax';
import { Shipping } from 'src/app/model/shipping';
import { OrderService } from 'src/app/services/order/order.service';
import { ShippingService } from 'src/app/services/shipping/shipping.service';
import { TaxService } from 'src/app/services/tax/tax.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-operations',
  templateUrl: './order-operations.component.html',
  styleUrls: ['./order-operations.component.scss'],
})
export class OrderOperationsComponent implements OnInit {
  orders: Order[] = [];
  tax: Tax | undefined ;
  shipping: Shipping | undefined ;
  orderDetailsTotalAmount: number = 0;
  orderTotal: number = 0;
  taxAmount: number = 0;

  constructor(
    private orderService: OrderService,
    private shippingService: ShippingService,
    private taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.loadOrderSummary();
  }

  private loadOrderSummary() {
    this.orderService.getOrderItems().pipe(
      switchMap(orderItems => {
        this.orders = orderItems;
        this.amountCalculator();
        const totalWeight = this.calculateTotalWeight(orderItems);

        return forkJoin({
          shipping: this.shippingService.getShippingData(totalWeight),
          tax: this.taxService.getTaxData()
        }).pipe(
          catchError(error => {
            console.error('Error fetching data', error);
            return of({ shipping: undefined, tax: undefined });
          })
        );
      })
    ).subscribe(
      ({ shipping, tax }) => {
        this.shipping = shipping;
        this.tax = tax;
        this.calculateOrderTotal();
      }
    );
  }

  private amountCalculator() {
    this.orderDetailsTotalAmount = this.orders.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  private calculateOrderTotal() {
    if (this.tax && this.shipping) {
      this.taxAmount = this.orderDetailsTotalAmount * this.tax.amount;
      this.orderTotal = this.orderDetailsTotalAmount + this.taxAmount + this.shipping.cost;
    }
  }

  private calculateTotalWeight(orderItems: Order[]): number {
    return orderItems.reduce((sum, item) => sum + (item.weight * item.qty), 0);
  }

  formatOrderDetails(order: Order): string {
    return `Name: ${order.name}, Price: ${order.price}, Quantity: ${order.qty}, Weight: ${order.weight}`;
  }

  formatAddress(address: any): string {
    if (!address) return '';
    return `${address.address_line1}, ${address.city_locality}, ${address.state_province}`;
  }
}






// Pormise kullanırsak

/*
async ngOnInit(): Promise<void> {
  await this.loadOrderSummary();
}

private async loadOrderSummary(): Promise<void> {
  try {
    const orderItems = await this.orderService.getOrderItems().toPromise();
    this.orders = orderItems;
    this.amountCalculator();
    const totalWeight = this.calculateTotalWeight(orderItems);

    const shippingPromise = this.shippingService.getShippingData(totalWeight).toPromise();
    const taxPromise = this.taxService.getTaxData().toPromise();

    const [shipping, tax] = await Promise.all([shippingPromise, taxPromise]);

    this.shipping = shipping;
    this.tax = tax;
    this.calculateOrderTotal();
  } catch (error) {
    this.handleError(error);
  }*/
