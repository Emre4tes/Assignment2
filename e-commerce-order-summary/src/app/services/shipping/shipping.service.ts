import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfig } from 'src/app/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  getShippingUrl(totalWeight: number): string {
    throw new Error('Method not implemented.');
  }
  private shippingUrl = `${ApiConfig.baseUrl}/shipping`;
  private readonly uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  public  getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.uniqueIdentifier}`);
  }

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

    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.status === 404) {
      errorMessage = 'Shipping data not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    console.error(errorMessage);
  }
}
