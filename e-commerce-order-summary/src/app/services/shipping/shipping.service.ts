import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from 'src/app/config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private shippingUrl = `${ApiConfig.baseUrl}/shipping`;

  constructor(private http: HttpClient) {}

  getShippingData(weight: number): Observable<any> {
    return this.http.get(`${this.shippingUrl}?weight=${weight}`);
  }
}
