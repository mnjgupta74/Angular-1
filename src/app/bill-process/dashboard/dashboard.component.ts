import { Component, OnInit } from '@angular/core';
import { Helper } from 'src/app/utils/Helper';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { ContextPathService } from 'src/app/services/context-path.service';
// import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userinfo: any = ''
  flagside: boolean = false;
  IsActiveMenu = 1;
  IsActiveHeader = 1;



  constructor(private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private Tcode: Helper, private router: Router, private contextPathService: ContextPathService) {

    this.contextPathService.config = {
      IsLogin: true
    }
    console.log("rajokish__iidddd_", sessionStorage.getItem('rajkoshId')
    );

  }

  ngOnInit(): void {
  

    this.ifmsLogin();

    if (this.Tcode.UserId == "0") {
      // alert("hill");
      this.router.navigate(['login']);

    } else {

    }


  }


  ifmsLogin() {

    console.log("dfdddddddddd___0", this.ApiMethods.getUserInfo());
    this.userinfo = this.ApiMethods.getUserInfo()!
    if (this.userinfo) {
      this.loader.setLoading(true);
      console.log("dataset__", this.ApiMethods.getUserInfo());
      var Json_Body = {
        "assignMentId": this.userinfo.aid,
        "userId": this.userinfo.userId,
      }
      localStorage.setItem('tCode', this.userinfo.treasCode);

      // var Json_Body = {
      //   "assignMentId": 581,
      //   "userId": 108,
      // }
      console.log("before_body__", Json_Body);


      this.ApiMethods.postresultservice(this.ApiService.LoginVerify, Json_Body).subscribe((resp:any) => {

        console.log("loginapi__Res", resp.result);
        let response = resp.result

        // console.log("response",response);
        if (Object.keys(response).length > 0) {
          this.loader.setLoading(false);
          if (response.status == 1) {
            // this.router.navigate(['Home']);
            // this.toastrService.error('Successfully Login', 'Success!');  

            // this.Tcode.Treasury_Code = response.tCode
            var IsActiveMenu = 0;
            localStorage.setItem('IsActiveMenu', IsActiveMenu.toString());
          }
          else if (response.status == 0) {
            //this.router.navigate(['Login']);
            //this.toastrService.error('Something Went Wrong! Please Try Login Again', 'Alert!');

            //localStorage.setItem('IsActiveMenu', response.status);
            var IsActiveMenu = 1;
            localStorage.setItem('IsActiveMenu', IsActiveMenu.toString());
          }
        }
        else {
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
          }
        })
    }

  }


}
