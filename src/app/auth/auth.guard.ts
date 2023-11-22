import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PensionServiceService } from '../services/pension-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  empInfo:any;
  constructor(private _Service: PensionServiceService, private router: Router) {

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|any {

    
     this.empInfo= localStorage.getItem('userInfo');
     console.log(this.empInfo);


    if(this.empInfo.aid==''){
      return false;
    }else{
      return true;
    }

  }


      // this.router.navigate(['/Access-Denied']);


  }





  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   return this.empInfo.pipe(map((response) => {
  //   //  console.log("response",response);
  //    debugger

  //     if (response) {
  //       return true;
  //     }


  //     this.router.navigate(['/Access-Denied']);
  //     return false;
  //   }), catchError((error) => {
  //     this.router.navigate(['/Access-Denied']);
  //     console.log("error:",error)
  //     return of(false);


  //   }));

  // }
