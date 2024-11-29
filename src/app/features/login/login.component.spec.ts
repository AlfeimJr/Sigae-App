import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../../core/services/login/auth.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'register',
      'resetPassword',
      'generateCaptcha',
      'generateAuthCode',
      'verifyCode',
    ]);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    authServiceSpy.generateCaptcha.and.returnValue(
      of({ captcha: 'mockCaptcha123' })
    );
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('should call AuthService.login and generate an auth code on success', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const captcha = 'captcha123';
      const captchaResposta = 'captcha123';

      authServiceSpy.login.and.returnValue(
        of({
          message: 'Login realizado com sucesso.',
          token: 'fake-jwt-token',
        })
      );
      authServiceSpy.generateAuthCode.and.returnValue(
        of({ message: 'Código de autenticação enviado.' })
      );

      component.authFormGroup.patchValue({
        email,
        password,
        captchaResposta,
      });
      component.captcha = captcha;

      component.login();

      expect(authServiceSpy.login).toHaveBeenCalledWith(
        email,
        password,
        captcha,
        captchaResposta
      );

      expect(authServiceSpy.generateAuthCode).toHaveBeenCalledWith(email);

      expect(component.isMultifactor).toBeTrue();
    });

    it('should show error message on login failure', () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const captcha = 'captcha123';
      const captchaResposta = 'captchaResposta123';
      const mockError = {
        status: 400,
        error: { message: 'CAPTCHA inválido.' },
      };

      authServiceSpy.login.and.returnValue(throwError(() => mockError));
      component.authFormGroup.patchValue({
        email,
        password,
        captchaResposta,
      });
      component.captcha = captcha;

      component.login();

      expect(authServiceSpy.login).toHaveBeenCalledWith(
        email,
        password,
        captcha,
        captchaResposta
      );
    });
  });

  describe('generateAuthCode', () => {
    it('should call AuthService.generateAuthCode and show a success message', () => {
      const email = 'test@example.com';
      authServiceSpy.generateAuthCode.and.returnValue(
        of({ message: 'Código de autenticação enviado.' })
      );

      component.emailControl.setValue(email);

      component.generateAuthCode();

      expect(authServiceSpy.generateAuthCode).toHaveBeenCalledWith(email);

      expect(component.isMultifactor).toBeTrue();
    });

    it('should show an error message on failure', () => {
      const email = 'test@example.com';
      const mockError = {
        status: 404,
        error: { message: 'Usuário não encontrado.' },
      };

      authServiceSpy.generateAuthCode.and.returnValue(
        throwError(() => mockError)
      );
      component.emailControl.setValue(email);

      component.generateAuthCode();

      expect(authServiceSpy.generateAuthCode).toHaveBeenCalledWith(email);
    });
  });

  describe('verifyCode', () => {
    it('should call AuthService.verifyCode and show a success message', () => {
      const email = 'test@example.com';
      const code = '123456';
      authServiceSpy.verifyCode.and.returnValue(
        of({ message: 'Código válido', token: 'fake-jwt-token' })
      );

      component.authFormGroup.addControl('authControl', new FormControl(code));
      component.emailControl.setValue(email);

      component.verifyCode();

      expect(authServiceSpy.verifyCode).toHaveBeenCalledWith(email, code);

      expect(component.isMultifactor).toBeFalse();
    });

    it('should show an error message on failure', () => {
      const email = 'test@example.com';
      const code = 'wrongcode';
      const mockError = {
        status: 401,
        error: { message: 'Código inválido.' },
      };

      authServiceSpy.verifyCode.and.returnValue(throwError(() => mockError));
      component.authFormGroup.addControl('authControl', new FormControl(code));
      component.emailControl.setValue(email);

      component.verifyCode();

      expect(authServiceSpy.verifyCode).toHaveBeenCalledWith(email, code);
    });
  });

  describe('forgotMyPassword', () => {
    it('should call AuthService.resetPassword and show the new password on success', () => {
      const email = 'test@example.com';
      const mockResponse = {
        message: 'Senha redefinida com sucesso.',
        novaSenha: 'novaSenha123',
      };

      authServiceSpy.resetPassword.and.returnValue(of(mockResponse));
      component.emailControl.setValue(email);

      component.forgotMyPassword();

      expect(authServiceSpy.resetPassword).toHaveBeenCalledWith(email);
    });
  });
});
