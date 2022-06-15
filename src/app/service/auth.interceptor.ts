import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  TOKEN_VALUE = ''; //token value to be appended

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers.set('Authorization', `Bearer ${this.TOKEN_VALUE}`);
    console.log('head', headers)
    const requestClone = req.clone({ headers });
    return next.handle(requestClone);
  }
}
