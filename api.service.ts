import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationMessageService } from '@core/notification/services/notification-message.service';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';

@Injectable()
export abstract class ApiService {
     constructor(
          protected http: HttpClient,
          protected notificationService: NotificationMessageService
     ) {}

     protected get<T>(url: string): Observable<T> {
          return this.http.get<T>(url).pipe(
               shareReplay(1),
               catchError((error: HttpErrorResponse) => {
                    this.notificationService.error('errorGetData');
                    return throwError(() => error);
               })
          );
     }

     protected post<T>(url: string, requestData: unknown): Observable<T> {
          return this.http.post<T>(url, requestData).pipe(
               shareReplay(1),
               catchError((error: HttpErrorResponse) => {
                    this.notificationService.error('errorGetData');
                    return throwError(() => error);
               })
          );
     }

     protected delete<T>(url: string): Observable<T> {
          return this.http.delete<T>(url).pipe(
               shareReplay(1),
               catchError((error: HttpErrorResponse) => {
                    this.notificationService.error('errorGetData');
                    return throwError(() => error);
               })
          );
     }
}
