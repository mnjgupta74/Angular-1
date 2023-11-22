import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { of, Observable, startWith, map } from "rxjs";
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiService } from 'src/app/utils/utility.service';
import { GetBIllDup, GetBillVoucher, IBillStatus, IBudgetAmountCheck, ICheckValidation, ICheckbillentrysave, IGetObjectionDataList, ISaveBillEntry, ISaveObjection, IbillExist } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatDialog, } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { log } from 'console';
//import { ToWords } from 'to-words';
import {ToWords} from 'to-words';
// import { orderData } from '../../directives/DigitsConversion/number-to-words.pipe'
export interface BillTypeMaster {
  TokenNum: number;
  BillRef: number;

}
@Component({
  selector: 'app-bill-entry',
  templateUrl: './bill-entry.component.html',
  styleUrls: ['./bill-entry.component.scss']
})
export class BillEntryComponent implements OnInit {
  IsOpen: boolean = true;
  IsObjectionOpen: boolean = false
  IsObjectionBill: any = {
    Objbillcode: '',
    Objbilltype: '',
    userType: 5,
    userId: sessionStorage.getItem('rajkoshId'),
    pageType: "1",
    routeFrom: 'BillEntry'
  }

  opentran:boolean=true
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  displayedColumns: string[] = ['BudgetHead', 'ObjectHead', 'PnNP', 'VnC', 'OfficeId', 'Grossamt'];
  dataSource = new MatTableDataSource();

  displayedColumns1: string[] = ['DetailHead', 'ObjectHead', 'Division', 'PnNP', 'VnC', 'PDAcNo', 'SanctionNo', 'SanctionDate', 'Amount', 'TreasuryName'];
  dataSource1 = new MatTableDataSource();

  displayedLoan: string[] = ['DETAIL HEAD', 'EMP NAME', 'GPF POLICY No.', 'AUTHORITY NO.', 'AMOUNT'];
  LoanSource = new MatTableDataSource();

  displayedMoreHead: string[] = ['BuddgetHead', 'ObjectHead', 'BFC', 'Head', 'PDAcNo', 'HeadGross', 'Budget'];
  MoreHeadSource = new MatTableDataSource();

  displayedRDCCD: string[] = ['SR. No.', 'Challan No', 'Challan Date', 'Amount', 'GRN'];
  RDCCDSource = new MatTableDataSource();

  displayedWorkInvoice: string[] = ['Invoice No', 'Invoice Date', 'Work Order No', 'Work Order Date', 'Party Name'];
  WorkInvoiceSource = new MatTableDataSource();

  displayedACBill: string[] = ['Dc Pending', 'Sanction No', 'Sanction Date', 'Sanction Authority', 'Purpose'];
  ACBillSource = new MatTableDataSource();

  displayedGrant: string[] = ['UC Required', 'Sanction No', 'Sanction Date', 'Sanction Authrity', 'Purpose'];
  GrantAidSource: any[] = []

  displayedInsitituion: string[] = ['Insitituion Code', 'Insitituion Name', 'Insitituion Amount'];
  InsitituionSource = new MatTableDataSource();

  //<...............block data set end.....>

  Ddomaster: MatTableDataSource<BillTypeMaster> = new MatTableDataSource();
  showHideDocument: string = "< Show Doc";
  showFiller = false;
  ButtonDisable: boolean = true

  // @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;

  billType: any;
  subBillType: any;
  savebillentry: IBillStatus = {
    treasurycode: this.Tcode.Treasury_Code,
    billnoid: 0,
    finyear: this.Tcode.year,
    tokenNo: 0,
  };

  GetObjectionListModal: IGetObjectionDataList = {
    type: 1,  // For All Objection
    billNo: 0,
    userId: sessionStorage.getItem('rajkoshId'),
    userType: 5
  }

  CheckBudgetAmt: IBudgetAmountCheck = {
    treasurycode: this.Tcode.Treasury_Code,
    detailHead: 0,
    objectHead: 0,
    bfcType: '',
    headType: '',
    pdAcNo: 0,
    finyear: this.Tcode.year,
    officeId: 0,
    billtype: 0,
    billsubtype: 0,
    billmonth: 0,
    billyear: this.Tcode.forwardYear,
  }

  CheckValid: ICheckValidation = {
    treasurycode: this.Tcode.Treasury_Code,
    billnoid: 0,
    finyear: this.Tcode.year,
    tokenNo: 0,
    officeId: 0,
    ddoCode: 0,
    detailHead: 0,
    objectHead: 0,
    planNonPlan: '',
    votedCharged: '',
    pdAcNo: 0,
    billtype: 0,
    billsubtype: 0,
    billmonth: 0,
    billyear: 0,
    majorHead: '',
    divcode: 0
  }

  SaveModal: ISaveBillEntry = {
    finYearFrom: this.Tcode.year,
    bankCode: 0,
    chequeDate: '',
    userId: sessionStorage.getItem('rajkoshId'),
    auditiorflag: 'P',
    objectionTypeCode: ['0000'],
    refNo: 0,
    assignMentId: 0,
    ipAddress:this.ApiMethods.clientIP

  }

  BillvoucheList: GetBillVoucher = {
    treasuryCode: this.Tcode.Treasury_Code,
    finYearFrom: this.Tcode.year,
    treasuryRefNo: 0,
    finYearTo: this.Tcode.finyear,
    type: 3
  }

  BillExist: IbillExist = {
    treasurycode: this.Tcode.Treasury_Code,
    billnoid: 0,
    finyear: this.Tcode.year,
    tokenNo: 3
  }

  BillNoCheck: GetBIllDup = {
    treasuryCode: this.Tcode.Treasury_Code,
    finyear: this.Tcode.year,
    finTo: this.Tcode.finyear,
    ddoCode: 0,
    ddoBillNo: 0,
    majorhead: 0
  }

  SaveOjection: ISaveObjection = {
    userid: sessionStorage.getItem('rajkoshId'),
    otherList: '',
    objectionlist: '',
    userType: 5,
    treasuryRefNo: 0,
  }

  billentrycheck: ICheckbillentrysave = {
    treasCode: this.Tcode.Treasury_Code,
    objectHead: 0,
    transType: 0,
    billSubType: 0,
    majorHead: 0,
    detailHead: 0,
    divCode: 0,
    pd_AcNo: 0,
    votedCh: '',
    pnp: '',
    type: 0,
    finYear: this.Tcode.year,
    demandno: 0
  }

  new_billcode: any = ''
  loginflag: any = true
  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  dataO: Array<any> = [];
  dataB: Array<any> = [];

  // Form Module
  BillTypeForm: any;
  BillEntryForm: any;
  ObjectForm: any;
  Base64Str: any = ''
  Imgshow: boolean = false

  SearchOptions: Observable<any[]> | undefined;
  //Flags

