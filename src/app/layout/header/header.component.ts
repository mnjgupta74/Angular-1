import { Component, OnInit } from '@angular/core';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Helper } from 'src/app/utils/Helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentDate = new Date();
  userinfo: any = {};
  deptName: any;
  treasuryName: any;
  financialYear: any;
  maskedStr: any;
  treasuryCode: any;
  displayName: any;
  ssoId: any;
  roleName: any;
  constructor(private ApiMethods: ApiMethods, private ApiService: ApiService, private helper: Helper,) { }
  ngOnInit(): void {
    this.userinfo = this.ApiMethods.getUserInfo();
    this.financialYear = this.helper.FinancialYear;
    this.getdepartment();
    //console.log("employeeId==>",this.userinfo.exp);
    //this.maskLeftChars(this.userinfo.employeeId,6);
    console.log("userinfo", this.userinfo);
    if (this.userinfo.employeeId != null && this.userinfo.employeeId != undefined) {
      this.maskLeftChars(this.userinfo.employeeId);
    }

    this.displayName = this.userinfo["displayName"];
    this.ssoId = this.userinfo["ssoId"];
    this.roleName = this.userinfo["roleName"];
    localStorage.setItem('tCode', this.userinfo.treasCode);
  }


  getdepartment() {
    //let treasuryCode=sessionStorage.getItem("treasCode");
    this.treasuryCode = this.userinfo.treasCode;
    console.log("treasuryCode", this.treasuryCode);
    this.ApiMethods.getInitial(this.ApiService.getdepartment + this.treasuryCode).subscribe((resp: any)  => {
      console.log("Getdepartment__res", resp);
      var response = resp.result
       if (resp.message=="Success") {   
      // if (response.length > 0) {
        // alert();     
        this.deptName = response.DeptName;
        this.treasuryName = response.TreasuryName;



      }


    })

  }



  maskLeftChars(str: string): string {
    const asterisks = '*'.repeat(str.length - 4); // Create a string of asterisks
    const maskedStr = asterisks + str.substring(str.length - 4); // Concatenate the asterisks with the remaining string
    //const maskedStr = str.substring(0, str.length - numChars) + asterisks; // Concatenate the remaining string with the asterisks
    //const maskedStr = asterisks+str.substring(0, str.length) ; // Concatenate the remaining string with the asterisks
    // console.log("asterisks",asterisks);
    this.maskedStr = maskedStr;
    return maskedStr;
  }

  logout(){
    if(confirm("Are you sure you want to log out?"))
    {
    sessionStorage.clear();
    localStorage.clear();  
    window.location.href=environment.SSO_BaseUrl;
}
  }







}
