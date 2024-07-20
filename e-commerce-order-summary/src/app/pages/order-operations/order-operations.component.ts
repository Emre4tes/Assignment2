import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { Order } from 'src/app/model/order.model';
import { Tax } from 'src/app/model/tax';
import { Shipping } from 'src/app/model/shipping';
import { OrderService } from 'src/app/services/order/order.service';
import { ShippingService } from 'src/app/services/shipping/shipping.service';
import { TaxService } from 'src/app/services/tax/tax.service';

@Component({
  selector: 'app-order-operations',
  templateUrl: './order-operations.component.html',
  styleUrls: ['./order-operations.component.scss'],
})
export class OrderOperationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  orders: Order[] = [];
  tax: Tax | null = null;
  shipping: Shipping | null = null;
  orderDetailsTotalAmount: number = 0;
  orderTotal: number = 0;
  taxAmount: number = 0;

  constructor(
    private orderService: OrderService,
    private shippingService: ShippingService,
    private taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.getTax();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getOrders() {
    this.orderService.getOrderItems().pipe(
      mergeMap(orderItems => {
        this.orders = orderItems;
        this.amountCalculator();
        return this.shippingService.getShipping(this.calculateTotalWeight(orderItems));
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      (shippingResponse) => {
        this.shipping = shippingResponse;
        this.calculateOrderTotal();
      },
      (errorResponse) => {
        alert("Hata oluştu");
        console.log(errorResponse);
      }
    );
  }

  private amountCalculator() {
    this.orderDetailsTotalAmount = this.orders.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  private calculateOrderTotal() {
    if (this.tax && this.orderDetailsTotalAmount && this.shipping) {
      this.taxAmount = this.orderDetailsTotalAmount * this.tax.amount;
      this.orderTotal = this.orderDetailsTotalAmount + this.taxAmount + this.shipping.cost;
    }
  }

  private calculateTotalWeight(orderItems: Order[]): number {
    return orderItems.reduce((sum, item) => sum + (item.weight * item.qty), 0);
  }

  getTax() {
    this.taxService.getTax().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (response) => {
        this.tax = response;
        this.calculateOrderTotal();
      },
      (errorResponse) => {
        console.log("Tax verisi alınamadı", errorResponse);
      }
    );
  }

  formatOrderDetails(order: Order): string {
    return `Name: ${order.name}, Price: ${order.price}, Quantity: ${order.qty}, Weight: ${order.weight}`;
  }

  formatAddress(address: any): string {
    if (!address) return '';
    return `${address.address_line1}, ${address.city_locality}, ${address.state_province}`;
  }
}
