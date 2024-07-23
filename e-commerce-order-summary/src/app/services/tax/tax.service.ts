import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  getTaxData(): Observable<any> {
    return this.http.get<any>(this.taxUrl);
  }
}
