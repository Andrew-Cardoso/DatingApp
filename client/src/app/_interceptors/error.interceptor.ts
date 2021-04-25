import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((e: HttpErrorResponse) => {
      if (e) {        
        switch (e.status) {
          case 400:
            const errors = e.error.errors;
            if (errors) {
              const modalStateErrors = [];
              for (const key in errors) errors[key] && modalStateErrors.push(errors[key]);
              throw modalStateErrors.flat();
            } else if (typeof e.error === 'object') {
              this.toastr.error(e.statusText, `${e.status}`);
            } else {
              this.toastr.error(e.error, `${e.status}`);
            }
            break;
          case 401:
            console.log(e);
            this.toastr.error(e.error ?? 'Unauthorized', `${e.status}`);
            break;
          case 404: 
          console.log(e);
            this.router.navigateByUrl('/not-found');
            break;
          case 500:
            console.log(e);
            const navExtras: NavigationExtras = {state: {error: e.error}};
            this.router.navigateByUrl('/server-error', navExtras);
            break;
          default:
            this.toastr.error('Something unexpected went wrong', '???');
            console.log(e);
            break;
        }
      }
      return throwError(e);
    }));
  }
}
