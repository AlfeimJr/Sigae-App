import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../../../shared/types/user';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  const mockBaseUrl = 'http://localhost:3000';
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    senha: 'password123',
  };
  const mockResponse = {
    message: 'Login realizado com sucesso.',
    token: 'fake-jwt-token',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('login', () => {
    it('should make a POST request to login and return the user on success', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const captcha = 'captcha123';
      const captchaResposta = 'captchaResposta123';

      authService.login(email, password, captcha, captchaResposta).subscribe({
        next: (user) => {
          expect(user).toEqual({
            message: 'Login realizado com sucesso.',
            token: 'fake-jwt-token',
          });
        },
      });

      const req = httpTestingController.expectOne(`${mockBaseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email,
        senha: password,
        captcha,
        captchaResposta,
      });

      req.flush(mockResponse);
    });

    it('should handle an error response for login', () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const captcha = 'captcha123';
      const captchaResposta = 'captchaResposta123';
      const mockError = {
        error: {
          code: 'CREDENCIAIS_INVALIDAS',
          message: 'Credenciais inválidas',
        },
        status: 401,
        statusText: 'Unauthorized',
        message: 'Credenciais inválidas',
      };

      authService.login(email, password, captcha, captchaResposta).subscribe({
        next: () => fail('Expected an error, but got a user'),
        error: (error) => {
          expect(error.error).toEqual(mockError.error);
        },
      });

      const req = httpTestingController.expectOne(`${mockBaseUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockError.error, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should make a POST request to register and return the user on success', () => {
      const email = 'newuser@example.com';
      const password = 'newpassword';
      const captcha = 'captcha123';
      const captchaResposta = 'captchaResposta123';

      authService
        .register(email, password, captcha, captchaResposta)
        .subscribe((user) => {
          expect(user).toEqual(mockUser);
        });

      const req = httpTestingController.expectOne(`${mockBaseUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email,
        senha: password,
        captcha,
        captchaResposta,
      });

      req.flush(mockUser);
    });

    it('should handle an error response for register', () => {
      const email = 'existinguser@example.com';
      const password = 'password';
      const captcha = 'captcha123';
      const captchaResposta = 'captchaResposta123';
      const mockError = { message: 'E-mail já registrado' };

      authService
        .register(email, password, captcha, captchaResposta)
        .subscribe({
          next: () => fail('Expected an error, but got a user'),
          error: (error) => {
            expect(error.error).toEqual(mockError);
          },
        });

      const req = httpTestingController.expectOne(`${mockBaseUrl}/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockError, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('generateAuthCode', () => {
    it('should make a POST request to generate an authentication code', () => {
      const email = 'test@example.com';
      const mockResponse = { message: 'Código gerado com sucesso' };

      authService.generateAuthCode(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${mockBaseUrl}/generate-auth-code`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });

      req.flush(mockResponse); // Simula a resposta do backend
    });

    it('should handle an error response for generateAuthCode', () => {
      const email = 'nonexistent@example.com';
      const mockError = { message: 'Usuário não encontrado' };

      authService.generateAuthCode(email).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.error).toEqual(mockError);
        },
      });

      const req = httpTestingController.expectOne(
        `${mockBaseUrl}/generate-auth-code`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockError, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('verifyCode', () => {
    it('should make a POST request to verify the code and return a token', () => {
      const email = 'test@example.com';
      const code = '123456';
      const mockResponse = { message: 'Código válido', token: 'fake-jwt' };

      authService.verifyCode(email, code).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${mockBaseUrl}/verify-code`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, code });

      req.flush(mockResponse);
    });

    it('should handle an error response for verifyCode', () => {
      const email = 'test@example.com';
      const code = 'wrongcode';
      const mockError = { message: 'Código inválido' };

      authService.verifyCode(email, code).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.error).toEqual(mockError);
        },
      });

      const req = httpTestingController.expectOne(`${mockBaseUrl}/verify-code`);
      expect(req.request.method).toBe('POST');
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
