import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Niveau } from '../../models/niveau.models';
import { PaginatedResponse } from '../../models/professor.models';


@Injectable({ providedIn: 'root' })
export class NiveauService {
  private baseUrl = 'http://localhost:8000/api/niveaux/';

  constructor(private http: HttpClient) {}

  getNiveaux(page: number = 1, pageSize: number = 10, search: string = '', sort: string = ''): Observable<PaginatedResponse<Niveau>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    if (search) params = params.set('search', search);
    if (sort) params = params.set('ordering', sort);
    return this.http.get<PaginatedResponse<Niveau>>(this.baseUrl, { params });
  }

  createNiveau(niveau: Niveau): Observable<Niveau> {
    return this.http.post<Niveau>(this.baseUrl, niveau);
  }

  updateNiveau(id: number, niveau: Partial<Niveau>): Observable<Niveau> {
    return this.http.put<Niveau>(`${this.baseUrl}${id}/`, niveau);
  }

  deleteNiveau(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  getNiveauById(id: number): Observable<Niveau> {
    return this.http.get<Niveau>(`${this.baseUrl}${id}/`);
  }

  importNiveaux(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}excel/`, formData);
  }
}