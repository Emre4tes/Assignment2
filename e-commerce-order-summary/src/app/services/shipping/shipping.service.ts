import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfig } from 'src/app/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private shippingUrl = `${ApiConfig.baseUrl}/shipping`;
  private readonly uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.uniqueIdentifier}`);
  }

  getShippingData(weight: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.shippingUrl}?weight=${weight}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.message);

    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.status === 404) {
      errorMessage = 'Shipping data not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }
}


// Alternatif olarak Promise kullanırsak
  /*
  async getShippingData(weight: number): Promise<any> {
    const headers = this.getHeaders();
    try {
      const response = await this.http.get<any>(`${this.shippingUrl}?weight=${weight}`, { headers }).toPromise();
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error.message);
*/
