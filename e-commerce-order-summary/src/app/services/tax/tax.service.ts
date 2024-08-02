import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { BaseService } from '../Base/base.service';

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseService {
  protected apiUrl = `${environment.apiUrl}/tax`;

  getTaxData(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError('getTaxData'))
    );
  }
}


//Alternatif olarak Promise kullanırsak

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
