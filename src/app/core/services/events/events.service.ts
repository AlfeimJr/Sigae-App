import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventCalendar } from '../../../shared/types/event-calendar';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = `${environment.api}/events`;

  constructor(private http: HttpClient) {}

  createEvent(event: EventCalendar): Observable<EventCalendar> {
    return this.http.post<EventCalendar>(this.apiUrl, event);
  }

  getAllEvents(): Observable<EventCalendar[]> {
    return this.http.get<EventCalendar[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<EventCalendar> {
    return this.http.get<EventCalendar>(`${this.apiUrl}/${id}`);
  }

  updateEvent(
    id: string,
    event: Partial<EventCalendar>
  ): Observable<EventCalendar> {
    return this.http.put<EventCalendar>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