  BillEntry_flag: any = 1;
  Morehead_flag: boolean = false;
  BT_flag: boolean = false;
  deduction_flag: boolean = true;
  PayInfo_flag: boolean = true;
  ACBlock_flag: boolean = true;
  Loan_flag: boolean = false
  RDCCD_Tableflag: boolean = false
  WorkITableflag: boolean = false
  ACBIllTableflag: boolean = false
  Insitituion_TabFlag: boolean = false
  Section_flag: boolean = true;
  Api_erroFlag: boolean = false
  Verify_done: boolean = false
  Bankselected: any = '';
  BillMonthSelect: any = ''
  BillYearSelect: any = ''
  check_pd_status: any = 0
  //objection container
  objection_flag: boolean = true
  categories: any[] = [];
  CommonObjection: any[] = []
  BillTypeObjection: any[] = []
  Ischecked: boolean = false;
  BudgetAmountF: boolean = false
  Commentlist: any[] = []

  LableMsg: any = ''
  grossAmtInword: any = ''
  budgetHead_valid: any = ''
  New_billcode_flag: boolean = false
  Objection_ErrMsg: boolean = false
  BillNoDuplicate: boolean = false


  billentry_info: any = ''
  budgetamt: any = {
    budgetAmount: 0,
    demandNo: 0
  }
  Common_objlist: any = []
  Billtype_objlist: any = []
  comment_selectionlist: any = []
  NEW_TREASURY_REFNO: any = ''

  popup: boolean = false


  budget_Status: boolean = false

  MonthList = [
    { "MonthName": "January", "MonthCode": 1 },
    { "MonthName": "Febury", "MonthCode": 2 },
    { "MonthName": "March", "MonthCode": 3 },
    { "MonthName": "April", "MonthCode": 4 },
    { "MonthName": "May", "MonthCode": 5 },
    { "MonthName": "June", "MonthCode": 6 },
    { "MonthName": "July", "MonthCode": 7 },
    { "MonthName": "Augest", "MonthCode": 8 },
    { "MonthName": "September", "MonthCode": 9 },
    { "MonthName": "October", "MonthCode": 10 },
    { "MonthName": "November", "MonthCode": 11 },
    { "MonthName": "December", "MonthCode": 12 }
  ]


  BankList: any[] = []
  BillTypeList: any[] = [];
  BillSubTypeList: any[] = [];
  SectionDetail: any[] = [];
  PayDetails: any;
  BudgetDetails: any[] = [];
  OtherBTDeatls: any[] = [];
  DeductionDetails: any[] = [];
  GiantAid_details: any[] = []
  Instituation_details: any[] = []

  ACBlockDetails: any[] = []
  LoanDetails: any[] = []


  bankSelect: any;

  Billselected: any;
  BillSubselected: any;
  selectedText: any = "";
  selecteBFC = 'A'
  selectedVoted = 'A'
  mat_Paymode: string = ''

  mat_Voted: string = ''

  mat_SF: string = ''

  Popup_error_list: any;
  GrantIn_Aid_Tableflag: boolean = false
  Institution_flag: boolean = true
  modeofpay: boolean = true
  TokenNo: any = ''
  RefNo: any = ''
  Sch_Code: any = ''

  // helpermsg: any = Helper

  // display: Observable<'open' | 'close'>;
  // <-------- radio flag end
  constructor(private router: Router, public _dialog: MatDialog, private routing: ActivatedRoute, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService,
    public Tcode: Helper,
    private snackbar: SnackbarService, private finyear_: Helper, private toyear_: Helper
  ) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    // this.Billselected = "20";

