import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesseurService } from '../../../service/professeurs.service/professeur.service';
import { NiveauService } from '../../../service/niveau.service/niveau.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Professor } from '../../../models/professor.models';
import { Niveau } from '../../../models/niveau.models';
import { MatiereService } from '../../../service/matiere.service/matiere.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-matiere-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './matiere-form.component.html',
  styleUrl: './matiere-form.component.css'
})
export class MatiereFormComponent implements OnInit {
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  matiereForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  professors: Professor[] = [];
  niveaux: Niveau[] = [];

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private professeurService: ProfesseurService,
    private niveauService: NiveauService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.matiereForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      professeur_nom: ['', Validators.required],
      niveaux_noms: [[]]
    });

    this.loadDependencies();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loading = true;
      this.matiereService.getMatiereById(+id).subscribe({
        next: (matiere) => {
          this.matiereForm.patchValue({
            nom: matiere.nom,
            description: matiere.description,
            professeur_nom: matiere.professeur.nom,
            niveaux_noms: matiere.niveaux.map(n => n.nom)
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors du chargement.';
          this.loading = false;
        }
      });
    }
  }

  private loadDependencies() {
    this.professeurService.getProfesseurs(1, 100).subscribe({
      next: ({ results }) => this.professors = results
    });
    this.niveauService.getNiveaux(1, 100).subscribe({
      next: ({ results }) => this.niveaux = results
    });
  }

  onSubmit(): void {
    if (this.matiereForm.invalid) return;
    this.loading = true;
    this.error = null;
    const formValue = this.matiereForm.value;

    const request = this.isEditMode
      ? this.matiereService.updateMatiere(+(this.route.snapshot.paramMap.get('id')!), formValue)
      : this.matiereService.createMatiere(formValue);

    request.subscribe({
      next: () => {
        this.dialog.open(this.successDialog, {
          data: { message: this.isEditMode ? 'Matière mise à jour.' : 'Matière ajoutée.' },
          width: '300px'
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/matieres']);
        });
      },
      error: () => {
        this.error = 'Erreur lors de l’opération.';
        this.loading = false;
      }
    });
  }
}