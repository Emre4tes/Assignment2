import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderService } from 'src/app/services/order/order.service';
import { ShippingService } from 'src/app/services/shipping/shipping.service';
import { TaxService } from 'src/app/services/tax/tax.service';
import { IOrderSummary } from 'src/app/model/order-summary.model';
import { Order } from 'src/app/model/order.model';
import { Tax } from 'src/app/model/tax';
import { Shipping } from 'src/app/model/order-summary.model';

@Injectable({
  providedIn: 'root',
})
export class OrderSummaryService {
  private readonly RETRY_COUNT = 5;
  private readonly DELAY_MS = 1000;

  constructor(
    private orderService: OrderService,
    private shippingService: ShippingService,
    private taxService: TaxService
  ) {}

  private async retry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed: ${this.getErrorMessage(error)}`);
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.DELAY_MS));
        }
      }
    }
    throw lastError;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred.';
  }

  private async fetchJson<T>(url: string, headers: HttpHeaders = new HttpHeaders()): Promise<T> {
    const headersObject = headers.keys().reduce((acc: { [key: string]: string }, key: string) => {
      acc[key] = headers.get(key) || '';
      return acc;
    }, {});

    const response = await fetch(url, {
      method: 'GET',
      headers: headersObject,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async getSummary(): Promise<IOrderSummary> {
    try {
      const orderResponse = await this.retry(
        () => this.fetchJson<Order[]>(this.orderService.getOrderUrl(), this.orderService.getHeaders()),
        this.RETRY_COUNT
      );
      const taxResponse = await this.retry(
        () => this.fetchJson<Tax>(this.taxService.getTaxUrl(), this.taxService.getHeaders()),
        this.RETRY_COUNT
      );

      const totalWeight = orderResponse.reduce(
        (acc: number, item: { weight: number; qty: number; }) => acc + item.weight * item.qty,
        0
      );

      const shippingResponse = await this.retry(
        () => this.fetchJson<Shipping>(this.shippingService.getShippingUrl(totalWeight), this.shippingService.getHeaders()),
        this.RETRY_COUNT
      );

      return {
        order: orderResponse,
        tax: taxResponse,
        shipping: shippingResponse,
      };
    } catch (error) {
      console.error('Error fetching order summary:', this.getErrorMessage(error));
      throw error;
    }
  }
}
