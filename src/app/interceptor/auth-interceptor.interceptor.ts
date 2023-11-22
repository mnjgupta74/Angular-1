import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {

  }

   
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
   
    const authToken:any= sessionStorage.getItem('MpJwtToken'); 
     
         
    
        const modifiedReq = request.clone({
          
          //params: new HttpParams().set("auth", authToken)
        //  setHeaders: {Authorization: `Bearer ${authToken.replace(/^["'](.+(?=["']$))["']$/, '$1')}`} 
         setHeaders: { "auth": authToken }

        });
        //console.log("modified request", modifiedReq);
         //return next.handle(modifiedReq);    // For Online
            return next.handle(request);     // For Offline
  }
}