    this.getBankList()  // Call Bank List
    // this.getCommonObjectlist()

  }


  ngOnInit() {

    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324
    //Bill type form
    this.BillTypeForm = new FormGroup({
      // Treasury: new FormControl({ value: this.savebillentry.treasurycode, disabled: true }),
      // Year: new FormControl({ value: this.savebillentry.finyear, disabled: true }),
      TreasuryControl: new FormControl({ value: '' }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value: financialYr, disabled: true }),
      TokenNum: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(12)])),
      //TokenNum: new FormControl('', [Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
      BillRef: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(19)])),


    });

    //Bill entry form
    this.BillEntryForm = new FormGroup({
      DdoName: new FormControl(''),
      AuditDate: new FormControl(this.datepicker),
      DdoBillNo: new FormControl(''),
      officeid: new FormControl('', [Validators.required]),
      DdoBillDate: new FormControl(''),
      Billtype: new FormControl(''),
      PayMonth: new FormControl(''),
      BillSubType: new FormControl(''),
      DetailHead: new FormControl('', [Validators.required]),
      ObjectHead: new FormControl('', [Validators.required]),
      Division: new FormControl('', [Validators.required]),
      GrossAmt: new FormControl('', [Validators.required]),
      HeadGross: new FormControl('', [Validators.required]),
      NetAmt: new FormControl('', [Validators.required]),
      PdAcc: new FormControl('', [Validators.required]),
      HeadOffice: new FormControl('', [Validators.required]),
      BudgetBal: new FormControl('', [Validators.required]),
      budgetval: new FormControl('', [Validators.required]),
      toDate: new FormControl(this.datepicker),
      BillMonth: new FormControl(''),
      BillYear: new FormControl(''),
      VotedCharged: new FormControl(''),
      ECSNONECS: new FormControl(''),
      PlanNonPlan: new FormControl(),
      payMode: new FormControl('NA'),
      bankName: new FormControl('')

    })
    this.BillEntryForm.disable();
    this.BillEntryForm.controls.bankName.enable();
    this.ObjectForm = new FormGroup({
      commentval: new FormControl(''),
    })
    this.getTreasuryList()

    // Params value get
    this.routing.queryParams.subscribe((params: any) => {
      console.log("ParamPrint____", params)
      this.loader.setLoading(true);

      if (Object.keys(params).length > 0) {

        this.BillTypeForm.patchValue({
          TokenNum: params.billToken,
          BillRef: params.billRef
        })

        this.OnShowDetails();
      }

    })


  }


  // Call Treasury List API >>>------------------->
  getTreasuryList() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {

      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.BillTypeForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("logg_uinvampop_", value);

            // return typeof value === 'string' ? value : value.treasuryCode
            return typeof value === 'string' ? value : value.TreasuryCode

          }),
          map((treasury: any) => {

            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        this.loader.setLoading(false);

        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
        this.BillTypeForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.Tcode.Treasury_Code != "5000") {
          this.BillTypeForm.controls['TreasuryControl'].disable();
        }
      }
    })
  }

  _filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displayFn(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  // Calling API for Bank List  
  getBankList() {
    console.log("bankList_before", this.BankList);

    //this.ApiMethods.getservice(this.ApiService.BankList).subscribe((resp:any) => {
    this.ApiMethods.getservice(this.ApiService.BankList + '/' + this.Tcode.Treasury_Code + '/' + 3).subscribe((resp:any) => {
      console.log("BankList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BankList = resp.result
      }
    })
    console.log("BankList_after", this.BankList);
  }


  // calling api for base64 imaage
  // getBase64Img() {

  //   this.ApiMethods.getservice(this.ApiService.Base64Img).subscribe((resp:any) => {
  //     console.log("Base64Img__res", resp);
  //     var response = resp.result
  //     if (Object.keys(response).length > 0) {

  //       var basestr = "data:image/png;base64," + resp.result.base64
  //       this.Base64Str = basestr
  //       this.Imgshow = true
  //       console.log("base64__strrrr_", basestr);

  //     }
  //   })
  // }

  // Calling API for Objection List  
  getCommonObjectlist() {
    console.log("CommonObjection_before", this.CommonObjection);

    this.ApiMethods.getservice(this.ApiService.ObjectionDetail + '0').subscribe((resp:any) => {
      console.log("CommonObjection__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.CommonObjection = resp.result
      }
    })
    console.log("CommonObjection_after", this.CommonObjection);
  }

  // Calling API for bill type Objection List  
  getBillTypeObjectlist(data: any) {
    console.log("billtype_Objection_before", data);

    this.ApiMethods.getservice(this.ApiService.ObjectionDetail + data.BillType).subscribe((resp:any) => {
      // this.ApiMethods.getservice(this.ApiService.ObjectionDetail + '6').subscribe((resp:any) => {

      console.log("billtype_Objection__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BillTypeObjection = resp.result
      }
    })
    console.log("BilltypeObjection_after", this.BillTypeObjection);
  }

  // Calling API for Bill Type List
  getBillTypeList() {
    console.log("BillTypeList_before", this.BankList);

    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
      if (resp.result && resp.result.length > 0) {
        this.BillTypeList.push(resp.result)
        // this.BillTypeList = resp.result
      }
    })
    console.log("BillTypeList_after", this.BillTypeList);
  }


  // Calling API for Bill Sub Type List
  getBillSubTypeList(data: any) {
    console.log("BillSubTypeList_before", this.BillSubTypeList, "return_subbilltype", data);

    this.ApiMethods.getservice(this.ApiService.BillSubType + data + '/' + 0).subscribe((resp:any) => {
      console.log("BillSubTypeList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BillSubTypeList = resp.result;
        const subBillData = this.BillSubTypeList.filter((item: any) => item.NSubCode == this.billentry_info.SUB_BILLTYPE)[0];
        console.log("data_ofbilll___", subBillData);

        this.subBillType = subBillData.SubType
      }
    })
    console.log("BillSubTypeList_after", this.BillSubTypeList);
  }


  onBankSelected(data: any) {
    console.log("selecteddddd_bank___", data.target.value);
    this.bankSelect = data.target.value
    console.log("ssssssssss", this.bankSelect);
  }

  BalanceBudgetCheck() {
    console.log("BERFORRR____");

    //  Budget amount check api call
    this.ApiMethods.postresultservice(this.ApiService.CheckBudgetAmt, this.CheckBudgetAmt).subscribe((resp:any) => {


      console.log("budgetstatus", resp);
      let response = resp.result

      // if (Object.keys(response).length > 0) {  
      if (response.length > 0) {
        this.loader.setLoading(false);
        this.budgetamt.budgetAmount = response[0].Amount

        if (Number(this.billentry_info.GROSS_AMOUNT) > Number(response[0].Amount)) {
          this.budget_Status = true
          this.BudgetAmountF= true
          this.LableMsg = this.Tcode.BUdgetEr1()

          console.log("bill available");
          this.Objection_ErrMsg = true
        }
        else {
          this.BudgetAmountF= false
        }
        console.log("bill_check_____", this.billentry_info.GROSS_AMOUNT, response[0].Amount);
        const toWords = new ToWords();

        this.BillEntryForm.patchValue({
          BudgetBal: response[0].Amount
        })


        this.CheckBudgetAmt.detailHead = 0
        this.CheckBudgetAmt.objectHead = 0
        this.CheckBudgetAmt.bfcType = ''
        this.CheckBudgetAmt.headType = ''
        this.CheckBudgetAmt.pdAcNo = 0
        this.CheckBudgetAmt.officeId = 0
        this.CheckBudgetAmt.billtype = 0
        this.CheckBudgetAmt.billsubtype = 0
        this.CheckBudgetAmt.billmonth = 0


      }
    },
      (res:any) => {
        console.log("Budgetapierror___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
          //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

        }
      })
  }

  //muliple selection common objection list data
  getCommonobj(value: any) {
    console.log("final_commone", value);

    if (!this.Common_objlist.includes(value.objectiontypecode)) {          //checking weather array contain the id
      this.Common_objlist.push(value.objectiontypecode.toString());               //adding to array because value doesnt exists
    } else {
      this.Common_objlist.splice(this.Common_objlist.indexOf(value.objectiontypecode), 1);  //deleting
    }
    console.log("newww__arrrr_", this.Common_objlist);
  }
  //muliple selection common objection list data
  getBilll_obj(value: any) {
    console.log("vvalueee__commone", value);

    if (!this.Billtype_objlist.includes(value.objectiontypecode)) {          //checking weather array contain the id
      this.Billtype_objlist.push(value.objectiontypecode.toString());               //adding to array because value doesnt exists
    } else {
      this.Billtype_objlist.splice(this.Billtype_objlist.indexOf(value.objectiontypecode), 1);  //deleting
    }
    console.log("billtype__arrrr_", this.Billtype_objlist);
  }

  CheckBillDuplication(Val: any) {
    var ddoarr = Val.DDOCode.split("-");
    console.log("Ddoval", ddoarr);
    var MajorH = Val.BudgetHead1.split("-");
    console.log("MajorH__", MajorH);

    this.BillNoCheck.ddoCode = ddoarr[0]
    this.BillNoCheck.ddoBillNo = Val.DdoBillNo
    this.BillNoCheck.majorhead = MajorH[0]



    console.log("Billnocheck_modal", this.BillNoCheck);

    //  Budget amount check api call
    this.ApiMethods.postresultservice(this.ApiService.CheckBillDuplicy, this.BillNoCheck).subscribe((resp:any) => {


      console.log("check_bill_duplcate", resp.result);
      let response = resp.result
      if (Object.keys(response).length > 0) {
        this.BillNoDuplicate = true
        this.LableMsg = this.Tcode.BUdgetEr6()
        this.Objection_ErrMsg = true
        console.log("inbilldupli_______________");
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
        }
      })
  }

  OfficeId_Verify() {
    var DdoCode = this.billentry_info.DDO_CODE.split("-");
    console.log("DDoCode_split", DdoCode[0], this.billentry_info.OFFICE_CODE, this.Tcode.Treasury_Code);

    var officeCode = this.billentry_info.OFFICE_CODE.split("-");
    console.log("officeid_split", officeCode[0]);


    // Office id verify api call
    this.ApiMethods.getservice(this.ApiService.OfficeId_Verify + this.Tcode.Treasury_Code + '/' + DdoCode[0] + '/' + officeCode[0]).subscribe((resp:any) => {

      console.log("officeidresp_verify___", resp.result);
      let response = resp.result

      if (Object.keys(response).length > 0) {
        this.loader.setLoading(false);

        if (response.OfficeId == 'N') {
          console.log("officewrong");
          // this.officeid_valid = true
          this.Tcode.officeid_valid = true
          this.New_billcode_flag = true

        }
      }
      else {
        this.loader.setLoading(false);
        // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
        }
      })
  }

  bilLExist_Verify() {

    this.BillExist.billnoid = this.RefNo
    this.BillExist.tokenNo = this.TokenNo
    console.log("billexsit_modal_", this.BillExist);


    // Office id verify api call
    this.ApiMethods.postresultservice(this.ApiService.BillExist_Verify, this.BillExist).subscribe((resp:any) => {
      console.log("Billexistrep_verify___", resp.result);
      let response = resp.result

      if (Object.keys(response).length > 0) {
        this.loader.setLoading(false);

        if (response.status == 'Y') {
          console.log("billwrong");
          // this.BillNoId_valid = true
          this.Tcode.BillNoId_valid = true
          this.New_billcode_flag = true
        }
      }
      else {
        this.loader.setLoading(false);
        // this.toastrService.error('BIll data not found', 'Alert!');
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
        }
      })
  }


  budgethead_validation() {
    // budget head validation api call
    this.ApiMethods.getservice(this.ApiService.BudgetHeadvalidation + this.billentry_info.BudgetHead + '/' + this.billentry_info.PdAcNo + '/' + this.billentry_info.DivCode).subscribe((resp:any) => {


      console.log("budgethead_resp___", resp.result);
      let response = resp.result
      this.loader.setLoading(false);

      if (Object.keys(response).length > 0) {

        if (response.head_flag) {
          console.log("succes_budgethead");
          this.Verify_done = true

        }
        else {
          //  this.toastrService.error(response.head_flag, 'Alert!');
          this.Verify_done = false

        }

      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          //   this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

        }
      })
  }
  getObjectionData() {

    console.log("api_ObjectionBef", this.GetObjectionListModal)
    this.ApiMethods.postresultservice(this.ApiService.BillObjectionData, this.GetObjectionListModal).subscribe((resp:any) => {
      console.log("data_setojection", resp.result);
      // if (resp.result.length > 0) {
      if (Object.keys(resp.result).length > 0) {

        this.dataO = resp.result.dataSet1;
        this.dataB = resp.result.dataSet2;
        console.log("dddddd");
      }
    },
      (res:any) => {
        console.log("errror_msg_ojbectiondata_", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

        }
      });
  }

  setchecked = (obj: any): boolean => {
    let data = this.dataO.filter((x: any) => x.objectiontypecode === obj);
    if (data.length === 0) {

      return this.Ischecked = false
    }
    else {
      return this.Ischecked = true
    }

  }
  setchecked1 = (obj1: any): boolean => {
    let data1 = this.dataB.filter((x: any) => x.objectiontypecode === obj1);
    if (data1.length === 0) {
      return this.Ischecked = false
    }
    else {
      return this.Ischecked = true
    }

  }
  isdisabled = (code: number): boolean => {
    return code >= 5000 ? true : false;
  }

  //Bill entry Save api call
  Save() {
    // this.budgethead_validation()
    // this.Amount_validation()
    console.log("pddd__acc___", this.check_pd_status, this.budgetamt);
    console.log("laksdjf+____", this.Bankselected, this.BillEntryForm.value.bankName);
    const bankId = this.BillEntryForm.value.bankName;
    console.log("bankk______Save()", bankId.BankBranchCode);

    if (!bankId) {
      this.Verify_done = false
      this.snackbar.show('Please select bank', 'danger')
    }
    else {
      this.Verify_done = true
      // this.New_billcode_flag = false
    }

    if (this.Api_erroFlag) {
      console.log("errrrr_dettt__", this.Api_erroFlag);
      this.snackbar.show('Somthing went wrong', 'danger')
      // this.toastrService.error('Somthing went wrong', 'Alert!');
    }
    // else if (this.New_billcode_flag == true || this.Objection_ErrMsg == true) {
    //   //  this.toastrService.error('Please check error details', 'Alert!');
    //   // alert(this.New_billcode_flag)
    //   this.snackbar.show('Please check error details', 'danger')
    // }
    else if (this.Popup_error_list.length > 0) {
      this.snackbar.show('Please check error details', 'danger')
    }

    else if (this.Verify_done) {
      //alert('hi')
      this.loader.setLoading(true);

      // this.OfficeId_Verify()      //Check office api call
      // this.bilLExist_Verify()   // check bill exist api call
      // this.CheckBillSave(0)  // check bill save api call


      // budget check amount body set
      var objectHarr = this.billentry_info.OBJECT_HEAD_NAME.split("-");
      console.log("ObjectH_save", objectHarr);
      var officeCode = this.billentry_info.OFFICE_CODE.split("-");
      console.log("officeid_save", officeCode[0]);
      this.CheckBudgetAmt.detailHead = this.billentry_info.BUDGETHEAD,
        this.CheckBudgetAmt.objectHead = objectHarr[0],
        this.CheckBudgetAmt.bfcType = this.billentry_info.BFC_TYPE,
        this.CheckBudgetAmt.headType = this.billentry_info.HEAD_TYPE,
        this.CheckBudgetAmt.pdAcNo = this.billentry_info.PDACC_NO,
        this.CheckBudgetAmt.officeId = this.billentry_info.HOD,
        this.CheckBudgetAmt.billtype = this.billentry_info.BILL_TYPE,
        this.CheckBudgetAmt.billsubtype = this.billentry_info.SUB_BILLTYPE,
        this.CheckBudgetAmt.billmonth = this.billentry_info.DDO_BILL_MONTH,

        console.log("onSave_budgetmodal___", this.CheckBudgetAmt
        );
      this.BalanceBudgetCheck()

      this.SaveModal.bankCode = bankId.BankBranchCode
      this.SaveModal.refNo = this.billentry_info.CDE_REFNO
      var assignMent_id: any = this.ApiMethods.getUserInfo()
      this.SaveModal.assignMentId = Number(assignMent_id.aid)

      let chequeDate = this.BillEntryForm.controls['toDate'].value;
      console.log("bill_entrydave__", chequeDate);
      var daeFormat = chequeDate.split(/\D/).reverse().join('-');
      // let formatdate = formatDate(new Date(chequeDate), 'YYYY-MM-DD', 'en')

      this.SaveModal.chequeDate = daeFormat



      // let formatdate = moment(chequeDate).format('YYYY-MM-DD')
      // console.log("save_after_Date",formatdate);

      // this.SaveModal.chequeDate = formatdate

      console.log("billentyrconsss___", this.billentry_info);

      console.log("ObSave___", this.SaveModal);


      // Office id verify api call
      this.ApiMethods.postresultservice(this.ApiService.BillEntySave, this.SaveModal).subscribe((resp:any) => {

        console.log("SaveBilllOnline_verify___", resp.result);
        let response = resp.result[0]

        if (Object.keys(response).length > 0 && response.ERR_CODE == 200) {

          //  this.toastrService.success('Successfully Inserted', 'Success!');
          //  this.snackbar.show('Transaction Save & Forwarded to next level!', 'success')
          this.snackbar.show(response.MSG, 'success')


          this.loader.setLoading(false);

          this.SaveModal.bankCode = 0
          this.SaveModal.refNo = 0
          this.SaveModal.assignMentId = 0
          this.SaveModal.chequeDate = ''
          //this.router.navigate(['OnlineBillList']);
          this.router.navigate(['OnLineBillList'], { queryParams: {} });
        }
        else {
          // this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          this.snackbar.show(response.MSG, 'alert')
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')

          }
        })




    }

  }

  // get object details api call
  Save_objectionDetails() {
    const bankId = this.BillEntryForm.value.bankName;
    console.log("bankk______Savewithobj()", bankId);
    if (!bankId) {
      this.Verify_done = false
      this.snackbar.show('Please select bank', 'danger')

    }

    else if (this.Api_erroFlag) {
      console.log("errrrr_dettt__", this.Api_erroFlag);
      this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert!')
    }
    else if (this.New_billcode_flag == true) {
      //  this.toastrService.error('Please check error details', 'Alert!');
      // alert(this.New_billcode_flag)
      this.snackbar.show('Please check error details', 'danger')

    }
    else {

      this.loader.setLoading(true);

      this.bilLExist_Verify()   // check bill exist api call

      this.OfficeId_Verify()      //Check office api call

      // this.CheckBillSave(0) //Under workig facing issue

      var objectHarr = this.billentry_info.OBJECT_HEAD_NAME.split("-");
      console.log("ObjectH_save", objectHarr);

      var officeCode = this.billentry_info.OFFICE_CODE.split("-");
      console.log("officeid_save_objection", officeCode[0]);
      this.CheckBudgetAmt.detailHead = this.billentry_info.BUDGETHEAD,
        this.CheckBudgetAmt.objectHead = objectHarr[0],
        this.CheckBudgetAmt.bfcType = this.billentry_info.BFC_TYPE,
        this.CheckBudgetAmt.headType = this.billentry_info.HEAD_TYPE,
        this.CheckBudgetAmt.pdAcNo = this.billentry_info.PDACC_NO,
        this.CheckBudgetAmt.officeId = this.billentry_info.HOD,
        this.CheckBudgetAmt.billtype = this.billentry_info.BILL_TYPE,
        this.CheckBudgetAmt.billsubtype = this.billentry_info.SUB_BILLTYPE,
        this.CheckBudgetAmt.billmonth = this.billentry_info.DDO_BILL_MONTH,

        console.log("onSave_budgetmodal___", this.CheckBudgetAmt);
      // this.BalanceBudgetCheck()

      this.SaveModal.bankCode = bankId.BankBranchCode
      this.SaveModal.refNo = this.billentry_info.CDE_REFNO
      var assignMent_id: any = this.ApiMethods.getUserInfo()
      this.SaveModal.assignMentId = Number(assignMent_id.aid)
      let chequeDate = this.BillEntryForm.controls['toDate'].value;

      var daeFormat = chequeDate.split(/\D/).reverse().join('-');
      // let formatdate = formatDate(new Date(chequeDate), 'YYYY-MM-DD', 'en')
      let formatdate = daeFormat

      this.SaveModal.chequeDate = formatdate
      this.SaveModal.auditiorflag = 'O'

      let objection_arrac: any[] = []

      this.Popup_error_list.map((item: any) => {
        objection_arrac.push(item.ERR_STATUS_CODE)
        console.log("resppp__objection", item.ERR_STATUS_CODE);

      })
      console.log("final_objc_array__", objection_arrac);


      // this.SaveModal.objectionTypeCode = this.LableMsg.ObjectionC
      this.SaveModal.objectionTypeCode = objection_arrac

      console.log("lable_objerrr__", this.LableMsg);

      console.log("billentyrconsss___", this.billentry_info);

      console.log("savemodal__after", this.SaveModal);
      this.deduction_flag = true
      this.PayInfo_flag = true

      this.GrantIn_Aid_Tableflag = true
      this.Institution_flag = true


      // Office id verify api call
      this.ApiMethods.postresultservice(this.ApiService.BillEntySave, this.SaveModal).subscribe((resp:any) => {

        console.log("SaveBilllWithObjection_verify___", resp.result);
        let response = resp.result[0]

        if (Object.keys(response).length > 0 && response.ERR_CODE == 200) {

          this.SaveModal.bankCode = 0
          this.SaveModal.chequeDate = ''
          this.SaveModal.auditiorflag = 'P'

          // this.router.navigate(['OnlineBillList']);

          this.NEW_TREASURY_REFNO = response.NEW_TREASURY_REFNO
          this.BillvoucheList.treasuryRefNo = response.NEW_TREASURY_REFNO
          this.GetObjectionListModal.billNo = response.NEW_TREASURY_REFNO
          console.log("modesendbefor__", this.BillvoucheList);

          //  Get voucher details check api call
          this.ApiMethods.postresultservice(this.ApiService.BillVoucherDetail, this.BillvoucheList).subscribe((resp:any) => {

            console.log("voucherresppp__", resp.result);
            let response = resp.result
            if (Object.keys(response).length > 0) {
              // this.getBillTypeObjectlist(response) //Bill type objection list api call

              // this.getObjectionData()  // Objection  type selected filter api

              // this.getCommonObjectlist()     // common objection type list api call
              this.BillEntry_flag = 3
              this.IsObjectionBill.Objbilltype = response.BillType
              this.IsObjectionBill.Objbillcode = this.BillvoucheList.treasuryRefNo
              console.log("isobject_data___", this.IsObjectionBill);


              // this.getBillTypeData()
              this.IsObjectionOpen = true

              this.BT_flag = true
              this.Section_flag = true
              this.loader.setLoading(false);
            }
          },
            (res:any) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert!')
              }
            }
          )

        }
        else {
          this.loader.setLoading(false);
          this.snackbar.show(response.MSG, 'danger')

        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert!')
          }
        })


    }

  }

  // save with objection api call
  Save_Objection() {
    // Office id verify api call
    let Common_dataset1: any[] = []
    let Common_dataset2: any[] = []

    if (this.Common_objlist.length == 0) {
      // this.toastrService.error('select atleast common ojection list or bill type list', 'Alert!');
    }
    else if (this.Commentlist.length == 0) {
      // this.toastrService.error('Comment list cannot be blank', 'Alert!');
    }
    else {

      if (this.dataO.length > 0) {
        this.dataO.map((item, index) => {
          Common_dataset1.push(item.objectiontypecode)
        })

      }
      if (this.dataB.length > 0) {
        this.dataB.map((item, index) => {
          Common_dataset2.push(item.objectiontypecode)
        })

      }
      var finalarr = this.Common_objlist.concat(this.Billtype_objlist, Common_dataset1, Common_dataset2);
      console.log("finalarrrr_aftermerge__", finalarr);

      console.log("listof__data__1", this.dataB);
      console.log("listof__data__2", this.dataO);



      this.SaveOjection.objectionlist = finalarr;
      this.SaveOjection.otherList = this.Commentlist
      this.SaveOjection.treasuryRefNo = this.BillvoucheList.treasuryRefNo
      console.log("saveobjmodall____", this.SaveOjection, this.SaveOjection.treasuryRefNo
      );

      this.ApiMethods.postresultservice(this.ApiService.Savewithobjection, this.SaveOjection).subscribe((resp:any) => {

        console.log("objectio_save_Res", resp.result);
        let response = resp.result

        if (response) {
          //   this.toastrService.success('Successfully Inserted', 'Success!');
          this.loader.setLoading(false);

          this.SaveOjection.objectionlist = '';
          this.SaveOjection.otherList = ''
          this.SaveOjection.treasuryRefNo = 0

          this.router.navigate(['OnlineBillList']);

        }
        else {
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //   this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

          }
        })
    }
  }


  // Calling API for pd account check
  checkPdAC(data: any) {
    console.log("pdaccount_share__", data);

    this.ApiMethods.getservice(this.ApiService.getpdaccount_status + data + '/' + 'p').subscribe((resp:any) => {
      console.log("pdaccountcheck__res", resp);
      let response = resp.result
      if (Object.keys(response).length > 0) {

        console.log("respp__flag__", response.flag);

        this.check_pd_status = response.flag
      }
    })
  }


  OnShowDetails() {
    this.loader.setLoading(true);

    this.Api_erroFlag = false
    console.log("Save_Else_Part", this.savebillentry);
    this.savebillentry.tokenNo = this.BillTypeForm.controls['TokenNum'].value;  //TokenNum controller
    this.savebillentry.billnoid = this.BillTypeForm.controls['BillRef'].value;  //Net Amount controller

    console.log("aftervalue___", this.savebillentry);

    // stop here if form is invalid
    if (this.BillTypeForm.invalid) {
      console.log('Error');
      return;
    }
    else {

      if (this.loginflag && this.BillTypeForm.valid) {
        console.log("Before_API_Save_Result", this.savebillentry);

        // On show details api call
        this.ApiMethods.postresultservice(this.ApiService.GetSalary, this.savebillentry).subscribe((resp:any) => {

          console.log("saveonlinebill_verify___", resp);
          let response = resp.result
          let data = response.tokenInfo
          this.billentry_info = data
          this.Popup_error_list = response.out_msg
          console.log("logoffdddattt___", data);

          // if (Object.keys(response).length > 0) {
          if (response.flag > 1) {
            // this.loader.setLoading(false);

            if (response.flag == 2) {
              console.log("fidddd", this.ButtonDisable);
              this.ButtonDisable = false
            }
            console.log("test1");

            this.BillEntry_flag = 2

            this.BillTypeForm.reset();
            this.BillTypeForm.patchValue({
              Treasury: this.savebillentry.treasurycode,
              Year: this.savebillentry.finyear,
            })

            this.getBillSubTypeList(data.BILL_TYPE,)  // call bill sub type list

            //Set value for payment mode
            let EcsData = ''
            if (data.PAYMENT_MODE == 'E') {
              EcsData = 'ECS'
            }
            else if (data.PAYMENT_MODE == 'C') {
              EcsData = 'Cheque'
            }
            else if (data.PAYMENT_MODE == 'A') {
              EcsData = 'N.A.'
            }

            //Set value for BFC Type
            let BFCMode = ''
            if (data.BFC_TYPE == 'P') {
              BFCMode = 'Plan'
            }
            else if (data.BFC_TYPE == 'N') {
              BFCMode = 'Non Plan'
            }
            else if (data.BFC_TYPE == 'C') {
              BFCMode = ' Central Assistance'
            }
            else if (data.BFC_TYPE == 'A') {
              BFCMode = 'N.A.'
            }

            //Set value for Head Type
            let HeadMode = ''
            if (data.HEAD_TYPE == 'V') {
              HeadMode = 'Voted'
            }
            else if (data.HEAD_TYPE == 'C') {
              HeadMode = 'Charged'
            }
            else if (data.HEAD_TYPE == 'A') {
              HeadMode = 'N.A.'
            }


            this.BillEntryForm.patchValue({
              Billtype: data.BILL_TYPE,
              PlanNonPlan: BFCMode,
              VotedCharged: HeadMode,
              ECSNONECS: EcsData,
              BudgetBal: data.BUDGET_AMOUNT,
            })

            if (data.BUDGET_AMOUNT <= data.GROSS_AMOUNT) {
              console.log("budgett_kitnahaoi__",data.BUDGET_AMOUNT,"grossamount_kitna_hai__",data.GROSS_AMOUNT);
              
              this.BudgetAmountF = true
            }
            else {
              this.BudgetAmountF = false
            }

            

            if (data.BANK_CODE == null) {
              if (data.PAYMENT_MODE == 'E') {
                let key = 'RBI';

                const BankFilter = this.BankList.filter((item: any) => { return item.BANKNAME.toLowerCase().includes(key.toLowerCase()) });
                console.log("bankli__flfilll__", BankFilter);
                this.BillEntryForm.patchValue({
                  bankName: BankFilter[0]
                })
                console.log("value_____asdf", BankFilter);
              }
            }
            else {
              const BankcodeFilter = this.BankList.filter((item: any) => { return item.BankBranchCode.toString().includes(data.BANK_CODE.toString()) });
              console.log("BankCode_filter", BankcodeFilter);
              this.BillEntryForm.patchValue({
                bankName: BankcodeFilter[0]
              })
              this.BillEntryForm.controls['bankName'].disable();
              console.log("bankcode__after", BankcodeFilter);
            }



            this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp:any) => {
              if (resp.result && resp.result.length > 0) {
                // this.BillTypeList.push(resp.result)
                let billData = resp.result.filter((item: any) => item.Ncode == data.BILL_TYPE);
                console.log("daatttt_", billData);

                if (billData.length > 0) {
                  this.billType = billData[0].BillType
                }
                // this.BillTypeList = resp.result
              }
            })

            this.savebillentry.treasurycode = this.Tcode.Treasury_Code
            this.savebillentry.finyear = this.Tcode.year
            this.savebillentry.billnoid = 0
            this.savebillentry.tokenNo = 0
            // this.savebillentry.tokenFinYear = this.Tcode.forwardYear

            if (this.BillEntry_flag == 2) {
              console.log("fdllll", data.BILL_TYPE);
              // this.Billselected = data.BillType.toString()
              // this.BillSubselected = data.BillSubType.toString()
              this.BillMonthSelect = data.DDO_BILL_MONTH.toString()
              this.BillYearSelect = data.DDO_BILL_YEAR.toString()
              this.budgetamt.demandNo = data.DEMANDNO

              // console.log("budgetheaddddd___", response.otherHead);

              // if (response.btDetails.length > 0) {
              //   var sumofbt = 0
              //   console.log("bt_and_deduction_resp__", response.btDetails);
              //   // const btTotal = response.btDetails.find((el: any) =>
              //   // {
              //   //   console.log("el______",el);
              //   //   el.Amount == "Amount"
              //   // })

              //   const btTotal = response.btDetails.map((el: any) => {
              //     console.log("el______", el.Amount);
              //     sumofbt = sumofbt + el.Amount
              //   })

              //   // var sumofbt_ded = Number(btTotal.amount) + Number(deductionTotal.amount)
              //   console.log("sumofdecutonandbt___", sumofbt);


              //   // // const found = response.btDetails.find((el: any) => el.DetailHead === "Total");
              //   // // console.log("ther_is_", found.amount,data.GROSS_AMOUNT ,data.CASH_AMOUNT);

              //   if (Math.abs(data.GROSS_AMOUNT - data.CASH_AMOUNT) != sumofbt) {
              //     console.log("ther_is_diff_between_bt_",);
              //     this.BT_valid = true
              //   }

              // }

              if (response.btDetails.length > 0) {
                console.log("bt_and_deduction_resp__", response.btDetails);
                const btTotal = response.btDetails.find((el: any) => el.DetailHead === "Total");
                console.log("sumofdecutonandbt___", btTotal);


                // const found = response.btDetails.find((el: any) => el.DetailHead === "Total");
                // console.log("ther_is_", found.amount,data.GROSS_AMOUNT ,data.CASH_AMOUNT);

                // if (Math.abs(data.GROSS_AMOUNT - data.CASH_AMOUNT) != btTotal.AMOUNT) {
                //   // alert(data.GROSS_AMOUNT+"===>"+data.CASH_AMOUNT+"====>"+btTotal);
                //   console.log("ther_is_diff_between_data_", data);

                //   //console.log("ther_is_diff_between_bt_",data.GROSS_AMOUNT,"===>",data.CASH_AMOUNT,"====>",btTotal.Amount);
                //   // this.BT_valid = true
                //   this.Tcode.BT_valid = true;
                //   this.New_billcode_flag = true
                // }

              }
              if ((response.btDetails.length > 0) && (Math.abs(data.GROSS_AMOUNT - data.CASH_AMOUNT) != 0)) {
                this.BT_flag = true

                this.dataSource1.data = response.btDetails;
              }
              if ((response.more_head.length > 0) && (Math.abs(data.GROSS_AMOUNT - data.HEAD_GROSS) != 0)) {
                this.Morehead_flag = true
                this.MoreHeadSource.data = response.more_head;
              }

              if (Object.keys(response.bill_type_wise).length > 0) {

                //bill type 7 loan book 
                if (response.bill_type_wise.LOAN) {
                  console.log("loannn__Data", response.bill_type_wise.LOAN);
                  this.LoanSource = response.bill_type_wise.LOAN
                  this.Loan_flag = true
                }

                //bill type 26 RDCCD book 
                if (response.bill_type_wise.RDCCD) {
                  console.log("rdccd__Data", response.bill_type_wise.RDCCD);
                  this.RDCCDSource = response.bill_type_wise.RDCCD
                  this.RDCCD_Tableflag = true
                }

                //bill type 36 WAM book 
                if (response.bill_type_wise.WAM) {
                  console.log("WorkInvoiceSource__Data", response.bill_type_wise.WAM);
                  this.WorkInvoiceSource = response.bill_type_wise.WAM
                  this.WorkITableflag = true
                }

                //bill type 11 AC book 
                if (response.bill_type_wise.ACBILL) {
                  console.log("ACBillSource__Data", response.bill_type_wise.ACBILL);
                  this.ACBillSource = response.bill_type_wise.ACBILL
                  this.ACBIllTableflag = true
                }

                //bill type 13 Aid and insititution book
                if (response.bill_type_wise.UCBILL) {
                  console.log("Graintinaid__Data", response.bill_type_wise.UCBILL[0]);
                  let data = response.bill_type_wise.UCBILL[0]
                  this.GrantAidSource.push({
                    'UCREQUIRED': data.UCREQUIRED,
                    'SANCTIONNO': data.SANCTIONNO,
                    'SANCTIONDATE': data.SANCTIONDATE,
                    'SANCTIONAUTHORITY': data.SANCTIONAUTHORITY,
                    'REMARK': data.REMARK,
                  })
                  this.GrantIn_Aid_Tableflag = true

                  this.InsitituionSource = data.INSTITUTION_DETAIL
                  this.Insitituion_TabFlag = true
                }

              }


              console.log("test3");
              const toWords = new ToWords();

              let words = toWords.convert(data.GROSS_AMOUNT, { currency: true });
              // words = Four Hundred Fifty Two Rupees Only


              console.log("ruppeinwordss__", words);
              const month = this.MonthList.filter((item: any) => item.MonthCode === data.DDO_BILL_MONTH)[0].MonthName;
              this.BillEntryForm.patchValue({
                PdAcc: data.PDACC_NO == 0 ? 'No PdAcc' : data.PDACC_NO,
                Division: data.DIVISION_CODE == 0 ? 'No division' : data.DIVISION_CODE,
                DdoBillNo: data.DDO_BILL_NO,
                officeid: data.OFFICE_CODE,
                DdoBillDate: formatDate(new Date(data.DDO_BILL_DATE), 'dd/MM/yyyy', 'en'),
                DdoName: data.DDO_CODE,
                DetailHead: data.BUDGETHEAD1,
                ObjectHead: data.OBJECT_HEAD_NAME,
                GrossAmt: data.GROSS_AMOUNT,
                HeadGross: data.HEAD_GROSS,
                NetAmt: data.CASH_AMOUNT,
                HeadOffice: data.HOD + ' (' + data.HOD_NAME,
                budgetval: Math.abs(data.GROSS_AMOUNT - data.CASH_AMOUNT),
                BillMonth: month + '-' + data.DDO_BILL_YEAR
              })
              console.log("test4", this.BillEntryForm);
              this.grossAmtInword = toWords.convert(data.GROSS_AMOUNT, { currency: false })

              this.TokenNo = data.TOKEN_NO
              this.RefNo = data.CDE_REFNO
              this.Sch_Code = data.SCHEME_CODE

              console.log("thistoen____", this.TokenNo, this.RefNo, data.CDE_REFNO
              );

              // if (response.otherHead.Amount + data.HeadGross != data.GROSS_AMOUNT) {
              //   this.CommonErr4 = true
              //   this.LableMsg = this.Tcode.CE4()
              //   this.New_billcode_flag = true
              // }
              // if (response.otherHead.BudgetHead != data.BUDGETHEAD) {
              //   this.CommonErr5 = true
              //   this.New_billcode_flag = true
              // }
              // var More_objh = data.ObjectHead.split("-");

              // if (response.otherHead.BudgetHead != data.BUDGETHEAD &&
              //   response.otherHead.PnNP == data.PlanNonPlan && response.otherHead.VnC == data.VotedCharged &&
              //   response.otherHead.ObjectHead == More_objh[0]) {
              //   this.CommonErr7 = true
              //   this.New_billcode_flag = true
              // }

            }



            // }

            // // budget check amount body set
            // var Budget_DetiH = data.ObjectHead.split("-");

            // this.CheckBudgetAmt.detailHead = data.BudgetHead
            // this.CheckBudgetAmt.objectHead = Budget_DetiH[0]
            // this.CheckBudgetAmt.planNonPlan = data.PlanNonPlan
            // this.CheckBudgetAmt.votedCharged = data.VotedCharged
            // this.CheckBudgetAmt.pdAcNo = data.PdAcNo
            // this.CheckBudgetAmt.officeId = data.OfficeId
            // this.CheckBudgetAmt.billtype = data.BillType
            // this.CheckBudgetAmt.billsubtype = data.BillSubType
            // this.CheckBudgetAmt.billmonth = data.DdoBillMonth

            // console.log("apidata_beforebudget___", this.CheckBudgetAmt
            // );

            // budget check amount body set
            var officeCode = this.billentry_info.OFFICE_CODE.split("-");
            console.log("officeid_load_salary", officeCode[0]);
            var objectHarr = this.billentry_info.OBJECT_HEAD_NAME.split("-");
            console.log("ObjectH_save", objectHarr);
            this.CheckBudgetAmt.detailHead = this.billentry_info.BUDGETHEAD,
              this.CheckBudgetAmt.objectHead = objectHarr[0],
              this.CheckBudgetAmt.bfcType = this.billentry_info.BFC_TYPE,
              this.CheckBudgetAmt.headType = this.billentry_info.HEAD_TYPE,
              this.CheckBudgetAmt.pdAcNo = this.billentry_info.PDACC_NO,
              this.CheckBudgetAmt.officeId = this.billentry_info.HOD,
              this.CheckBudgetAmt.billtype = this.billentry_info.BILL_TYPE,
              this.CheckBudgetAmt.billsubtype = this.billentry_info.SUB_BILLTYPE,
              this.CheckBudgetAmt.billmonth = this.billentry_info.DDO_BILL_MONTH,

              console.log("onload_budgetmodal___", this.CheckBudgetAmt
              );

            this.BalanceBudgetCheck() //balance budget check api call
            // this.bilLExist_Verify()   // check bill exist api call

            // this.CheckBillSave(0) //Under workig facing issue

            // this.OfficeId_Verify()      //Check office api call


            // this.CheckBillDuplication(data) // check bill no duplicate or not

            if ((data.BUDGETHEAD == "8443001060000") && (data.BILL_TYPE == 20)) {
              // this.CommonErr1 = true
              this.Tcode.CommonErr1 = true
              this.New_billcode_flag = true
            }
            if ((data.BUDGETHEAD == "8443001060000") && (data.PDACC_NO == 20 || data.PDACC_NO <= 0)) {
              // this.CommonErr2 = true
              this.Tcode.CommonErr2 = true
              this.New_billcode_flag = true
            }
            if ((data.PDACC_NO != 0) && (data.BILL_TYPE != 37 && data.BILL_TYPE != 9 && data.BILL_TYPE != 21)) {
              // this.CommonErr3 = true
              this.Tcode.CommonErr3 = true
              this.New_billcode_flag = true
            }



            if (data.GROSS_AMOUNT != data.HEAD_GROSS) {

              var detailH = this.BillEntryForm.controls['DetailHead'].value.split("-");


              if (data.GROSS_AMOUNT < data.HEAD_GROSS) {
                // this.CommonErr4 = true
                this.Tcode.CommonErr4 = true
                this.LableMsg = this.Tcode.CE4()
                this.Objection_ErrMsg = true
              }
              else if (detailH[0] >= 8000 || this.BudgetDetails.length > 0) {
                // this.CommonErr5 = true
                this.Tcode.CommonErr5 = true
                this.New_billcode_flag = true
              }
            }
          }
          else {
            this.snackbar.show(response.out_msg[0].MSG, 'danger')
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
      else {
        alert('Captcha Failed');
      }
    }



  }

  onReset() {
    this.BillEntry_flag = 1
    this.BT_flag = true
    this.Morehead_flag = true
    this.Section_flag = true
    this.Institution_flag = true
    this.BillEntryForm.reset();
    this.BillTypeForm.reset();
    this.budget_Status = false
    this.GrantIn_Aid_Tableflag = false
    this.Tcode.Billtype_error1 = false
    this.Tcode.Billtype_error2 = false
    this.Tcode.Billtype_error3 = false
    this.Tcode.Billtype_error4 = false
    this.Tcode.Billtype_error5 = false
    this.Tcode.Billtype_error6 = false
    this.Tcode.Billtype_error7 = false
    this.Tcode.Billtype_error8 = false
    this.Tcode.Billtype_error9 = false

    this.Tcode.CommonErr1 = false
    this.Tcode.CommonErr2 = false
    this.Tcode.CommonErr3 = false
    this.Tcode.CommonErr4 = false
    this.Tcode.CommonErr5 = false
    this.Tcode.CommonErr6 = false
    this.Tcode.CommonErr7 = false
    this.Tcode.CommonErr8 = false
    this.Tcode.CommonErr9 = false

    this.BillTypeForm.patchValue({
      Treasury: this.savebillentry.treasurycode,
      Year: this.savebillentry.finyear,
    })
    this.BillEntryForm.patchValue({
      AuditDate: this.datepicker,
    })
    this.SectionDetail = []
    this.PayDetails = []
    this.BudgetDetails = []
    document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.router.navigate(['OnLineBillList'], { queryParams: {} });

  }

  AddComment() {
    let cmt = this.ObjectForm.controls['commentval'].value;
    if (cmt) {
      console.log("show__commm___t", cmt);
      this.Commentlist.push(cmt)
      this.ObjectForm.reset()
    }
  }

  //muliple selection common objection list data
  selectcommentlist(value: any) {
    console.log("final_commone", value);

    if (!this.comment_selectionlist.includes(value)) {          //checking weather array contain the id
      this.comment_selectionlist.push(value);               //adding to array because value doesnt exists
    } else {
      this.comment_selectionlist.splice(this.comment_selectionlist.indexOf(value), 1);  //deleting
    }
    console.log("Commentlist__arrrr_", this.comment_selectionlist);
  }

  showHideDocumentFiles() {
    if (this.showHideDocument == "< Show Doc") {
      this.showHideDocument = "Hide Doc >";
    } else {
      this.showHideDocument = "< Show Doc";
    }
  }

  RemoveComment() {
    console.log("commentlist___log", this.Commentlist);
    console.log("comment_selectionlist___log", this.comment_selectionlist);

    this.Commentlist = this.Commentlist.filter((el) => !this.comment_selectionlist.includes(el));
    console.log("fadsffaf", this.Commentlist);
  }

  get TokenNum() { return this.BillTypeForm.get('TokenNum') }
  get BillRef() { return this.BillTypeForm.get('BillRef') }
  get Treasury() { return this.BillTypeForm.get('Treasury') }
  get Year() { return this.BillTypeForm.get('Year') }

  get DdoName() { return this.BillEntryForm.get('DdoName') }
  get AuditDate() { return this.BillEntryForm.get('AuditDate') }
  get DdoBillNo() { return this.BillEntryForm.get('DdoBillNo') }
    get officeid() { return this.BillEntryForm.get('officeid') }
  get DdoBillDate() { return this.BillEntryForm.get('DdoBillDate') }
  get Billtype() { return this.BillEntryForm.get('Billtype') }
  get PayMonth() { return this.BillEntryForm.get('PayMonth') }

  get BillSubType() { return this.BillEntryForm.get('BillSubType') }
  get DetailHead() { return this.BillEntryForm.get('DetailHead') }
  get ObjectHead() { return this.BillEntryForm.get('ObjectHead') }
  get ChequeDate() { return this.BillEntryForm.get('ChequeDate') }
  get Division() { return this.BillEntryForm.get('Division') }
  get GrossAmt() { return this.BillEntryForm.get('GrossAmt') }
  get NetAmt() { return this.BillEntryForm.get('NetAmt') }
  get PdAcc() { return this.BillEntryForm.get('PdAcc') }
  get HeadOffice() { return this.BillEntryForm.get('HeadOffice') }
  get BudgetBal() { return this.BillEntryForm.get('BudgetBal') }
  get budgetval() { return this.BillEntryForm.get('budgetval') }
  get HeadGross() { return this.BillEntryForm.get('HeadGross') }
  get BillMonth() { return this.BillEntryForm.get('BillMonth') }
  get BillYear() { return this.BillEntryForm.get('BillYear') }

  viewDocument() {
    this.IsOpen = !this.IsOpen
  }


  tokenStatus(field: any, title: any, btnText: any) {
    this._dialog.open(CommonDialogComponent,
      {
        panelClass: 'dialog-w-50', autoFocus: false
        ,
        height: "auto",
        width: "40%",
        data: {
          message: title,
          // field: field,
          error_info: this.Popup_error_list,
          id: 'billError',
          // btnText: btnText
        }
      }
    );
  }


}


