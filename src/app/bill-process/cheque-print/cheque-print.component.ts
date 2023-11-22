import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';


export interface BillTypeMaster {
  //FrmToken: number;
}

@Component({
  selector: 'app-cheque-print',
  templateUrl: './cheque-print.component.html',
  styleUrls: ['./cheque-print.component.scss'],
})




export class ChequePrintComponent implements OnInit {
  IsDisable: boolean = true;
  checkPrintForm: any;

//  ChequeDataList:any = [];
  ChequeDataList: MatTableDataSource<any> = new MatTableDataSource();
  userinfo: any;

  BankList: any[] = [];
  BankListoptions: Observable<any[]> | undefined;

  UserList: any = [];
  UserListoptions: Observable<any[]> | undefined;

  showTab_Table: boolean = false

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.ChequeDataList.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.ChequeDataList.paginator = paginator;
  }

  //fetchedToken: any;

  isPrintDisabled:boolean=true;

  // isOkDisabled:boolean=true;
  // isCancelDisabled:boolean=true;

  printBtnType:any;

  isBtnOkDisabled: boolean[]=[]
  isBtnCancelDisabled: boolean[]=[]

  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  displayedColumns = [
    'SrNo',
    'TokenNo',
    'officename',
    'MajorHeadNameHindi',
    'CashAmt',
    'ChequeNo',
    'ChequeDate',
    'PrintPreview',
    'PrintOk',
    'PrintCancel'
  ];


  constructor( private http: HttpClient, private ApiMethods: ApiMethods, private ApiService: ApiService, private snackbar: SnackbarService, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private IPAdd: Helper, public loader: LoaderService,public dialog: MatDialog,  )
  {
    this.userinfo = this.ApiMethods.getUserInfo();
    this.getBankdata();
    this.getUserdata();
  }

  ngOnInit(): void {

    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.checkPrintForm = new FormGroup({
      BankList: new FormControl('', { validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required]}),
     // UserList: new FormControl('', [ Val.maxLength(40), Val.SpecialChar, Val.Required, ]),
      UserList: new FormControl('',  { validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required]}),
     // FrmToken: new FormControl('', [ Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric,]),
     RunningCheque: new FormControl({ value: '', disabled: true }),
     InitialCheque: new FormControl({ value: '', disabled: true }),

     TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
     //Year: new FormControl({ value: "2324", disabled: true }),
     Year: new FormControl({ value:  financialYr, disabled: true }),

    });

    this.getTreasuryList();

    // this.isOkDisabled =true;
    // this.isCancelDisabled =true;
  }



            // Call Treasury List API >>>------------------->
   
            getTreasuryList() {
              this.loader.setLoading(true);
               //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
                 this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
           
                 console.log("Auditor__res", resp);
                 let data = resp.result
                 if (resp.result && resp.result.length > 0) {
                   this.TreasuryListarr = resp.result
                   //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
                   this.Treasuryoptions = this.checkPrintForm.controls['TreasuryControl'].valueChanges.pipe(
                     startWith(''),
                     map((value: any) => {
                       return typeof value === 'string' ? value : value.treasuryCode
                     }),
                     map((treasury: any) => {
           
                       return treasury ? this._filterTreas(treasury, data) : data.slice()
                     })
                   );
                   const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
                   this.checkPrintForm.patchValue({
                     TreasuryControl: treasury
           
                   })
            
                   if(this.TCode.Treasury_Code !="5000")
                   {
                     this.checkPrintForm.controls['TreasuryControl'].disable();
                   }
                 }
               })
               this.loader.setLoading(false);
      
              }
        
        
          _filterTreas(value: string, data: any) {
            return data.filter((option: any) => {
              return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
            });
          }
        
          displayTreasFn(selectedoption: any) {
            console.log("display_fun_call aaa", selectedoption.TreasuryName);
            return selectedoption ? selectedoption.TreasuryName : undefined;
          }

          
  //  Bind and Filter Bank List ---------------------->
  getBankdata()
  {
    this.ApiMethods.getservice( this.ApiService.BankList + this.userinfo.treasCode + '/' + 1 ).subscribe((resp:any) => {
    if (resp.result.length > 0)
    {
      this.BankList = resp.result;
      console.log('BankList_afterthis', this.BankList);
    }

      this.BankListoptions = this.checkPrintForm.controls['BankList']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.BankList
        }),
        map((BANKNAME: any) => {
          console.log("second__map", BANKNAME);

          return BANKNAME ? this._filterBank(BANKNAME,  this.BankList ) :  this.BankList.slice()
        })
      );

    });
  }

  _filterBank(value: string, data: any) {
    return data.filter((option: any) => {
      return option.BANKNAME.toLowerCase().includes(value.toLowerCase())
    });
  }


  displayBankFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.BANKNAME : undefined;
  }



 //  Bind and Filter User List ---------------------->
  getUserdata()
  {
    this.ApiMethods.getservice( this.ApiService.BankUserList + this.userinfo.treasCode + '/MstUsers' ).subscribe((resp:any) => {
    if (resp.result.length > 0)
    {
      this.UserList = resp.result;
    }
      console.log('UserList_after', this.UserList);

      this.UserListoptions = this.checkPrintForm.controls['UserList']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.UserList
        }),
        map((employeeid: any) => {
          console.log("second__map", employeeid);

          return employeeid ? this._filterUser(employeeid,  this.UserList ) :  this.UserList.slice()
        })
      );


    });
  }

  _filterUser(value: string, data: any) {

    return data.filter((option: any) => {
      return option.employeeid.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayUserFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.employeeid : undefined;
  }



  //  Fetch Cheque Print Data ---------------------->
  GetCheckFetch()
  {
    this.loader.setLoading(true)
    let pageVal =
    {
      treasuryCode: this.TCode.Treasury_Code,
      bankBranchCode: this.checkPrintForm.controls['BankList'].value.BankBranchCode,
      // bankBranchCode: 293,  // Only For Testing
       auditorCode: this.checkPrintForm.controls['UserList'].value.userid,
      //auditorCode: 0,       // Only For Testing
      //tokenNo: this.checkPrintForm.controls['FrmToken'].value,
      tokenNo:0,
      type: 1,
      tokenFinYear: this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4),
    };

    console.log("Test_pageVal",pageVal);

    this.checkPrintForm.disable();
    // Calling API : checkPrintList ----------------------------------->
    this.ApiMethods.postresultservice(this.ApiService.checkPrintList, pageVal).subscribe((resp:any) => {
      console.log("After_API_Save_Result__", resp);
      if (resp.result.length > 0)
      {
        this.ChequeDataList.data = resp.result
        //this.fetchedToken = resp.result[0].TokenNo;
        this.showTab_Table = true;
        //console.log("data_sendbefore__", this.ChequeDataList.data);
       // console.log("XXXXXXXXXXXXXXXXXXXXXX_fetchedToken__", this.fetchedToken );
        this.loader.setLoading(false)
      }
      else
      {
        this.snackbar.show('Data Not Found !', 'alert');
        this.showTab_Table = false;
      }
    },
    (res:any) => {
      console.log("errror message___", res.status);
      if (res.status != 200) {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger');
      }
    });




    let pageVal2 =
    {
      treasuryCode: this.TCode.Treasury_Code,
      bankBranchCode: this.checkPrintForm.controls['BankList'].value.BankBranchCode,
      // bankBranchCode: 748,  // Only For Testing
      userId: this.checkPrintForm.controls['UserList'].value.userid,
      //userId: 12758,       // Only For Testing
      //tokenNo: this.checkPrintForm.controls['FrmToken'].value,

    };
    console.log("pageVal2_Before_API_Show_Result__", pageVal2);
    // Calling API : checkPrintGetChequeNo ----------------------------------->
    this.ApiMethods.postresultservice(this.ApiService.checkPrintGetChequeNo, pageVal2).subscribe((resp:any) => {
      console.log("After_API_Save_Result__", resp);

      if (Object.keys(resp).length> 0)
      //if (resp.result.length > 0)
      {
          console.log("XXXXXXXXXXXXXX_Result__",  resp.result);
          this.checkPrintForm.controls['RunningCheque'].value = resp.result.chequeno;
          this.checkPrintForm.controls['InitialCheque'].value = resp.result.chequeinit;
      }
      else
      {
        this.snackbar.show('No Check Available For Printing !', 'alert');
        //this.showTab_Table = false;
        this.checkPrintForm.controls['RunningCheque'].value = "";
        this.checkPrintForm.controls['InitialCheque'].value = "";
      }
    },
    (res:any) => {
      console.log("errror message___", res.status);
      if (res.status != 200) {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger');
      }
    });

  }



  applyFilter(filterValue: string) {
    this.ChequeDataList.filter = filterValue.trim().toLowerCase();
    if (this.ChequeDataList.paginator) {
      this.ChequeDataList.paginator.firstPage();
     console.log("XXXXXXXXXXXXXX__", this.ChequeDataList.filter);
    }
  }



  Reset()
  {
    window.location.reload();
  }

  //  PrintBill()
  //   {
  //  }


  // common popup For 'ChequePrintPreviewDialog' ------------------------------->
      PrintPreview(element: any,printBtnType:any) {

        const reasondialogRef = this.dialog.open(CommonDialogComponent,
        {
          panelClass: 'dialog-w-50', autoFocus: false
          ,
          height: "auto",
          width: "50%",
          data: {
            //ChequePrintToken: tokenNo,
            ChequePrintToken: element.TokenNo,
            ChequePrintRunningChequeNo: this.checkPrintForm.controls['RunningCheque'].value,
            ChequePrintBtnType: printBtnType,
            id: 'ChequePrintPreviewDialog',
          }
        }
      );


      this.disableElement(element.TokenNo);

      //this.isOkDisabled=false;
      //this.isCancelDisabled=false;
    }



 disableElement(tokenNo:any): void 
  {
    this.isBtnOkDisabled[tokenNo] = true;
    this.isBtnCancelDisabled[tokenNo] = true;
  }


//  Update Cheque Print With OK ---------------------->
 ChequePrintOK(printBtnType:any,element:any)
  {

    console.log("AAAAAAAAAAA_ChequePrintOK_element.TokenNo",element.TokenNo);

    this.loader.setLoading(true)
   // exec trgUpdateCheque @treasurycode='2100',@Chequeno='666339',@Chequeinit='666331',@bankbranchcode=995,@tokenno=22,@userid=64,@type=1  -- type=1  //  Print Ok
    let pageVal =
    {
      // Parameter List (pageVal1) -----------------
      chequeno: this.checkPrintForm.controls['RunningCheque'].value,
      chequeinit: this.checkPrintForm.controls['InitialCheque'].value,
      treasurycode: this.TCode.Treasury_Code,
      bankBranchCode: this.checkPrintForm.controls['BankList'].value.BankBranchCode,
      userID: this.checkPrintForm.controls['UserList'].value.userid,
      //tokenNo:  this.fetchedToken,
      tokenNo:  element.TokenNo,
      type: 1

    };


    console.log("AAAAAAAAAAA_ChequePrintOK_pageVal",pageVal);
     
    console.log("Test_pageVal_bankBranchCode",this.checkPrintForm.controls['BankList'].value.BankBranchCode);
    console.log("Test_pageVal_userID",this.checkPrintForm.controls['UserList'].value.userid,);

    // Calling API : Cheque Print OK ----------------------------------->
    this.ApiMethods.postresultservice(this.ApiService.ChequePrintAction, pageVal).subscribe((resp:any) => {
      console.log("After_API_ChequePrintAction_OK_Result__", resp);
      if (resp.result)
      {
        //this.snackbar.show('Cheque Print has been Updated Sucessfully !', 'success');
        //this.showTab_Table = false;
        //this.isOkDisabled =true;
        //this.isCancelDisabled =true;


        this.PrintPreview(element.TokenNo,printBtnType);
        this.loader.setLoading(false)
      }
      else
      {
        this.snackbar.show('Cheque Print has not been Updated !', 'alert');
        this.showTab_Table = false;
      }
    },
    (res:any) => {
      console.log("errror message___", res.status);
      if (res.status != 200) {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger');
      }
    });


  }

//  Update Cheque Print With Cancel ---------------------->
  ChequePrintCancel(element:any)
  {
    console.log("BBBBBBBBBBBB_ChequePrintCancel_element.TokenNo",element.TokenNo);

    this.loader.setLoading(true)
    let pageVal2 =
    {
      // Parameter List (pageVal2) -----------------
      chequeno: this.checkPrintForm.controls['RunningCheque'].value,
      chequeinit: this.checkPrintForm.controls['InitialCheque'].value,
      treasurycode: this.TCode.Treasury_Code,
      bankBranchCode: this.checkPrintForm.controls['BankList'].value.BankBranchCode,
      userID: this.checkPrintForm.controls['UserList'].value.userid,
      //tokenNo:  this.fetchedToken,
      tokenNo:  element.TokenNo,
      
      type: 2
    };

    console.log("Test_pageVal2",pageVal2);

    console.log("Test_pageVal2_bankBranchCode",this.checkPrintForm.controls['BankList'].value.BankBranchCode);
    console.log("Test_pageVal2_userID",this.checkPrintForm.controls['UserList'].value.userid,);

    // Calling API : Cheque Print Cancel ----------------------------------->
    this.ApiMethods.postresultservice(this.ApiService.ChequePrintAction, pageVal2).subscribe((resp:any) => {
      console.log("After_API_ChequePrintAction_Cancel_Result__", resp);
      if (resp.result)
      {
        this.snackbar.show('Cheque Print has been Cancelled Sucessfully !', 'success');
        this.showTab_Table = false;
        //this.isOkDisabled =true;
        //this.isCancelDisabled =true;
        this.loader.setLoading(false)
      }
      else
      {
        this.snackbar.show('Cheque Print has not been Cancelled !', 'alert');
        this.showTab_Table = false;
      }
    },
    (res:any) => {
      console.log("errror message___", res.status);
      if (res.status != 200) {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger');
      }
    });


  }



}
