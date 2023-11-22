import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { ApiService } from './utility.service';


// For Offline :-------------------------------------------------------------->
//const JwtKey ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiIxMDdiNjM2Mi0wNWIwLTQ5NjUtOTlkZi01MzE0YjA2NmEyNDQiLCJleHAiOjE2ODI5MjU2ODYsImlhdCI6MTY4MjkyNDQ4Niwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IlJBV1RFS0FNTEVTSDEwIiwibGV2ZWxWYWx1ZUlkIjpudWxsLCJkaXNwbGF5TmFtZSI6IlNISVYgU0FIQVkgTUVFTkEgICIsInJvbGVJZCI6IjgyIiwibGV2ZWxJZCI6IjEiLCJyb2xlTmFtZSI6IlRPIiwiZW1wbG95ZWVJZCI6bnVsbCwibGV2ZWxOYW1lIjoiT0ZGSUNFIiwibGV2ZWxWYWx1ZUNvZGUiOiIxMTExIiwidXNlcklkIjoiNTk4NjgiLCJhaWQiOiI1ODM1MyIsInRyZWFzQ29kZSI6IjE5MDAiLCJncm91cHMiOltdfQ.PLRFRpkRhS63jX01RrFL0KFifhGWWno-PRK36c_CiPcnA0fJC7UqbJ27PkOK3jV6oGnM2DnoaI9pgJ2DLg9-Ih0hRsct1delNmDkfzujsUGozIgqdAUKdxsizOABP33NLKufLU5wL4kiSWYZEmLVkpoNS9V1t1BxIR89ARE3ZNsWwdffu9qG55cQxg2Fete2J03lPfVNZXN9BSCfLazPm0K3w09_Qq3LSA7Emm66gQOfvS8zPiuX-pd4HGzxSV22zgXciA6nwDw5Je068EVF9b1QStULuLMM2b7zRRlT4HAS_Z3s7F-7Qg72qhqhTBRLbfgGYERNWLmr3REAH4NpdA'


// For Online :-------------------------------------------------------------->
const JwtKey = sessionStorage.getItem("MpJwtToken");

