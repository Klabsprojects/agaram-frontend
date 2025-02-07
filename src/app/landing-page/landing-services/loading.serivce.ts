import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiLoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  private requestCount = 0;

  showLoader() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this._loading.next(true);  // Show loader on first request
    }
  }

  hideLoader() {
    this.requestCount--;
    if (this.requestCount === 0) {
      this._loading.next(false); // Hide loader when all requests complete
    }
  }
}
