import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {

  requestCount = 0;
  constructor(public loaderService: LoaderService) { }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<| HttpEvent<any>> {

    this.loaderService.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );

  }
}
