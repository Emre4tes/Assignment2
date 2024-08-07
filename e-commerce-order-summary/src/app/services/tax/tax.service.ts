import { Injectable } from '@angular/core';
import { catchError, delay,retry } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import { BaseService } from '../Base/base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tax } from 'src/app/model/tax';

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseService {
  private readonly RETRY_COUNT = 5;
  private readonly DELAY_MS = 100;
  protected apiUrl = `${environment.apiUrl}/tax`;

  constructor(protected override http: HttpClient) {
    super(http);
  }


  private applyRetryAndDelay<T>(observable: Observable<T>, operation: string, result: T): Observable<T> {
    return observable.pipe(
      retry(this.RETRY_COUNT),
      delay(this.DELAY_MS),
      catchError(this.handleError(operation, result))
    );
  }

  getTaxData(): Observable<Tax> {
    return this.applyRetryAndDelay(
      this.http.get<Tax>(this.apiUrl, { headers: this.getHeaders() }),
      'getTaxData',
      {
        amount: 0,
      }
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
