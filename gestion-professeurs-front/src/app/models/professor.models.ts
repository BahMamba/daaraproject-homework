export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Professor {
  id: number;
  nom: string;
  email: string;
  specialite: string;
  telephone: string;
}