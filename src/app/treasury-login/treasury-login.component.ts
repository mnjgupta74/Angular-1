import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from '../utils/Helper';
import { LoaderService } from '../services/loaderservice';
import { ApiMethods } from '../utils/ApiMethods';
import { ApiService } from '../utils/utility.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-treasury-login',
  templateUrl: './treasury-login.component.html',
  styleUrls: ['./treasury-login.component.scss']
})
export class TreasuryLoginComponent implements OnInit {
  userinfo: any = '';
  rajkoshIdArray: any = [];



  constructor(private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private Tcode: Helper, private router: Router, private matSnackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.treasuryLogin();

    let IsActiveHeader = 1;
    localStorage.setItem('IsActiveHeader', IsActiveHeader.toString());
    // this.dialog.open(LoginComponent, { disableClose: true });

  }






  treasuryLogin() {
    console.log("dfdddddddddd___0", this.ApiMethods.getUserInfo());
    this.userinfo = this.ApiMethods.getUserInfo()!
    if (this.userinfo) {
      this.loader.setLoading(true);
      console.log("dataset__", this.ApiMethods.getUserInfo());
      var Json_Body = {
        "assignMentId": this.userinfo.aid,
        "userId": this.userinfo.userId,
      }

      // var Json_Body = {
      //   "assignMentId": 581,
      //   "userId": 108,
      // }
      
      // this.dialog.open(LoginComponent)
      console.log("before_body__", Json_Body);
      this.ApiMethods.postInitial(this.ApiService.LoginVerify, Json_Body).subscribe((resp: any) => {

        console.log("loginapi__Res", resp.result);
        this.rajkoshIdArray = resp.result;

        // sessionStorage.setItem('rajkoshId', this.rajkoshIdArray.rajkoshId);

        let response = resp.result
        console.log("responsecheck__",response)

        // console.log("response",response);
        if (resp.result.rajkoshId > 0) {
          sessionStorage.setItem('rajkoshId', response.rajkoshId);
          console.log("first_ifme_aaya", response.rajkoshId);

          this.loader.setLoading(false);
          if (response.status == 1) {
            let IsActiveHeader = 1;
            console.log("rajkosh_aa_rhi_h", response.rajkoshId);

            localStorage.setItem('IsActiveHeader', IsActiveHeader.toString());
            localStorage.setItem('JwtToken', response.token)
            this.dialog.closeAll();
            this.router.navigate(['Dashboard']);
            this.Tcode.UserId = response.rajkoshId

            //this.matSnackBar.error('Successfully Login', 'Success!');  
            //this.matSnackBar.open('Successfully Login', 'Success!');

            //localStorage.setItem('IsActiveMenu',response.status);

          }
          else if (response.status == 0) {
            let IsActiveHeader = 0;
            localStorage.setItem('IsActiveHeader', IsActiveHeader.toString());
            this.router.navigate(['Logins']);
            //this.toastrService.error('Something Went Wrong! Please Try Login Again', 'Alert!');

            //localStorage.setItem('IsActiveMenu', response.status);

          }
        }
        else {
          this.loader.setLoading(false);
          this.router.navigate(['Logins']);

        }
      },
        (res: any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.matSnackBar.open('Something Went Wrong! Please Try Again', 'Alert!');
          }
        })
    }

  }

}
