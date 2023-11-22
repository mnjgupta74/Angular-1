import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Observable, Subject } from 'rxjs';

// const httpOptions = environment.httpOptions;


interface FileAttachement {
  file: string;
  employeeId:3385530;
  docTypeId:15;
}

@Injectable({
  providedIn: 'root'
})
export class PensionServiceService {
  BaseUrl: any;
  userActivated = new Subject;
  userActivated1 = new Subject;
  stringSubject = new Subject;
  loanAdvance = new Subject;
  headers = new HttpHeaders();

  constructor(private http: HttpClient, private _errService:ErrorService) { }
  // baseUrl8080 = environment.baseUrl8080
  // baseUrl8081 = environment.baseUrl8081;
  // baseUrl9010 = environment.baseUrl9010;
  // baseUrl8082 = environment.baseUrl8082;
  // baseUrlToken8085 = environment.baseUrlToken8085;
  // baseUrlToken = environment.baseUrlToken;
  // baseUrlLoan = environment.baseUrlLoan;
  // baseUrlAdd = environment.baseUrlAdd;
  // baseUrl8080pension = environment.baseUrl8080pension;



  httpOptions= {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'token':localStorage.getItem('token')!
    })
  }


 baseUrl8080 = "http://172.22.32.49:8080/pension/"
 baseUrl8080pension = "http://172.22.32.177:8080/pension/v1.0/"
 baseUrl8081 = "http://172.22.32.177:8081/employee/mst/v1.0/";
 baseUrl9010 = "http://172.22.32.26:9010/employee/mst/v1.0/";
 baseUrl8082="http://172.22.32.26:8082/pension/wf/v1.0/";
 baseUrlToken8085="http://172.22.32.26:8085/mp/";
 baseUrlToken="http://172.22.32.48:8082/";
 baseUrlLoan = "http://172.22.32.48:8080/loanDetails/";
 baseUrlAdd="http://172.22.32.26:8080/pension/";
 esignUrlNew="http://172.22.36.201:7070/esign/"
userRoleUrl="http://172.22.32.26:8082/pension/wf/v1.0/";
billUrl="http://172.22.32.177:8080/pension/v1.0/";
deduction="http://172.22.32.26:9011/pension/v1.0/";
hoapprover="http://172.22.32.26:8082/pension/wf/v1.0/";
baseUrl9010Pensioner="http://172.22.32.26:9010/employee/mst/v1.0/";


 // Local Url comment before deploy

//  baseUrl8080 = "http://ifmstest.rajasthan.gov.in/pension/"
//  baseUrl8080pension = "http://ifmstest.rajasthan.gov.in/pension/v1.0/"
//  baseUrl8081 = "http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/";
//  baseUrl9010 = "http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/";
//  baseUrl8082="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
//  baseUrlToken8085="http://ifmstest.rajasthan.gov.in/mp/";
//  baseUrlToken="http://ifmstest.rajasthan.gov.in/";
//  baseUrlLoan = "http://ifmstest.rajasthan.gov.in/loanDetails/";
//  baseUrlAdd="http://ifmstest.rajasthan.gov.in/pension/";
//  esignUrlNew="http://ifmstest.rajasthan.gov.in/esign/"
// userRoleUrl="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
// billUrl="http://ifmstest.rajasthan.gov.in/pension/v1.0/";
// deduction="http://ifmstest.rajasthan.gov.in/pension/v1.0/";
// hoapprover="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
// baseUrl9010Pensioner="http://ifmstest.rajasthan.gov.in/employee/mst/v1.0/";


createAuthorizationHeader(headers: HttpHeaders) {

  headers.append("Content-Type", "application/json");
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append("Content-Type", "json");
  headers.append("Accept", "application/json");
  headers.append("Accept", "text/xml");
  headers.append("Content-Type", "text/xml");
  headers.append("Content-Type", "application/xml");
  headers.append("Accept", "*/*");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Credentials", "true");
}

  userInfo():any  {
    return JSON.parse(localStorage.getItem('userInfo')!);
  }

  // post( ACTION: string,data: any)
  //  {
  //   ACTION = `${this.baseUrl8080}` + ACTION;
  //   return this.http.post<any>(ACTION, data).pipe(
  //     catchError(this._errService.handleError)
  //   )
  //  }
   postho(url: any,data: any)
   {
     this.createAuthorizationHeader(this.headers);
       this.headers = new HttpHeaders().append("contentType", "text/xml");
       //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
       return this.http.post(`${this.hoapprover}${url}`, data, {
         headers: this.headers
       });
   }
  post(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.userRoleUrl}${url}`, data, {
      headers: this.headers,
    });
  }
  postNewEsign(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.esignUrlNew}${url}`, data, {
      headers: this.headers,
      responseType: "text",
    });
  }
  postRequestpensiondr(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8080}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }
  postdetype(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8080pension}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }
  postdeduction(data: any, ACTION: string)
   {
    ACTION = `${this.deduction}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }
postSavebill(url: any,data: any)
{
  this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.billUrl}${url}`, data, {
      headers: this.headers
    });
}
  postRequestpension(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl9010}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }
  postUpcomingpension(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl9010Pensioner}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }

   requestApplication(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrl8082}` + ACTION;
     return this.http.post<any>(ACTION, data);
   }



   downloadPDF(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrl8081}` + ACTION;
     return this.http.post<any>(ACTION, data);
   }


  postRequest(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrlLoan}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }


   postRequestAddress(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrlAdd}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }
  postRequestPensionSave(data: any, ACTION: string)
   {
    ACTION = `${this.baseUrl8081}` + ACTION;
    return this.http.post<any>(ACTION, data).pipe(
      catchError(this._errService.handleError)
    )
   }


   Token(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrlToken}` + ACTION;
     return this.http.post<any>(ACTION, data);
   }

   getWorkFlowId(data:any,ACTION:string)
   {
     ACTION = `${this.baseUrlToken}` + ACTION;
     return this.http.post<any>(ACTION, data, this.httpOptions);
   }

   getWorkFlowToken(data:any,ACTION:string){
     ACTION = `${this.baseUrlToken8085}` + ACTION;
     return this.http.post<any>(ACTION, data, this.httpOptions);
   }

   getPensionerDetail(data:any,ACTION:string)
   {
     ACTION = `${this.deduction}` + ACTION;
     return this.http.post<any>(ACTION, data);
   }


   add_Reason(data:any,ACTION:string)
   {
     ACTION = `${this.deduction}` + ACTION;
     return this.http.post<any>(ACTION, data);
   }

   getStopReasonList(ACTION:string){
    ACTION = `${this.deduction}` + ACTION;
    return this.http.post<any>(ACTION, this.httpOptions);
  }
serviceRecord():any{
  return localStorage.getItem("addEditServiceRecordslist")
}
saveRecord(data:any){
return this.http.post('http://localhost:3000/service',data);
}
getCartList(){
  return this.http.get<any>("http://localhost:3000/service/").pipe(map((res:any)=>{
    return res;
  }))
}

updateCartList(id:any,data:any){
  return this.http.put<any>(`http://localhost:3000/service/${id}`,data).pipe(map((res:any)=>{
    return res;
  }))


}


saveDocument(data:File,employeeId:any,docTypeId:any){
const formData=new FormData();
formData.append("file",data);
formData.append("employeeId",employeeId);
formData.append("docTypeId",docTypeId);
  return this.http.post<any>(this.baseUrl9010+'uploadFileInWcc',formData);

  }

  getDocument(){
    return this.http.get<any>("http://localhost:3000/Document/").pipe(map((res:any)=>{
      return res;
    }))
  }



}
