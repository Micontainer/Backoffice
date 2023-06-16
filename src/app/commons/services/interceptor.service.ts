import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { isProtectedRoute } from "../functions/routes.function";
import { IdentityService } from "./identity.service";


@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    private identityService: IdentityService,
    private router: Router,
  ) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = httpRequest.clone();

    if (isProtectedRoute(httpRequest.url)) {
      const token = this.identityService.getToken();
      console.log({token});

      if (!token) {
        this.router.navigate(['/']);
        this.identityService.removeUserSession();
        return this.errorHandler(new HttpErrorResponse({ error: { message: 'SESSION_REQUIRED' }}));
      }

      request = httpRequest.clone({
        headers: httpRequest.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.errorHandler(error)));
  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    switch (true) {
      case (error.status === 401):
        error.error.message = 'Error de autenticación.';
        // maybe here we can navigate to login
        break;
      case (error.status === 403):
        error.error.message = `{{alert}} No tienes suficientes privilegios para acceder a este recurso. falta el permiso: ${error.error.resource || ''}`;
        break;
      case (error.status === 500):
        error.error.message = 'Ocurrió un error inesperado.';
        break;
    }
    return throwError(() => error);
  }
}
