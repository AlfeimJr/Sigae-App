import { inject, Injectable } from '@angular/core';
import { People } from '../../../shared/types/people';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private apiUrl = `${environment.api}/people`;
  private http = inject(HttpClient);

  addPerson(person: People): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-person`, person);
  }

  getPeople(): Observable<{ message: string; people: People[] }> {
    return this.http.get<{ message: string; people: People[] }>(
      `${this.apiUrl}`
    );
  }

  getPersonById(id: string): Observable<{ message: string; people: People[] }> {
    return this.http.get<{ message: string; people: People[] }>(
      `${this.apiUrl}/${id}`
    );
  }

  patchPeople(person: People, id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string; people: People }>(
      `${this.apiUrl}/edit/${id}`,
      person
    );
  }

  deletePeople(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${id}`);
  }
}
