import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from './authentification/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialogContent, MatDialogTitle, 
  MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gestion-professeurs-front';
  user: any = null;
  private destroy$ = new Subject<void>();
  @ViewChild('sessionExpiredDialog') sessionExpiredDialog!: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.getProfile().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => this.user = user,
      error: () => {
        this.authService.logout();
        this.router.navigate(['/auth']);
      }
    });

    this.authService.sessionExpired$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.dialog.open(this.sessionExpiredDialog, {
        width: '350px',
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/auth']);
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}