import { Routes } from '@angular/router';
import { authGuard } from './authentification/auth.guard'; // Présumé

export const routes: Routes = [

  { path: 'auth', loadComponent: () => import('./authentification/auth/auth.component').then(m => m.AuthComponent) },

  {
    path: 'niveaux', 
    loadComponent: () => import('./components/niveaux/niveaux-list/niveaux-list.component').then(m => m.NiveauxComponent),
    canActivate: [authGuard]
  },
  {
    path: 'niveaux/create',
    loadComponent: () => import('./components/niveaux/niveaux-form/niveaux-form.component').then(m => m.NiveauFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'niveaux/edit/:id',
    loadComponent: () => import('./components/niveaux/niveaux-form/niveaux-form.component').then(m => m.NiveauFormComponent),
    canActivate: [authGuard]
  },

  {
    path: 'matieres',
    loadComponent: () => import('./components/matieres/matiere-list/matiere-list.component').then(m => m.MatiereListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'matieres/create',
    loadComponent: () => import('./components/matieres/matiere-form/matiere-form.component').then(m => m.MatiereFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'matieres/edit/:id',
    loadComponent: () => import('./components/matieres/matiere-form/matiere-form.component').then(m => m.MatiereFormComponent),
    canActivate: [authGuard]
  },

  {
    path: 'professors',
    loadComponent: () => import('./components/professeurs/professeurs-list/professeurs.component').then(m => m.ProfesseursComponent),
    canActivate: [authGuard]
  },
  {
    path: 'professors/create',
    loadComponent: () => import('./components/professeurs/professeur-form/professeur-form.component').then(m => m.ProfesseurFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'professors/edit/:id',
    loadComponent: () => import('./components/professeurs/professeur-form/professeur-form.component').then(m => m.ProfesseurFormComponent),
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    loadComponent: () => import('./authentification/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '/auth' }
];