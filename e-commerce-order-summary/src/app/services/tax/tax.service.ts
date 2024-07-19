import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tax } from 'src/app/model/tax';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  getTaxDetails() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/tax';

  constructor(private http: HttpClient) {}

  getTax(): Observable<Tax> {

    return this.http.get<Tax>(this.apiUrl);
  }
}
