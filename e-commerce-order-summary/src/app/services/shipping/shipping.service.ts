import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { BaseService } from '../Base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingService extends BaseService {
  protected apiUrl = `${environment.apiUrl}/shipping`;

  getShippingData(weight: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?weight=${weight}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError('getShippingData'))
    );
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
