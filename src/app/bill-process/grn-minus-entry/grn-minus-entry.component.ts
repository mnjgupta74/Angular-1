
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetBillEncashmentFetchList } from 'src/app/utils/Master';
import { IGetBillEncashmentSubmitList } from 'src/app/utils/Master';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import * as Val from  '../../../app/utils/Validators/ValBarrel'
import * as moment from 'moment';
import { Helper } from 'src/app/utils/Helper';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-grn-minus-entry',
  templateUrl: './grn-minus-entry.component.html',
  styleUrls: ['./grn-minus-entry.component.scss']
})
export class GrnMinusEntryComponent implements OnInit {

  // Form Module

  hodError:boolean=true;
  HODID:any;
  HodName:any;
  ResultData:any
  ObjectHeadData:any;
  BudgetHeadData:any;
  grnResultData:any;
  GrnMinusEntryForm: any;
  GrnMinusEntryFormDetails: any;
  ChooseOption: any = '';

  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  BankList: any[] = [];
  BankNameList: any[] = [];

  DodoNameList: Observable<any[]> | undefined;
  DdoNameListarr: any[] = []
  SelectDdoName: any = ''

  DdoBillNo: any = '';

  OfficeName: any = '';

  BIllMonth: any = '';

  BIllYear: any = '';

  BillTypeList: Observable<any[]> | undefined;
  BillTypeListarr: any[] = []
  SelectBilltype: any = ''

  ObjectHeadList: Observable<any[]> | undefined;
  treasuryCode:any;
  DivisionData:any;
  grnResultDataLength:number=0;
  pipe: any;
  maxDate:any;


