import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode = true;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: [''],
      last_name: [''],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    const { email, password, first_name, last_name } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login({ email, password }).subscribe({
        next: () => this.router.navigate(['/professors']),
        error: err => {
          console.error('Erreur API :', err); // Logger l'erreur complète
          this.error = err.error?.error || 'Erreur lors de la connexion';
        },
      });
    } else {
      this.authService.register({ email, first_name, last_name, password }).subscribe({
        next: () => {
          this.isLoginMode = true;
          this.authForm.reset();
          this.error = '';
        },
        error: err => {
          console.error('Erreur API :', err); // Logger l'erreur complète
          this.error = err.error?.error || 'Erreur lors de l’inscription';
        },
      });
    }
  }
}