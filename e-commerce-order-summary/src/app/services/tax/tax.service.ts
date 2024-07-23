import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfig } from 'src/app/config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  getTax() {
    throw new Error('Method not implemented.');
  }
  private taxUrl = `${ApiConfig.baseUrl}/tax`;
  private readonly AUTH_KEY = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.AUTH_KEY}`);
  }


  getTaxData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(this.taxUrl, { headers });
  }
}
