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
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatiereService } from '../../../service/matiere.service/matiere.service';
import { Matiere } from '../../../models/matiere.models';
import { Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-matieres',
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
    MatTableModule,
    MatToolbarModule,
    RouterLink
  ],
  templateUrl: './matiere-list.component.html', // Corrigé : aligné avec le nom du composant
  styleUrl: './matiere-list.component.css'
})
export class MatiereListComponent implements OnInit, OnDestroy {
  
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  matieres: Matiere[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 10;
  search = '';
  isLoading = false;
  displayedColumns = ['nom', 'description', 'professeur', 'niveaux', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private matiereService: MatiereService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMatieres();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMatieres() {
    this.isLoading = true;
    this.matiereService.getMatieres(this.page, this.pageSize, this.search)
      .subscribe({
        next: ({ results, count }) => {
          this.matieres = results;
          this.totalItems = count;
          this.isLoading = false;
        },
        error: () => this.showError('Erreur lors du chargement')
      });
  }

  exportPdf() {
    this.matiereService.exportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matieres.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('PDF généré', 'OK', { duration: 2000 });
      },
      error: () => this.showError('Erreur lors de l’export PDF')
    });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.page = pageIndex + 1;
    this.pageSize = pageSize;
    this.loadMatieres();
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.page = 1;
    this.loadMatieres();
  }

  clearSearch() {
    this.search = '';
    this.page = 1;
    this.loadMatieres();
  }

  getNiveauxNames(matiere: Matiere): string {
    return matiere.niveaux.map(n => n.nom).join(', ') || '-';
  }

  openDeleteModal(matiere: Matiere) {
    this.dialog.open(this.deleteDialog, {
      width: '350px',
      data: matiere
    }).afterClosed().subscribe(result => {
      if (result) this.deleteMatiere(matiere.id);
    });
  }

  deleteMatiere(id: number) {
    this.matiereService.deleteMatiere(id).subscribe({
      next: () => {
        this.snackBar.open('Matière supprimée', 'OK', { duration: 2000 });
        this.loadMatieres();
      },
      error: () => this.showError('Erreur lors de la suppression')
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
    this.isLoading = false;
  }
}