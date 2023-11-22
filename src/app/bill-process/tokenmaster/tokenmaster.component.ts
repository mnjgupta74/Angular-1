import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { Router } from '@angular/router';
import { IPayManagerSAVE, IBudgetSAVE } from 'src/app/utils/Master';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { findIndex, map, startWith } from 'rxjs/operators';
import { Helper } from 'src/app/utils/Helper';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-tokenmaster',
  templateUrl: './tokenmaster.component.html',
  styleUrls: ['./tokenmaster.component.scss']
})
export class TOKENMASTERComponent implements OnInit {

  finYr: any;
  treasury: any;


  SavePayManagerModal: IPayManagerSAVE = {
    treasuryCode: this.Tcode.Treasury_Code,
    fromFinYear: this.finyear_.year.toString(),
    toFinYear: this.toyear_.finyear.toString(),
    userId: this.usercode_.UserId,
    //userId: sessionStorage.getItem('rajkoshId'),
    cdeRefNo: 0,
    ipaddress: '',
    asignmentId: this.asgnId.assignmentId
  }


  SaveBudgetModal: IBudgetSAVE = {
    treasuryCode: this.Tcode.Treasury_Code,
    fromFinYear: this.finyear_.year.toString(),
    toFinYear: this.toyear_.finyear.toString(),
    userId: this.usercode_.UserId,
   // userId: sessionStorage.getItem('rajkoshId'),
    cdeRefNo: 0,
    ipaddress: '',
    ddoCode: 0,
    cashAmt: 0,
    grossAmt: 0,
    majorHead: 0,
    asignmentId: this.asgnId.assignmentId
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

  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  PayinputForm: boolean = false;

  SelectBilltype: any = ''
  SelectMajorHead: any = ''
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  display: boolean = true
  mat_radio_1: boolean = true
  mat_radio_2: boolean = false
  indisplay: boolean = true
  pay_radio: boolean = true


  // Form Module
  tokenofflineForm: any;
  tokenonlineForm: any;
  BillTypeoptions: Observable<any[]> | undefined;
  MajorHeadoptions: Observable<any[]> | undefined;
  treasuryform:any;
  base64data:any;
  //Flags
  loginflag: boolean = true;
IP:any;
  //LIst array
  BillTypeListarr: any = []
  MajorHeadListarr: any = []


  constructor(private sanitizer: DomSanitizer,public dialog: MatDialog, private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private usercode_: Helper, private Fyear_: Helper, private asgnId: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    this.getBillTypeList()  // Call Bill Type List
    this.getMajorHeadList()  // Call Major Head List
    this.IP= this.ApiMethods.clientIP;
  }

  radioButtonGroupChange(event: any) {
    console.log("evnenrt______", event.value);
    this.display = !this.display
    if (event.value == 1) {
      this.mat_radio_1 = true
      this.mat_radio_2 = false
      this.tokenofflineForm.reset();
      this.tokenofflineForm.controls['Date'].setValue(this.datepicker)
      this.tokenonlineForm.reset();
      this.tokenonlineForm.controls['Date'].setValue(this.datepicker)
      this.PayinputForm = false;
    }
    else {
      this.mat_radio_2 = true
      this.mat_radio_1 = false
      this.tokenofflineForm.reset();
      this.tokenofflineForm.controls['Date'].setValue(this.datepicker)
      this.tokenonlineForm.reset();
      this.tokenonlineForm.controls['Date'].setValue(this.datepicker)
      this.PayinputForm = false;

    }
  }
  radioinnerGroupChange(event: any) {
    console.log(event.value);
    this.indisplay = !this.indisplay
    if (event.value == 1) {
      this.pay_radio = true

    }
    else {
      this.pay_radio = false

    }
  }

  ngOnChanges() {
    alert('ngonchagnes call')
    console.log("ng on change callll");

  }

  ngOnInit() {
    this.finYr = this.finyear_.forwardYear.toString();
    this.treasury = this.SavePayManagerModal.treasuryCode;
    console.log("treasury--", this.treasury)
    this.getTreasuryList();
    //offline form Group 
    this.tokenofflineForm = new FormGroup({
      finyear: new FormControl({ value:this.finYr, disabled: true }),
      Date: new FormControl({ value: this.datepicker, disabled: true }),
      DdoCode: new FormControl('', [Val.Required, Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      DdoName: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(40), Val.SpecialChar]),
      BillType: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      MajorHead: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      NetAmt: new FormControl('', [Val.Required, Val.maxLength(14), Val.SpecialChar, Val.Numeric]),
      GrossAmt: new FormControl('', [Val.Required, Val.maxLength(14), Val.SpecialChar, Val.Numeric]),
      // BillTypeControl: new FormControl(''),
      BillTypeControl: new FormControl('', { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required, Validators.maxLength(40)] }),
      // MajorHeadControl: new FormControl(''),
     // TreasuryControl: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      MajorHeadControl: new FormControl('', { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required, Validators.maxLength(40)] }),
    });

    //onineline form Group 
    this.tokenonlineForm = new FormGroup({
      finyear: new FormControl({ value:this.finYr, disabled: true }),
      Date: new FormControl({ value: this.datepicker, disabled: true }),
      payRef: new FormControl('', [Val.maxLength(20), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      BudgetRef: new FormControl({ value: '', disabled: true }, [Val.maxLength(40), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      NDdoCode: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      NDdoName: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(40), Val.SpecialChar]),
      NBillType: new FormControl({ value: '', disabled: true }),
      NMajorHead: new FormControl({ value: '', disabled: true }),
      NNetAmt: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
      NGrossAmt: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
     // TreasuryControl: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    })
    this.treasuryform =new FormGroup({
      finyear: new FormControl({ value:this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
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
         this.Treasuryoptions = this.treasuryform.controls['treasuryval'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {
              return treasury ? this._filtertreasury(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
         this.treasuryform.patchValue({
          treasuryval: treasury
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


  onSearch() {
    let payRef = this.tokenonlineForm.controls['payRef'].value;
    console.log("payRef", payRef);
    if (payRef == '' || payRef == null) {
      this.snackbar.show('Please Enter CDE Ref. No.!', 'alert')
      this.PayinputForm = false
    }
    // else if( billtype == null || billtype==undefined){
    //   this.snackbar.show(' billtype Not matched', 'alert')
    // }
    else {
      this.loader.setLoading(true);
     //api call of get token reference list
      this.ApiMethods.getservice(this.ApiService.PayManagerRef + this.Tcode.Treasury_Code + '/' + payRef).subscribe((resp:any) => {
        console.log("After_API_Search_Result__", resp);
        if (Object.keys(resp.result).length > 0) {
          //console.log(resp.result);
          let data = resp.result
          console.log("after api data__", data)
          let resultMessageArr: any = [];
          data.forEach((resultArr: any) => {
            if (resultArr.Message != undefined && resultArr.Message != null) {
              resultMessageArr.push(resultArr.Message);
            }
          });
    
          let b= data.find((i:any)=>i.out_err_msg==0)
          //  if (data[1].out_err_msg == "0") {
           if (b) {
            // data.forEach((element: any) => {
             const fbilltype = this.BillTypeListarr.filter((x:any) => x.BillType == data[0].BillType)[0];
            //  console.log("elementbilltype___",data[0].BillType)
             console.log("elementbilltype___",fbilltype)
             // console.log("BillType__", fbilltype.BillType)
              this.loader.setLoading(false);
              if(fbilltype){
                this.tokenonlineForm.patchValue({
                  Date: this.datepicker,
                  NDdoCode: data[0].ddoCode,
                  NDdoName: data[0].officename,
                  NBillType:fbilltype.BillType,
                 //NBillType:data[0].BillType,
                  NMajorHead: data[0].budgethead,
                  NNetAmt: data[0].cashAmoumt,
                  NGrossAmt: data[0].grossAmount
                 })
                 this.PayinputForm = true;
                 this.loader.setLoading(false);
              }
              else {
                this.loader.setLoading(false);
                this.snackbar.show('Bill Type Not Found!', 'alert')
                this.PayinputForm = false
              }
           // })
           
          }
          else if (data.out_err_msg != 0) {
            this.snackbar.show(JSON.stringify(resultMessageArr).substring(1, JSON.stringify(resultMessageArr).length - 1), 'danger')
            this.loader.setLoading(false);
            this.PayinputForm = false
            console.log("data____vinay--------",data.out_err_msg)
          }
        }
        else {
          this.snackbar.show('No Data Found!', 'alert')
          this.loader.setLoading(false);
        }

      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
            this.PayinputForm = false
          }
        }
      );
    }
  }

  onPayManagerSave() {
    let payRef = this.tokenonlineForm.controls['payRef'].value;
    console.log("data__onupadate", payRef);
    if (payRef) {
      console.log("Paymangatesaveeee___", this.SavePayManagerModal);
      this.SavePayManagerModal.cdeRefNo = this.tokenonlineForm.controls['payRef'].value;  //  "deptType" (14)
      this.SavePayManagerModal.ipaddress = this.IP
      let billtype = this.tokenonlineForm.controls['NBillType'].value;  //Gross Amount controller
      let Netamount = this.tokenonlineForm.controls['NNetAmt'].value;  //Net Amount controller
      let Grossamount = this.tokenonlineForm.controls['NGrossAmt'].value;  //Gross Amount controller
      let DDOname = this.tokenonlineForm.controls['NDdoName'].value;
      let DDocode = this.tokenonlineForm.controls['NDdoCode'].value;
      let BudgetHead = this.tokenonlineForm.controls['NMajorHead'].value;
      console.log("aftervalue___", this.SavePayManagerModal);


      // stop here if form is invalid
      if (this.tokenonlineForm.invalid) {
        console.log('Error');
        return;
      }
      // else if (JSON.parse() > JSON.parse(Grossamount)) {
      else if (Number(Netamount) > Number(Grossamount)) {
        console.log("netttttt___", Netamount,);
        console.log("grGrossAmountoss", Grossamount);
        console.log("netammount");
        this.snackbar.show('Net amount cannot be greater than GrossAmount amount', 'alert')
      }
      else if (billtype == 20 && Netamount != 0) {
        this.snackbar.show('Net amount should be 0 when billtype is 20', 'alert')
      }

      else if (DDOname == null || DDocode == null) {
        this.snackbar.show('DDO Not Found', 'alert')
      }
      else if (Netamount == null || Grossamount == null) {
        this.snackbar.show('NetAmount or GrossAmount Not Found', 'alert')
      }
      else if (BudgetHead == null ) {
        this.snackbar.show('BudgetHead Not Found', 'alert')
      }
      else if( billtype == null || billtype==undefined){
        this.snackbar.show('Billtype Not matched', 'alert')
      }
      else {

        if (this.loginflag && this.tokenonlineForm.valid) {
          console.log("Before_API_Save_Result", this.SavePayManagerModal);
          this.loader.setLoading(true);

          // Office id verify api call
          this.ApiMethods.postresultservice(this.ApiService.SavePayManager, this.SavePayManagerModal).subscribe((resp:any) => {

            console.log("office_verify___", resp.result);
            
            let data = resp.result[0]
            console.log("dataval___", data)
            if (data.str == 1) {
              console.log("data", data.NewTokenNo);
              this.snackbar.show(' TOKEN NUMBER :' + '\n' + this.Tcode.Treasury_Code + '-' + this.Fyear_.forwardYear + '-' + data.NewTokenNo.toString() + '\n' + "Generated Successfully", 'success')
              this.loader.setLoading(false);
              this.tokenonlineForm.reset();
              this.display = true
              this.mat_radio_1 = true
              this.mat_radio_2 = false
              this.indisplay = true
              this.PayinputForm = false
              this.SHOWPDF(data.NewTokenNo, this.Tcode.Treasury_Code, this.Fyear_.forwardYear);
              // this.OnShowData(data.NewTokenNo);
             // this.GetViewBillDetail(data.NewTokenNo, this.Tcode.Treasury_Code, this.Fyear_.forwardYear);
              console.log("newetoken", data.NewTokenNo)
            }
            else if (data.Status == -9) {
              this.snackbar.show('Reference Number Is Used For Token No' + "-" + data.NewTokenNo.toString(), 'alert')
              this.loader.setLoading(false);
            }
            else if (data.str == 2) {
              this.snackbar.show(data.out_err_msg, 'alert')
              this.loader.setLoading(false);
            }
},
            (res:any) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')

              }
            })
        }
        else {
          alert('Captcha Failed');
          this.loader.setLoading(false);
        }
      }
    }
  }

  displayFn(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.BillType : undefined;
  }

  //get Bill type list api call
  getBillTypeList() {
    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
      console.log("Treasury__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.BillTypeListarr = resp.result
      }
      console.log("treasury_inbetween", this.BillTypeListarr);
      this.BillTypeoptions = this.tokenofflineForm.controls['BillTypeControl']
        .valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.BillTypeListarr
          }),
          map((BillType: any) => {
            console.log("second__map", BillType);

            return BillType ? this._filter(BillType, data) : data.slice()
          })
        );

    })

  }

  _filter(value: string, data: any) {

    return data.filter((option: any) => {
      return option.BillType.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayMajor(selectedoption: any) {
    console.log("displayfuncall");
   // let displayResult: any = selectedoption.majorheadcode + "-" + selectedoption.majorheadname
    return selectedoption ? selectedoption.majorheadname : undefined;
  }

  //get Major Head list api call
  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.MajorHeadList + 0).subscribe((resp:any) => {
      console.log("MajorHeadList__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.MajorHeadListarr = resp.result
      }
      console.log("MajorHeadList_inbetween", this.MajorHeadListarr);
      this.MajorHeadoptions = this.tokenofflineForm.controls['MajorHeadControl']
        .valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.MajorHeadListarr
          }),
          map((majorheadcode: any) => {
            console.log("second__map", majorheadcode);
            return majorheadcode ? this._filterMajor(majorheadcode, data) : data.slice()
          })
        );
    })
  }



  _filterMajor(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.majorheadcode.toLowerCase().includes(value.toLowerCase())
    });
  }

  SearchFn(selected: any) {
    console.log("searchfuncall");
    return selected ? selected.ddo_code : undefined;
  }

  OnBillTypeSelected(SelectBilltype: any) {
    console.log("befort______SelectBilltype", SelectBilltype);
    console.log("slelction__________option_____________", this.SelectBilltype);
    this.SaveBudgetModal.cdeRefNo = this.SelectBilltype.Ncode
    this.selectChangesBilltype(SelectBilltype);
  }

  OnMajorHeadSelected(SelectMajorHead: any) {
    console.log("befort______SelectMajorHead", SelectMajorHead);
    console.log("slelction__________option__majorhead", this.SelectMajorHead);
    this.SaveBudgetModal.majorHead = this.SelectMajorHead.majorheadcode;
    //console.log("SaveBudgetModal==>>",this.SaveBudgetModal);
  }

  Search_filter(value: string, data: any) {
    // console.log("filterval__search", value, data);
    return data.filter((option: any) => {
      // console.log("option_val__search", option);
      return option.ddo_code.toString().includes(value.toString())
    });
  }


  onReset() {
    this.tokenofflineForm.reset();
    this.display = true
    this.mat_radio_1 = true
    this.mat_radio_2 = false
    this.indisplay = true
    this.pay_radio = true
    this.PayinputForm = false
  }

  OnSaveOffline() {
    let majorheadcode = this.tokenofflineForm.controls.MajorHeadControl.value.majorheadcode;
    let majorheadname = this.tokenofflineForm.controls.MajorHeadControl.value.majorheadname;
    let BillTypeControl = this.tokenofflineForm.controls.BillTypeControl.value.BillType;
    console.log("majorheadname__", majorheadname)
    if (BillTypeControl == undefined || BillTypeControl == null) {
      this.snackbar.show('Please Select valid Bill Type!', 'alert');
      this.tokenofflineForm.controls.MajorHeadControl.value = ''
      return;
    }
    if (majorheadcode == undefined || majorheadcode == null && majorheadname != undefined) {
      this.tokenofflineForm.controls.MajorHeadControl.value = ''
      this.snackbar.show('Please Select valid Major Head!', 'alert');
      return;
    }

    //console.log("tokenofflineForm", );
    //return

    console.log("Save_Else_Part", this.SaveBudgetModal);
    console.log("billtpeee_________", this.SaveBudgetModal.cdeRefNo, this.SelectBilltype);
    this.SaveBudgetModal.ddoCode = this.tokenofflineForm.controls['DdoCode'].value;  //DdoCode controller
    this.SaveBudgetModal.cashAmt = this.tokenofflineForm.controls['NetAmt'].value;  //Net Amount controller
    this.SaveBudgetModal.grossAmt = this.tokenofflineForm.controls['GrossAmt'].value;  //Gross Amount controller
    this.SaveBudgetModal.ipaddress =this.IP
    console.log("aftervalue___", this.SaveBudgetModal);


    // stop here if form is invalid
    if (this.tokenofflineForm.invalid) {
      console.log('Error');
      return;
    }
    else if (!this.SelectBilltype || this.SaveBudgetModal.cdeRefNo <= 0) {
      //  this.toastrService.error('Please Select Bill Type!', 'Alert!');
      this.snackbar.show('Please Select Bill Type!', 'alert')
    }
    else if (!this.SelectMajorHead || this.SaveBudgetModal.majorHead <= 0) {
      this.snackbar.show('Please Select Major Head!', 'alert')
    }
    else if (this.SaveBudgetModal.cdeRefNo == 20 && this.SaveBudgetModal.cashAmt != 0) {
      console.log("trffff");
      this.snackbar.show('Net amount should be 0 when billtype is 20', 'alert')
    }
    else if (Number(this.SaveBudgetModal.cashAmt) > Number(this.SaveBudgetModal.grossAmt)) {
      console.log("trueeeeee");

      this.snackbar.show('Net amount cannot be greater than gross amount', 'alert')
    }
     else if(this.SaveBudgetModal.grossAmt==0){
       this.snackbar.show('Gross amount should not be zero', 'alert')
     }
    else {

      if (this.loginflag && this.tokenofflineForm.valid) {
        console.log("Before_API_Save_Result", this.SaveBudgetModal);
        this.loader.setLoading(true);

        // Office id verify api call
        this.ApiMethods.postresultservice(this.ApiService.SaveTokenOffline, this.SaveBudgetModal).subscribe((resp:any) => {

          console.log("office_verify___", resp.result);
          let data = resp.result[0]
          if (data.str == 1) {
            console.log("test", data.v_NewTokenNo);
            // this.snackbar.show('TOKEN NUMBER : ' + this.Tcode.Treasury_Code + '-' + this.Fyear_.forwardYear + "- " + data.v_NewTokenNo.toString() + '\n' + "Generated Successfully", 'success')
            //const  snackBarRef=this.snackbar.openSnackBar();
            // console.log("snackbar vale",snackBarRef)
            this.loader.setLoading(false);
            this.tokenofflineForm.reset();
            this.display = true
            this.mat_radio_1 = true
            this.mat_radio_2 = false
            this.indisplay = true
            this.PayinputForm = false
            this.pay_radio = true
            this.SaveBudgetModal.treasuryCode = this.Tcode.Treasury_Code
            this.SaveBudgetModal.fromFinYear = this.finyear_.year.toString()
            this.SaveBudgetModal.toFinYear = this.toyear_.finyear.toString()
            this.SaveBudgetModal.userId = this.usercode_.UserId
            this.SaveBudgetModal.cdeRefNo = 0
            this.SaveBudgetModal.ipaddress = ''
            this.SaveBudgetModal.ddoCode = 0
            this.SaveBudgetModal.cashAmt = 0
            this.SaveBudgetModal.grossAmt = 0
            this.SaveBudgetModal.majorHead = 0
            this.SHOWPDF(data.v_NewTokenNo, this.Tcode.Treasury_Code, this.Fyear_.forwardYear);
            // this.showmodal(data.v_NewTokenNo);
           // this.GetViewBillDetail(data.v_NewTokenNo, this.Tcode.Treasury_Code, this.Fyear_.forwardYear);
            //   snackBarRef.afterDismissed().subscribe((info: { dismissedByAction: boolean; }) => {
            //    if (info.dismissedByAction === true) {
            //     this.GetViewBillDetail(data.v_NewTokenNo); // your code for handling this goes here
            //   }
            //  });
            console.log("newetoken", data.v_NewTokenNo)
          }
          else if (data.str == -9) {
            this.snackbar.show('Reference Number Is Used For Token No (' + data.v_NewTokenNo.toString() + ')', 'alert')
            this.loader.setLoading(false);
          }
          else if (data.str == 2) {
            this.snackbar.show(data.out_err_msg, 'alert')
            this.loader.setLoading(false);
          }
        },
          (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
            }
          })
      }
      else {
        alert('Captcha Failed');
        this.loader.setLoading(false);
      }
    }


  }
  //  GetViewBillDetail(NewToken: any, treasury: any, finyear: any) {

  //   const dialogRef = this.dialog.open(CommonDialogComponent,
  //     {
  //       panelClass: 'dialog-w-50', autoFocus: false
  //       ,
  //       height: "100%",
  //       width: "50%",
  //       data: {
  //         //field: field,
  //         id: 'TokenReceipt',
  //         //btnText: btnText
  //         // reasonBillCode:billcode
  //       }
  //     }
  //   );
  //   dialogRef.componentInstance.OnShowData(NewToken, treasury, finyear);

  // }

  onFocusOutEvent(event: any) {
    console.log("onfouncsvaluuu", event.target.value);
    const text = event.target.value
    if (text) {
      this.loader.setLoading(true);

      // api call for Verify DDO Code
      this.ApiMethods.getservice(this.ApiService.Verify_DDO_Code + event.target.value).subscribe((resp:any) => {
        console.log("verifyddocode__res", resp.result);
        let respp = resp.result
        if (respp.count != 0) {
          // api call for get DDO Name
          this.ApiMethods.getservice(this.ApiService.GetDDOName + event.target.value + '/' + this.Tcode.Treasury_Code).subscribe((resp:any) => {
          //  let data = resp.result[0];
         let data = resp.result
            console.log("DDOName__res", data);
           // if (resp.result.length > 0) {
           if( Object.keys(resp.result).length > 0){
             // console.log("DDOName__res", data);
                this.loader.setLoading(false);
              this.tokenofflineForm.controls['DdoName'].setValue(data.OfficeName)
            }
            else {
               this.loader.setLoading(false);
              this.tokenofflineForm.controls['DdoCode'].setValue('')
              this.tokenofflineForm.controls['DdoName'].setValue('')
              this.snackbar.show('DDO Code Not Found', 'alert')
            }
          },
            (res:any) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
              }
            })

        }
        else {
          this.snackbar.show('Please enter valid ddo code', 'alert')
          this.loader.setLoading(false);
        }
      },
      
      (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        })
    }
  }
  selectChangesBilltype(SelectBilltype: any) {
    this.tokenofflineForm.controls['MajorHeadControl'].setValue('')
    console.log("SelectBilltype==>>", SelectBilltype);
    this.ApiMethods.getservice(this.ApiService.MajorHeadList + SelectBilltype.Ncode).subscribe((resp:any) => {
      //this.ApiMethods.getservice(this.ApiService.MajorHeadList + '/' +23).subscribe((resp:any) => {
      console.log("MajorHeadListsBilltype__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.MajorHeadListarr = resp.result
      }
      console.log("MajorHeadList_inbetween", this.MajorHeadListarr);

      // const majorselectcode = this.MajorHeadListarr.filter((item: any) => item.majorheadcode === item.majorheadcode)[0];
      //console.log("afadsfnbetween", majorselectcode);
      // this.tokenofflineForm.patchValue({
      //   MajorHeadControl: majorselectcode
      // })

      this.MajorHeadoptions = this.tokenofflineForm.controls['MajorHeadControl']
        .valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__", value);
            return typeof value === 'string' ? value : value.MajorHeadListarr
          }),
          map((majorheadname: any) => {
            // console.log("second__map", majorheadname);

            return majorheadname ? this._filterMajor(majorheadname, data) : data.slice()
          })
        );
    })
  };


  SHOWPDF(Token: any, tCode: any, fYear: any) {
    let NEWTOKEN = Token;
    this.TokenReceiptList.params[1].value = this.Tcode.Treasury_Code
    this.TokenReceiptList.params[2].value = this.finyear_.year.toString()
    this.TokenReceiptList.params[3].value = NEWTOKEN
    this.snackbar.show('TOKEN NUMBER : ' + tCode + '-' + fYear + "- " + Token.toString() + '\n' + "Generated Successfully", 'success')
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
        let w = window.open('about:blank', 'mywindow', "width=690, height=900");
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
          this.snackbar.show('Something Went Wrong ! Please Try Again !', 'danger')
          this.loader.setLoading(false);
        }
      }
    );
  }
  
  get DdoCode() { return this.tokenofflineForm.get('DdoCode') }
  get DdoName() { return this.tokenofflineForm.get('DdoName') }
  get BillType() { return this.tokenofflineForm.get('BillType') }
  get MajorHead() { return this.tokenofflineForm.get('MajorHead') }
  get NetAmt() { return this.tokenofflineForm.get('NetAmt') }
  get GrossAmt() { return this.tokenofflineForm.get('GrossAmt') }
  get payRef() { return this.tokenonlineForm.get('payRef') }
  get NDdoCode() { return this.tokenonlineForm.get('NDdoCode') }
  get NDdoName() { return this.tokenonlineForm.get('NDdoName') }
  get NBillType() { return this.tokenonlineForm.get('NBillType') }
  get NMajorHead() { return this.tokenonlineForm.get('NMajorHead') }
  get NNetAmt() { return this.tokenonlineForm.get('NNetAmt') }
  get NGrossAmt() { return this.tokenonlineForm.get('NGrossAmt') }

}
