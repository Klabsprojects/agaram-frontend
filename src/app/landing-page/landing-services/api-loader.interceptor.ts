import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { ApiLoadingService } from './loading.serivce';

@Injectable()
export class ApiLoaderInterceptor implements HttpInterceptor {

  constructor(private loadingService: ApiLoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;
    const shouldSkipLoader = url.includes('getEmployeeProfile') && !url.includes('?');

    if (!shouldSkipLoader) {
      this.loadingService.showLoader(); // Show loading only if conditions are not met
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (!shouldSkipLoader) {
          this.loadingService.hideLoader(); // Hide loading only if it was shown
        }
      })
    );
  }
}
