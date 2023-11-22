import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loaderservice';
import { Helper } from '../utils/Helper';
import { ApiService } from 'src/app/utils/utility.service'
import { Router } from '@angular/router';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ilogin } from '../utils/Master';
import { ContextPathService } from '../services/context-path.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/utils/snackbar.service';
// import * as shajs from 'sha.js';
const shajs = require('sha.js');




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginSave: Ilogin = {
    username: '',
    ipAddress: '',
    password: '',
  };

  loginForm: any;
  userinfo: any;
  finalPassword: any;
  random: any;
  IP:any;

  constructor(private ApiMethods: ApiMethods, public loader: LoaderService, private snackbar: SnackbarService, private ApiService: ApiService, private Tcode: Helper, private router: Router, private contextPathService: ContextPathService, private dialog: MatDialog) {
    // this.ApiMethods.getUserInfo().subscribe(resp => {})
    // console.log("dfdddddddddd___0",this.ApiMethods.getUserInfo());

    this.contextPathService.config = {
      IsLogin: false
    }
    this.IP= this.ApiMethods.clientIP;
  }
  ngOnInit() {
    let IsActiveHeader = 0;
    sessionStorage.setItem('IsActiveHeader', IsActiveHeader.toString());
    this.loginForm = new FormGroup({
      // userid: new FormControl({ value: '', disabled: false }, [Val.Required, Val.minLength(1), Val.maxLength(20)]),
      // password: new FormControl({ value: '', disabled: false }, [Val.Required, Val.minLength(1), Val.maxLength(20)]),
      username: new FormControl({ value: '', disabled: false }, [Validators.minLength(1), Validators.maxLength(20)]),
      password: new FormControl({ value: '', disabled: false }, [Validators.minLength(1), Validators.maxLength(100)]),
    });

  }
  onsubmit() {

    this.LoginSave.username = this.loginForm.controls['username'].value;
    //this.LoginSave.password = this.loginForm.controls['password'].value;
    this.LoginSave.password =this.finalPassword
    this.userinfo = this.ApiMethods.getUserInfo()!

    // console.log("APicall_data_befor",this.LoginSave);

    var Json_Body = {
      "assignMentId": this.userinfo.aid,
      "userId": this.userinfo.userId,
      "ipAddress": this.IP,
      "password": this.finalPassword,
      "randomNo":this.random,
      "ssoId": this.userinfo.ssoId,
      "userName": this.LoginSave.username,
      "treasuryCode": this.userinfo.treasCode,
    }

    //"randomNo":"213321"
    console.log("before_body__", Json_Body);

   // let url= this.ApiMethods.postresultservice(this.ApiService.SsoLogin);
    console.log("before_body__", this.ApiService.SsoLogin);

    this.ApiMethods.postInitial(this.ApiService.SsoLogin, Json_Body).subscribe((resp:any) => {
      console.log("Login_verify___", resp);
      var response = resp.result;

      // sessionStorage.setItem('rajkoshId', response.rajkoshId);
      console.log("response received", response);

      //sessionStorage.setItem('treasCode',this.userinfo.treasCode,);

      //localStorage.setItem('tCode',this.userinfo.treasCode);      
      if (response.rajkoshId > 0) {
        this.dialog.closeAll();
        localStorage.setItem('JwtToken', response.token)
        let IsActiveHeader = 1;
        this.router.navigate(['Dashboard']);
        //sessionStorage.setItem('IsActiveHeader',IsActiveHeader.toString());  
        sessionStorage.setItem('rajkoshId', resp.result.rajkoshId);
        this.Tcode.UserId = resp.result.rajkoshId

              // }
      }
      else {
        this.router.navigate(['']);
        sessionStorage.removeItem('rajkoshId')
        this.snackbar.show('User Name or Password incorrect? please try again', 'danger')
        console.log("rajokish__login___", sessionStorage.getItem('rajkoshId'))
        // sessionStorage.setItem('rajkoshId', null);

      }

    })

    //this.ApiMethods.postresultservice(this.ApiService.LoginVerify, Json_Body).subscribe(resp => {

    // Sso login api call
    // this.ApiMethods.postresultservice(this.ApiService.SsoLogin, this.LoginSave).subscribe(resp => {

    //   console.log("Login_verify___", resp.result);
    //   let response = resp.result

    //   if (Object.keys(response).length > 0) {
    //     this.toastrService.success('Successfully Login', 'Success!');
    //     this.loader.setLoading(false);

    //     this.LoginSave.username = ''
    //     this.LoginSave.password = ''
    //     // this.router.navigate(['OnlineBillList']);

    //   }
    //   else {
    //     this.loader.setLoading(false);
    //   }
    // },
    //   (res:any) => {
    //     console.log("errror message___", res.status);
    //     if (res.status != 200) {
    //       this.loader.setLoading(false);
    //       this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

    //     }
    //   })
  }


  encPassword(){
   
    // this.LoginSave.password = this.loginForm.controls['password'].value;
     this.random = this.getRandomInt(1, 9999999999);
   
     var randonNo=this.random
    
    console.log("radomNo :",randonNo)
     var rndSHA = (randonNo + shajs('sha256').update(this.loginForm.controls['password'].value).digest('hex'))
    
     this.finalPassword = shajs('sha256').update(rndSHA).digest('hex') 
 
     console.log("FinalPassword :",this.finalPassword );
     //this.loginForm.get('password').setValue('1234');
     this.loginForm.get('password').setValue(this.finalPassword);
     //this.loginForm.controls['password'].value=this.finalPassword
   }


   public  getRandomInt(min: any, max: any) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
