import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PensionServiceService } from 'src/app/services/pension-service.service';
import { HttpClient } from '@angular/common/http';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { error } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  displayedColumns: string[] = ['Request ID','Initiator','Request Description','Created Date','Received From','Remarks','Action'];
  dataSource!: MatTableDataSource<any>;
  dr_Master!: FormGroup
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datalist: any = [];
  countDetail: any;
  inboxData: any = [];
  outboxData: any = [];
  draftData: any = [];
  showerror: boolean = false;
  pensionerbtn: boolean = false;
  pensionerBtn: boolean = false;
  error: string = '';
  empinfo: any;
  makerToken:any;
  isShow=true;
  wfProcessId:any;

  constructor(public dialog: MatDialog, private _Service: PensionServiceService, private formbuilder: FormBuilder
    , private _snackBar: MatSnackBar,private router:Router) {

  }
  ngOnInit(): void {
    localStorage.setItem("reqId",'')
    localStorage.setItem("transid",'')
    localStorage.setItem("taskRoleId",'')
    localStorage.setItem("wfProcessId",'')
    //MAker
       //  var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiIzOTU1YjIzMy1lODRlLTQzZjEtYjFjMi00YWM5MjZlY2QxOTEiLCJleHAiOjE2ODExOTMzOTUsImlhdCI6MTY4MTE5MjE5NSwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IktBTFlBLkFOVVJBRyIsImRpc3BsYXlOYW1lIjoiTUFOIE1PSEFOIE1FRU5BICAiLCJyb2xlSWQiOiI4MSIsImxldmVsSWQiOiIxIiwicm9sZU5hbWUiOiJTdGFmZiIsImVtcGxveWVlSWQiOiJSSkpQMjAyMjAwMDAwMDEyIiwibGV2ZWxOYW1lIjoiT0ZGSUNFIiwibGV2ZWxWYWx1ZUNvZGUiOm51bGwsInVzZXJJZCI6IjU5ODYzIiwiYWlkIjoiNTgyMzMiLCJncm91cHMiOltdfQ.Je5m5bfZkRwaR7PrNVv4Jqlwwr0SzEQLMnEKlBI9DUADwf6nlbyihKPoCoPMeH-HEFCkBA5qwE1hFlWDxfN7WwLggRLF-bfEDWNhb0YMrSKXM5LSkbqfqg6UEblBvegpT9cAk1PguFLCa-kQ05YFrL6cftvCwgp2Tc5XrmzQL0Tgio2NZtl2X9AaIS69a3w-IDEv6-33BIhS-z1Dl7smWQ-TUqLzRR7XyCCyTu_v6jSa4M1O3aZ0XsXqp25gW4yq78KCiaQsgqZXKj5nHUkMjU4h4UuzLWatETl7smxmjXBtjpkbkDJ3L20qX6cbB5eNwjWKHR40W8atqCD9GrdGBA"

    //Checker
   //token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiJjNjdmNzZkMi04MDRiLTQ2MjEtODJjOS04NDg2MDIzMzUzNGQiLCJleHAiOjE2ODEyMTY5MzgsImlhdCI6MTY4MTIxNTczOCwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IkFOSUwuRC5ZQURBViIsImRpc3BsYXlOYW1lIjoiUkFNRVNIIEtVTUFSIE1VTkRSQSIsInJvbGVJZCI6IjgxIiwibGV2ZWxJZCI6IjEiLCJyb2xlTmFtZSI6IlN0YWZmIiwiZW1wbG95ZWVJZCI6IlJKSlAyMDIyMDAwMDAwMDkiLCJsZXZlbE5hbWUiOiJPRkZJQ0UiLCJsZXZlbFZhbHVlQ29kZSI6bnVsbCwidXNlcklkIjoiNTk4NjQiLCJhaWQiOiI1ODIzNCIsImdyb3VwcyI6W119.czdXtInQGgJzhthmncqP_Xqa9y7NI1gerzY-erLMBCxC47TXR3czjbQ8zz7aibNx8WnhYHYGz7S4mRTwQbtxK5JInW_Lr4mOghNle09emTWSCxhPU3QieCkJ1qtBvOHqxDgJfdnCjNkadUK-1CLUKaQDxZdHmmDbUw16_H0ziC1pLQ0PlHOEqbZFkzsxdKRwoAsmaYaBu5-9AKEOtHyaUpNrV9OLDYg3z8TFLk7qgWJF0tCIY0Qwad8hCpMABPaWoItI1DTud3O36EU4DquzT0nFllkLHnZW6osCS8tgjWBOuTyckr48lpUcgOrlCQSw1pciEjLCR9RNWpXR9GDjPQ"
// APProver
//token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiI4NGMxZjc5ZS1kNjNmLTRjYWMtYmExYy1mNDU4ZGNlM2E0YmIiLCJleHAiOjE2ODEyMTk5MTEsImlhdCI6MTY4MTIxODcxMSwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6Ik5BVkVFTi5LQU5PT05HTyIsImRpc3BsYXlOYW1lIjoiUFJJWUFOS0EgVklEWUFSVEhZICIsInJvbGVJZCI6IjgxIiwibGV2ZWxJZCI6IjEiLCJyb2xlTmFtZSI6IlN0YWZmIiwiZW1wbG95ZWVJZCI6IlJKSlAyMDIyMDAwMDAwMTYiLCJsZXZlbE5hbWUiOiJPRkZJQ0UiLCJsZXZlbFZhbHVlQ29kZSI6bnVsbCwidXNlcklkIjoiNTk4MDIiLCJhaWQiOiI1ODIzNSIsImdyb3VwcyI6W119.c_2bg3v_lc_yfYNfe7p7-Nr_epJdUFev7v7PjyyBtVZDFfFluFj9bSAtVy3f7-dTN1QKv7hRdohqWUeeuJDhlBMi40qQ63IfrGiWH76gJAT9ZlEmbajHbDRizov75TfkGlnn0k50A1Qil-m1r9YgFykHI5BkpB1EkSNlOB4jVkxnH3-YcVnz-_Y5zsET0JyBLnoz-MlxyeFPsQNyavnrrxGgUnKCLb2YkKsSDfyfnaDSkKtEMkic_j1Fu7nX63zr-Jm3oqta_vq855DkZXHzckklOP1-RiAj-iAeAsrX5MzVVlDcshPDuYvC7BXTd7lc1UGDmHkxQuCzpL65YfXLiA"
//Auditor
   // token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiJkNGMzZmQxYy01NGVkLTRmZWItYjQzZi1lNGQ0N2I5NjgyOWYiLCJleHAiOjE2ODEyMjMxNDYsImlhdCI6MTY4MTIyMTk0Niwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IlBSQVZFSy5WQU5TV0FSIiwiZGlzcGxheU5hbWUiOiJSRU5VIFNBSU5JIiwicm9sZUlkIjoiODEiLCJsZXZlbElkIjoiMSIsInJvbGVOYW1lIjoiU3RhZmYiLCJlbXBsb3llZUlkIjoiUkpKUDIwMjIwMDAwMDAxMCIsImxldmVsTmFtZSI6Ik9GRklDRSIsImxldmVsVmFsdWVDb2RlIjpudWxsLCJ1c2VySWQiOiI1OTg2NiIsImFpZCI6IjU4MjM2IiwiZ3JvdXBzIjpbXX0.D07TeJnHXBzkkHfRjK9ZJ5AcPjPAI1g184EZDpSbRTO0lMmwGDcTDl5oMHUtdo8LGz8piG6-BbkdCIs0JU5zZTd7FUwBSs0Xvb8ANcx0vZCFTT6mbXEgfqYgjEhMuSFSpH39RZ5ZNzRmokHV-sNyusUWjfTgDZBPjgNQZKLdeZG8Yt1sFefvYHN28ozTVWXYIouROkZ559JNQwqJ7GNK8pEKvuaBkEmd1EUMBOgMbZ27nF1xL9ueAVlvQLeTFrN1d7w-7sUXCtpEdB1JOe8FLmsy_QpT0Z4fRsGejo7cSC7jDd0jJEsjIQElWQ41N85gMhosTHqbMT5uMt0uPrh7Gg"
//AAO
    //token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiJiN2ZhMzAwMC05MzNjLTRjMDktODY3Yy05OTM5MDA0Y2M3Y2EiLCJleHAiOjE2ODEyMjMzMjQsImlhdCI6MTY4MTIyMjEyNCwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6Ik5BVkFORUVULkpBSVNXQUwiLCJkaXNwbGF5TmFtZSI6Ik1BREFOIE1PSEFOIEdVUFRBICIsInJvbGVJZCI6IjgxIiwibGV2ZWxJZCI6IjEiLCJyb2xlTmFtZSI6IlN0YWZmIiwiZW1wbG95ZWVJZCI6IlJKSlAyMDIyMDAwMDAwMTUiLCJsZXZlbE5hbWUiOiJPRkZJQ0UiLCJsZXZlbFZhbHVlQ29kZSI6bnVsbCwidXNlcklkIjoiNTk4NjciLCJhaWQiOiI1ODIzNyIsImdyb3VwcyI6W119.bl7hJS6JeJ3KQoN7jF1tmKcvDan7t4wGphLiqqfO-Ock8BHx7k1h1Uhs-Uv49DCbWZ638_GI0ILO9Kub8veOHeHNISpZnM0H3jTDYXyUPVLp3qDqGVEviXusFkb2Cm2G6_3U4GfCaX4tUYxivg0wXGXkv38tvLGTeFQTobjgFVxLKXY64F6nRUiwtwKANL8zplThg6-yeJ33ZM6BK7x3XrTnofSdr2Ff8hUSVNsJGurksDkViNaYsdYhYvfzTU-SEaLYABAG7ew_mVlaS75VKclO-kC4FzCImT3xF7mN-mNhXvU3xS04J44FL5UuCUEys9abHWsP_ikw6yflZNnnNw"

    //AD
    //token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiJmYTNlMzJkOC01YTAwLTQyNjMtOWNkOC1jNmU3ODNkYjNhN2EiLCJleHAiOjE2ODEyMjM0NTYsImlhdCI6MTY4MTIyMjI1Niwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IlJBV1RFS0FNTEVTSDEwIiwiZGlzcGxheU5hbWUiOiJTSElWIFNBSEFZIE1FRU5BICAiLCJyb2xlSWQiOiI4MSIsImxldmVsSWQiOiIxIiwicm9sZU5hbWUiOiJTdGFmZiIsImVtcGxveWVlSWQiOm51bGwsImxldmVsTmFtZSI6Ik9GRklDRSIsImxldmVsVmFsdWVDb2RlIjpudWxsLCJ1c2VySWQiOiI1OTg2OCIsImFpZCI6IjU4MjM4IiwiZ3JvdXBzIjpbXX0.GcrkceKsUDxRNVPobyAqozZMuiEV6Drui-z6Ng1x5ZYID5YQMawYD7J0UF-POu_ddw681p4vVBOH9cG1LniKCbDym4GhhDZ1QR6swdgZ-nOLcWu83b1b6v3vnhNV41tN9MFChtlDhqc3IylgDlIAYBucPYmwIawUMi-S_xAw_F4ZijR5En5qrlZ846mN2_s6DO35AvTE_fpKoprvWkt1E7lmL5FDC-NSTH6JlaynqTnhNDaRaXAL4TxB68kgVUw2tmcGD05OcBCOxnhOnusHb07QGa1PSdVDSVfYycBbw2w1UarIcXTV_Cqu-jS3gG7kfF9dQm_DCgNOatEUatzx8g"


   // sessionStorage.setItem('MpJwtToken', JSON.stringify(token));

    this.empinfo=this._Service.userInfo();

    this.makerToken = sessionStorage.getItem('MpJwtToken');

    this.getDecodedAccessToken(this.makerToken);
    this.getInboxDetail(this.empinfo.aid,'INBOX');
    this.getCount();

  }

  getDecodedAccessToken(makerToken: string): any {

    try {
      let mytoken = jwt_decode(makerToken);
      localStorage.setItem('userInfo', JSON.stringify(mytoken));
      this.empinfo=this._Service.userInfo();
    }
    catch (Error) {
      return null;
    }
  }

  getInboxDetail(id:any,type:any) {
    let data = {
      assignmentId:id,
      type:type
    }
    this._Service.requestApplication(data, "inbox").subscribe({
      next: (res:any) => {
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            this.inboxData = res;
            this.dataSource = new MatTableDataSource(this.inboxData.data);
            this.dataSource.paginator = this.paginator;
            if(type==='OUTBOX'){
              this.isShow=false;
            }else{
              this.isShow=true;
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })
  }

  getCount(){
    let data = {
      assignmentId:this.empinfo.aid,
    }

    this._Service.requestApplication(data, "getRequestCount").subscribe({
      next: (res:any) => {
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            this.countDetail = res.data;
          }
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'DRMaster'
        }
      }
    );
  }

  openDialog1(){
    alert("welcome to Mr. Tushar Taneja")
  }
  

  close(i: number) {}
  // showDRDdl(e: any) {
  //   if (e.target.value == '12') {
  //     this.DdlShow = true;
  //   } else {
  //     this.DdlShow = false;
  //   }
  // }



  View_History(reqId:any){
    this.dialog.open(CommonDialogComponent,
      {
        maxWidth: '60vw',
        maxHeight: 'auto',
        width: '100%',
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'View History',id:1,reqId:reqId
        }
      }
    );
  }
  View_Profile(requestID:any,taskTranId:any,taskRoleId:any){

    this.View_pensionerlist1();
    localStorage.setItem("reqId",requestID)
    localStorage.setItem("transid",taskTranId)
    localStorage.setItem("taskRoleId",taskRoleId)
    localStorage.setItem("wfProcessId",this.wfProcessId)

    this.router.navigate(['/pension/e-Pension/Profile']);


  }

  View_pensionerlist1(){

let data ={

    "formID":1,
    "assignmentId":this.empinfo.aid
}

    this._Service.requestApplication(data, "getWorkflowID").subscribe({
      next: (res:any) => {
        if ((res.status = 200)) {
          this.wfProcessId=res.data.wfProcessId;
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })





  }
  View_pensionerlist(){

let data ={

    "formID":1,
    "assignmentId":this.empinfo.aid
}

    this._Service.requestApplication(data, "getWorkflowID").subscribe({
      next: (res:any) => {
        if ((res.status = 200)) {

          this.wfProcessId=res.data.wfProcessId;
          debugger
          if ((res.data.wfProcessId == 1)) {
            localStorage.setItem("wfProcessId",this.wfProcessId)
            this.router.navigate(['/pension/e-Pension/PensionerList']);

          }else{
            // this.router.navigate(['/pension/e-Pension/PensionerList']);
            alert("Only Maker can see upcoming pensioners");
          }
        }
      },
      error: (err) => {
        console.log(err);
        // this.error = err
        // this._snackBar.open('Error occurred :- ', this.error, {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      }
    })





  }

  updateRequest() {
    this.dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        , data: {
          message: 'Request',id:2
        }
      }
    );

  }

}



