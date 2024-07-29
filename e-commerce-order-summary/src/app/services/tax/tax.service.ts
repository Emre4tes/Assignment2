import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfig } from 'src/app/config/api.config';
import { Tax } from 'src/app/model/tax';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  getTaxUrl(): string {
    throw new Error('Method not implemented.');
  }
  private taxUrl = `${ApiConfig.baseUrl}/tax`;
  private readonly uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

  constructor(private http: HttpClient) {}

  public getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.uniqueIdentifier}`);
  }

  public async getTaxData(): Promise<Tax> {
    const headers = this.getHeaders();
    try {
      const response = await this.http.get<Tax>(this.taxUrl, { headers }).toPromise();
      if (response) {
        return response;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error.message);

  }
}
