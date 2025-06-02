import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Professor, PaginatedResponse } from '../../models/professor.models';

@Injectable({ providedIn: 'root' })
export class ProfesseurService {
  private baseUrl = 'http://localhost:8000/api/professeurs/';

  constructor(private http: HttpClient) {}

  getProfesseurs(page: number = 1, pageSize: number = 10, search: string = '', sort: string = ''): Observable<PaginatedResponse<Professor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    if (search) params = params.set('search', search);
    if (sort) params = params.set('ordering', sort);
    return this.http.get<PaginatedResponse<Professor>>(this.baseUrl, { params });
  }

  createProfessor(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(this.baseUrl, professor);
  }

  updateProfessor(id: number, professor: Partial<Professor>): Observable<Professor> {
    return this.http.put<Professor>(`${this.baseUrl}${id}/`, professor);
  }

  deleteProfessor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  getProfessorById(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.baseUrl}${id}/`);
  }

  exportProfessors(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}export/`, { responseType: 'blob' });
  }
}