import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  protected readonly uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';


  constructor(protected http: HttpClient) {}

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.uniqueIdentifier}`);
  }



  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error.status === 404) errorMessage = `${operation} not found.`;
      if (error.status === 500) errorMessage = 'Server error. Please try again later.';
      alert(errorMessage);
      return of(result as T);
    };
  }
}
