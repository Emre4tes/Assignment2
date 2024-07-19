import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipping } from 'src/app/model/shipping';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = 'http://localhost:3000/shipping';

  constructor(private http: HttpClient) {}

  getShipping(totalWeight: any): Observable<Shipping> {
    return this.http.get<Shipping>(this.apiUrl);
  }
}
