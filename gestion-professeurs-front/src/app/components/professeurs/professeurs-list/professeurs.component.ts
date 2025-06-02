import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfesseurService } from '../../../service/professeurs.service/professeur.service';
import { Professor, PaginatedResponse } from '../../../models/professor.models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-professeurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    RouterLink
  ],
  templateUrl: './professeurs.component.html',
  styleUrl: './professeurs.component.css'
})
export class ProfesseursComponent implements OnInit, OnDestroy {
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  professeurs: Professor[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 10;
  search = '';
  sort = '';
  isLoading = false;
  displayedColumns = ['nom', 'email', 'specialite', 'telephone', 'actions'];
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private professeurService: ProfesseurService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setupSearch();
    this.loadProfesseurs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.loadProfesseurs();
    });
  }

  loadProfesseurs() {
    this.isLoading = true;
    this.professeurService.getProfesseurs(this.page, this.pageSize, this.search, this.sort)
      .subscribe({
        next: ({ results, count }) => {
          this.professeurs = results;
          this.totalItems = count;
          this.isLoading = false;
        },
        error: () => this.showError('Erreur lors du chargement')
      });
  }

  exportProfessors() {
    this.professeurService.exportProfessors().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'professeurs.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Export réussi', 'OK', { duration: 2000 });
      },
      error: () => this.showError('Erreur lors de l’export')
    });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.page = pageIndex + 1;
    this.pageSize = pageSize;
    this.loadProfesseurs();
  }

  onSearch(search: string) {
    this.search = search;
    this.searchSubject.next(search);
  }

  onSortChange({ active, direction }: Sort) {
    this.sort = direction ? (direction === 'desc' ? `-${active}` : active) : '';
    this.page = 1;
    this.loadProfesseurs();
  }

  openDeleteModal(professeur: Professor) {
    this.dialog.open(this.deleteDialog, {
      width: '350px',
      data: professeur
    }).afterClosed().subscribe(result => {
      if (result) this.deleteProfessor(professeur.id);
    });
  }

  deleteProfessor(id: number) {
    this.professeurService.deleteProfessor(id).subscribe({
      next: () => {
        this.snackBar.open('Professeur supprimé', 'OK', { duration: 2000 });
        this.loadProfesseurs();
      },
      error: () => this.showError('Erreur lors de la suppression')
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
    this.isLoading = false;
  }
}