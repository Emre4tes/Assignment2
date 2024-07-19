import { Order } from './order.model';
import { Shipping } from './shipping';
import { Tax } from './tax';

export interface IOrderSummary {
  order: Order;
  shipping: Shipping;
  tax: Tax;
}

export { Order, Tax, Shipping };
