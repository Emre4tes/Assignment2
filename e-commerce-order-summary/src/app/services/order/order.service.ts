
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/model/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/order';


  constructor(private http: HttpClient) {}

  getOrderItems(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
}
