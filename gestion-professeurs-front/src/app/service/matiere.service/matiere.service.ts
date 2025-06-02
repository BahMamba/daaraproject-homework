import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matiere } from '../../models/matiere.models';
import { PaginatedResponse } from '../../models/professor.models';

@Injectable({ providedIn: 'root' })
export class MatiereService {
  private baseUrl = 'http://localhost:8000/api/matieres/';

  constructor(private http: HttpClient) {}

  getMatieres(page: number = 1, pageSize: number = 10, search: string = '', sort: string = ''): Observable<PaginatedResponse<Matiere>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    if (search) params = params.set('search', search);
    if (sort) params = params.set('ordering', sort);
    return this.http.get<PaginatedResponse<Matiere>>(this.baseUrl, { params });
  }

  createMatiere(matiere: Partial<Matiere>): Observable<Matiere> {
    return this.http.post<Matiere>(this.baseUrl, matiere);
  }

  updateMatiere(id: number, matiere: Partial<Matiere>): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.baseUrl}${id}/`, matiere);
  }

  deleteMatiere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  getMatiereById(id: number): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.baseUrl}${id}/`);
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}pdf/`, { responseType: 'blob' });
  }
}