console.log("JwtKey===>>>", JwtKey);
const MINUTES_UNITL_AUTO_LOGOUT = 10 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root'
})
export class ApiMethods {

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY) || '{}');
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  clientIP: any
  ngOnInit(): void {
  }

  hash: any;
  rajkoshId: any
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // public auth_token: BehaviorSubject<string> = new BehaviorSubject<string>(sessionStorage.getItem('token'));
  public TreName: BehaviorSubject<string> = new BehaviorSubject<string>(sessionStorage.getItem('loc') || '{}');
  public ippAddress: any;
  // public token
  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog, private ApiService: ApiService) {
    // sessionStorage.getItem('MpJwtToken');
    this.check();
    this.initListener();
    this.initInterval();
    this.GEtIP()
    localStorage.setItem(STORE_KEY, Date.now().toString());
  }

  ///*** auto logout code ***/// 
  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }
  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 100;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout) {
      // this.logout();
      const RajkoshId_chk = sessionStorage.getItem('rajkoshId');
      console.log("rajkosh_hai_kya__", RajkoshId_chk);

      if (!RajkoshId_chk) {
        this.logout();
      }
    }


  }
  ///*** Service call for login ***///   
  //  postresultservice(data: any)
  //  {

  //    //return this.http.post(this.loginurl,data,this.httpOptions).pipe(catchError(this.handleError));//('postresultservice',data)
  //    return this.http.post(this.loginurl,data,this.httpOptions).
  //    pipe(
  //        map((data:any)=>{

  //          return data}),
  //        catchError(this.handleError));//('postresultservice',data)
  //  }

  // header = new HttpHeaders().set(
  //   "Authorization",
  //   'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI3MTAiLCJVc2VySWQiOiI3MTAiLCJleHAiOjE2NjUzODQ1NjgsIlVzZXJUeXBlIjoiMTAiLCJpYXQiOjE2NjUzODM2Njh9.CDlHZI2UpFUocny9zCyx6Wwe-bjxqaXwe-hDAPTBgjmriihVu54cHL6wAS7t_09pD5LeHP-a0eCyfQZqlmB6-Q'
  // );
  postInitial(url: any, data: any) {
  
    return this.http.post(url, data).
      pipe(
        map((data: any) => {
          return data
        }))
  }

  postIpv4_api(url: any, data: any) {
    var JwtToken_loc: any = localStorage.getItem('JwtToken')
    let Options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        , 'Authorization': 'Bearer ' + JwtToken_loc
      }),
    };
    return this.http.post(url, data,Options).
      subscribe(
        (data: any) => {
          console.log("apiiiiii___", data);

          return data
        })
  }




  getInitial(url: any) {
    // let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NlcnZlci5leGFtcGxlLmNvbSIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiI3OTA4YzQ1Zi01MzVjLTRiMDItYjdmNC04NTU5ZTY0YjQ0NGMiLCJleHAiOjE2ODQxNTI4ODksImlhdCI6MTY4NDE0OTg4OSwic3ViIjoiSmVzc2llIiwidXBuIjoiSmVzc2llIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSmVzc2llIiwiY3VzdG9tLXZhbHVlIjoiSmVzc2llIHNwZWNpZmljIHZhbHVlIiwiZ3JvdXBzIjpbInVzZXIiLCJwcm90ZWN0ZWQiXX0.mVyYOyhmnB8hBvuXqo6JT73SJme2VXV2Ypyr43A8uc6vmMMR8keLuu00Vj_UKkmlUEAUt4HNeN5jg-KmBGC9etd46UiSdYb5xXBNJiHpgWhIyDJyj-eDcfnzTe_8cW98w2pO-lgJKc5tRXSi1miYf7nfSXKaV55IM_p3zbYyw9CHG3OYK73UsrgmP-L4F_8htTNxxeykZMGCilmDxXzRzysiZmg9u4QSbdZtOtp4TaMUygAv2D_ztdw3_1me6KQepfxkJQDIiIVFy6lxFEYLCkTlHugqMWIy7VTedGpGrxyVuewhvxNSSnx13Hv1wbymeMUV0NEkeXVuDrhef6qyKA';
    var JwtToken_loc: any = localStorage.getItem('JwtToken')
    let Options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        , 'Authorization': 'Bearer ' + JwtToken_loc
      }),
    };

    console.log("get_intiila__calkllll");
    return this.http.get(url, Options).
      pipe(
        map((data: any) => {
          console.log("_____asdfasdf__", data.headers);
          return data
        }))
  }

  postresultservice(url: any, data: any) {
  
    // let token = localStorage.getItem('token');
    // data ='test';


    //     var key = CryptoJS.enc.Utf8.parse('11223344556677889911223344556677');
    //   var iv = CryptoJS.enc.Utf8.parse('');
    //   var encryptedData   = CryptoJS.AES.encrypt( CryptoJS.enc.Utf8.parse(JSON.stringify(data)), key,
    //   {
    //       keySize: 256 / 8,
    //       iv: iv,
    //       mode: CryptoJS.mode.CBC,
    //       padding: CryptoJS.pad.Pkcs7
    //   }).toString();
    // console.log("ENCValue",encryptedData )

    //   var decrypteData = CryptoJS.AES.decrypt(encryptedData, key,
    //     {
    //         keySize: 256 / 8,
    //         iv: iv,
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.Pkcs7
    //     }).toString(CryptoJS.enc.Utf8);
    //     if (decrypteData.toString())
    //         // JSON.stringify(decrypteData.toString())
    //         console.log("DECValue",decrypteData)


    // return this.http.post(this.loginurl,data,this.httpOptions).pipe(catchError(this.handleError));//('postresultservice',data)
    //return this.http.post(url,data,Options).pipe();//('postresultservice',data)





    console.log("user_haiasdfas_gfhdhdfdfhhdf_");
    var RajkoshId_sess: any = sessionStorage.getItem("rajkoshId");
    console.log("user_hai__getapi", RajkoshId_sess);
    console.log("url__datatttttt", url);


    var returnval: any = { "result": [], "message": "Success" }
    var JwtToken_loc: any = localStorage.getItem('JwtToken')
    let Options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        , 'Authorization': 'Bearer ' + JwtToken_loc
      }),
    };
    var jwt_session_info: any = jwt_decode(JwtToken_loc)
    console.log("user_haiasdfas__", RajkoshId_sess);
    console.log("user_hai__rjllllll__", url);
    if (RajkoshId_sess == jwt_session_info.rajkoshId) {
      // if (RajkoshId_sess == 1115) {
      // this.dialog.closeAll()
      console.log("post_method__log", url);
      return this.http.post(url, data,Options).
        pipe(
          map((data: any) => {
            return data
          }))
    }
    else {
      var JwtToken_loc: any = localStorage.getItem('JwtToken')
      var jwt_session_info: any = jwt_decode(JwtToken_loc)
      console.log("user_haiasdfas__", RajkoshId_sess);
      console.log("user_hai__rjllllll__", url);
      //console.log("jwt_tekn___", apiurl);
      if (RajkoshId_sess == jwt_session_info.rajkoshId) {
        // if (RajkoshId_sess == 1115) {
        // this.dialog.closeAll()
        console.log("post_method__log", url);
        return this.http.post(url, data,Options).
          pipe(
            map((data: any) => {
              return data
            }))
      }
      else {
        console.log("postmehod__else");
        this.router.navigate(['Logins']);
        return returnval
      }
    }
  }

  getservice(url: any) {


    var RajkoshId_sess: any = sessionStorage.getItem("rajkoshId");

    console.log("user_hai__getapi", RajkoshId_sess);
    console.log("url__datatttttt", url);
    var jwt_session_info: any
    var rajkosh_sess: any

    var JwtToken_loc: any = localStorage.getItem('JwtToken')
    let Options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        , 'Authorization': 'Bearer ' + JwtToken_loc
      }),
    };
    console.log("locjwt", JwtToken_loc);
    if (JwtToken_loc) {
      jwt_session_info = jwt_decode(JwtToken_loc)
      console.log("jwt_", jwt_session_info);
      rajkosh_sess = jwt_session_info.rajkoshId
    }
    var returnval: any = { "result": [], "message": "Success" }
    if (RajkoshId_sess == rajkosh_sess) {
      //if (RajkoshId_sess == 1115) {
      console.log("post_method__log", url);
      return this.http.get(url,Options).
        pipe(
          map((data: any) => {
            return data
          }))
    }
    else {

      console.log("getmehod__else");
      this.router.navigate(['Logins']);
      return of(returnval)
    }
  }

  ipaddress() {
    // this.http.get("https://jsonip.com").subscribe((res: any) => {
    //   this.ippAddress = res.ip;
    //   console.log('res.ip', this.ippAddress);
    // });
  }

  ///*** logout call ***///   
  logout(): void {
    this.loggedIn.next(false);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loc');
    sessionStorage.removeItem('rajkoshId');
    this.router.navigate(['']);
  }

  ///*** Error Handel ***///   
  // private handleError(error: HttpErrorResponse) {
  //   console.log("eroroomessage__", error);
  //   var result = error.error.result.ErrorCode

  //   let errormessage = ''
  //   if (result === 0) {
  //     // A client-side or network error occurred  . Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //     return throwError(() => new Error('Sorry some technical issuse , please try again !'))
  //   }
  //   else if (result === 1) {
  //     errormessage += 'User not found !'
  //     return throwError(() => new Error(errormessage));
  //   }
  //   else if (result === 2) {
  //     errormessage += 'Login attempt more than 5 !'
  //     return throwError(() => new Error(errormessage));
  //   }
  //   else if (result === 3) {
  //     errormessage += 'Password not match !'
  //     return throwError(() => new Error(errormessage));
  //   }
  //   else if (result == -1) {
  //     // errormessage += JSON.stringify(error.error.message);
  //     return throwError(() => new Error(result));
  //   }
  //   else if (result == -2) {
  //     // errormessage += JSON.stringify(error.error.message);
  //     return throwError(() => new Error(result));
  //   }
  //   else {
  //     errormessage += 'Sorry some technical issuse , please try again !'
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     //console.error(`Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(() => new Error(errormessage));

  // }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  // get username() {
  //   return this.user.asObservable();
  // }
  get LocName() {
    return this.TreName.asObservable();
  }

  getUserInfo() {
    // const token = sessionStorage.getItem('MpJwtToken');
    console.log("toek____", JwtKey);

    if (JwtKey !== null) {
      console.log("hiid")
      const user = jwt_decode(JwtKey);
      console.log("user__", user)
      return user
    }
    else {
      window.location.reload();
      alert('Please Login in Proper way');
      return false;
    }
  }

  getrajkoshIdInfo() {
    let rajkoshIddata = sessionStorage.getItem('rajkoshId');
    console.log("getrajkosh__id___", rajkoshIddata);

    if (rajkoshIddata != undefined && rajkoshIddata != null) {
      return this.rajkoshId = parseInt(rajkoshIddata);
    }

    else {
      this.router.navigate(['Logins']);
      return rajkoshIddata;
    }


  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }


  GEtIP() {
    return this.http.post(this.ApiService.getIp, {}, { responseType: 'json' })
      .subscribe((resp: any) => {
        console.log("key__", resp);
        this.clientIP = resp.ipAddress
      })
  }
}

