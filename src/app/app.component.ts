import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';
import { AuthService } from './core/services/login/auth.service';
import { LoginComponent } from './features/login/login.component';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, TopBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ViceriTest';
  showTopBar: boolean = true;
  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  constructor(private router: Router, public authService: AuthService) {
    this.router.events.subscribe(() => {
      this.showTopBar = !this.router.url.includes('login');
    });
  }

  get token() {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
