import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order.model';
import { Shipping } from 'src/app/model/shipping';
import { Tax } from 'src/app/model/tax';
import { OrderService } from 'src/app/services/order/order.service';
import { ShippingService } from 'src/app/services/shipping/shipping.service';
import { TaxService } from 'src/app/services/tax/tax.service';

@Component({
  selector: 'app-order-operations',
  templateUrl: './order-operations.component.html',
  styleUrls: ['./order-operations.component.scss'],
})
export class OrderOperationsComponent implements OnInit {
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

  async ngOnInit(): Promise<void> {
    await this.loadOrderSummary();
  }

  private async loadOrderSummary(): Promise<void> {
    try {
      const orderItems = await this.orderService.getOrderItems();
      this.orders = orderItems;
      this.amountCalculator();
      const totalWeight = this.calculateTotalWeight(orderItems);

      const [shipping, tax] = await Promise.all([
        this.shippingService.getShippingData(totalWeight),
        this.taxService.getTaxData()
      ]);

      this.shipping = shipping;
      this.tax = tax;
      this.calculateOrderTotal();
    } catch (error) {
      console.error('Error loading order summary:', error);
    }
  }


  private amountCalculator(): void {
    this.orderDetailsTotalAmount = this.orders.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  private calculateOrderTotal(): void {
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
    return `${address.address_line1 || ''}, ${address.city_locality || ''}, ${address.state_province || ''}`;
  }
}
