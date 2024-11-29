import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormResponse } from '../../../shared/types/form';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiUrl = `${environment.api}/form-fields`;
  private http = inject(HttpClient);
  constructor() {}

  getFormFields(): Observable<FormResponse> {
    return this.http.get<FormResponse>(this.apiUrl);
  }
}
