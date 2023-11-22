import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { IGenerateToken, IGetAutoProcessStatus, IPayMangerToken } from 'src/app/utils/Master';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { DomSanitizer } from '@angular/platform-browser';


export interface tokenList {
  BillType: string;
  TokenNo: number;
  CDE_RefNo: number;
  DDOCode: number;
  MHeadName: number;
  ObjectHead: number;
  GrossAmount: number;
  CashAmt: number;
  ForwardDate: Date
}

@Component({
  selector: 'app-online-token-entry',
  templateUrl: './online-token-entry.component.html',
  styleUrls: ['./online-token-entry.component.scss']
})

export class OnlineTokenEntryComponent implements OnInit {
  Listdata: MatTableDataSource<tokenList> = new MatTableDataSource();
  displayedColumns =
    ['SrNo',
      'CDE_RefNo',
      'DDOName',
      'MHeadName',
      'BillType',
      // 'ObjectHead',
      'CashAmount',
      'GrossAmount',
      'TokenNo',
      'TokenReceipt'
    ]
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) Sort!: MatSort;
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.Listdata.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.Listdata.sort = sort;
  }
  finYr: any;
  treasury: any;
  TokenEntryform: any;
  TreasOffList: any;
  Generateflag: number = 0;
  commonmsg: string = ''
  p: number = 1;
  BillID: any;
  indexReceived: any;
  btnval = "Generate"
  NewToken: any
  element: any
  tokencde: any[] = [];
  TokenResult: any[] = []
  buttonvisible: boolean = false;
  
  //LIst array
  BillTypeListarr: any = []
  SelectBillType: any = ''
  BillTypeOptions: Observable<any[]> | undefined;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  // editCache: { [key: string]: any } = {};
  //radio button check flag
  PayManager_radio: boolean = true
  Objected_radio: boolean = false
  radioButtonvalue: any;
  // BillTypelist: any = '';
  showPayManagerTable: boolean = false
  Reslt: any;
  row: any;
  IP:any
  base64data:any;
  GettokenonlinetusModal: IGetAutoProcessStatus = {
    treasuryCode: this.Tcode.Treasury_Code,
    tblName: "TreasuryMst"
  }
  // PayMangerToken model
  PayMangerTokenModel: IPayMangerToken = {
    treasurycode: this.Tcode.Treasury_Code,
    finyear: this.finyear_.year.toString(),
    billType: 0,
    type: 0,
  }

  TokenReceiptList: any = {
    "billNo": 1212,
    "reportPath": "/Treasury/Others/Reports/RPT_TOKEN_RECEIPT.xdo",
    "format": "pdf",
    "params": [
      {
        "name": "v_type",
        "value": "A"
      },
      {
        "name": "v_Treasurycode",
        "value": ""
      },
      {
        "name": "v_Finyear",
        "value": 0
      },
      {
        "name": "v_Tokenno",
        "value": 0
      }
    ]
  }



  constructor(private sanitizer: DomSanitizer,public dialog: MatDialog, private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private _liveAnnouncer: LiveAnnouncer, private ApiService: ApiService, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private usercode_: Helper, private Fyear_: Helper, private asgnId: Helper, private fy_: Helper) {
    history.pushState(null, '', location.href);
    this.getBillTypeList() //call billtypelist 
 
    this.IP= this.ApiMethods.clientIP;
  }

  //generate token model
  GeneratetokenNodel: IGenerateToken = {
    treasuryCode: this.Tcode.Treasury_Code,
    fromFinYear: this.finyear_.year.toString(),
    tokenfinYear: this.fy_.forwardYear.toString(),
    userId: this.usercode_.UserId,
   // userId: sessionStorage.getItem('rajkoshId'),
    assignmentId: this.asgnId.assignmentId,
    cdeRefNo: [],
    ipaddress: ""
  }

  radioButtonGroupChange(event: any) {
    // console.log("XXXXXXXXXXXXXXX_mat_radioVal", event.value);
    if (event.value == 1) {
      this.radioButtonvalue = "1"
    }
    else {
      this.radioButtonvalue = "2"
    }
    this.PayMangerTokenModel.type = this.radioButtonvalue;
  }

  ngOnInit(): void {
    this.finYr = this.finyear_.forwardYear.toString();
    // this.treasury = this.PayMangerTokenModel.treasurycode;
    this.getTreasuryList();
    console.log("treasury--", this.treasury)
    this.TokenEntryform = new FormGroup({
      // Treasury: new FormControl({ value: this.PayMangerTokenModel.treasurycode, disabled: true }),
      finyear: new FormControl({ value: this.finYr, disabled: true }),
    BillTypeControl: new FormControl('', [Val.maxLength(40), Val.SpecialChar, Val.maxLength(12)]),
     // BillTypeControl: new FormControl({value: 0},{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required,Validators.maxLength(40)] }),
      TreasuryControl: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    })
  }

  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.TokenEntryform.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filtertreasury(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
        this.TokenEntryform.patchValue({
          TreasuryControl: treasury
        })
      }
    })
    this.loader.setLoading(false);
  }

  _filtertreasury(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displaytreasury(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  // Call bill List API >>>------------------->
  getBillTypeList() {
    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
      console.log("BillType__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.BillTypeListarr = resp.result
      }
      console.log("Show_Treasury_BillList", this.BillTypeListarr);
      this.BillTypeOptions = this.TokenEntryform.controls['BillTypeControl'].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.billType
        }),
        map((billType: any) => {
          return billType ? this._filter(billType, data) : data.slice()
        })
      );

    })

  }

  
  //  bill List filter >->
  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.BillType.toLowerCase().includes(value.toLowerCase())
    });
  }

  
  //  biil List Select >------>
  OnBillTypeSelected(SelectBillType: any) {
    console.log("befort______Select_Bill", SelectBillType);
    console.log("slelction__________option_____________", SelectBillType);
    this.PayMangerTokenModel.billType = SelectBillType
  }

  //  Bill Type display Function >----->
  displayFn(selectedoption: any) {
    console.log("displaycall");
    return selectedoption ? selectedoption.BillType : undefined;
  }

  // get bill type list
  // getBillTypeList() {
  //   this.ApiMethods.getservice(this.ApiService.BillTypeList).subscribe((data: any) => {
  //     console.log("Billtype__res", data.result);
  //     this.BillTypelist = data.result;

  //   })
  // }

  //bill code sent in model
  // GetBillTypeListCode() {
  //   this.PayMangerTokenModel.billType = this.TokenEntryform.value.BillTypeControl;
  //   let BillCode: any = this.PayMangerTokenModel.billType;
  //   console.log("biilcode__", BillCode);
  // }


  applyFilter(filterValue: string) {
    this.Listdata.filter = filterValue.trim().toLowerCase();
    if (this.Listdata.paginator) {
      this.Listdata.paginator.firstPage();
    }
  }



  //paymangertokenlist api calling
  // GetPayMangerToken() {
    
  //   let BillTYpeVal = this.TokenEntryform.controls['BillTypeControl'].value;
  //   console.log("Bill_Value", BillTYpeVal);
  //   console.log("Billtype_Value", BillTYpeVal.Ncode);
  //   this.PayMangerTokenModel.billType = BillTYpeVal.Ncode;
  //   this.loader.setLoading(true);
  //   console.log("before_cAlling_Api BilltypeValue", this.PayMangerTokenModel)

  //   //api calling of PayMangerOnlineToken__--?
  //   this.ApiMethods.postresultservice(this.ApiService.PayManagerTokenlist, this.PayMangerTokenModel).subscribe(resp => {
  //     console.log("PayMangerOnlineToken__result", resp);
  //     this.TokenResult = resp.result;
  //     let DDOname: any[] = [];
  //     this.TokenResult.forEach(element => {
  //       if (element.DDOName == "-" || element.MHeadName == '-' || element.BillName == '-') {
  //         this.buttonvisible = false;
  //         console.log("gfdgs")
  //       }
  //       console.log("DDD", DDOname)
  //       DDOname.push(element.DDOName)
  //     });

  //     if (resp.result.length > 0) {
  //       // console.log("PayMangerOnlineToken__", resp.result);
  //       // this.TokenResult = resp.result;
  //       // console.log("tokenlistresult__", this.TokenResult)
  //       this.Listdata.data = resp.result
  //       // this.Listdata.sort = this.Sort;
  //       this.showPayManagerTable = true;
  //       this.loader.setLoading(false);
  //     }
  //     else {
  //       this.snackbar.show("No Data Found !", 'alert')
  //       this.loader.setLoading(false);
  //       this.Listdata.data = []
  //       this.showPayManagerTable = false;
  //     }
  //   },
  //     (res:any) => {
  //       console.log("errror message___", res.status);
  //       if (res.status != 200) {
  //         this.loader.setLoading(false);
  //         this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
  //         this.showPayManagerTable = false;
  //       }
  //     }
  //   );
  // }

  GetPayMangerToken() {
    
    let BillTYpeVal = this.TokenEntryform.controls['BillTypeControl'].value;
    console.log("Bill_Value", BillTYpeVal);
    const fbilltype = this.BillTypeListarr.filter((x:any) => x.BillType ==BillTYpeVal.BillType)[0];
    console.log("billype__",fbilltype)
     if(fbilltype==undefined&&BillTYpeVal!=''){
      this.showPayManagerTable = false;
      this.snackbar.show("please select valid billtype !", 'alert')
    }
    else{
        console.log("Billtype_Value", BillTYpeVal.Ncode);
    this.PayMangerTokenModel.billType = BillTYpeVal.Ncode;
    this.loader.setLoading(true);
    console.log("before_cAlling_Api BilltypeValue", this.PayMangerTokenModel)

    //api calling of PayMangerOnlineToken__--?
    this.ApiMethods.postresultservice(this.ApiService.PayManagerTokenlist, this.PayMangerTokenModel).subscribe((resp:any) => {
      console.log("PayMangerOnlineToken__result", resp);
      this.TokenResult = resp.result;

      //--------code for disable generateall button-------------///
     /// let DDOname: any[] = [];
      // this.TokenResult.forEach(element => {
      //   if (element.DDOName == "-" || element.MHeadName == '-' || element.BillName == '-') {
      //     this.buttonvisible = false;
      //     console.log("gfdgs")
      //   }
      //  // console.log("DDD", DDOname)
      //  /// DDOname.push(element.DDOName)
      // });

      ///------end=--------------------------------------------//

      if (resp.result.length > 0) {
        // console.log("PayMangerOnlineToken__", resp.result);
        // this.TokenResult = resp.result;
        // console.log("tokenlistresult__", this.TokenResult)
        this.Listdata.data = resp.result
        // this.Listdata.sort = this.Sort;
        this.showPayManagerTable = true;
        this.loader.setLoading(false);
      }
      else {
        this.snackbar.show("No Data Found !", 'alert')
        this.loader.setLoading(false);
        this.Listdata.data = []
        this.showPayManagerTable = false;
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          this.showPayManagerTable = false;
        }
      }
    );
     }
  }
  //Reset page
  PayMangerTokenReset() {
    window.location.reload();
  }

  //generate all tokens -------------------------------------->>>>>>>>>>>>>>>>
  GenerateAllToken() {
   // console.log("toen__", this.tokencde)
    // this.Generatetoken(this.row );
    if (window.confirm('Are you sure you want to Generate Token')) {
      console.log("generateall called__")
      // this.GeneratetokenNodel.billnoid = row.RefNo;
      const RefNumber: any = [];
      const getNewToken: any[] = [];

      //console.log("DDO Map !",this.element.NewToken)
      this.TokenResult.forEach(element => {
        if (element.DDOName == "-" || element.MHeadName == '-' || element.BillName == '-' || element.NewToken > 0) {
          if (element.NewToken) {
            getNewToken.push(element.NewToken)
            //console.log("XXXXX_getNewToken !",getNewToken )
          }
        }
        else {
          RefNumber.push(element.CDE_RefNo)
          //console.log("XXXXX_RefNumber !",RefNumber)
        }
      });

      this.GeneratetokenNodel.cdeRefNo = RefNumber

      if (getNewToken.length > 0 && RefNumber == "") {
        console.log("XXXXX_getNewToken !", getNewToken)
        this.snackbar.show('No Pendency Found !', 'alert')
      }

      else if (RefNumber == "") {
        this.snackbar.show('Either DDO is not Mapped with Treasury OR MajorHead is not found OR Bill Type is not Available !', 'alert')
      }
      
      else {
        console.log("after api-- ", this.GeneratetokenNodel.cdeRefNo)
        console.log("XXXXX_RefNumber !", RefNumber)
        this.GeneratetokenNodel.ipaddress=this.IP
        console.log("before calling api_", this.GeneratetokenNodel)
        this.loader.setLoading(true);
        this.ApiMethods.postresultservice(this.ApiService.TokenGenerate, this.GeneratetokenNodel).subscribe((resp:any) => {
          console.log("response", resp.result)
         // let tokenresul=resp.result[0];
          if (resp.result.length > 0) {
            if(resp.result[0].MSG!=null){
              console.log("Mscheck__",resp.result[0].MSG)
              this.snackbar.show(resp.result[0].MSG, 'alert')
              this.loader.setLoading(false);
            }
            else{
            resp.result.forEach((element: any) => {
              // const data = this.TokenResult.filter(x => x.cdeRefNo === element.CDE_RefNo)[index];
              const data = this.TokenResult.filter(x => x.CDE_RefNo === element.cdeRefNo)[0];
              console.log("data_____________", data)
              data.NewToken = element.tokenNo;
              this.buttonvisible = true;
              //console.log("Show_Label_NewToken")
              this.snackbar.show("Token has been Generated Successfully !", 'success')
              this.loader.setLoading(false);
            });
          }
          }
          else {
            this.snackbar.show("No Data Found !", 'alert')
            this.loader.setLoading(false);
            this.buttonvisible = false;
          }
        },
          (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
            }
          }
        )
      }
    }
  }

  //generate single token api call----------------------------->>>>>>>>>>>>
  Generatetoken(row: any) {
    if (window.confirm('Are you sure you want to Generate this Token')) {
      this.GeneratetokenNodel.cdeRefNo = [row.CDE_RefNo]
      this.GeneratetokenNodel.ipaddress=this.IP
      console.log("Before cdeRefNo", this.GeneratetokenNodel.cdeRefNo)
      this.loader.setLoading(true);
      this.ApiMethods.postresultservice(this.ApiService.TokenGenerate, this.GeneratetokenNodel).subscribe((resp:any) => {
        console.log("response", resp.result)
        this.Reslt = resp.result[0];
        if (resp.result.length > 0) {
          if(this.Reslt.MSG!=null){
            console.log("Mscheck__",this.Reslt.MSG)
            this.snackbar.show(this.Reslt.MSG, 'alert')
            this.loader.setLoading(false);
          }
          else {
          row.NewToken = this.Reslt.tokenNo;
          // console.log("tojkenno.", row.NewToken)
          this.snackbar.show("Token has been Generated Successfully !", 'success')
          //console.log("resl--", this.TokenResult)
          this.loader.setLoading(false);
        }
      }
        else {
          this.snackbar.show("No Data Found !", 'alert')
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        }
      );
    }
  }
  viewReceiptPopUp(element: any) {
    this.SHOWPDF(element.NewToken, this.Tcode.Treasury_Code, this.Fyear_.forwardYear);
    //this.showmodal(element.NewToken);
   // this.GetViewBillDetail(element.NewToken, this.Tcode.Treasury_Code, this.finyear_.year.toString(),);
    console.log("newetoken", element.NewToken, this.Tcode.Treasury_Code, this.finyear_.year.toString(),)
  }

  //   showmodal(NewToken: any) {
  //     const dialogRef = this.dialog.open(TokenReceiptComponent,
  //       {
  //         width: '1000px',
  //         height: '800px',
  // }
  //     );
  //     dialogRef.componentInstance.OnShowData(NewToken) ;
  // }

  // GetViewBillDetail(NewToken: any, treasury: any, finyear: any) {
  //   const dialogRef = this.dialog.open(CommonDialogComponent,
  //     {
  //       panelClass: 'dialog-w-50', autoFocus: false,
  //       height: "auto",
  //       width: "50%",
  //       data: {
  //         id: 'TokenReceipt',
  //       }
  //     }
  //   );
  //   dialogRef.componentInstance.OnShowData(NewToken, treasury, finyear);
  // }


  viewDocumentPopup(element: any) {
    //this.loader.setLoading(true);
    this.showmodal(element.CDE_RefNo);
  }
  showmodal(CDE_RefNo: any) {
    const dialogRef = this.dialog.open(ViewDocumentComponent,
      {
        // width: '50%',
        // height: '63%',
        width: '1000px',
        height: '800px',
        disableClose: true
       
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(CDE_RefNo);
  }


  SHOWPDF(Token: any, tCode: any, fYear: any) {
    let NEWTOKEN = Token;
    this.TokenReceiptList.params[1].value = this.Tcode.Treasury_Code
    this.TokenReceiptList.params[2].value = this.finyear_.year.toString()
    this.TokenReceiptList.params[3].value = NEWTOKEN
    this.snackbar.show('Generated Token Number is : ' + tCode + '-' + fYear + "-" + Token.toString() + '\n' + " ", 'alert')
    console.log("token value", NEWTOKEN)
    this.TokenReceiptList.params[3].value = NEWTOKEN;
    this.loader.setLoading(true);
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.TokenReceiptList).subscribe((resp:any) => {
      console.log("imgresp__", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.base64data = "data:application/pdf;base64," + documentArray.content;
        console.log("base64", this.base64data)
        this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
        //this.showReport = true
        let w = window.open('about:blank', 'mywindow', "width=730, height=900");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.base64data);
        this.loader.setLoading(false)
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
  }

 }
