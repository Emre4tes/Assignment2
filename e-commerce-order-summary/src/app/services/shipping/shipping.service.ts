import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfig } from 'src/app/config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private shippingUrl = `${ApiConfig.baseUrl}/shipping`;
  private readonly AUTH_KEY = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.AUTH_KEY}`);
  }

  getShippingData(weight: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.shippingUrl}?weight=${weight}`, { headers });
  }
}
