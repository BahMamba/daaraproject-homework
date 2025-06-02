import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Professor } from '../../../models/professor.models';
import { ProfesseurService } from '../../../service/professeurs.service/professeur.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-professeur-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    RouterLink
  ],
  templateUrl: './professeur-form.component.html',
  styleUrl: './professeur-form.component.css'
})
export class ProfesseurFormComponent implements OnInit {
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  professeurForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private professeurService: ProfesseurService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.professeurForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialite: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loading = true;
      this.professeurService.getProfessorById(+id).subscribe({
        next: (prof) => {
          this.professeurForm.patchValue(prof);
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors du chargement du professeur.';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.professeurForm.invalid) return;
    this.loading = true;
    this.error = null;
    const formValue = this.professeurForm.value;

    const request = this.isEditMode
      ? this.professeurService.updateProfessor(+(this.route.snapshot.paramMap.get('id')!), formValue)
      : this.professeurService.createProfessor(formValue as Professor);

    request.subscribe({
      next: () => {
        this.dialog.open(this.successDialog, {
          data: { message: this.isEditMode ? 'Professeur mis à jour avec succès.' : 'Professeur ajouté avec succès.' },
          width: '350px'
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/professors']);
        });
      },
      error: () => {
        this.error = this.isEditMode ? 'Erreur lors de la modification.' : "Erreur lors de l'ajout.";
        this.loading = false;
      }
    });
  }
}