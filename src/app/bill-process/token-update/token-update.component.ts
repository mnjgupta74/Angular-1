import { Component, OnInit, ViewChild } from '@angular/core';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { Observable, map, startWith } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { IGetAllTokenModel, ITokenDeleteUpdate, ITokenDeleteview, ITokenUpdate, IfetchTokenEdit } from 'src/app/utils/Master';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { MatDialog } from '@angular/material/dialog';

export interface tokenreferencelist {
  BillType: string;
  TokenNo: number;
  DDO: number;
  MajorHead: number;
  CashAmt: number;
  GrossAmt: number;
  cde_RefNo: number
}

@Component({
  selector: 'app-token-update',
  templateUrl: './token-update.component.html',
  styleUrls: ['./token-update.component.scss']
})


export class TokenUpdateComponent implements OnInit {
[x: string]: any;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  //  @ViewChild(MatSort) Sort!: MatSort;


  tokenRefListarr: MatTableDataSource<tokenreferencelist> = new MatTableDataSource();
  // tokenRefListarr: MatTableDataSource<any> = new MatTableDataSource();
  // tokendeleteARR: MatTableDataSource<tokenreferencelist> = new MatTableDataSource();

  displayedColumns = ['SrNo', 'TokenNo', 'CDE_RefNo', 'DDOCode', 'MajorHead', 'GrossAmt', 'CashAmt', 'BillType', 'Action']
   displayColumn = ['SrNo', 'TokenNo','CDE_RefNo', 'DdoCode', 'MajorHead', 'GrossAmt', 'CashAmt', 'Billtype','Action']

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.tokenRefListarr.sort = sort;
    // this.tokendeleteARR.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.tokenRefListarr.paginator = paginator;
    // this.tokendeleteARR.paginator = paginator;
  }




  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  SelectBilltype: any = ''
  SelectMajorHead: any = ''
  finYr: any;
  treasury: any;
  radioButtonvalue: any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  //Flags
  loginflag: boolean = true;

  display: boolean = false
  indisplay: boolean = false
  mat_radio_1: boolean = false
  mat_radio_2: boolean = false
  Payment_radio: boolean = true
  Reference_radio: boolean = false

  //forms
  tokenDetailsForm: any
  tokenDeleteForm: any
  tokenEditForm: any
  treasuryform:any

  //LIst array
  BillTypeoptions: Observable<any[]> | undefined;
  // tokenRefListarr: any[] = []
  //  tokendeleteARR: any[] = []
  BillTypeListarr: any = []
  MajorHeadListarr: any = []
  MajorHeadoptions: Observable<any[]> | undefined;
  tokenRefArray: any = [];
  tokenEditData: any;

  //flags
  showtrantab: boolean = false
  showtab: boolean = false
  showeditForm: boolean = false
  itemArray: any;
  resplist: Array<any> = []

  //model
  GetTokenListModel: IGetAllTokenModel = {
    treasuryCode: this.Tcode.Treasury_Code,
    // fromFinYear: this.finyear_.year.toString(),
    // toFinYear: this.toyear_.finyear.toString(),
    tokenfinYear: this.fy_.forwardYear.toString(),
    mode: null,
    modeValue: null,
    fromDate: "",
    toDate: ""
  }

  GetTokenFetchEDitModel: IfetchTokenEdit = {
    treasurycode: this.Tcode.Treasury_Code,
    fromFinYr: this.finyear_.year.toString(),
    toFinYr: this.toyear_.finyear.toString(),
    type: 1,
    tokenNo: 0,
  }

  GetUpdateTokenModel: ITokenUpdate = {
    oldtokenNo: 0,
    userId: this.usercode_.UserId,
    ddoCode: 0,
    treasuryCode: this.Tcode.Treasury_Code,
    majorHead: "",
    billType: 0,
    cashAmt: 0,
    grossAmt: 0,
  }

  GetTokenDeleteModel: ITokenDeleteview = {
    treasurycode: this.Tcode.Treasury_Code,
    fromDate: this.finyear_.year.toString(),
    toDate: this.toyear_.finyear.toString(),
    billFlag: "P",
    tokenNo: 0,
    finyear: this.fy_.forwardYear.toString(),
  }

  GetTokenDeleteupdateModel: ITokenDeleteUpdate = {
    treasurycode: this.Tcode.Treasury_Code,
    billFlag: "P",
    tokenNo: 0,
    finyear: this.fy_.forwardYear.toString(),
    treasRefNo:0,
  }

  constructor(public dialog: MatDialog,private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private usercode_: Helper, private Fyear_: Helper, private asgnId: Helper, private fy_: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.getBillTypeList()  // Call Bill Type List
    this.getMajorHeadList()  // Call Major Head List

  }
  radioButtonGroupChange(event: any) {
    console.log("evnenrt______", event.value);
    this.display = !this.display
    if (event.value == 1) {
      console.log("event__", event.value)
      this.mat_radio_1 = true
      this.mat_radio_2 = false
      this.showtab = false
      this.showeditForm = false;
       this.tokenDeleteForm.reset();
      this.showtrantab = false
      this.indisplay = false
      this.display = true;
      // window.location.reload();
    }

    else {
      this.mat_radio_2 = true
      this.mat_radio_1 = false
      this.tokenEditForm.reset();
      this.tokenDetailsForm.reset();
      // window.location.reload();
      this.showtrantab = false
      this.indisplay = true
      this.display = false;
      this.showtab = false
      this.showeditForm = false;
    }
  }
  radioButtonGroup(event: any) {
    if (event.value == 1) {
      this.radioButtonvalue = "P"
    }
    else {
      this.radioButtonvalue = "R"
    }
    this.GetTokenDeleteupdateModel.billFlag = this.radioButtonvalue;
    this.GetTokenDeleteModel.billFlag = this.radioButtonvalue;

  }




  ngOnInit(): void {
    this.finYr = this.finyear_.forwardYear.toString();
   // this.treasury = this.GetTokenDeleteModel.treasurycode;
   // console.log("treasury--", this.treasury)
    this.getTreasuryList();
    this.tokenEditForm = new FormGroup({
      Date: new FormControl({ value: this.datepicker, disabled: true }),
      DdoCode: new FormControl('', [Val.Required, Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      DdoName: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(40), Val.SpecialChar]),
     // BillType: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
     // MajorHead: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      NetAmt: new FormControl('', [Val.Required, Val.maxLength(14), Val.SpecialChar, Val.Numeric]),
      GrossAmt: new FormControl('', [Val.Required, Val.maxLength(14), Val.SpecialChar, Val.Numeric]),
      TokenNo: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
      Receipt: new FormControl({ value: '', disabled: true }),
      BillTypeControl: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required,Validators.maxLength(40)] }),
      MajorHeadControl: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required,Validators.maxLength(40)] }),
     // TreasuryControl: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
     //  BillTypeControl: new FormControl(''),
     //  MajorHeadControl: new FormControl(''),
    });

    this.tokenDeleteForm = new FormGroup({
      Treasury: new FormControl({ value: this.GetTokenDeleteModel.treasurycode, disabled: true }),
      Year: new FormControl({ value: this.finYr, disabled: true }),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      tokenNo: new FormControl('', [Val.maxLength(10), Val.SpecialChar, Val.Numeric]),
   //  TreasuryControl: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    });
    this.tokenDetailsForm = new FormGroup({
     toDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required, Val.maxLength(12)]),
    //fromDate:new FormControl({}),
    //toDate:new FormControl({}),
    // BillTypeControl: new FormControl(''),
    // BillTypeControl: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required,Validators.maxLength(40)] }),
      searchField: new FormControl(''),
      searchValue: new FormControl('', [Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
    //  TreasuryControl: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
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

  //  onreset(){
  //   window.location.reload();
  //  }
 

   
  onReset() {
    this.tokenEditForm.reset();
   //  this.tokenDetailsForm.reset();
   //this.tokenEditForm.reset();
     this.tokenDeleteForm.reset();
    this.mat_radio_2 = false
    this.mat_radio_1 = true
    this.showeditForm = false;
    this.showtrantab=false;
    this.indisplay=false;
   this.display = true
   this.showtab = false
    // window.location.reload();
  }
  onreset(){
    window.location.reload() 
  }


  Filter(filterValue: string) {
    this.tokenRefListarr.filter = filterValue.trim().toLowerCase();
    if (this.tokenRefListarr.paginator) {
      this.tokenRefListarr.paginator.firstPage();
      console.log("ghiff", this.tokenRefListarr.paginator.firstPage())
      console.log("tokenref", this.tokenRefListarr.filter)  
   }
  }

  GetTokenLIst() {
    this.tokenRefListarr.filter = '';
    let Date1 = this.tokenDetailsForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.tokenDetailsForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    //this.tokenRefListarr.data=[];
    console.log("ZZZZZZZZZZZZZZZ___", this.tokenRefListarr.data);
    this.loader.setLoading(true);
    this.GetTokenListModel.mode = this.tokenDetailsForm.controls['searchField'].value;    //mode  controller
    this.GetTokenListModel.modeValue = this.tokenDetailsForm.controls['searchValue'].value; //mode value controller
   /// this.GetTokenListModel.fromDate = this.tokenDetailsForm.controls['fromDate'].value;
   // this.GetTokenListModel.toDate = this.tokenDetailsForm.controls['toDate'].value;
   this.GetTokenListModel.fromDate=fDate!;
   this.GetTokenListModel.toDate=tDate!;
    console.log(this.GetTokenListModel.mode, "Value", this.GetTokenListModel.modeValue);
    console.log("aftervalue___", this.GetTokenListModel);
    this.ApiMethods.postresultservice(this.ApiService.AllTokenList, this.GetTokenListModel).subscribe((resp:any) => {
      this.loader.setLoading(true);
      // console.log("resp__", resp.result);
      // this.tokenRefListarr = resp.result;
      // console.log("data__", this.tokenRefListarr)
      let Data = resp.result;
      if (resp.result.length > 0) {
        this.tokenRefListarr.data = Data;
        // this.tokenRefListarr.sort = this.Sort;
        // this.tokenRefListarr.paginator = this.paginator;
        // this.tokenRefListarr.sort = this.Sort;
        //  this.tokenRefListarr.paginator = this.paginator;
        console.log("dat_", this.tokenRefListarr.data)

        console.log("ZZZZZZZZZZZZZZZ___", this.tokenRefListarr.data);

        this.showtab = true
        this.loader.setLoading(false);
        // document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else {
        this.showtab = false
        this.loader.setLoading(false);
        this.snackbar.show("No Data Found !", 'alert')
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

  displayFn(SelectBilltype: any) {
    console.log("displayfuncall===>>>", SelectBilltype);
    return SelectBilltype ? SelectBilltype.BillType : undefined;
  }
  
  getBillTypeList() {
    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
      console.log("Treasury__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.BillTypeListarr = resp.result
      }
      console.log("treasury_inbetween", this.BillTypeListarr);
      this.BillTypeoptions = this.tokenEditForm.controls['BillTypeControl']
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
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.BillType.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayMajor(selectedoption: any) {
    console.log("displayfuncall");
   // let displayResult: any = selectedoption.majorheadcode + "-" + selectedoption.majorheadname
    return selectedoption ? selectedoption.majorheadname : undefined;
  }

  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.MajorHeadList + 0).subscribe((resp:any) => {
      console.log("MajorHeadList__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.MajorHeadListarr = resp.result
      }
      console.log("MajorHeadList_inbetween", this.MajorHeadListarr);
      this.MajorHeadoptions = this.tokenEditForm.controls['MajorHeadControl']
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
  }

  _filterMajor(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.majorheadcode.toLowerCase().includes(value.toLowerCase())
    });
  }


  OnBillTypeSelected(selectedOption: any) {
    console.log("slelction__________option_____________", selectedOption);
    this.GetUpdateTokenModel.billType = this.SelectBilltype.Ncode;
    this.selectChangesBilltype(selectedOption);
  }

  OnMajorHeadSelected(SelectMajorHead: any) {
    console.log("befort______SelectMajorHead", SelectMajorHead);
    console.log("slelction__________option__majorhead", this.SelectMajorHead);
    this.GetUpdateTokenModel.majorHead = this.SelectMajorHead.majorheadcode
  }
  onAction(row: any) {
    this.loader.setLoading(true);
    this.showeditForm = true;
    this.display = false;
    this.showtab=false;
    this.GetTokenFetchEDitModel.tokenNo = row.TokenNo
    
    console.log("tokenEditData===>>>", this.GetTokenFetchEDitModel);
    this.ApiMethods.postresultservice(this.ApiService.FetchTokenEditList, this.GetTokenFetchEDitModel).subscribe((resp:any) => {
      console.log("resp__", resp.result);
      //  this.tokenRefListarr = resp.result;
      let data = resp.result[0];
      this.SelectBilltype = this.BillType
      console.log("billtype__", this.SelectBilltype)
      console.log("data_", data)
      if (resp.result.length > 0) {
        this.tokenEditForm.patchValue({
          Date: this.datepicker,
          DdoCode: data.DDOCode,
          DdoName: data.officename,
          NetAmt: data.CashAmt,
          GrossAmt: data.GrossAmt,
          TokenNo: data.TokenNo,
          Receipt: data.Create_date
        })
        this.loader.setLoading(false);
        const bType = this.BillTypeListarr.filter((item: any) => item.Ncode.toString() === data.BillType)[0];
        const majorcode = this.MajorHeadListarr.filter((item: any) => item.majorheadcode === data.MajorHead)[0];
        this.tokenEditForm.patchValue({
          BillTypeControl: bType,
          MajorHeadControl: majorcode
        })
      }
      else {
        this.showeditForm = false;
        this.snackbar.show("No Data Found !", 'alert')
        this.loader.setLoading(false);
        this.display = true;
        this.showtab = false
        this.mat_radio_1 = true
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')

          //this.showeditForm=false
          //this.display=true;
          // this.showtab=false
          //this.mat_radio_1 = true
        }
      })
  }

  onSubmit() {

   // this.loader.setLoading(true);
    console.log("Save_Else_Part", this.GetUpdateTokenModel);
    console.log("billtpeee_________", this.SelectBilltype);
    this.GetUpdateTokenModel.oldtokenNo = this.GetTokenFetchEDitModel.tokenNo
    this.GetUpdateTokenModel.ddoCode = this.tokenEditForm.controls['DdoCode'].value;  //DdoCode controller
    this.GetUpdateTokenModel.cashAmt = this.tokenEditForm.controls['NetAmt'].value;  //Net Amount controller
    this.GetUpdateTokenModel.grossAmt = this.tokenEditForm.controls['GrossAmt'].value;  //Gross Amount controller
    this.GetUpdateTokenModel.billType = this.tokenEditForm.controls.BillTypeControl.value.Ncode;
    this.GetUpdateTokenModel.majorHead = this.tokenEditForm.controls.MajorHeadControl.value.majorheadcode;
    console.log("aftervalue___", this.GetUpdateTokenModel);

    let majorheadcode = this.tokenEditForm.controls.MajorHeadControl.value.majorheadcode;
    let majorheadname = this.tokenEditForm.controls.MajorHeadControl.value.majorheadname;
    let BillTypeControl = this.tokenEditForm.controls.BillTypeControl.value.BillType;
    console.log("majorheadname__", majorheadname)
    if (BillTypeControl == undefined || BillTypeControl == null) {
      this.snackbar.show('Please Select valid Bill Type !', 'alert');
     // this.loader.setLoading(false);
      // this.tokenEditForm.controls.MajorHeadControl.value = ''
      return;
    }


    if (majorheadcode == undefined || majorheadcode == null && majorheadname != undefined) {
      this.tokenEditForm.controls.MajorHeadControl.value = ''
      this.snackbar.show('Please Select valid Major Head !', 'alert');
      //this.loader.setLoading(false);
      return;
    }


    // stop here if form is invalid
    if (this.tokenEditForm.invalid) {
      console.log('Error');
      return;
    }
    //    else if (!this.SelectBilltype) {
    //      this.snackbar.show('Please Select Bill Type!', 'alert')
    //    }
    //  else if (this.SelectMajorHead == 0) {
    //    this.snackbar.show('Please Select Major Head!', 'alert')
    //   }
    else if (Number(this.GetUpdateTokenModel.cashAmt) > Number(this.GetUpdateTokenModel.grossAmt)) {
      console.log("trueeeeee");
      this.snackbar.show('Net amount cannot be greater than gross amount', 'Error!')
      //this.loader.setLoading(false);

    }
    else if (this.GetUpdateTokenModel.billType == 20 && this.GetUpdateTokenModel.cashAmt != 0) {
      this.snackbar.show('Net amount should be 0 when billtype is 20', 'Error!')
     // this.loader.setLoading(false);
    }

    else {
      if (this.loginflag && this.tokenEditForm.valid) {
        // if (this.tokenEditForm.valid) {
        console.log("Before_API_Save_Result", this.GetUpdateTokenModel);
        this.loader.setLoading(true);

        // Office id verify api call
        this.ApiMethods.postresultservice(this.ApiService.UpdateToken, this.GetUpdateTokenModel).subscribe((resp:any) => {
          console.log("officeid", resp.result);
          let data = resp.result
          console.log("datavalue___", data)
          if (data === true) {
            this.snackbar.show('Token Updated Successfully !', 'success')
            this.showeditForm = false;
            this.loader.setLoading(false);
            this.display = true;
            this.showtab = false;
          }

          else {
            this.snackbar.show('Token could not be updated !', 'alert')
            this.showeditForm = true;
            this.loader.setLoading(false);
            this.display = false;
          }
        },
          (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
            }
          });
      }

    }
  }


  // onFocusOutEvent(event: any) {
  //   console.log("onfouncsvaluuu", event.target.value);
  //   const text = event.target.value
  //   if (text) {
  //     this.loader.setLoading(true);

  //     // api call for Verify DDO Code
  //     this.ApiMethods.getservice(this.ApiService.Verify_DDO_Code + event.target.value).subscribe((resp:any) => {
  //       console.log("verifyddocode__res", resp.result);
  //       let respp = resp.result
  //       if (respp.count != 0) {

  //         // api call for get DDO Name
  //         this.ApiMethods.getservice(this.ApiService.GetDDOName + event.target.value + '/' + this.Tcode.Treasury_Code).subscribe((resp:any) => {
  //           let data = resp.result[0]
  //           console.log("DDOName__res", data);
  //           if (resp.result.length > 0) {
  //             this.loader.setLoading(false);
  //             this.tokenEditForm.controls['DdoName'].setValue(data.OfficeName)
  //           }
  //           else {
  //             this.loader.setLoading(false);
  //             this.tokenEditForm.controls['DdoCode'].setValue('')
  //             this.tokenEditForm.controls['DdoName'].setValue('')
  //             this.snackbar.show('DDO Code Not Found', 'alert')
  //           }
  //         },
  //           (res:any) => {
  //             console.log("errror message___", res.status);
  //             if (res.status != 200) {
  //               this.loader.setLoading(false);
  //               this.snackbar.show('Something Went Wrong! Please Try Again', 'alert')
  //             }
  //           })
  //       }
  //       else {
  //         this.snackbar.show('Please enter valid ddo code', 'alert')
  //         this.loader.setLoading(false);
  //       }
  //     },
  //       (res:any) => {
  //         console.log("errror message___", res.status);
  //         if (res.status != 200) {
  //           this.loader.setLoading(false);
  //           this.snackbar.show('Something Went Wrong\n Please Try Again', 'alert')

  //         }
  //       })
  //   }
  // }



  // applyFilter(filterValue: string) {
  //   this.tokendeleteARR.filter = filterValue.trim().toLowerCase();
  //   if (this.tokendeleteARR.paginator) {
  //     this.tokendeleteARR.paginator.firstPage();
  //   }
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
              this.tokenEditForm.controls['DdoName'].setValue(data.OfficeName)
            }
            else {
               this.loader.setLoading(false);
              this.tokenEditForm.controls['DdoCode'].setValue('')
              this.tokenEditForm.controls['DdoName'].setValue('')
              this.snackbar.show('DDO Code Not Found', 'alert')
            }
          },
            (res:any) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
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
            this.snackbar.show('Something Went Wrong\n Please Try Again', 'danger')
          }
        })
    }
  }

  ontokensearch(action?:any) {
    this.tokenRefListarr.filter = '';
    console.log("tokendelete__", this.GetTokenDeleteModel)
    let Date1 = this.tokenDeleteForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.tokenDeleteForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
   // this.GetTokenDeleteModel.fromDate = this.tokenDeleteForm.controls['fromDate'].value;
   this.GetTokenDeleteModel.fromDate=fDate!;
   this.GetTokenDeleteModel.toDate=tDate!
   // this.GetTokenDeleteModel.toDate = this.tokenDeleteForm.controls['toDate'].value;
    this.GetTokenDeleteModel.tokenNo = this.tokenDeleteForm.controls['tokenNo'].value;
    console.log("date-- after", this.GetTokenDeleteModel)
    this.loader.setLoading(true);
    this.ApiMethods.postresultservice(this.ApiService.DeleteViewToken, this.GetTokenDeleteModel).subscribe((resp:any) => {


      console.log("of", resp.result);
      let Data2 = resp.result
      console.log("datue___", Data2)


      if (resp.result.length > 0) {
        //this.tokendeleteARR = resp.result;
        this.tokenRefListarr.data = Data2;
        //  this.tokendeleteARR.sort = this.Sort;
        //  this.tokendeleteARR.paginator = this.paginator;
        console.log("tokwj", this.tokenRefListarr.data)
        this.showtrantab = true
        this.loader.setLoading(false);
        // document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else {
       // this.tokenRefListarr.data = [];
        this.showtrantab = false
        if(action!=='delete'){
          this.snackbar.show("No Data Found !", 'alert')
        }
       
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
  onDelete(row: any) {
    this.indisplay = true;
    if (window.confirm('Are you sure to delete this Token !')) {
      this.loader.setLoading(true);
      this.GetTokenDeleteupdateModel.tokenNo = row.TokenNo
      this.GetTokenDeleteupdateModel.treasRefNo = row.TREASURY_REFNO
      console.log("after tokn vmodel__", this.GetTokenDeleteupdateModel);
      this.ApiMethods.postresultservice(this.ApiService.DeleteTokenUpdate, this.GetTokenDeleteupdateModel).subscribe((resp:any) => {

        console.log("of", resp.result);
        let data = resp.result
        console.log("datue___", data)
        if (data == true) {
          this.snackbar.show('Token Deleted Successfully !', 'success');
          this.tokenDeleteForm.controls['tokenNo'].setValue('')
          this.ontokensearch('delete')
          this.showtrantab = true;
          this.loader.setLoading(false);
        }
        else {
          this.showtrantab = true;
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
    this.tokenEditForm.controls['MajorHeadControl'].setValue('')
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

      // this.tokenEditForm.patchValue({
      //   MajorHeadControl: majorselectcode

      // })

      this.MajorHeadoptions = this.tokenEditForm.controls['MajorHeadControl']
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
        // disableClose: true
        // , data: {
        //   // result: ''
        // }
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(CDE_RefNo);

    // Back From Objection Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res === 1) {
    //    // this.GetTreasOfficeList();
    //   }
    // })
    // --------------------------------------------------------------------------------------------enD-------
  }



  get DdoCode() { return this.tokenEditForm.get('DdoCode') }
  get DdoName() { return this.tokenEditForm.get('DdoName') }
  get BillType() { return this.tokenEditForm.get('BillType') }
  get MajorHead() { return this.tokenEditForm.get('MajorHead') }
  get NetAmt() { return this.tokenEditForm.get('NetAmt') }
  get GrossAmt() { return this.tokenEditForm.get('GrossAmt') }
  get tokenNo() { return this.tokenDeleteForm.get('tokenNo') }
}
