import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }
  handleError(err:HttpErrorResponse) {
console.log(err)
let errMsg='';
if(err.statusText =="Not Found"){  
  errMsg='There is an error at backend. Kindly contact to admin.'
}else{
  if(err.statusText=="Unknown Error"){
    errMsg='There is an unknown error. Please try after some time.'
  }
}
return throwError(errMsg)
  }
}
