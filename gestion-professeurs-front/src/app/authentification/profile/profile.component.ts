import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: user => (this.user = user),
      error: () => {
        this.error = 'Erreur lors du chargement du profil';
        this.authService.logout();
        this.router.navigate(['/auth']);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}