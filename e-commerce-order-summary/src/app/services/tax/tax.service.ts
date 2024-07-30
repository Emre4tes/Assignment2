import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfig } from 'src/app/config/api.config';
import { Tax } from 'src/app/model/tax';
import { catchError, Observable, throwError } from 'rxjs';

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

  getTaxData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(this.taxUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {

    console.error('An error occurred:', error.message);

    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.status === 404) {
      errorMessage = 'Tax data not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }

}


//Promise kullanırsak

  /*
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
    */
