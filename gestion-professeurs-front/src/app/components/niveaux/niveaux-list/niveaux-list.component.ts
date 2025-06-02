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
import { NiveauService } from '../../../service/niveau.service/niveau.service';
import { Niveau } from '../../../models/niveau.models';
import { Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-niveaux',
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
  templateUrl: './niveaux-list.component.html',
  styleUrl: './niveaux-list.component.css'
})
export class NiveauxComponent implements OnInit, OnDestroy {
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  @ViewChild('importDialog') importDialog!: TemplateRef<any>;
  niveaux: Niveau[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 10;
  search = '';
  isLoading = false;
  displayedColumns = ['nom', 'actions'];
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private niveauService: NiveauService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadNiveaux();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNiveaux() {
    this.isLoading = true;
    this.niveauService.getNiveaux(this.page, this.pageSize, this.search)
      .subscribe({
        next: ({ results, count }) => {
          this.niveaux = results;
          this.totalItems = count;
          this.isLoading = false;
        },
        error: () => this.showError('Erreur lors du chargement')
      });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.page = pageIndex + 1;
    this.pageSize = pageSize;
    this.loadNiveaux();
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.page = 1;
    this.loadNiveaux();
  }

  openDeleteModal(niveau: Niveau) {
    this.dialog.open(this.deleteDialog, {
      width: '350px',
      data: niveau
    }).afterClosed().subscribe(result => {
      if (result) this.deleteNiveau(niveau.id);
    });
  }

  deleteNiveau(id: number) {
    this.niveauService.deleteNiveau(id).subscribe({
      next: () => {
        this.snackBar.open('Niveau supprimé', 'OK', { duration: 2000 });
        this.loadNiveaux();
      },
      error: () => this.showError('Erreur lors de la suppression')
    });
  }

  openImportModal() {
    this.dialog.open(this.importDialog, {
      width: '350px'
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  importNiveaux() {
    if (!this.selectedFile) {
      this.showError('Veuillez sélectionner un fichier');
      return;
    }
    this.isLoading = true;
    this.niveauService.importNiveaux(this.selectedFile).subscribe({
      next: (response) => {
        this.dialog.closeAll();
        this.snackBar.open(response.message, 'OK', { duration: 2000 });
        this.loadNiveaux();
        this.selectedFile = null;
        this.isLoading = false;
      },
      error: () => {
        this.showError('Erreur lors de l’import');
        this.isLoading = false;
      }
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
    this.isLoading = false;
  }
}