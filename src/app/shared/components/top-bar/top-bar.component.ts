import { Component, Inject, Signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/login/auth.service';
@Component({
  selector: 'sigae-top-bar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, SplitButtonModule, InputTextModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  menuOptions: MenuItem[] = [
    {
      label: 'Pessoas',
      icon: 'pi pi-user',
      routerLink: '/peoples',
    },
    {
      label: 'Agenda',
      icon: 'pi pi-calendar',
      routerLink: '/agenda',
    },
    {
      label: 'Plano de Ação',
      icon: 'pi pi-copy',
      routerLink: '/action-plan',
    },
  ];

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
