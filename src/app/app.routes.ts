import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
    title: 'Sigae - Home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'Sigae - Login',
  },
  {
    path: 'peoples',
    loadComponent: () =>
      import('./features/peoples/peoples.component').then(
        (m) => m.PeoplesComponent
      ),
    canActivate: [authGuard],
    title: 'Sigae - Pessoas',
    children: [
      {
        path: 'add',
        loadComponent: () =>
          import('./features/peoples/add-people/add-people.component').then(
            (m) => m.AddPeopleComponent
          ),
        title: 'Sigae - Adicionar pessoa',
      },
      {
        path: 'add/:id',
        loadComponent: () =>
          import('./features/peoples/add-people/add-people.component').then(
            (m) => m.AddPeopleComponent
          ),
        title: 'Sigae - Editar pessoa',
      },
    ],
  },
  {
    path: 'agenda',
    loadComponent: () =>
      import('./features/agenda/agenda.component').then(
        (m) => m.AgendaComponent
      ),
    title: 'Sigae - Agenda',
  },
  {
    path: 'action-plan',
    loadComponent: () =>
      import('./features/action-plan/action-plan.component').then(
        (m) => m.ActionPlanComponent
      ),
    title: 'Sigae - Plano de ação',
  },
];
