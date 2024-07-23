import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/model/order.model';
import { ApiConfig } from 'src/app/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = `${ApiConfig.baseUrl}/order`;

  constructor(private http: HttpClient) {}


  getOrderItems(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderUrl);
  }
}
