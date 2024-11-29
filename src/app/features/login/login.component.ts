import { Component, Inject, inject, OnInit, Renderer2 } from '@angular/core';
import { InputTextFloatComponent } from '../../shared/components/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/login/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InputOtpModule } from 'primeng/inputotp';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextFloatComponent, ButtonModule, ToastModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService, BrowserAnimationsModule, InputOtpModule],
})
export class LoginComponent implements OnInit {
  authFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    captchaResposta: new FormControl('', Validators.required),
  });
  renderer: Renderer2 = inject(Renderer2);
  isRegister: boolean = false;
  messageService = inject(MessageService);
  authService = inject(AuthService);
  isForgotMyPassword: boolean = false;
  captcha: string = '';
  isMultifactor: boolean = false;
  token: string = '';
  router: Router = inject(Router);
  ngOnInit() {}

  login() {
    const { email, password, captchaResposta } = this.authFormGroup.value;

    if (this.authFormGroup.valid) {
      this.authService
        .login(email, password, this.captcha, captchaResposta)
        .subscribe({
          next: (res: { message: string; token: string }) => {
            this.generateAuthCode(res.token);
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.error.message,
            });
            this.generateCaptcha();
          },
        });
    }
  }

  generateAuthCode(token?: string) {
    this.authFormGroup.setControl(
      'authControl',
      new FormControl('', Validators.required)
    );
    this.authService.generateAuthCode(this.emailControl.value).subscribe({
      next: (res: { message: string }) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: res.message,
        });
        this.isMultifactor = true;
        this.token = token ?? '';
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.message,
        });
      },
    });
  }

  verifyCode() {
    this.authService
      .verifyCode(this.emailControl.value, this.codeControl.value)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Autenticação concluída.',
          });
          this.isMultifactor = false;
          localStorage.setItem('token', this.token);
          this.token = '';
          this.router.navigate(['']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.message,
          });
        },
      });
  }
  register() {
    this.authService
      .register(
        this.emailControl.value,
        this.passwordControl.value,
        this.captcha,
        this.captchaRespostaControl.value
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cadastro realizado.',
          });
          this.isRegister = false;
          this.generateCaptcha();
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error.message,
          });
          this.generateCaptcha();
        },
      });
  }

  forgotMyPassword() {
    this.authService.resetPassword(this.emailControl.value).subscribe({
      next: (res: { message: string; novaSenha: string }) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: `Sua nova senha: ${res.novaSenha}`,
        });
        this.isForgotMyPassword = false;
        this.isRegister = false;
        this.authFormGroup.get('password')?.setValue('');
        this.generateCaptcha();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao redefinir senha.',
        });
        this.isRegister = false;
        this.isForgotMyPassword = true;
        this.generateCaptcha();
      },
    });
  }

  generateCaptcha() {
    this.authService.generateCaptcha().subscribe({
      next: (res: { captcha: string }) => {
        this.captcha = res.captcha;
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao gerar captcha.',
        });
      },
    });
  }

  get emailControl() {
    return this.authFormGroup.get('email') as FormControl;
  }

  get captchaRespostaControl() {
    return this.authFormGroup.get('captchaResposta') as FormControl;
  }

  get passwordControl() {
    return this.authFormGroup.get('password') as FormControl;
  }

  get codeControl() {
    return this.authFormGroup.get('authControl') as FormControl;
  }
}