  constructor(private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private _liveAnnouncer: LiveAnnouncer, private Helper:Helper,public dialog: MatDialog) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };

    this.maxDate = new Date();
  }

  ngOnInit(): void {

//     const encodedString = "AMpsU6W4Hn3ZUrbDJvLwDcV41FuR+OkpJGVcx1Kj8fzxg2wKtjG8J7o5J0EYrvMU";
// const decodedString = atob(encodedString);
// console.log("decodedString==>",decodedString);
//alert(decodedString);

    let financialYr  = this.Helper.year.toString().substring(2,4) + this.Helper.finyear.toString().substring(2,4);   // It Shows = 2324

      this.GrnMinusEntryForm = new FormGroup({
      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value:  financialYr, disabled: true }),
      GRN: new FormControl('',[Validators.pattern('^[0-9]*$'),Val.Required, Val.minLength(4), Val.maxLength(13), Val.cannotContainSpace, Val.Numeric])
    });




    this.GrnMinusEntryFormDetails = new FormGroup({
      TreasuryCode: new FormControl(''),
      GRN: new FormControl(''),
      Billtype: new FormControl({ value: '', disabled: true }),
      bankName: new FormControl('',[Validators.required]),
      VoucherDate: new FormControl(new Date(),[Validators.required]),
      DdoName: new FormControl({ value: '', disabled: true }),
      DdoBillNo: new FormControl({ value: '', disabled: true }),
      OfficeName: new FormControl({ value: '', disabled: true }),
      DdoBillDate: new FormControl({ value: '', disabled: true }),
      BIllMonth: new FormControl({ value: '', disabled: true }),
      BIllYear: new FormControl({ value: '', disabled: true }),
      chequeType: new FormControl({ value: '', disabled: true }),
      BudgetHead: new FormControl({ value: '', disabled: true }),
      paymentMode: new FormControl({ value: '', disabled: true }),
      objectHead: new FormControl({ value: '', disabled: true }),
      chequeDate: new FormControl({ value: '', disabled: true }),
      thirdPartyName: new FormControl({ value: '', disabled: true }),
      PlanNonPlan: new FormControl({ value: '', disabled: true }),
      division: new FormControl({ value: '', disabled: true }),
      VotedCharged: new FormControl({ value: '', disabled: true }),
      grossAmount: new FormControl({ value: '', disabled: true }),
      AISGNG: new FormControl({ value: '', disabled: true }),
      netAmount: new FormControl({ value: '', disabled: true }),
      DivCode: new FormControl('',[Validators.required]),
      chequeNo: new FormControl({ value: '', disabled: true }),
      HODID: new FormControl({ value: '', disabled: true },[Validators.required]),
      HodName: new FormControl({ value: '', disabled: true },[Validators.required]),
    });



    this.getTreasuryList();
    this.getBankList()
    this.getDdoNameList();
    this.getBillTypeList();
    this.trgGetObjectHeadCodelist();
    this.fetchGroupSubHead();
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
         this.Treasuryoptions = this.GrnMinusEntryForm.controls['TreasuryControl'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {

             return treasury ? this._filterTreas(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Helper.Treasury_Code)[0];
         this.GrnMinusEntryForm.patchValue({
           TreasuryControl: treasury

         })


          if(this.Helper.Treasury_Code !="5000")
          {
            this.GrnMinusEntryForm.controls['TreasuryControl'].disable();
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


  // Calling API for Bank List
  getBankList() {
    console.log("bankList_before", this.BankList);
    this.ApiMethods.getservice(this.ApiService.BankList + '/' + this.Helper.Treasury_Code + '/' + 3).subscribe((resp:any) => {
      console.log("BankList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BankList = resp.result;

        this.BankList.forEach(element => {
          this.BankNameList[element.BankBranchCode]=element;

        });

      ///  console.log("BankNameListRecord", this.BankNameList);
      //  alert();

       // this.BankNameList[resp.result]
      }
    })
    console.log("BankList_after", this.BankList);
  }


  //<............Ddo Name list get flow start......
  getDdoNameList() {
    this.ApiMethods.getservice(this.ApiService.getDdoNamelist + this.Helper.Treasury_Code + '/0').subscribe((resp:any) => {
       console.log("getDdoNameList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.DodoNameList = resp.result;
        // console.log("");

        this.DdoNameListarr = resp.result;

        this.DodoNameList = this.GrnMinusEntryFormDetails.controls['DdoName'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("firstmap__DdoName", value);
            return typeof value === 'string' ? value : value.DDO_NAME
          }),
          map((DDO_NAME: any) => {
            // console.log("second__map_DdoName", DDO_NAME);
            return DDO_NAME ? this.DdoName_filter(DDO_NAME, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }
  //  Ddo name List Select >>>------------------->
  OnDdoNameSelected() {
    this.SelectDdoName = this.GrnMinusEntryFormDetails.value.DdoName
    // console.log("slelction__________DdoName", this.SelectDdoName, this.BillEntryForm.value.DdoName);
  }

  //  Ddo name List filter >>>------------------->
  DdoName_filter(value: string, data: any) {
    // console.log("filterval__DdoName", value);
    return data.filter((option: any) => {
      // console.log("option_val__DdoName", option);
      return option.DDO_NAME.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Ddo name display Function >>>------------------->
  displayFn3(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_DdoName", selectedoption);
    //  return selectedoption ? selectedoption.DDO_NAME : 'undefined';
    return selectedoption ? selectedoption.DDO_NAME : selectedoption.DDO_NAME
      ;
  }
  //..................end.................>



  // Calling API for Bill Type List
  getBillTypeList() {
    console.log("BillTypeList_before", this.BankList);

    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
      console.log("BillTypeList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.BillTypeList = resp.result
        this.BillTypeListarr = resp.result

        this.BillTypeList = this.GrnMinusEntryFormDetails.controls['Billtype'].valueChanges.pipe(
          startWith(''),

          map((value: any) => {
            // console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.BillType
          }),
          map((BillType: any) => {
            // console.log("second__map", BillType);

            return BillType ? this._filter(BillType, resp.result) : resp.result.slice()
          })
        );
      }

    })
    console.log("BillTypeList_after", this.BankList);
  }

    //  Bill type List Select >>>------------------->
    OnBilltypeSelected() {
      this.SelectBilltype = this.GrnMinusEntryFormDetails.value.Billtype
      console.log("slelction__________option_____Biltypoe", this.SelectBilltype, this.GrnMinusEntryFormDetails.value.Billtype);
    }


    //  Auditor List filter >>>------------------->
    _filter(value: string, data: any) {
      // console.log("filterval__", value);
      return data.filter((option: any) => {
        console.log("option_val__", option);
        return option.BillType.toLowerCase().includes(value.toLowerCase())
      });
    }


    //  Auditor display Function >>>------------------->
    displayFn(selectedoption: any) {
      // console.log("display_fun_call");
      return selectedoption ? selectedoption.BillType : undefined;
    }






  //<............object head list get flow start......
  getObjectHeadList(SelectBillSubtype: any) {
    this.ApiMethods.getservice(this.ApiService.getobjectheadlist + this.SelectBilltype.Ncode + '/' + SelectBillSubtype).subscribe((resp:any) => {
      // console.log("ObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.ObjectHeadList = resp.result;
        this.ObjectHeadList = this.GrnMinusEntryFormDetails.controls['ObjectHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("firstmap__ObjectHead", value);
            return typeof value === 'string' ? value : value.objectHeadCodeName
          }),
          map((objectHeadCodeName: any) => {
            // console.log("second__map_ObjectHead", objectHeadCodeName);
            return objectHeadCodeName ? this.ObjectHead_filter(objectHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }



    //  Object Head List Select >>>------------------->
    OnObjectHeadSelected(SelectObjectHead: any) {
      // console.log("slelction__________ObjectHead", SelectObjectHead);
    }

    //  Auditor List filter >>>------------------->
    ObjectHead_filter(value: string, data: any) {
      // console.log("filterval__Object", value);
      return data.filter((option: any) => {
        // console.log("option_val__Object", option);
        return option.objectHeadCodeName.toLowerCase().includes(value.toLowerCase())
      });
    }








  // Function : Reset >>>------------------->
    Reset()
    {
    window.location.reload();
  }

  trgGetObjectHeadCodelist(){
    this.ApiMethods.getservice(this.ApiService.trgGetObjectHeadCodelist+'/1/'+1).subscribe((resp:any) => {
      if (resp.result && Object.keys(resp.result).length >0) {
      this.ObjectHeadData=resp.result;
      }

    });
  }


  fetchGroupSubHead(){
    this.ApiMethods.getservice(this.ApiService.fetchGroupSubHead+'/6/'+0).subscribe((resp:any) => {
      if (resp.result && Object.keys(resp.result).length >0) {
      this.BudgetHeadData=resp.result;
       console.log("XXXX_this.BudgetHeadData", this.BudgetHeadData);
      }

    });

  }

  getDivisionlist()
  {
    //let strBudgetHead=  this.grnResultData.BudgetHead.slice(0, 4);
    let strBudgetHead="8782"; //for Testing
    this.ApiMethods.getservice(this.ApiService.getDivisionlist+'/'+this.treasuryCode+'/'+strBudgetHead).subscribe((resp:any) => {
      if (resp.result && Object.keys(resp.result).length >0) {
      this.DivisionData=resp.result;
      }
    });

  }




  // Function : GetGrnDetail >>>------------------->
GetGrnDetail(){
  this.GrnMinusEntryForm.disable();
 this.loader.setLoading(true);
let grn=this.GrnMinusEntryForm.controls.GRN.value;
this.treasuryCode=this.GrnMinusEntryForm.controls.TreasuryControl.value.TreasuryCode;
  this.ApiMethods.getservice(this.ApiService.getGrnDetails + grn + '/'+this.treasuryCode ).subscribe((resp:any) => {

    this.loader.setLoading(false);
    if (resp.result && Object.keys(resp.result).length >0) {
      this.grnResultData=resp.result;
      this.grnResultDataLength= Object.keys(this.grnResultData).length;
      this.getDivisionlist();
      console.log("grnResultData===>>>",Object.keys(this.grnResultData).length);
      this.GrnMinusEntryFormDetails.get('grossAmount').patchValue(this.grnResultData.Amount);
      this.GrnMinusEntryFormDetails.get('netAmount').patchValue(this.grnResultData.Amount);
      this.GrnMinusEntryFormDetails.get('bankName').patchValue(parseInt(this.grnResultData.Bank));
      this.GrnMinusEntryFormDetails.get('DdoName').patchValue(parseInt(this.grnResultData.DDOcode));
      //this.GrnMinusEntryFormDetails.get('DdoName').patchValue(195);
      this.GrnMinusEntryFormDetails.get('OfficeName').patchValue(this.grnResultData.OfficeId);
      this.GrnMinusEntryFormDetails.get('objectHead').patchValue(this.grnResultData.ObjectHead);
      this.GrnMinusEntryFormDetails.get('BudgetHead').patchValue(this.grnResultData.BudgetHead);
      this.GrnMinusEntryFormDetails.get('VotedCharged').patchValue(this.grnResultData.VotedCharged);
      this.GrnMinusEntryFormDetails.get('PlanNonPlan').patchValue(this.grnResultData.PlanNonPlan);
      this.GrnMinusEntryFormDetails.get('GRN').patchValue(this.grnResultData.GRN);
      this.GrnMinusEntryFormDetails.get('TreasuryCode').patchValue(this.grnResultData.TreasuryCode);
      this.GrnMinusEntryFormDetails.get('paymentMode').patchValue("0");
      this.GrnMinusEntryFormDetails.get('chequeType').patchValue("N");
      this.GrnMinusEntryFormDetails.get('AISGNG').patchValue("N");


     // alert(this.grnResultData.ChallanType.toLowerCase());
      if(this.grnResultData.ChallanType.toLowerCase()=="cc"){
        this.GrnMinusEntryFormDetails.get('Billtype').patchValue(3);


      }else{
        this.GrnMinusEntryFormDetails.get('Billtype').patchValue(0);
      }
      this.ApiMethods.getservice(this.ApiService.getHod + this.grnResultData.OfficeId ).subscribe((resp:any) => {
        this.GrnMinusEntryFormDetails.get('HODID').patchValue('');
        this.GrnMinusEntryFormDetails.get('HodName').patchValue('');

        if (resp.result && Object.keys(resp.result).length >0) {
          this.HODID=resp.result.HODID;
          this.HodName=resp.result.HodName;
          // this.GrnMinusEntryFormDetails.get('HODID').patchValue('',{disable:true});
          // this.GrnMinusEntryFormDetails.get('HodName').patchValue('',{disable:true});
            this.GrnMinusEntryFormDetails.get('HODID').patchValue(this.HODID);
           // let HodIDName = this.HODID+'-'+this.HodName;
           this.GrnMinusEntryFormDetails.get('HodName').patchValue(this.HODID+'-'+this.HodName);
           if(this.HODID>0){
            this.hodError=false;
            this.GrnMinusEntryForm.disable();
           }
        }

      })



    }else{
      this.snackbar.show('Data Not Found !', 'danger');
      this.GrnMinusEntryForm.enable();
    }
  });
}

grnMinusEntryFormSubmit(){
  // this.GrnMinusEntryFormDetails.disable();
  this.loader.setLoading(true);
  if(this.BankNameList[this.GrnMinusEntryFormDetails.controls.bankName.value].BANKNAME.toString().substring(0,3).toUpperCase() =="RBI"){
    this.snackbar.show('RBI Bank not allowed', 'danger');
    this.loader.setLoading(false);
    return;
  }

  let transformVoucherDate= this.GrnMinusEntryFormDetails.controls.VoucherDate.value;
  var datePipe = new DatePipe("en-US");
  let majorHead = this.GrnMinusEntryFormDetails.controls.BudgetHead.value.toString().substring(0,4)
  if(this.GrnMinusEntryFormDetails.controls.HODID.value>0){
  }else{
    this.snackbar.show('Head Office not mapped with this office', 'danger');
    this.loader.setLoading(false);
    return ;
  }

  let detailHeadString= this.GrnMinusEntryFormDetails.controls.BudgetHead.value.toString().substring(0,4);

  if(detailHeadString=="4000"){
    this.snackbar.show('Deatil Head Can Not be 4000', 'danger');
    this.loader.setLoading(false);
    return ;
  }

  if(this.GrnMinusEntryFormDetails.controls.grossAmount.value!=this.GrnMinusEntryFormDetails.controls.netAmount.value){
    this.snackbar.show('Gross and Cash Should Be Equal', 'danger');
    this.loader.setLoading(false);
    return ;
  }

  if(this.GrnMinusEntryFormDetails.controls.netAmount.value.toString()=="0" || this.GrnMinusEntryFormDetails.controls.netAmount.value.toString()=="0.00"){
    this.snackbar.show('Amount Can Not Be Zero', 'danger');
    this.loader.setLoading(false);
    return ;
  }

  if(this.GrnMinusEntryFormDetails.controls.OfficeName.value>0){

  }else{
    this.snackbar.show('OfficeID Not Found', 'danger');
    this.loader.setLoading(false);
    return ;

  }




  let dataPost={
    "treasCode": this.GrnMinusEntryFormDetails.controls.TreasuryCode.value,
    "date": datePipe.transform(transformVoucherDate, 'yyyy-MM-dd'),
    "flag": null,
    "ddocode": this.GrnMinusEntryFormDetails.controls.DdoName.value,
    "officeId": this.GrnMinusEntryFormDetails.controls.OfficeName.value,
    "objectHead": this.GrnMinusEntryFormDetails.controls.objectHead.value,
    "transType": 3,
    "majorHead": majorHead,
    "detailHead": this.GrnMinusEntryFormDetails.controls.BudgetHead.value,
    "divCode":this.GrnMinusEntryFormDetails.controls.DivCode.value,
    "billSubType": 0,
    "pd_AcNo": 0,
    "votedCh": this.GrnMinusEntryFormDetails.controls.VotedCharged.value,
    "pnp": this.GrnMinusEntryFormDetails.controls.PlanNonPlan.value,
    "type": 0,
    "finYear": this.Helper.finyear,
     "treasuryRefNo":"",
     "grn": this.GrnMinusEntryFormDetails.controls.GRN.value,
    "tokenNo": 0,
    "finYearFrom":this.Helper.currentYear,
    "bankCode": this.GrnMinusEntryFormDetails.controls.bankName.value,
    "grossAmount": this.GrnMinusEntryFormDetails.controls.grossAmount.value,
    "netAmount": this.GrnMinusEntryFormDetails.controls.netAmount.value,
    "billType": this.GrnMinusEntryFormDetails.controls.Billtype.value,
  //  "payMode": this.GrnMinusEntryFormDetails.controls.paymentMode.value,
    "payMode": 0,
    "payType": this.GrnMinusEntryFormDetails.controls.chequeType.value,
    "aisGng": 0,
    "cdeRefNo": 0,
    "ddoBillNo": 0,
    "userId": this.Helper.UserId,
    "asignmentId": this.Helper.assignmentId,
    "checkNo":this.GrnMinusEntryFormDetails.controls.chequeNo.value,

    "chequeDate": datePipe.transform(transformVoucherDate, 'yyyy-MM-dd'),
    "auditDate": datePipe.transform(transformVoucherDate, 'yyyy-MM-dd'),
    "ecsNonEcs":"",
    "partyName":"",
    "ddoBillMonth":"",
    "ddoBillYear":"",
    "oldBillCode":0,
    "voucherDate": datePipe.transform(transformVoucherDate, 'yyyy-MM-dd'),
    "voucherChequeNo":"",
    "moreHead":"",
    "headGross":this.GrnMinusEntryFormDetails.controls.netAmount.value,
    "tokenfinyear":this.Helper.finyear,
    "hod":this.GrnMinusEntryFormDetails.controls.HODID.value,
    "demandNo":0,
    "tokenRefNo": 0,
    //"ddoBillDate":  datePipe.transform(transformVoucherDate, 'yyyy-MM-dd'),
    "deptRefNo": "",
    "deptCode": 0,
    "bcoCode": 0,
    "toFlag":null,
     "ty": "",
    "teReference": 0,
    "chequeCancelDate":  datePipe.transform(transformVoucherDate, 'yyyy-MM-dd'),

}
  this.ApiMethods.postresultservice(this.ApiService.grnSave,dataPost ).subscribe((resp:any) => {
    this.loader.setLoading(false);
    let ResultData= resp.result;
    this.ResultData=ResultData;
    if(resp.result &&  Object.keys(resp.result).length >0){
      this.checkResultStatus();
    }else{
      this.snackbar.show('Grn has not share in Scroll File  !', 'danger');
      // resp.result.error.forEach((element: string)=> {
      //   this.snackbar.show(element, 'danger');
      // });
    }
  },
  (res:any) => {
    if (res.status == 400) {
      this.ResultData=res.error.result;
      console.log("ResultData400==>>", this.ResultData);

      this.loader.setLoading(false);
      this.checkResultStatus();
      //this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');


    }

    //console.log("errror message___", res.status);
    if (res.status != 200) {
      this.loader.setLoading(false);
      //this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
    }
  }
  );

}


checkResultStatus() {

  console.log("ResultData==>>",this.ResultData);

  this.dialog.open(CommonDialogComponent,
    {
      panelClass: 'dialog-w-50', autoFocus: false
      ,
      height: "auto",
      width: "40%",
      data: {
        message: "Check update Message",
        // field: field,
        result_info: this.ResultData,
        id: 'CheckResponceData',
        // btnText: btnText
      }
    }
  );
}


  get GRN() { return this.GrnMinusEntryForm.get('GRN') }

}
