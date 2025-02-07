import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { ApiLoadingService } from './loading.serivce';

@Injectable()
export class ApiLoaderInterceptor implements HttpInterceptor {

  constructor(private loadingService: ApiLoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoader();  // Show loading on request start

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.hideLoader();  // Hide loading when request finishes (success or error)
      })
    );
  }
}
