import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpsInterceptor implements HttpInterceptor {
     public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
          if (request.url.includes('svg') || request.url.includes('i18n')) {
               return next.handle(request);
          }
          if (request.url.includes('json')) {
               const mockApi: HttpRequest<unknown> = request.clone({
                    url: `${environment.mockApi}/${request.url}`,
               });
               return next.handle(mockApi);
          }
          const httpsRequest: HttpRequest<unknown> = request.clone({
               url: `${environment.api}/${request.url}`,
          });
          return next.handle(httpsRequest);
     }
}
