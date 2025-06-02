import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Niveau } from '../../../models/niveau.models';
import { NiveauService } from '../../../service/niveau.service/niveau.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-niveau-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './niveaux-form.component.html',
  styleUrl: './niveaux-form.component.css'
})
export class NiveauFormComponent implements OnInit {
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  niveauForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private niveauService: NiveauService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.niveauForm = this.fb.group({
      nom: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loading = true;
      this.niveauService.getNiveauById(+id).subscribe({
        next: (niveau) => {
          this.niveauForm.patchValue(niveau);
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors du chargement du niveau.';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.niveauForm.invalid) return;
    this.loading = true;
    this.error = null;
    const formValue = this.niveauForm.value;

    const request = this.isEditMode
      ? this.niveauService.updateNiveau(+(this.route.snapshot.paramMap.get('id')!), formValue)
      : this.niveauService.createNiveau(formValue as Niveau);

    request.subscribe({
      next: () => {
        this.dialog.open(this.successDialog, {
          data: { message: this.isEditMode ? 'Niveau mis à jour avec succès.' : 'Niveau ajouté avec succès.' },
          width: '350px'
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/niveaux']);
        });
      },
      error: () => {
        this.error = this.isEditMode ? 'Erreur lors de la modification.' : "Erreur lors de l'ajout.";
        this.loading = false;
      }
    });
  }
}