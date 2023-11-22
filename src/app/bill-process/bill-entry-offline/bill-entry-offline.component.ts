import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from "rxjs";
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiService } from 'src/app/utils/utility.service';
import { GetBillVoucher, IBudgetAmountCheck, IGetObjectionDataList, ISaveBillEntry, ISaveObjection } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatDialog, } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import * as Val from '../../utils/Validators/ValBarrel'

import * as rxjs from 'rxjs'
import * as rxops from 'rxjs/operators'
import { log } from 'console';
export interface BillTypeMaster {
  TokenNum: number;
  BillRef: number;
}
@Component({
  selector: 'app-bill-entry-offline',
  templateUrl: './bill-entry-offline.component.html',
  styleUrls: ['./bill-entry-offline.component.scss']
})
export class BillEntryOfflineComponent implements OnInit {
  IsOpen: boolean = true;
  IsObjectionOpen: boolean = false
  IsObjectionBill: any = {
    Objbillcode: '',
    Objbilltype: '',
    userType: 2,
    userId: this.Tcode.UserId,
    pageType: "1",
    routeFrom: 'BillEntry'
  }
  ChooseOption: any = '';

  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  displayedColumns: string[] = ['BudgetHead', 'ObjectHead', 'PnNP', 'VnC', 'OfficeId', 'Grossamt'];
  dataSource = new MatTableDataSource();

  displayedColumns1: string[] = ['DetailHead', 'ObjectHead', 'Division', 'PnNP', 'VnC', 'PDAcNo', 'SanctionNo', 'SanctionDate', 'Amount', 'TreasuryName'];
  dataSource1 = new MatTableDataSource();

  displayedBookT: string[] = ['BudgetHead', 'ObjectHead', 'Concern Pnp', 'Concern Vnc', 'PDAcNo', 'Concern Division', 'Amount', 'Sanction No', 'Sanction Date', 'For Treasury', 'Concern PDAcNo', 'Concern BudgetHead', 'Concern ObjectHead', 'Action'];
  BookTSource: any[] = [];

  displayedACBill: string[] = ['Dc Pending', 'Sanction No', 'Sanction Date', 'Purpose', 'Action'];
  ACBillSource: any[] = [];

  displayedPension: string[] = ['PPO No', 'Cash Amount', 'PPO Flag', 'Action'];
  PensionSource: any[] = [];

  displayedGrant: string[] = ['UC Required', 'Sanction No', 'Sanction Date', 'Sanction Date Validity', 'Sanction Authrity', 'Purpose', 'Action'];
  GrantAidSource: any[] = [];

  displayedRDCCD: string[] = ['SR. No.', 'Challan No', 'Challan Date', 'Amount', 'Party Name', 'GRN', 'Action'];
  RDCCDSource: any[] = [];

  displayedWorkInvoice: string[] = ['Invoice No', 'Invoice Date', 'Work Order Date', 'Work Order No', 'Party Name', 'Action'];
  WorkInvoiceSource: any[] = [];

  Auditoroptions: Observable<any[]> | undefined;

  PayAllowSum: any = 0

  PayAllowData = [{
    id: '120', name: '120-FTA', Amount: 0
  },
  {
    id: '121', name: '121-MTA', Amount: 0
  },
  {
    id: '122', name: '122-APA', Amount: 0
  },
  {
    id: '123', name: '123-ROP', Amount: 0
  },
  {
    id: '109', name: '109-Wash Allo.', Amount: 0
  },
  {
    id: '110', name: '110-Cycle All', Amount: 0
  },
  {
    id: '111', name: '111-CA', Amount: 0
  },
  {
    id: '112', name: '112-Handi. All', Amount: 0
  },
  {
    id: '113', name: '113-Ohter All', Amount: 0
  },
  {
    id: '114', name: '114-Cent. All', Amount: 0
  },
  {
    id: '115', name: '115-CMF', Amount: 0
  },
  {
    id: '116', name: '116-Med.Allo.', Amount: 0
  },
  {
    id: '117', name: '117-Mess.All.', Amount: 0
  },
  {
    id: '118', name: '118-Lib. Allo.', Amount: 0
  },
  {
    id: '119', name: '119-HDA', Amount: 0
  },
  {
    id: '101', name: '101-SPI Pay', Amount: 0
  },
  {
    id: '102', name: '102-Leave Pay', Amount: 0
  },
  {
    id: '103', name: '103-Pers.Pay', Amount: 0
  },
  {
    id: '104', name: '104-DA', Amount: 0
  },
  {
    id: '105', name: '105-Addl.DA', Amount: 0
  },
  {
    id: '106', name: '106-IR', Amount: 0
  },
  {
    id: '107', name: '107-HRA', Amount: 0
  },
  {
    id: '108', name: '108-CCA', Amount: 0
  },
  {
    id: '97', name: '97-FDA', Amount: 0
  },
  {
    id: '98', name: '98-DP', Amount: 0
  },
  {
    id: '99', name: '99-NPA', Amount: 0
  },
  {
    id: '100', name: '100-Basic', Amount: 0
  },
  ]

  Ddomaster: MatTableDataSource<BillTypeMaster> = new MatTableDataSource();
  showHideDocument: string = "< Show Doc";
  showFiller = false;
  ButtonDisable: boolean = true
  GetObjectionListModal: IGetObjectionDataList = {
    type: 1,  // For All Objection
    billNo: 0,
    userId: this.Tcode.UserId,
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
  SaveModal: ISaveBillEntry = {
    finYearFrom: this.Tcode.year,
    bankCode: 0,
    chequeDate: '',
    userId: this.Tcode.UserId,
    auditiorflag: 'P',
    objectionTypeCode: '0000',
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
  SaveOjection: ISaveObjection = {
    userid: this.Tcode.UserId,
    // type: 1,
    otherList: '',
    objectionlist: '',
    userType: 5,
    treasuryRefNo: 0,
    // pageType: "1"
  }

  Bfctype_check: boolean = false
  Headtype_check: boolean = false
  Objecthead_check: boolean = false
  MBHAutoCHeck: boolean = false

  new_billcode: any = ''
  SelectBilltype: any = ''
  SelectBillSubtype: any = ''
  SelectObjectHead: any = ''
  SelectDdoName: any = ''
  SelectMajorHead: any = ''
  SelectBTConMajorHead: any = ''
  SelectBTConDetailHead: any = ''
  SelectDetailHeadd: any = ''
  SelectService_DetailHeadd: any = ''
  SelecBTConObjecthead: any = ''
  PdAcc_Name: any = ''
  SelectConPdAcc: any = ''
  SelectDivision: any = ''
  SelectPdAcc: any = ''
  SelecBTObjecthead: any = ''
  SelecService_Majorhead: any = ''
  SelectConDivision: any = ''
  SumBTAmt: any = 0
  SelectMBObjectHead: any = ''

  loginflag: any = true
  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  dataO: Array<any> = [];
  dataB: Array<any> = [];
  billentry_info: any;
  // Form Module
  BillTypeForm: any;
  BillEntryForm: any;
  ObjectForm: any;
  BookTForm: any;
  MoreHForm: any;
  LoanBForm: any;
  ServiceBlockForm: any;
  AdvanceC_Form: any;
  PDACCForm: any;
  SanctionDForm: any;
  WorkDBForm: any;
  Insitituion_Form: any;
  RDCCDForm: any;
  GrantInAid_Form: any;
  PensionBForm: any;
  WorkInvForm: any;
  PayallowForm: any;

  Base64Str: any = ''
  Imgshow: boolean = false
  PPoFlag_C: any = 'P'
  SearchOptions: Observable<any[]> | undefined;
  //Flags

  BillEntry_flag: any = 1;
  Morehead_flag: boolean = true;
  deduction_flag: boolean = true;
  ACBlock_flag: boolean = false;
  Loan_flag: boolean = false
  Service_flag: boolean = false
  WorkInv_Flag: boolean = false
  PDAcc_flag: boolean = false
  RDCCD_Flag: boolean = false
  PayAllow_Flag: boolean = false
  Pension_flag: boolean = false
  Section_flag: boolean = true;
  RDCCD_Tableflag: boolean = false
  WorkITableflag: boolean = false


  Api_erroFlag: boolean = false
  Verify_done: boolean = false
  Bankselected: any = '';
  BillMonthSelect: any = ''
  BillYearSelect: any = ''
  check_pd_status: any = 0

  MorehAddNewflag: boolean = false
  ACBIllTableflag: boolean = false
  GrantIn_Aid_Tableflag: boolean = false
  Pension_Tableflag: boolean = false
  Insitituion_TabFlag: boolean = false


  //objection container
  objection_flag: boolean = true
  categories: any[] = [];
  CommonObjection: any[] = []
  BillTypeObjection: any[] = []
  Ischecked: boolean = false;

  Commentlist: any[] = []

  LableMsg: any = ''
  budgetHead_valid: any = ''
  New_billcode_flag: boolean = false
  Objection_ErrMsg: boolean = false
  BillNoDuplicate: boolean = false


  budgetamt: any = {
    budgetAmount: 0,
    demandNo: 0
  }
  Common_objlist: any = []
  Billtype_objlist: any = []
  comment_selectionlist: any = []
  BtAddNewflag: boolean = false
  BTAutoCHeck: boolean = false
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
  BillTypeList: Observable<any[]> | undefined;
  BillTypeListarr: any[] = []

  BillSubTypeList: Observable<any[]> | undefined;
  ObjectHeadList: Observable<any[]> | undefined;
  DodoNameList: Observable<any[]> | undefined;
  DdoNameListarr: any[] = []

  BTMajorHeadList: Observable<any[]> | undefined;
  BTMajorHeadListarr: any[] = []

  BTConMajorHeadList: Observable<any[]> | undefined;
  BTConMajorHeadListarr: any[] = []

  BTDetailHeadList: Observable<any[]> | undefined;
  BTDetailHeadListarr: any[] = []

  BTConDetailHeadList: Observable<any[]> | undefined;
  BTConDetailHeadListarr: any[] = []

  BTDivisionListList: Observable<any[]> | undefined;
  BTDivisionListListarr: any[] = []

  BTConDivisionListList: Observable<any[]> | undefined;
  BTConDivisionListListarr: any[] = []

  BTPdAccList: Observable<any[]> | undefined;
  BTPdAccListarr: any[] = []

  BTConPdAccList: Observable<any[]> | undefined;
  BTConPdAccListarr: any[] = []

  BTObjectHeadList: Observable<any[]> | undefined;
  BTObjectHeadListarr: any[] = []

  BTConObjectHeadList: Observable<any[]> | undefined;
  BTConObjectHeadListarr: any[] = []

  MBObjectHeadList: Observable<any[]> | undefined;
  MBObjectHeadListarr: any[] = []

  SBMajorHeadList: Observable<any[]> | undefined;
  SBMajorHeadListarr: any[] = []

  SBDetailsHeadList: Observable<any[]> | undefined;
  SBDetailsHeadListarr: any[] = []

  SectionDetail: any[] = [];
  PayDetails: any;
  BudgetDetails: any[] = [];
  OtherBTDeatls: any[] = [];

  displayedMoreH: string[] = ['BuddgetHead', 'ObjectHead', 'BFC', 'Head', 'Amount', 'Budget_Amount', 'Action'];
  MoreHDeatls: any[] = [];

  displayedInsitituion: string[] = ['Insitituion Code', 'Insitituion Name', 'Insitituion Amount', 'Action'];
  InsitituionSource: any[] = [];

  InsitituionList: Observable<any[]> | undefined;

  DeductionDetails: any[] = [];
  GiantAid_details: any[] = []
  Instituation_details: any[] = []

  ACBlockDetails: any[] = []
  LoanDetails: any[] = []


  bankSelect: any;

  Billselected: any;
  BillSubselected: any;
  selectedText: any = "";

  mat_Paymode: string = ''
  mat_Voted: string = ''
  mat_SF: string = ''

  Popup_error_list: any[] = [];
  Grant_in_aid_flag: boolean = false
  WorkB_Flag: boolean = false
  Institution_flag: boolean = false
  modeofpay: boolean = true
  TokenNo: any = ''
  RefNo: any = ''
  BT_Input_flag: boolean = true
  // helpermsg: any = Helper
  maxDate: any = new Date()
  // display: Observable<'open' | 'close'>;
  // <-------- radio flag end
  constructor(private router: Router, public _dialog: MatDialog, private routing: ActivatedRoute, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService,
    public Tcode: Helper, private finyear_: Helper, private toyear_: Helper,
    private snackbar: SnackbarService
  ) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    // this.Billselected = "20";

    this.getBankList()  // Call Bank List
    this.getBillTypeList() //call bill type list
    this.getDdoNameList()  //call ddo name list
    this.getMajorHeadList()  //Call Major Head List
    this.getMajorHeadList1()  //Call Major Head List for reverse entry BT


    this.getBTObjectHeadList() //call api for bt object head list
    this.getBTConObjectHeadList()
    this.getDivisionList()
    this.getConDivisionList
    this.getMBObjectHeadList()
    this.getService_MajorHeadList()
    this.getInsititutionList()
  }


  ngOnInit() {

    let financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324


    //Bill type form

    this.BillTypeForm = new FormGroup({
      TreasuryControl: new FormControl({ value: '' }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      Year: new FormControl({ value: financialYr, disabled: true }),
      TokenNum: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(12)])),


    });


    // Params value get
    this.routing.queryParams.subscribe((params: any) => {
      console.log("ParamPrint____", params)

      if (Object.keys(params).length > 0) {
        this.loader.setLoading(true);

        this.BillTypeForm.patchValue({
          TokenNum: params.billToken,
        })
        // this.getBillTypeList() //call bill type list

        this.OnShowDetails();
      }

    })


    //  console.log("Required==>>", this.BillTypeForm);

    //Bill entry form
    this.BillEntryForm = new FormGroup({
      DdoName: new FormControl(''),
      DdoBillNo: new FormControl('', [Val.Required, Val.Numeric]),
      officeid: new FormControl('', [Val.Required, Val.maxLength(13), Val.Numeric, Val.cannotContainSpace]),
      DdoBillDate: new FormControl(''),
      Billtype: new FormControl(''),
      PayMonth: new FormControl(''),
      BillSubType: new FormControl(''),
      DetailHead: new FormControl('', [Val.Required, Val.maxLength(13), Val.Numeric]),
      ObjectHead: new FormControl('', [Validators.required]),
      Division: new FormControl('0', [Val.Required, Val.maxLength(5), Val.Numeric]),
      GrossAmt: new FormControl('', [Val.Required, Val.maxLength(40), Val.Numeric]),
      NetAmt: new FormControl('', [Val.Required, Val.maxLength(100), Val.Numeric]),
      HeadGross: new FormControl('', [Val.Required, Val.maxLength(100), Val.Numeric]),
      PdAcc: new FormControl('0', [Val.Required, Val.maxLength(5), Val.Numeric]),
      HeadOffice: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      BudgetBal: new FormControl({ value: '', disabled: true }, [Validators.required]),
      budgetval: new FormControl({ value: '', disabled: true }, [Validators.required]),
      toDate: new FormControl(new Date()),
      BillMonth: new FormControl({ value: this.Tcode.month, disabled: true }),
      BillYear: new FormControl({ value: this.Tcode.currentYear, disabled: true }),
      VotedCharged: new FormControl(''),
      ECSNONECS: new FormControl(''),
      PlanNonPlan: new FormControl(),
      payMode: new FormControl({ value: 'NA', disabled: true }),
      bankName: new FormControl(''),
    })
    this.ObjectForm = new FormGroup({
      commentval: new FormControl(''),
    })
    this.BookTForm = new FormGroup({
      BTMajorHead: new FormControl(''),
      BTDivision: new FormControl(''),
      BTPlanNonPlan: new FormControl({ value: 'P', disabled: false }),
      BTVotedCharged: new FormControl({ value: 'V', disabled: false }),
      BTAmount: new FormControl(''),
      BTSanctionNo: new FormControl(''),
      BTPurpose: new FormControl(''),
      BTSancationDate: new FormControl(''),
      BTDetailHead: new FormControl(''),
      BTObjectHead: new FormControl(''),
      BTPdAcc: new FormControl(''),

      BTConMajorHead: new FormControl(''),
      BTConDetailHead: new FormControl(''),
      BTConObjectHead: new FormControl(''),
      BTConPdAcc: new FormControl(''),
      BTConDivision: new FormControl(''),
      BTConPlanNonPlan: new FormControl({ value: 'P', disabled: false }),
      BTConVotedCharged: new FormControl({ value: 'V', disabled: false }),
    })
    this.MoreHForm = new FormGroup({
      MB_DetailHead: new FormControl('', [Val.Required, Val.maxLength(13), Val.Numeric]),
      MB_PlanNonPlan: new FormControl({ value: 'P', disabled: false }),
      MB_VotedCharged: new FormControl({ value: 'V', disabled: false }),
      MB_Amount: new FormControl('0'),
      MB_ObjectHead: new FormControl(''),
    })
    this.LoanBForm = new FormGroup({
      GPFPolicy: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
      EmployeeN: new FormControl('', [Val.Required, Val.NotSpecialChar]),
      AuthorityNo: new FormControl('', [Val.Required, Val.maxLength(12), Val.Numeric]),
    })
    this.LoanBForm = new FormGroup({
      GPFPolicy: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
      EmployeeN: new FormControl('', [Val.Required, Val.NotSpecialChar]),
      AuthorityNo: new FormControl('', [Val.Required, Val.maxLength(12), Val.Numeric]),
    })
    this.ServiceBlockForm = new FormGroup({
      ServiceMajorHead: new FormControl(''),
      ServiceDetailsHead: new FormControl(''),
    })
    this.AdvanceC_Form = new FormGroup({
      AC_DC_Pending: new FormControl(''),
      AC_Sanction_No: new FormControl('', [Val.Required, Val.maxLength(8), Val.Numeric]),
      AC_Sanction_Date: new FormControl(''),
      AC_Purpose: new FormControl('', [Val.Required, Val.maxLength(100), Val.NotSpecialChar]),
      AC_Sanction_Authority: new FormControl('', [Val.maxLength(50), Val.NotSpecialChar]),
    })
    this.GrantInAid_Form = new FormGroup({
      Uc_Required: new FormControl(''),
      GA_Sanction_No: new FormControl('', [Val.Required, Val.maxLength(8), Val.Numeric]),
      GA_Sanction_Date: new FormControl('', [Val.Required]),
      GA_Sanction_Valid_Date: new FormControl('', [Val.Required]),
      GA_Purpose: new FormControl('', [Val.maxLength(50), Val.NotSpecialChar]),
      GA_Sanction_Authority: new FormControl('', [Val.Required, Val.maxLength(50), Val.NotSpecialChar]),
    })

    this.PDACCForm = new FormGroup({
      PDAccount_No: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
    })
    this.SanctionDForm = new FormGroup({
      FD_SanctionNo: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
      FD_SanctionDate: new FormControl('', [Val.Required]),
      Order_NO: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
      Order_Date: new FormControl('', [Val.Required])
    })
    this.WorkDBForm = new FormGroup({
      Cheque_No: new FormControl('', [Val.Required, Val.Numeric]),
      Cheque_Date: new FormControl('', [Val.Required]),
    })
    this.PensionBForm = new FormGroup({
      PPoNo: new FormControl('', [Val.Required, Val.NotSpecialChar]),
      PPoFlag: new FormControl('',),
      PPoCash: new FormControl('', [Val.Required, Val.Numeric]),
    })
    this.Insitituion_Form = new FormGroup({
      Insitituion_Code: new FormControl(''),
      Amount: new FormControl('', [Val.Required]),
    })
    this.RDCCDForm = new FormGroup({
      Challan_No: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
      Challan_Date: new FormControl('', [Val.Required]),
      RDAmount: new FormControl('', [Val.Required, Val.Numeric]),
      Sr_No: new FormControl('', [Val.Required, Val.Numeric]),
      Name: new FormControl('', [Val.Required, Val.NotSpecialChar]),
    })

    this.WorkInvForm = new FormGroup({
      Invoice_Date: new FormControl('', [Val.Required]),
      Invoice_No: new FormControl('', [Val.Required, Val.maxLength(5), Val.Numeric]),
      WorkO_Date: new FormControl('', [Val.Required]),
      WorkO_No: new FormControl('', [Val.Required, Val.Numeric]),
      WorkIName: new FormControl('', [Val.Required, Val.NotSpecialChar]),
    })

    this.PayallowForm = new FormGroup({
      PayId: new FormControl('', [Val.Required, Val.Numeric]),
      PayAmount: new FormControl('', [Val.Required, Val.Numeric]),

      PayBasic: new FormControl(''),
      PayFDA: new FormControl(''),
      PayHRA: new FormControl(''),
      PayCCA: new FormControl(''),
      PayCA: new FormControl(''),
      PayHand: new FormControl(''),
      PayOther: new FormControl(''),
      PayCent: new FormControl(''),
      PayCMF: new FormControl(''),
      PayMED: new FormControl(''),

      PayMES: new FormControl(''),
      PayLIB: new FormControl(''),
      PayHDA: new FormControl(''),
      PayFTA: new FormControl(''),
      PayMTA: new FormControl(''),
      PayAPA: new FormControl(''),
      PayRDP: new FormControl(''),
      PayWash: new FormControl(''),
      PayCycle: new FormControl(''),
      PaySPI: new FormControl(''),

      PayLeave: new FormControl(''),
      PayPers: new FormControl(''),
      PayDA: new FormControl(''),
      PayAddl: new FormControl(''),
      PayIR: new FormControl(''),
      PayDP: new FormControl(''),
      PayNPA: new FormControl(''),
    })

    this.getTreasuryList()



  }

  // Call Auditor List API >>>------------------->
  getTreasuryList() {
    this.loader.setLoading(true);
    //this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode + "/" + this.GetAutoProcessStatusModal.tblName).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp: any) => {

      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.BillTypeForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("logg_uinvampop_", value);

            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filter(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
        this.BillTypeForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.Tcode.Treasury_Code != "5000") {
          this.BillTypeForm.controls['TreasuryControl'].disable();
        }
      }
    })
    this.loader.setLoading(false);
  }

  filter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }
  displayFn_tres(selectedoption: any) {
    console.log("display_fun_call aaa", selectedoption);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  // Calling API for Bank List  
  getBankList() {
    console.log("bankList_before", this.BankList);
    this.ApiMethods.getservice(this.ApiService.BankList + '/' + this.Tcode.Treasury_Code + '/' + 3).subscribe((resp: any) => {
      console.log("BankList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BankList = resp.result
      }
    })
    console.log("BankList_after", this.BankList);
  }

  // Calling API for Objection List  
  getCommonObjectlist() {
    console.log("CommonObjection_before", this.CommonObjection);

    this.ApiMethods.getservice(this.ApiService.ObjectionDetail + '0').subscribe((resp: any) => {
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

    this.ApiMethods.getservice(this.ApiService.ObjectionDetail + data.BillType).subscribe((resp: any) => {
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

    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp: any) => {
      console.log("BillTypeList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.BillTypeList = resp.result
        this.BillTypeListarr = resp.result

        this.BillTypeList = this.BillEntryForm.controls['Billtype'].valueChanges.pipe(
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
    this.SelectBilltype = this.BillEntryForm.value.Billtype

    console.log("slelction__________option_____Biltypoe", this.SelectBilltype, this.BillEntryForm.value.Billtype);
    this.getBillSubTypeList(this.SelectBilltype.Ncode)
    if (this.SelectBilltype.Ncode == 7 || this.SelectBilltype.Ncode == 8) {
      console.log("inifff___");
      this.Service_flag = true
      this.Loan_flag = true
    }
    else {
      console.log("inesleeee___");
      this.Service_flag = false
      this.Loan_flag = false
    }

    if (this.SelectBilltype.Ncode == 11) {
      console.log("inifff___ACBlock_flag");
      this.ACBlock_flag = true
    }
    else {
      console.log("inesleeee___ACBlock_flag");
      this.ACBlock_flag = false
    }

    if (this.SelectBilltype.Ncode == 9) {
      console.log("inifff___PDAcc_flag");
      this.PDAcc_flag = true
    }
    else {
      console.log("inesleeee___PDAcc_flag");
      this.PDAcc_flag = false
    }
    if (this.SelectBilltype.Ncode == 13) {
      console.log("inifff___Grant_in_aid_flag");
      this.Grant_in_aid_flag = true
      this.Institution_flag = true
    }
    else {
      console.log("inesleeee___Grant_in_aid_flag");
      this.Grant_in_aid_flag = false
      this.Institution_flag = false
    }
    if (this.SelectBilltype.Ncode == 22) {
      console.log("inifff___WorkB_Flag");
      this.WorkB_Flag = true
      this.Service_flag = true
    }
    else {
      console.log("inesleeee___WorkB_Flag");
      this.WorkB_Flag = false
      this.Service_flag = false
    }

    if (this.SelectBilltype.Ncode == 23) {
      console.log("inifff___Pension_flag");
      this.Pension_flag = true
    }
    else {
      console.log("inesleeee___Pension_flag");
      this.Pension_flag = false
    }
    if (this.SelectBilltype.Ncode == 26) {
      console.log("inifff___RDCCD_Flag");
      this.RDCCD_Flag = true
    }
    else {
      console.log("inesleeee___RDCCD_Flag");
      this.RDCCD_Flag = false
    }

    if (this.SelectBilltype.Ncode == 36) {
      console.log("inifff___WorkInv_Flag");
      this.WorkInv_Flag = true
    }
    else {
      console.log("inesleeee___WorkInv_Flag");
      this.WorkInv_Flag = false
    }
    if (this.SelectBilltype.Ncode == 2) {
      console.log("inifff___PayAllow_Flag");
      this.PayAllow_Flag = true
    }
    else {
      console.log("inesleeee___PayAllow_Flag");
      this.PayAllow_Flag = false
    }
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

  //<.................sub bill type flow start....
  // Calling API for Bill Sub Type List
  getBillSubTypeList(data: any) {
    // console.log("BillSubTypeList_before", this.BillSubTypeList, "return_subbilltype", data);

    this.ApiMethods.getservice(this.ApiService.BillSubType + data + '/' + 0).subscribe((resp: any) => {
      // console.log("BillSubTypeList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BillSubTypeList = resp.result;
        this.BillSubTypeList = this.BillEntryForm.controls['BillSubType'].valueChanges.pipe(
          startWith(''),

          map((value: any) => {
            // console.log("firstmap__SubType", value);
            return typeof value === 'string' ? value : value.SubType
          }),
          map((SubType: any) => {
            // console.log("second__map_SubType", SubType);

            return SubType ? this.Bill_SubType_filter(SubType, resp.result) : resp.result.slice()
          })
        );
      }
    })
    // console.log("BillSubTypeList_after", this.BillSubTypeList);
  }

  //  Bill type List Select >>>------------------->
  OnSubBilltypeSelected(SelectBillSubtype: any) {
    // console.log("slelction__________option___ObjecHeadsL", SelectBillSubtype);
    this.getObjectHeadList(SelectBillSubtype.NSubCode)
  }


  //  Auditor List filter >>>------------------->
  Bill_SubType_filter(value: string, data: any) {
    // console.log("filterval__SubType", value);
    return data.filter((option: any) => {
      // console.log("option_val__SubType", option);
      return option.SubType.toLowerCase().includes(value.toLowerCase())
    });
  }



  //  Auditor display Function >>>------------------->
  displayFn1(selectedoption: any) {
    // console.log("display_fun_call_SubType");
    return selectedoption ? selectedoption.SubType : undefined;
  }
  //..................end.................>

  //<.................Insitituion List flow start....
  // Calling API for Bill Sub Type List
  getInsititutionList() {
    // this.ApiMethods.getservice(this.ApiService.BillSubType + data + '/' + 0).subscribe(resp => {
    // console.log("BillSubTypeList__res", resp);


    // // if (resp.result && resp.result.length > 0) {
    // let arr = [{
    //   'Insitituion_Code': 1, 'Insitituion_Name': 'test'
    // },
    // {
    //   'Insitituion_Code': 2, 'Insitituion_Name': 'test2'
    // },
    // {
    //   'Insitituion_Code': 3, 'Insitituion_Name': 'test3'
    // },
    // {
    //   'Insitituion_Code': , 'Insitituion_Name': 'test4'
    // },
    // {
    //   'Insitituion_Code': '5', 'Insitituion_Name': 'test5'
    // }]
    // this.InsitituionList = arr;
    // this.InsitituionList = this.Insitituion_Form.controls['Insitituion_Code'].valueChanges.pipe(
    //   startWith(''),

    //   map((value: any) => {
    //     console.log("firstmap__Insitituion_Name", value);
    //     return typeof value === 'string' ? value : value.Insitituion_Name
    //   }),
    //   map((Insitituion_Name: any) => {
    //     console.log("second__map_Insitituion_Name", Insitituion_Name);

    //     return Insitituion_Name ? this.Insitituion_filter(Insitituion_Name, this.InsitituionList) : this.InsitituionList.slice()
    //   })
    // );
    // // }
    // // })
    // console.log("InsitituionList_after", this.InsitituionList);
    this.ApiMethods.getservice(this.ApiService.getMajorheadlist).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.InsitituionList = resp.result;

        this.InsitituionList = this.Insitituion_Form.controls['Insitituion_Code'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.MajorHeadCodeName
          }),
          map((MajorHeadCodeName: any) => {
            // console.log("sMajorhead_", MajorHeadCodeName);
            return MajorHeadCodeName ? this.MajorHead_filter(MajorHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Bill type List Select >>>------------------->
  OnInsititutionSelect() {
    // console.log("slelction__________option___insititution");
  }


  //  Insitituion filter >>>------------------->
  Insitituion_filter(value: string, data: any) {
    // console.log("filterval__Insitu___", value);
    return data.filter((option: any) => {
      // console.log("option_val__Insitu___", option);
      return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Insitituion display Function >>>------------------->
  Insitituion_dis(selectedoption: any) {
    // console.log("display_fun_call_Insitituion_Name");
    return selectedoption ? selectedoption.MajorHeadCodeName : undefined;
  }
  //..................end.................>

  //<............object head list get flow start......
  getObjectHeadList(SelectBillSubtype: any) {
    this.ApiMethods.getservice(this.ApiService.getobjectheadlist + this.SelectBilltype.Ncode + '/' + SelectBillSubtype).subscribe((resp: any) => {
      // console.log("ObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.ObjectHeadList = resp.result;
        this.ObjectHeadList = this.BillEntryForm.controls['ObjectHead'].valueChanges.pipe(
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

  //  Auditor display Function >>>------------------->
  displayFn2(selectedoption: any) {
    // console.log("display_fun_call_Object");
    return selectedoption ? selectedoption.objectHeadCodeName : selectedoption.objectHeadCodeName;
  }
  //..................end.................>


  //<............Ddo Name list get flow start......
  getDdoNameList() {
    this.ApiMethods.getservice(this.ApiService.getDdoNamelist + this.Tcode.Treasury_Code + '/0').subscribe((resp: any) => {
      // console.log("ObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        // this.DodoNameList = resp.result;
        // console.log("");

        this.DdoNameListarr = resp.result;

        this.DodoNameList = this.BillEntryForm.controls['DdoName'].valueChanges.pipe(
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
    this.SelectDdoName = this.BillEntryForm.value.DdoName
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


  //<.....BT.......Major Head list get flow start......
  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.getMajorheadlist).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTMajorHeadListarr = resp.result;

        this.BTMajorHeadList = this.BookTForm.controls['BTMajorHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.MajorHeadCodeName
          }),
          map((MajorHeadCodeName: any) => {
            // console.log("sMajorhead_", MajorHeadCodeName);
            return MajorHeadCodeName ? this.MajorHead_filter(MajorHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Major Head List Select >>>------------------->
  OnBtMajorHeadSelected(SelectMajorHead: any) {
    // console.log("slelction__________Majorhead", SelectMajorHead);
    this.getDetailHeadList(SelectMajorHead)
    const BTobjecttype = this.BTObjectHeadListarr.filter((item: any) => item.objectHeadCode === '00')[0]
    console.log("BTnormattype_filter", BTobjecttype.objectHeadCode, "daffffsdfas__", Number(SelectMajorHead.MajorHeadCode));
    this.SelecBTObjecthead = BTobjecttype
    this.SelectDetailHeadd = ''
    if (Number(SelectMajorHead.MajorHeadCode) > 7999) {
      // console.log("hjhkjhj____");

      this.Headtype_check = true
      this.Bfctype_check = true
      this.Objecthead_check = true
      // this.BookTForm.BTObjectHead.disabled()
      //alert();
      this.BookTForm.patchValue({
        BTVotedCharged: 'A',
        BTPlanNonPlan: 'A',
      })
      this.BookTForm.get('BTPlanNonPlan').disable();
      this.BookTForm.get('BTVotedCharged').disable();
      this.BookTForm.get('BTObjectHead').disable();
    }
    else {
      this.BookTForm.patchValue({
        BTVotedCharged: 'V',
        BTPlanNonPlan: 'P',
      })
      this.BookTForm.get('BTPlanNonPlan').enable();
      this.BookTForm.get('BTVotedCharged').enable();
      this.BookTForm.get('BTObjectHead').enable();

    }
  }

  //  Major Head List filter >>>------------------->
  MajorHead_filter(value: string, data: any) {
    // console.log("filterval__Major", value);
    return data.filter((option: any) => {
      // console.log("option_val__Major", option);
      return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Major Head display Function >>>------------------->
  display_Major(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Major", selectedoption);
    //  return selectedoption ? selectedoption.MajorHeadCodeName : 'undefined';
    return selectedoption ? selectedoption.MajorHeadCodeName : selectedoption.MajorHeadCodeName
      ;
  }
  //..................end.................>

  //<.....BT.......Major Head list get flow start......
  getMajorHeadList1() {
    this.ApiMethods.getservice(this.ApiService.getMajorheadlist).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTConMajorHeadListarr = resp.result;

        this.BTConMajorHeadList = this.BookTForm.controls['BTConMajorHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.MajorHeadCodeName
          }),
          map((MajorHeadCodeName: any) => {
            // console.log("sMajorhead_", MajorHeadCodeName);
            return MajorHeadCodeName ? this.MajorHeadCon_filter(MajorHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Major Head List Select >>>------------------->
  OnBTConMajorHeadSelected(SelectMajorHead: any) {
    console.log("slelction__________Majorhead", SelectMajorHead, "major_on", this.BTConMajorHeadListarr);
    this.geBTtDetailHeadList(SelectMajorHead)
    const BTobjecttype = this.BTConMajorHeadListarr.filter((item: any) => {
      console.log("innnerbtojecjtt__", item);

      item.objectHeadCode === '00'
    })[0]
    console.log("BTcon__e_filter", BTobjecttype, "dasdfas__", Number(SelectMajorHead.MajorHeadCode));
    this.SelecBTConObjecthead = '00'
    this.SelectBTConDetailHead = ''
    if (Number(SelectMajorHead.MajorHeadCode) > 7999) {
      // console.log("hjhkjhj____");

      this.Headtype_check = true
      this.Bfctype_check = true
      this.Objecthead_check = true
      // this.BookTForm.BTObjectHead.disabled()
      //alert();
      this.BookTForm.patchValue({
        BTConVotedCharged: 'A',
        BTConPlanNonPlan: 'A',
      })
      this.BookTForm.get('BTConPlanNonPlan').disable();
      this.BookTForm.get('BTConVotedCharged').disable();
      this.BookTForm.get('BTConObjectHead').disable();
    }
    else {
      this.BookTForm.patchValue({
        BTConVotedCharged: 'V',
        BTConPlanNonPlan: 'P',
      })
      this.BookTForm.get('BTConPlanNonPlan').enable();
      this.BookTForm.get('BTConVotedCharged').enable();
      this.BookTForm.get('BTConObjectHead').enable();

    }
  }

  //  Major Head List filter >>>------------------->
  MajorHeadCon_filter(value: string, data: any) {
    // console.log("filterval__Major", value);
    return data.filter((option: any) => {
      // console.log("option_val__Major", option);
      return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Major Head display Function >>>------------------->
  display_ConMajor(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Major", selectedoption);
    //  return selectedoption ? selectedoption.MajorHeadCodeName : 'undefined';
    return selectedoption ? selectedoption.MajorHeadCodeName : selectedoption.MajorHeadCodeName
      ;
  }
  //..................end.................>


  //<....BT........Division list get flow start......
  getDivisionList() {
    this.ApiMethods.getservice(this.ApiService.getDivisionlist + this.Tcode.Treasury_Code + '/' + 8782).subscribe((resp: any) => {
      // console.log("Divisionlist__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTDivisionListListarr = resp.result;

        this.BTDivisionListList = this.BookTForm.controls['BTDivision'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Division__", value);
            return typeof value === 'string' ? value : value.DivisionName
          }),
          map((DivisionName: any) => {
            // console.log("sDivision_", DivisionName);
            return DivisionName ? this.BTDivision_filter(DivisionName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Division List Select >>>------------------->
  OnBtDivisionSelected(SelectDivision: any) {
    // console.log("slelction__________Division", SelectDivision);
  }

  //  Division List filter >>>------------------->
  BTDivision_filter(value: string, data: any) {
    // console.log("filterval__Division", value);
    return data.filter((option: any) => {
      // console.log("option_val__Division", option);
      return option.DivisionName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Division display Function >>>------------------->
  display_BTDivision(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Division", selectedoption);
    return selectedoption ? selectedoption.DivisionName : selectedoption.DivisionName;
  }
  //..................end.................>

  //<....BT........Division list get flow start......
  getConDivisionList() {
    this.ApiMethods.getservice(this.ApiService.getDivisionlist + this.Tcode.Treasury_Code + '/' + 8782).subscribe((resp: any) => {
      // console.log("Divisionlist__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTConDivisionListListarr = resp.result;

        this.BTConDivisionListList = this.BookTForm.controls['BTConDivision'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Division__", value);
            return typeof value === 'string' ? value : value.DivisionName
          }),
          map((DivisionName: any) => {
            // console.log("sDivision_", DivisionName);
            return DivisionName ? this.BTConDivision_filter(DivisionName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Division List Select >>>------------------->
  OnBtConDivisionSelected(SelectDivision: any) {
    console.log("slelction______Con____Division", SelectDivision);
  }

  //  Division List filter >>>------------------->
  BTConDivision_filter(value: string, data: any) {
    // console.log("filterval__Division", value);
    return data.filter((option: any) => {
      // console.log("option_val__Division", option);
      return option.DivisionName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Division display Function >>>------------------->
  display_BTConDivision(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Division", selectedoption);
    return selectedoption ? selectedoption.DivisionName : selectedoption.DivisionName;
  }
  //..................end.................>

  // <....service block........Major Head list get flow start......
  getService_MajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.getMajorheadlist).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.SBMajorHeadListarr = resp.result;

        this.SBMajorHeadList = this.ServiceBlockForm.controls['ServiceMajorHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__service", value);
            return typeof value === 'string' ? value : value.MajorHeadCodeName
          }),
          map((MajorHeadCodeName: any) => {
            // console.log("serviceMajorhead_", MajorHeadCodeName);
            return MajorHeadCodeName ? this.Service_MajorHead_filter(MajorHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }
  //  Service Block Major Head List Select >>>------------------->
  OnSBMajorHeadSelected(SelecService_Majorhead: any) {
    // console.log("slelction______Service____Majorhead", SelecService_Majorhead);
    this.getService_DetailHeadList(SelecService_Majorhead)
  }

  //Service Block Major Head List filter >>>------------------->
  Service_MajorHead_filter(value: string, data: any) {
    // console.log("filterval__service_Major", value);
    return data.filter((option: any) => {
      // console.log("service_val__Major", option);
      return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //Service Block Major Head display Function >>>------------------->
  Service_Major(selectedoption: any) {
    // console.log('selecteservicen===>>>', selectedoption);
    // console.log("display_fun_call_Major", selectedoption);
    //  return selectedoption ? selectedoption.MajorHeadCodeName : 'undefined';
    return selectedoption ? selectedoption.MajorHeadCodeName : selectedoption.MajorHeadCodeName
      ;
  }
  //..................end.................>

  //<......Service Block.....Details head list get flow start......
  getDetailHeadList(data: any) {
    this.ApiMethods.getservice(this.ApiService.getDetailHeadlist + data.MajorHeadCode + '/1').subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTDetailHeadListarr = resp.result;

        this.BTDetailHeadList = this.BookTForm.controls['BTDetailHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.groupsubheadname
          }),
          map((groupsubheadname: any) => {
            // console.log("sMajorhead_", groupsubheadname);
            return groupsubheadname ? this.BTDetailHead_filter(groupsubheadname, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Detail head List Select >>>------------------->
  OnBTDetailHeadSelected(SelectDetailhead: any) {
    // console.log("slelction__________Detailshead", SelectDetailhead);
    this.getPdAccist(SelectDetailhead)
  }

  //  Detail head List filter >>>------------------->
  BTDetailHead_filter(value: string, data: any) {
    // console.log("filterval__Detailshead", value);
    return data.filter((option: any) => {
      // console.log("option_val__Detailshead", option);
      return option.groupsubheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Detail head display Function >>>------------------->
  display_BTDetailhead(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_callbtdetailshead", selectedoption);
    return selectedoption ? selectedoption.groupsubheadname : selectedoption.groupsubheadname;
  }
  //..................end.................>


  //<......Service Block.....Details head list get flow start......
  geBTtDetailHeadList(data: any) {
    this.ApiMethods.getservice(this.ApiService.getDetailHeadlist + data.MajorHeadCode + '/1').subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTConDetailHeadListarr = resp.result;

        this.BTConDetailHeadList = this.BookTForm.controls['BTConDetailHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.groupsubheadname
          }),
          map((groupsubheadname: any) => {
            // console.log("sMajorhead_", groupsubheadname);
            return groupsubheadname ? this.BTConDetailHead_filter(groupsubheadname, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Detail head List Select >>>------------------->
  OnBTConDetailHeadSelected(SelectDetailhead: any) {
    // console.log("slelction__________Detailshead", SelectDetailhead);
    this.getConPdAccist(SelectDetailhead)
  }

  //  Detail head List filter >>>------------------->
  BTConDetailHead_filter(value: string, data: any) {
    // console.log("filterval__Detailshead", value);
    return data.filter((option: any) => {
      // console.log("option_val__Detailshead", option);
      return option.groupsubheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Detail head display Function >>>------------------->
  display_BTConDetailhead(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_callbtdetailshead", selectedoption);
    return selectedoption ? selectedoption.groupsubheadname : selectedoption.groupsubheadname;
  }
  //..................end.................>

  //<......Service block......Details head list get flow start......
  getService_DetailHeadList(data: any) {
    this.ApiMethods.getservice(this.ApiService.getDetailHeadlist + data.MajorHeadCode + '/1').subscribe((resp: any) => {
      // console.log("Detilas__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.SBDetailsHeadListarr = resp.result;

        this.SBDetailsHeadList = this.ServiceBlockForm.controls['ServiceDetailsHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Details_service_headp__", value);
            return typeof value === 'string' ? value : value.groupsubheadname
          }),
          map((groupsubheadname: any) => {
            // console.log("sDetails_service_head_", groupsubheadname);
            return groupsubheadname ? this.Service_DetailHead_filter(groupsubheadname, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Detail head List Select >>>------------------->
  OnService_DetailHeadSelected(SelectService_DetailHeadd: any) {
    // console.log("slelction_____service_____Detailshead", SelectService_DetailHeadd);
  }

  //  Detail head List filter >>>------------------->
  Service_DetailHead_filter(value: string, data: any) {
    // console.log("filterval_service_Detailshead", value);
    return data.filter((option: any) => {
      // console.log("option_service__Detailshead", option);
      return option.groupsubheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Detail head display Function >>>------------------->
  Service_Detailhead(selectedoption: any) {
    // console.log("display_serivce_callbtdetailshead", selectedoption);
    return selectedoption ? selectedoption.groupsubheadname : selectedoption.groupsubheadname;
  }
  //..................end.................>

  //<....BT........Pd account list get flow start......
  getPdAccist(data: any) {
    this.ApiMethods.getservice(this.ApiService.getPDAccountlist + this.Tcode.Treasury_Code + '/' + data.code).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTPdAccListarr = resp.result;

        this.BTPdAccList = this.BookTForm.controls['BTPdAcc'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("PDAccName_pfff", value);
            return typeof value === 'string' ? value : value.PDAccName
          }),
          map((PDAccName: any) => {
            // console.log("PDAccName__mapp2", PDAccName);
            return PDAccName ? this.BTPdAcc_filter(PDAccName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  PdAcc List Select >>>------------------->
  OnBtPdAccSelected(SelectPdAcc: any) {
    // console.log("slelction__________PdACC", SelectPdAcc);
  }

  //  PdAcc List filter >>>------------------->
  BTPdAcc_filter(value: string, data: any) {
    // console.log("filterval__PdAcc", value);
    return data.filter((option: any) => {
      // console.log("option_val__PdAcc", option);
      return option.PDAccName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  PdAcc display Function >>>------------------->
  display_BTPdAcc(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_PdAcc", selectedoption);
    return selectedoption ? selectedoption.PDAccName : selectedoption.PDAccName;
  }
  //..................end.................>


  //<....BT........Pd account list get flow start......
  getConPdAccist(data: any) {
    this.ApiMethods.getservice(this.ApiService.getPDAccountlist + this.Tcode.Treasury_Code + '/' + data.code).subscribe((resp: any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTConPdAccListarr = resp.result;

        this.BTConPdAccList = this.BookTForm.controls['BTConPdAcc'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("PDAccName_pfff", value);
            return typeof value === 'string' ? value : value.PDAccName
          }),
          map((PDAccName: any) => {
            // console.log("PDAccName__mapp2", PDAccName);
            return PDAccName ? this.BTConPdAcc_filter(PDAccName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  PdAcc List Select >>>------------------->
  OnBtConPdAccSelected(SelectPdAcc: any) {
    // console.log("slelction__________PdACC", SelectPdAcc);
  }

  //  PdAcc List filter >>>------------------->
  BTConPdAcc_filter(value: string, data: any) {
    // console.log("filterval__PdAcc", value);
    return data.filter((option: any) => {
      // console.log("option_val__PdAcc", option);
      return option.PDAccName.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  PdAcc display Function >>>------------------->
  display_BTConPdAcc(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_PdAcc", selectedoption);
    return selectedoption ? selectedoption.PDAccName : selectedoption.PDAccName;
  }
  //..................end.................>


  //<......BT......object head list get flow start......
  getBTObjectHeadList() {
    this.ApiMethods.getservice(this.ApiService.getObjectheadAllList).subscribe((resp: any) => {
      // console.log("BTObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BTObjectHeadList = resp.result;
        this.BTObjectHeadListarr = resp.result;
        this.SelecBTObjecthead = resp.result;
        this.BTObjectHeadList = this.BookTForm.controls['BTObjectHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__BTObjectHead", value);
            return typeof value === 'string' ? value : value.objectHeadNameHindi
          }),
          map((objectHeadNameHindi: any) => {
            console.log("second__mapBT_ObjectHead", objectHeadNameHindi);
            return objectHeadNameHindi ? this.BTObjectHead_filter(objectHeadNameHindi, resp.result) : resp.result.slice()
          })
        );
        // console.log("BTObjectHeadList===>>>", this.BTObjectHeadList);
      }
    })

  }

  //  Object Head List Select >>>------------------->
  OnBTObjectHeadSelected(SelectBTObjectHead: any) {
    // console.log("slelction__________BTObjectHead", SelectBTObjectHead);
  }

  //  Auditor List filter >>>------------------->
  BTObjectHead_filter(value: string, data: any) {
    console.log("filterval__BTObject", value);
    return data.filter((option: any) => {
      // console.log("option_val__BTObject", option);
      return option.objectHeadNameHindi
    });
  }

  //  Auditor display Function >>>------------------->
  BTdisplayObecthead(selectedoption: any) {
    console.log("display_fun_BTccon_Object", selectedoption);
    return selectedoption ? selectedoption.objectHeadNameHindi : selectedoption.objectHeadNameHindi;
  }
  //..................end.................>


  //<......BT......object head list get flow start......
  getBTConObjectHeadList() {
    this.ApiMethods.getservice(this.ApiService.getObjectheadAllList).subscribe((resp: any) => {
      console.log("BTObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.BTConObjectHeadList = resp.result;
        this.BTConObjectHeadListarr = resp.result;
        this.SelecBTConObjecthead = resp.result;
        this.BTConObjectHeadList = this.BookTForm.controls['BTConObjectHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("condd__fmap1", value);
            return typeof value === 'string' ? value : value.objectHeadNameHindi
          }),
          map((objectHeadNameHindi: any) => {
            console.log("cpmdd__map2", objectHeadNameHindi);
            return objectHeadNameHindi ? this.BTConObjectHead_filter(objectHeadNameHindi, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Object Head List Select >>>------------------->
  OnBTConObjectHeadSelected(SelectBTObjectHead: any) {
    console.log("slelction______con____BTObjectHead", SelectBTObjectHead);
  }

  //  Auditor List filter >>>------------------->
  BTConObjectHead_filter(value: string, data: any) {
    console.log("filterval__conbject", value);
    return data.filter((option: any) => {
      // console.log("option_val__BTObject", option);
      return option.objectHeadNameHindi
    });
  }

  //  Auditor display Function >>>------------------->
  BTdisplayConObecthead(selectedoption: any) {
    console.log("display_fun_connn_Object");
    return selectedoption ? selectedoption.objectHeadNameHindi : selectedoption.objectHeadNameHindi;
  }
  //..................end.................>

  onBankSelected(data: any) {
    // console.log("selecteddddd_bank___", data.target.value);
    this.bankSelect = data.target.value
    // console.log("ssssssssss", this.bankSelect);
  }

  BalanceBudgetCheck() {
    // console.log("BERFORRR____");
    var Detailhead = this.BillEntryForm.controls['DetailHead'].value;
    var officeid = this.BillEntryForm.controls['officeid'].value;
    var BillMonth = this.BillEntryForm.controls['BillMonth'].value;


    var BFCType = this.BillEntryForm.controls['PlanNonPlan'].value;
    var Headtype = this.BillEntryForm.controls['VotedCharged'].value;

    if (!this.SelectBilltype) {
      this.snackbar.show('Please Select Bill type', 'danger')
    }
    else if (!this.BillSubType) {
      this.snackbar.show('Please Select Sub Bill type', 'danger')
    }
    else if (!Detailhead) {
      this.snackbar.show('Please enter detail head', 'danger')
    }
    else if (!this.SelectObjectHead) {
      this.snackbar.show('Please Select object head', 'danger')
    }
    else if (!officeid) {
      this.snackbar.show('Please enter Office id', 'danger')
    }
    else if (!BFCType) {
      this.snackbar.show('Please Select Bfc Type', 'danger')
    }
    else if (!Headtype) {
      this.snackbar.show('Please Select Head Type', 'danger')
    }

    else {
      this.CheckBudgetAmt.detailHead = Detailhead

      this.CheckBudgetAmt.objectHead = this.SelectObjectHead.objectHeadCode
      this.CheckBudgetAmt.bfcType = BFCType
      this.CheckBudgetAmt.headType = Headtype
      this.CheckBudgetAmt.officeId = officeid
      this.CheckBudgetAmt.billtype = this.SelectBilltype.Ncode
      this.CheckBudgetAmt.billsubtype = this.BillSubType.NSubCode
      this.CheckBudgetAmt.billmonth = BillMonth

      // console.log("budgetsetdata___", this.CheckBudgetAmt
      // );
      //  Budget amount check api call
      this.ApiMethods.postresultservice(this.ApiService.CheckBudgetAmt, this.CheckBudgetAmt).subscribe((resp: any) => {


        // console.log("budgetstatus", resp);
        let response = resp.result

        // if (Object.keys(response).length > 0) {  
        if (response.length > 0) {
          this.loader.setLoading(false);
          this.budgetamt.budgetAmount = response[0].Amount

          this.BillEntryForm.patchValue({
            BudgetBal: response[0].Amount,
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
        (res: any) => {
          // console.log("Budgetapierror___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.Api_erroFlag = true
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
            //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

          }
        })
    }


  }

  //muliple selection common objection list data
  getCommonobj(value: any) {
    // console.log("final_commone", value);

    if (!this.Common_objlist.includes(value.objectiontypecode)) {          //checking weather array contain the id
      this.Common_objlist.push(value.objectiontypecode.toString());               //adding to array because value doesnt exists
    } else {
      this.Common_objlist.splice(this.Common_objlist.indexOf(value.objectiontypecode), 1);  //deleting
    }
    // console.log("newww__arrrr_", this.Common_objlist);
  }
  //muliple selection common objection list data
  getBilll_obj(value: any) {
    // console.log("vvalueee__commone", value);

    if (!this.Billtype_objlist.includes(value.objectiontypecode)) {          //checking weather array contain the id
      this.Billtype_objlist.push(value.objectiontypecode.toString());               //adding to array because value doesnt exists
    } else {
      this.Billtype_objlist.splice(this.Billtype_objlist.indexOf(value.objectiontypecode), 1);  //deleting
    }
    // console.log("billtype__arrrr_", this.Billtype_objlist);
  }

  getObjectionData() {

    // console.log("api_ObjectionBef", this.GetObjectionListModal)
    this.ApiMethods.postresultservice(this.ApiService.BillObjectionData, this.GetObjectionListModal).subscribe((resp: any) => {
      // console.log("data_setojection", resp.result);
      // if (resp.result.length > 0) {
      if (Object.keys(resp.result).length > 0) {

        this.dataO = resp.result.dataSet1;
        this.dataB = resp.result.dataSet2;
        // console.log("dddddd");
      }
    },
      (res: any) => {
        // console.log("errror_msg_ojbectiondata_", res.status);
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

  //<......MB......object head list get flow start......
  getMBObjectHeadList() {
    this.ApiMethods.getservice(this.ApiService.getObjectheadAllList).subscribe((resp: any) => {
      console.log("BTObjectList__res", resp);
      if (resp.result && resp.result.length > 0) {
        this.MBObjectHeadList = resp.result;
        this.MBObjectHeadListarr = resp.result;
        this.MBObjectHeadList = this.MoreHForm.controls['MB_ObjectHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            console.log("firstmap__MBObjectHead", value);
            return typeof value === 'string' ? value : value.objectHeadNameHindi
          }),
          map((objectHeadNameHindi: any) => {
            console.log("second__mapMB_ObjectHead", objectHeadNameHindi);
            return objectHeadNameHindi ? this.MBObjectHead_filter(objectHeadNameHindi, resp.result) : resp.result.slice()
          })
        );
        console.log("MBObjectHeadList===>>>", this.MBObjectHeadList);
      }
    })

  }

  //  Object Head List Select >>>------------------->
  OnMBObjectHeadSelected(SelectMBObjectHead: any) {
    console.log("slelction__________MBObjectHead", SelectMBObjectHead);
  }

  //  Auditor List filter >>>------------------->
  MBObjectHead_filter(value: string, data: any) {
    console.log("filterval__MBObject", value);
    return data.filter((option: any) => {
      console.log("option_val__MBObject", option);
      return option.objectHeadNameHindi.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  MH Object Head display Function >>>------------------->
  MBdisplayObecthead(selectedoption: any) {
    console.log("display_fun_MBcall_Object");
    return selectedoption ? selectedoption.objectHeadNameHindi : selectedoption.objectHeadCodeNam;
  }
  //..................end.................>

  Checkbillsave() {
    var Detailhead = this.BillEntryForm.controls['DetailHead'].value;
    var MajorH = Detailhead.slice(0, 4);
    console.log("majorh_____", MajorH);
    var Division = this.BillEntryForm.controls['Division'].value;
    var pdacc = this.BillEntryForm.controls['PdAcc'].value;

    var BFCType = this.BillEntryForm.controls['PlanNonPlan'].value;
    var Headtype = this.BillEntryForm.controls['VotedCharged'].value;
    // var splitmajorh= 
    let body_chkbillsave = {
      "treasCode": this.Tcode.Treasury_Code,
      "objectHead": this.SelectObjectHead.objectHeadCode,
      "transType": "23",
      "majorHead": MajorH,
      "detailHead": Detailhead,
      "divCode": Division,
      "billSubType": this.BillSubType.NSubCode,
      "pd_AcNo": pdacc,
      "votedCh": Headtype,
      "pnp": BFCType,
      "type": 0,
      "finYear": this.Tcode.year
    }
    console.log("body___checkbillS", body_chkbillsave);

    //  Budget amount check api call
    this.ApiMethods.postresultservice(this.ApiService.Checkbillsave_Verify, body_chkbillsave).subscribe((resp: any) => {


      console.log("Check__billsave", resp.result);
      let response = resp.result

      // if (Object.keys(response).length > 0) {  
      if (Object.keys(response).length > 0) {
        this.loader.setLoading(false);
        if (response.code != '0000') {
          this.Popup_error_list.push(response.msg[0])
          console.log();

        }
      }
    },
      (res: any) => {
        console.log("Budgetapierror___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
          //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

        }
      })
  }
  CheckOfficeId() {
    this.loader.setLoading(true);

    // Office id verify api call
    this.ApiMethods.getservice(this.ApiService.OfficeId_Verify + this.Tcode.Treasury_Code + '/' + this.billentry_info.DDO_CODE + '/' + this.BillEntryForm.value.officeid).subscribe((resp: any) => {

      console.log("officeidresp_verify___", resp.result);
      let response = resp.result
      let msg = [
        {
          "ERR_CODE": "20001",
          "MSG": "5009:Office Id not available "
        }
      ]
      if (Object.keys(resp).length > 0) {
        this.loader.setLoading(false);
        if (response == "N") {
          console.log("officeid_not_correct");
          this.Popup_error_list.push(msg[0])
        }
      }
    },
      (res: any) => {
        console.log("Budgetapierror___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
          //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

        }
      })
  }

  CheckBillNo() {
    var MajorH = this.BillEntryForm.value.DetailHead.slice(0, 4);
    this.loader.setLoading(true);
    let duplicatebil_body = {
      "finyear": this.Tcode.finyear,
      "treasuryCode": this.Tcode.Treasury_Code,
      "ddoCode": this.billentry_info.DDO_CODE,
      "ddoBillNo": this.BillEntryForm.value.DdoBillNo,
      "majorhead": MajorH
    }
    // Office id verify api call
    this.ApiMethods.postresultservice(this.ApiService.CheckBillDuplicy, duplicatebil_body).subscribe((resp: any) => {

      console.log("duplicatebill_verify___", resp.result);
      let response = resp.result
      let msg = [
        {
          "ERR_CODE": "20001",
          "MSG": "5009:Bill already exist "
        }
      ]
      if (Object.keys(resp).length > 0) {
        this.loader.setLoading(false);
        if (response == "N") {
          console.log("bill_not_correct");
          this.Popup_error_list.push(msg[0])
        }
      }
    },
      (res: any) => {
        console.log("Budgetapierror___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.Api_erroFlag = true
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
          //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

        }
      })
  }

  //Bill entry Save api call
  Save() {
    this.Popup_error_list = [] //clear error list array before push
    this.BalanceBudgetCheck()  //budget amount check api call
    this.Checkbillsave()  //api call for check bill save 
    this.CheckOfficeId()  // api call for check office id valid or not
    this.CheckBillNo()// api call for check bill no 

    var DetailsH = this.BillEntryForm.controls['DetailHead'].value;
    var Division = this.BillEntryForm.controls['Division'].value;
    var ModeOfP = this.BillEntryForm.controls['ECSNONECS'].value;
    var ChequeD = this.BillEntryForm.controls['toDate'].value;
    var Detailhead = this.BillEntryForm.controls['DetailHead'].value;
    var MajorH = Detailhead.slice(0, 4);
    console.log("majorh_____save", MajorH, this.BillEntryForm.value.GrossAmt, this.BillEntryForm.value.PlanNonPlan, this.BillEntryForm.value.VotedCharged, this.Popup_error_list);

    console.log("pddd__acc___", this.check_pd_status, this.budgetamt);
    console.log("laksdjf+____", this.Bankselected);
    const bankId = this.BillEntryForm.value.bankName;
    console.log("bankk______Save()", bankId);

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
    }
    else if ((DetailsH == '8443001080000' || DetailsH == '8443001090000') && Division == 0) {
      this.snackbar.show('Division cannot be 0 when Budget Head is 8443001080000 or 8443001090000', 'danger')
    }
    else if (bankId == '1141' && ModeOfP == 'C') {
      this.snackbar.show('RBI Not Allow With Cheque Case !', 'danger')
    }
    else if (!ChequeD && ModeOfP == 'C') {
      this.snackbar.show('Please Select Cheque Date', 'danger')
    }
    else if (this.BillEntryForm.value.GrossAmt == 0) {
      this.snackbar.show('Gross Amount Should be greater then 0', 'danger')
    }
    else if (this.BillEntryForm.value.HeadGross > this.BillEntryForm.value.GrossAmt) {
      this.snackbar.show('Head gross should be equal or less than gross amount', 'danger')
    }
    else if (this.BillEntryForm.value.NetAmt > this.BillEntryForm.value.GrossAmt) {
      this.snackbar.show('Cash amount should be equal or less than gross amount', 'danger')
    }
    else if (this.BillEntryForm.value.ECSNONECS != 'A' && this.BillEntryForm.value.NetAmt == 0) {
      this.snackbar.show('Select (N.A.) for [Mode of Payment] and [Cheque/Ecs/N.A.] when cash is zero', 'danger')
    }
    else if (MajorH < 2000 || MajorH == 4000) {
      this.snackbar.show("Please Enter proper Budgethead", 'danger')
    }
    else if ((MajorH > 7999) && !(this.BillEntryForm.value.PlanNonPlan == 'A' && this.BillEntryForm.value.VotedCharged == 'A' && this.SelectObjectHead.objectHeadCode == '00')) {
      this.snackbar.show("Please Select Voted/Charged ,Plan/NonPlan to N.A. and ObjectHead to 00 select  ", 'danger')
    }
    else if (this.BillEntryForm.value.budgetval != this.SumBTAmt && this.OtherBTDeatls.length > 0) {
      this.snackbar.show("Bt Total amount should be equal to Diff of gross and cash amount", 'danger')
    }
    else if (this.BillEntryForm.value.budgetval != 0 && this.OtherBTDeatls.length == 0) {
      this.snackbar.show("Please Enter BT Details", 'danger')
    }

    else if (this.Popup_error_list.length > 0) {
      this.snackbar.show('Please check error details', 'danger')
    }

    else if (this.Verify_done) {
      //alert('hi')
      this.loader.setLoading(true);


      // this.SaveModal.bankCode = bankId
      // this.SaveModal.refNo = this.billentry_info.CDE_REFNO
      // var assignMent_id: any = this.ApiMethods.getUserInfo()
      // this.SaveModal.assignMentId = Number(assignMent_id.aid)
      // let chequeDate = this.BillEntryForm.controls['toDate'].value;
      // let formatdate = moment(chequeDate).format('YYYY-MM-DD')
      // this.SaveModal.chequeDate = formatdate

      // console.log("billentyrconsss___", this.billentry_info);

      // console.log("ObSave___", this.SaveModal);


      // // Office id verify api call
      // this.ApiMethods.postresultservice(this.ApiService.BillEntySave, this.SaveModal).subscribe(resp => {

      //   console.log("SaveBilllOnline_verify___", resp.result);
      //   let response = resp.result

      //   if (Object.keys(response).length > 0) {
      //     //  this.toastrService.success('Successfully Inserted', 'Success!');
      //     this.snackbar.show('Successfully Inserted !', 'success')

      //     this.loader.setLoading(false);

      //     this.SaveModal.bankCode = 0
      //     this.SaveModal.refNo = 0
      //     this.SaveModal.assignMentId = 0
      //     this.SaveModal.chequeDate = ''
      //     //this.router.navigate(['OnlineBillList']);
      //     this.router.navigate(['OnLineBillList'], { queryParams: {} });
      //   }
      //   else {
      //     this.loader.setLoading(false);
      //   }
      // },
      //   (res:any) => {
      //     console.log("errror message___", res.status);
      //     if (res.status != 200) {
      //       this.loader.setLoading(false);
      //       //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
      //       this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')

      //     }
      //   })




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

      var objectHarr = this.billentry_info.OBJECT_HEAD_NAME.split("-");
      console.log("ObjectH_save", objectHarr);
      this.CheckBudgetAmt.detailHead = this.billentry_info.BUDGETHEAD,
        this.CheckBudgetAmt.objectHead = objectHarr[0],
        this.CheckBudgetAmt.bfcType = this.billentry_info.BFC_TYPE,
        this.CheckBudgetAmt.headType = this.billentry_info.HEAD_TYPE,
        this.CheckBudgetAmt.pdAcNo = this.billentry_info.PDACC_NO,
        this.CheckBudgetAmt.officeId = this.billentry_info.OFFICE_CODE,
        this.CheckBudgetAmt.billtype = this.billentry_info.BILL_TYPE,
        this.CheckBudgetAmt.billsubtype = this.billentry_info.SUB_BILLTYPE,
        this.CheckBudgetAmt.billmonth = this.billentry_info.DDO_BILL_MONTH,

        console.log("onSave_budgetmodal___", this.CheckBudgetAmt);
      // this.BalanceBudgetCheck()

      this.SaveModal.bankCode = bankId
      this.SaveModal.refNo = this.billentry_info.CDE_REFERENCE_NO
      var assignMent_id: any = this.ApiMethods.getUserInfo()
      this.SaveModal.assignMentId = Number(assignMent_id.aid)
      let chequeDate = this.BillEntryForm.controls['toDate'].value;
      let formatdate = moment(chequeDate).format('YYYY-MM-DD')
      this.SaveModal.chequeDate = formatdate
      this.SaveModal.auditiorflag = 'O'

      let objection_arrac: any[] = []

      this.Popup_error_list.map((item: any) => {
        objection_arrac.push(item.ERR_CODE)
        console.log("resppp__objection", item.ERR_CODE);

      })
      console.log("final_objc_array__", objection_arrac);


      // this.SaveModal.objectionTypeCode = this.LableMsg.ObjectionC
      this.SaveModal.objectionTypeCode = objection_arrac

      console.log("lable_objerrr__", this.LableMsg);

      console.log("billentyrconsss___", this.billentry_info);

      console.log("savemodal__after", this.SaveModal);
      this.deduction_flag = true

      this.Grant_in_aid_flag = true
      this.Institution_flag = true


      // // Office id verify api call
      // this.ApiMethods.postresultservice(this.ApiService.BillEntySave, this.SaveModal).subscribe(resp => {

      //   console.log("SaveBilllWithObjection_verify___", resp.result);
      //   let response = resp.result

      //   if (Object.keys(response).length > 0) {

      //     this.SaveModal.bankCode = 0
      //     this.SaveModal.chequeDate = ''
      //     this.SaveModal.auditiorflag = 'P'

      //     // this.router.navigate(['OnlineBillList']);


      //     this.BillvoucheList.treasuryRefNo = response.NewBillCode
      //     this.GetObjectionListModal.billNo = response.NewBillCode
      //     console.log("modesendbefor__", this.BillvoucheList);

      //     //  Get voucher details check api call
      //     this.ApiMethods.postresultservice(this.ApiService.BillVoucherDetail, this.BillvoucheList).subscribe(resp => {

      //       console.log("voucherresppp__", resp.result);
      //       let response = resp.resultc
      //       if (Object.keys(response).length > 0) {
      //         // this.getBillTypeObjectlist(response) //Bill type objection list api call

      //         // this.getObjectionData()  // Objection  type selected filter api

      //         // this.getCommonObjectlist()     // common objection type list api call
      //         // this.BillEntry_flag = 3
      //         this.IsObjectionBill.Objbilltype = response.BillType
      //         this.IsObjectionBill.Objbillcode = this.BillvoucheList.treasuryRefNo

      //         // this.getBillTypeData()
      //         alert(this.BillEntry_flag)
      //         this.IsObjectionOpen = true

      //         this.Section_flag = true
      //         this.loader.setLoading(false);
      //       }
      //     },
      //       (res:any) => {
      //         console.log("errror message___", res.status);
      //         if (res.status != 200) {
      //           this.loader.setLoading(false);
      //           this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert!')
      //         }
      //       }
      //     )

      //   }
      //   else {
      //     this.loader.setLoading(false);
      //   }
      // },
      //   (res:any) => {
      //     console.log("errror message___", res.status);
      //     if (res.status != 200) {
      //       this.loader.setLoading(false);
      //       this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert!')
      //     }
      //   })


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

      this.ApiMethods.postresultservice(this.ApiService.Savewithobjection, this.SaveOjection).subscribe((resp: any) => {

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
        (res: any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //   this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');

          }
        })
    }
  }

  Show_moreBudgetHEad() {
    console.log("object__head__", this.MBObjectHeadListarr);
    let MBobjecttype = this.MBObjectHeadListarr.find(item => item.objectHeadCode === this.SelectObjectHead.objectHeadCode)
    console.log("BTobjecttype_filter", MBobjecttype, this.BillEntryForm.value.ObjectHead);
    if (this.BillEntryForm.value.DetailHead.length < 13) {
      this.snackbar.show('Please Enter Detail Head', 'danger')
    }
    else if (!this.SelectObjectHead) {
      this.snackbar.show('Please Select Object Head', 'danger')
    }
    else if (!this.BillEntryForm.value.officeid) {
      this.snackbar.show('Please Enter Office ID', 'danger')
    }
    else if (!this.BillEntryForm.value.VotedCharged) {
      this.snackbar.show('Please Select Head type', 'danger')
    }
    else if (!this.BillEntryForm.value.PlanNonPlan) {
      this.snackbar.show('Please Select BFC type', 'danger')
    }
    else if (!this.BillEntryForm.value.GrossAmt) {
      this.snackbar.show('Please Enter Gross Amount', 'danger')
    }
    else if (!this.BillEntryForm.value.HeadGross) {
      this.snackbar.show('Please Enter Head Amount', 'danger')
    }
    else if (this.BillEntryForm.value.HeadGross > this.BillEntryForm.value.GrossAmt) {
      this.snackbar.show('Head gross should be equal or less than gross amount', 'danger')
    }
    else {
      this.MBHAutoCHeck = true
      this.MoreHForm.patchValue({
        MB_DetailHead: this.BillEntryForm.value.DetailHead,
        MB_PlanNonPlan: this.BillEntryForm.value.PlanNonPlan,
        MB_VotedCharged: this.BillEntryForm.value.VotedCharged,
      })
      this.SelectMBObjectHead = MBobjecttype
      console.log("more__jhead_De__", this.BillEntryForm.value.DetailHead, this.BillEntryForm.value.PlanNonPlan, this.BillEntryForm.value.VotedCharged, this.SelectObjectHead);

      this.BillEntryForm.get('officeid').disable();
      this.BillEntryForm.get('DetailHead').disable();
      this.BillEntryForm.get('ObjectHead').disable();
      this.BillEntryForm.get('VotedCharged').disable();
      this.BillEntryForm.get('PlanNonPlan').disable();
      this.BillEntryForm.get('HeadGross').disable();
      this.BillEntryForm.get('GrossAmt').disable();
    }

  }

  Pension_Add() {
    var CashAMt = this.BillEntryForm.controls['NetAmt'].value

    var PPONo = this.PensionSource[this.PensionSource.map(function (item) { return item.PPO_No; }).indexOf(this.PensionBForm.value.PPoNo)];
    // var PPOFlag = this.PensionSource[this.PensionSource.map(function (item) { return item.PPO_Flag; }).indexOf(this.PPoFlag_C)];
    // var PPOCash = this.PensionSource[this.PensionSource.map(function (item) { return item.Cash_Amt; }).indexOf(this.PensionBForm.value.PPoCash)];

    console.log("PPoNO___", PPONo);
    console.log("Pension_arrr__", this.PensionSource, CashAMt, this.PPoFlag_C, this.PensionBForm.value.PPoNo);

    var SumOfPensionAmt: number = 0
    if (this.PensionSource.length > 0) {
      for (let i = 0; i < this.PensionSource.length; i += 1) {
        SumOfPensionAmt += Number(this.PensionSource[i].Cash_Amt);
      }
      SumOfPensionAmt = Number(this.PensionBForm.value.PPoCash) + Number(SumOfPensionAmt)

      console.log("sumOf__pensionAMt_", SumOfPensionAmt, this.PensionBForm.value.PPoCash);

    }
    if (this.PensionBForm.value.PPoCash > CashAMt) {
      this.snackbar.show('Pension cash Amt cannot be grater than Net amount', 'danger')
    }
    else if (PPONo) {
      this.snackbar.show('PPO No. already Exist', 'danger')
    }
    else {
      if (SumOfPensionAmt <= CashAMt) {
        console.log("logoff___elseifpart", SumOfPensionAmt, CashAMt);

        this.Pension_Tableflag = true
        this.PensionSource.push({
          'PPO_No': this.PensionBForm.value.PPoNo,
          'Cash_Amt': this.PensionBForm.value.PPoCash,
          'PPO_Flag': this.PPoFlag_C,
        })
        this.PensionSource = [...this.PensionSource]
      }
      else {
        this.snackbar.show('sum of Pension Amount cannot be grater than Net Amount', 'danger')
      }
    }
  }

  Pension_Delete(index: any, element: any) {
    console.log("get__datat__", index, element);

    var Removedata = this.PensionSource[this.PensionSource.map(function (item) { return item.PPO_No; }).indexOf(element.PPO_No)];

    console.log("RemovePension___", Removedata);

    if (Removedata) {
      this.PensionSource.splice(index, 1);
      this.PensionSource = [...this.PensionSource]
    }
  }

  OnPensionFlagChange(event: any) {
    console.log("XXXXXXXXXXXXXXX_mat_radioVal", event.value);
    if (event.value == 'P') {
      this.PPoFlag_C = 'P'
    }
    else if (event.value == 'F') {
      this.PPoFlag_C = 'F'
    }
  }


  RDCCD_Add() {
    var GroassAMt = this.BillEntryForm.value.GrossAmt

    var ChallanNo = this.RDCCDSource[this.RDCCDSource.map(function (item) { return item.Challan_No; }).indexOf(this.RDCCDForm.value.Challan_No)];
    var SR = this.RDCCDSource[this.RDCCDSource.map(function (item) { return item.SRNo; }).indexOf(this.RDCCDForm.value.Sr_No)];
    var Name = this.RDCCDSource[this.RDCCDSource.map(function (item) { return item.Party_Name; }).indexOf(this.RDCCDForm.value.Name)];

    console.log("rdccdfor_status___", ChallanNo, SR, Name);
    console.log("Pension_arrr__", this.RDCCDSource, GroassAMt);

    var SumOfRDCCDAmt: number = 0
    if (this.RDCCDSource.length > 0) {
      for (let i = 0; i < this.RDCCDSource.length; i += 1) {
        SumOfRDCCDAmt += Number(this.RDCCDSource[i].Amount);
      }
      SumOfRDCCDAmt = Number(this.RDCCDForm.value.RDAmount) + Number(SumOfRDCCDAmt)

      console.log("sumOf__RDCCDAMt_", SumOfRDCCDAmt, this.RDCCDForm.value.PPoCash);

    }
    if (this.RDCCDForm.value.RDAmount > GroassAMt) {
      this.snackbar.show('Amount cannot be grater than Gross amount', 'danger')
    }
    else if (ChallanNo && SR && Name) {
      this.snackbar.show('Record already Exist', 'danger')
    }
    else {
      if (SumOfRDCCDAmt <= GroassAMt) {
        console.log("logoff___elseifpart", SumOfRDCCDAmt, GroassAMt);

        this.RDCCD_Tableflag = true
        this.RDCCDSource.push({
          'SRNo': this.RDCCDForm.value.Sr_No,
          'Challan_No': this.RDCCDForm.value.Challan_No,
          'Challan_Date': this.RDCCDForm.value.Challan_Date,
          'Amount': this.RDCCDForm.value.RDAmount,
          'Party_Name': this.RDCCDForm.value.Name,
          'GRN': 0,
        })
        this.RDCCDSource = [...this.RDCCDSource]
      }
      else {
        this.snackbar.show('sum of RDCCD Amount cannot be grater than Gross Amount', 'danger')
      }
    }
  }

  RDCCD_Delete(index: any, element: any) {
    console.log("get__RDCCDSource__", index, element);

    var Removedata = this.RDCCDSource[this.RDCCDSource.map(function (item) { return item.Challan_No; }).indexOf(element.Challan_No)];

    console.log("RemoveRDCCD___", Removedata);

    if (Removedata) {
      this.RDCCDSource.splice(index, 1);
      this.RDCCDSource = [...this.RDCCDSource]
    }
  }

  Add_payallow() {

    let PayId = this.PayallowForm.value.PayId
    let PayAmount = this.PayallowForm.value.PayAmount

    if (PayId == 97) {
      this.PayallowForm.patchValue({
        PayFDA: PayAmount
      })
    }
    else if (PayId == 98) {
      this.PayallowForm.patchValue({
        PayDP: PayAmount
      })
    }
    else {
      console.log("enter_allow", PayId, PayAmount);
      this.snackbar.show('Pay ID Invalid', 'danger')
      this.PayallowForm.get('PayId')?.reset();
      this.PayallowForm.get('PayAmount')?.reset();
    }
  }


  Add_MoreH() {
    this.BalanceBudgetCheck()

    console.log("testing_found__", this.MoreHForm.value.MB_Amount);
    var GrossAmt = this.BillEntryForm.controls['GrossAmt'].value
    var HeadGroassAmt = this.BillEntryForm.controls['HeadGross'].value;
    var BudgetAmt = this.BillEntryForm.controls['BudgetBal'].value;


    var budgetheadcheck = this.MoreHDeatls[this.MoreHDeatls.map(function (item) { return item.BudgetHead; }).indexOf(this.MoreHForm.value.MB_DetailHead)];
    var ObjectH_check = this.MoreHDeatls[this.MoreHDeatls.map(function (item) { return item.ObjectHead; }).indexOf(this.SelectMBObjectHead.objectHeadCode)];
    var bfccheck = this.MoreHDeatls[this.MoreHDeatls.map(function (item) { return item.BFCT; }).indexOf(this.MoreHForm.value.MB_PlanNonPlan)];
    var headtypecheck = this.MoreHDeatls[this.MoreHDeatls.map(function (item) { return item.HeadT; }).indexOf(this.MoreHForm.value.MB_VotedCharged)];
    var Amountheck = this.MoreHDeatls[this.MoreHDeatls.map(function (item) { return item.Amount; }).indexOf(this.MoreHForm.value.MB_Amount)];
    console.log("Morecheck__", budgetheadcheck, budgetheadcheck, bfccheck, headtypecheck, ObjectH_check);
    console.log("Morehead_arrr__", this.MoreHDeatls, BudgetAmt);


    let SumOfMHAmt: number = 0
    if (this.MoreHDeatls.length > 0) {
      console.log("berfor__arrr__", this.MoreHDeatls);

      for (let i = 0; i < this.MoreHDeatls.length; i++) {
        console.log("befor__nam__", this.MoreHDeatls[i].AMOUNT);

        SumOfMHAmt += Number(this.MoreHDeatls[i].AMOUNT);
        console.log("sumo__inloop__", SumOfMHAmt);

      }
      SumOfMHAmt = Number(this.MoreHForm.value.MB_Amount) + Number(SumOfMHAmt)

      console.log("sumOf__MoreHAMt_", SumOfMHAmt, this.MoreHForm.value.MB_Amount);

    }

    if (this.MoreHForm.value.MB_DetailHead.length < 13) {
      this.snackbar.show('Please Enter Detail Head', 'danger')
    }
    else if (!this.SelectMBObjectHead) {
      this.snackbar.show('Please Select Object Head', 'danger')
    }
    else if (this.MoreHForm.value.MB_Amount == 0) {
      this.snackbar.show('Enter Amount cannot be zero', 'danger')
    }
    else if (this.MoreHForm.value.MB_Amount > Math.abs(GrossAmt - HeadGroassAmt)) {
      this.snackbar.show('More Head Amount cannot be grater than diff of gross and head gross amount', 'danger')
    }

    else if (budgetheadcheck && bfccheck && headtypecheck && ObjectH_check) {
      this.snackbar.show('Record Already Exit', 'danger')
    }
    // else if(this.MoreHDeatls.length > 0 && SumOfBTAmt)
    else {
      if (SumOfMHAmt <= Math.abs(GrossAmt - HeadGroassAmt)) {
        this.MorehAddNewflag = true
        this.MoreHDeatls.push({
          'BUDGETHEAD1': this.MoreHForm.value.MB_DetailHead,
          'OBJECT_HEAD': this.SelectMBObjectHead.objectHeadCode,
          'AMOUNT': this.MoreHForm.value.MB_Amount,
          'BFC_TYPE': this.MoreHForm.value.MB_PlanNonPlan,
          'HEAD_TYPE': this.MoreHForm.value.MB_VotedCharged,
          'BUDGET_AMOUNT': BudgetAmt,
        })
        this.MoreHDeatls = [...this.MoreHDeatls]
      }
      else {
        this.snackbar.show('sum of More Head Amount cannot be grater than diff of gross and head gross amount', 'danger')
      }
    }
  }

  OnMOreHead_Delete(element: any, index: any) {
    var Removedata = this.MoreHDeatls[this.MoreHDeatls.map(function (item) { return item.BudgetHead; }).indexOf(element.BudgetHead)];

    console.log("RemoveMoreH___", Removedata);
    if (Removedata) {
      this.MoreHDeatls.splice(index, 1);
      this.MoreHDeatls = [...this.MoreHDeatls]
    }

  }

  ACBill_Add() {
    if (!this.AdvanceC_Form.value.AC_Sanction_No) {
      this.snackbar.show('Please Enter Sanction No', 'danger')
    }
    else if (!this.AdvanceC_Form.value.AC_Sanction_Date) {
      this.snackbar.show('Please Choose Sanction Date', 'danger')
    }
    else if (!this.AdvanceC_Form.value.AC_Purpose) {
      this.snackbar.show('Please Enter Purpose', 'danger')
    }
    else {
      console.log("arry___", this.ACBillSource.length);

      if (this.ACBillSource.length == 0) {
        this.ACBIllTableflag = true
        this.ACBillSource.push({
          'DC_Pending': this.AdvanceC_Form.value.AC_DC_Pending == true ? 'Y' : 'N',
          'Sanction_No': this.AdvanceC_Form.value.AC_Sanction_No,
          'Sanction_Date': formatDate(new Date(this.AdvanceC_Form.value.AC_Sanction_Date), 'dd/MM/yyyy', 'en'),
          'Purpose': this.AdvanceC_Form.value.AC_Purpose,
        })
      }
      else {
        this.snackbar.show('Date Already Exist', 'danger')
      }
    }
  }

  OnACBillDelete() {

    if (this.ACBillSource.length > 0) {
      this.ACBillSource = []
      this.ACBIllTableflag = false
    }
  }

  Insitituion_Add() {
    var GrossAmt = this.BillEntryForm.controls['GrossAmt'].value
    var Insitituion_Data = this.Insitituion_Form.controls['Insitituion_Code'].value
    console.log("insiiu__dettt__", GrossAmt, Insitituion_Data);
    var Insi_code = this.InsitituionSource[this.InsitituionSource.map(function (item) { return item.Insitituion_Code; }).indexOf(Insitituion_Data.MajorHeadCode)];
    var Insi_name = this.InsitituionSource[this.InsitituionSource.map(function (item) { return item.Insitituion_Name; }).indexOf(Insitituion_Data.MajorHeadCodeName)];


    if (this.GrantAidSource.length == 0) {
      this.snackbar.show('Please Add Grant In Aid Bill Details', 'danger')
    }
    else if (!this.GrantInAid_Form.value.Uc_Required) {
      this.snackbar.show('UC Required should be Y', 'danger')
    }
    else if (this.Insitituion_Form.value.Amount > GrossAmt) {
      this.snackbar.show('Amount Should be Equal or Less then Gross Amount', 'danger')
    }
    else if (Insi_code && Insi_name) {
      this.snackbar.show('Record Already Exit', 'danger')
    }
    else {

      let SumOfInsitituion: number = 0
      if (this.InsitituionSource.length > 0) {
        console.log("berfor__Insitituion", this.InsitituionSource);

        for (let i = 0; i < this.InsitituionSource.length; i++) {
          console.log("befor__Insitituion_", this.InsitituionSource[i].Insitituion_Amount);

          SumOfInsitituion += Number(this.InsitituionSource[i].Insitituion_Amount);
          console.log("sumo__Insitituion__", SumOfInsitituion);

        }
        SumOfInsitituion = Number(this.Insitituion_Form.value.Amount) + Number(SumOfInsitituion)

        console.log("sumOf__Insitituion_", SumOfInsitituion, this.Insitituion_Form.value.Amount);

      }

      if (SumOfInsitituion <= GrossAmt) {
        this.Insitituion_TabFlag = true

        this.InsitituionSource.push({
          'Insitituion_Code': Insitituion_Data.MajorHeadCode,
          'Insitituion_Name': Insitituion_Data.MajorHeadCodeName,
          'Insitituion_Amount': this.Insitituion_Form.value.Amount,
        })
        this.InsitituionSource = [...this.InsitituionSource]
      }
      else {
        this.snackbar.show('sum of Insitituion Amount cannot be grater than gross amount', 'danger')
      }
    }


  }

  Insitituion_Delete(index: any, element: any) {
    console.log("insu__delllt_", element, index);
    var Removedata = this.InsitituionSource[this.InsitituionSource.map(function (item) { return item.Insitituion_Name; }).indexOf(element.Insitituion_Name)];

    console.log("Removedata___InsitituionSource", Removedata);
    if (Removedata) {
      this.InsitituionSource.splice(index, 1);
      this.InsitituionSource = [...this.InsitituionSource]
    }

  }

  GrantInAid_Add() {
    console.log("arry___GrantInAid", this.GrantAidSource.length);

    if (this.GrantAidSource.length == 0) {
      this.GrantIn_Aid_Tableflag = true
      this.GrantAidSource.push({
        'UC_Required': this.GrantInAid_Form.value.Uc_Required == true ? 'Y' : 'N',
        'Sanction_No': this.GrantInAid_Form.value.GA_Sanction_No,
        'Sanction_Date': formatDate(new Date(this.GrantInAid_Form.value.GA_Sanction_Date), 'dd/MM/yyyy', 'en'),
        'Sanction_Authrity': this.GrantInAid_Form.value.GA_Sanction_Authority,
        'Sanction_Date_Validity': formatDate(new Date(this.GrantInAid_Form.value.GA_Sanction_Valid_Date), 'dd/MM/yyyy', 'en'),
        'Purpose': this.GrantInAid_Form.value.GA_Purpose,
      })
    }
    else {
      this.snackbar.show('Date Already Exist', 'danger')
    }
  }

  GrantInAid_Delete() {

    if (this.GrantAidSource.length > 0) {
      this.GrantAidSource = []
      this.GrantIn_Aid_Tableflag = false
    }
  }
  getNewFinalBHList() {
    // let newVal = value.replace(/[^0-9]/gi, '')
    let PayId = this.PayallowForm.value.PayId
    let PayAmt = this.PayallowForm.value.PayAmount
    const districtGroupsCopy1: any = [];
    // this.PayAllowData.forEach((x: any) => {
    //   let amttt = x.Amount
    //   console.log("inlogggg", amttt);

    //   if (x.id == PayId) {
    //     amttt = PayAmt
    //     console.log("inlasdfasdfa", amttt);

    //   }
    //   districtGroupsCopy1.push({
    //     id: x.id,
    //     name: x.name,
    //     amount: amttt
    //   });
    //   console.log('fasdfasfasdf', districtGroupsCopy1);

    // });

    let upd_payallowdata = this.PayAllowData.map((obj: any) => {
      if (obj.id == PayId) {
        obj.Amount = PayAmt
      }
      return obj
    })

    console.log('districtGroupsCopy', districtGroupsCopy1, upd_payallowdata);
    let SumOfBTAmt = 0
    // return districtGroupsCopy1;
    if (upd_payallowdata.length > 0) {
      for (let i = 0; i < upd_payallowdata.length; i += 1) {
        SumOfBTAmt += Number(upd_payallowdata[i].Amount);
      }
      this.PayAllowSum = SumOfBTAmt
      console.log("ssummmii_btamt__", SumOfBTAmt, this.PayAllowData);

    }
  }


  WorkInvoice_Add() {
    console.log("arry___WorkInvoice", this.WorkInvoiceSource.length);

    if (this.WorkInvoiceSource.length == 0) {
      this.WorkITableflag = true
      this.WorkInvoiceSource.push({
        'Invoice_No': this.WorkInvForm.value.Invoice_No,
        'Invoice_Date': formatDate(new Date(this.WorkInvForm.value.Invoice_Date), 'dd/MM/yyyy', 'en'),
        'WorkO_No': this.WorkInvForm.value.WorkO_No,
        'WorkO_Date': formatDate(new Date(this.WorkInvForm.value.WorkO_Date), 'dd/MM/yyyy', 'en'),
        'Party_Name': this.WorkInvForm.value.WorkIName,
      })
    }
    else {
      this.snackbar.show('Date Already Exist', 'danger')
    }
  }

  WorkInvoice_Delete() {

    if (this.WorkInvoiceSource.length > 0) {
      this.WorkInvoiceSource = []
      this.WorkITableflag = false
    }
  }

  Get_AccName() {
    alert('hiiiii')
    this.PdAcc_Name = 'Pd Account Name'
  }

  OnBTDelete(element: any, index: any) {
    var Removedata = this.OtherBTDeatls[this.OtherBTDeatls.map(function (item) { return item.BudgetHead; }).indexOf(element.BudgetHead)];

    console.log("Removedata___", Removedata);

    // if (Removedata) {
    //   this.OtherBTDeatls.splice(this.OtherBTDeatls.findIndex((a: any) => a.BudgetHead === this.SelectDetailHeadd), 1)
    //   console.log("remove_btdetails___", this.OtherBTDeatls);
    //   this.OtherBTDeatls = [...this.OtherBTDeatls]

    // }
    if (Removedata) {
      this.OtherBTDeatls.splice(index, 1);
      this.OtherBTDeatls = [...this.OtherBTDeatls]
    }
  }

  //Add new bt fun()
  onadd_NewBt() {
    var BTAmount = this.BookTForm.controls['BTAmount'].value;
    var BtSanctionNo = this.BookTForm.controls['BTSanctionNo'].value;
    var BTSanctionDate = this.BookTForm.controls['BTSancationDate'].value;
    var BTBFCType = this.BookTForm.controls['BTPlanNonPlan'].value;
    var BTHeadtype = this.BookTForm.controls['BTVotedCharged'].value;

    var BTConBFCType = this.BookTForm.controls['BTConPlanNonPlan'].value;
    var BTConHeadtype = this.BookTForm.controls['BTConVotedCharged'].value;
    // var GrossAmt = this.BillEntryForm.controls['GrossAmt'].value;
    var BalanceDiff = this.BillEntryForm.controls['budgetval'].value;
    var SumOfBTAmt: number = 0
    if (this.OtherBTDeatls.length > 0) {
      for (let i = 0; i < this.OtherBTDeatls.length; i += 1) {
        SumOfBTAmt += Number(this.OtherBTDeatls[i].AMOUNT);
      }
      SumOfBTAmt = Number(BTAmount) + Number(SumOfBTAmt)

      console.log("sumOf__btamt__", SumOfBTAmt, BTAmount);

    }


    // var NetAmt = this.BillEntryForm.controls['NetAmt'].value;

    // const found = this.OtherBTDeatls.some((el: any) => {
    console.log("testing_found__", this.SelectDetailHeadd.groupsubheadname);

    //   el.BudgetHead === this.SelectDetailHeadd.groupsubheadname
    // });

    var budgetheadcheck = this.OtherBTDeatls[this.OtherBTDeatls.map(function (item) { return item.BudgetHead; }).indexOf(this.SelectDetailHeadd.groupsubheadname)];
    var bfccheck = this.OtherBTDeatls[this.OtherBTDeatls.map(function (item) { return item.CPnp; }).indexOf(BTBFCType)];
    var headtypecheck = this.OtherBTDeatls[this.OtherBTDeatls.map(function (item) { return item.CVnc; }).indexOf(BTHeadtype)];
    var pdcheck = this.OtherBTDeatls[this.OtherBTDeatls.map(function (item) { return item.PDAcNo; }).indexOf(this.SelectPdAcc.PDAccNo)];
    var objectheadcehck = this.OtherBTDeatls[this.OtherBTDeatls.map(function (item) { return item.ObjectHead; }).indexOf(this.SelecBTObjecthead.objectHeadCode)];

    //   console.log("testing_found__", el.BudgetHead, this.SelectDetailHeadd.groupsubheadname);

    console.log("otherbt___data__", this.OtherBTDeatls);
    console.log("hkjhjkhkjh___", budgetheadcheck, budgetheadcheck, bfccheck, headtypecheck, pdcheck, objectheadcehck);

    if (budgetheadcheck && budgetheadcheck && bfccheck && headtypecheck && pdcheck && objectheadcehck) {
      this.snackbar.show('Record Already Exit', 'danger')
    }
    else if (BTAmount > BalanceDiff) {
      this.snackbar.show('BT Total Amount Should Be Equal To The Differece Of Gross and Net Amount', 'danger')
    }
    else if (this.SelectDetailHeadd.code == '8443001060000' && !this.SelectPdAcc) {

      this.snackbar.show('Please Select pd account when budget head is 8443-00-106-00-00', 'danger')
    }
    else if (this.SelectPdAcc && !(BtSanctionNo && BTSanctionDate)) {
      console.log("bt_sanctionde___", BtSanctionNo, BTSanctionDate);

      this.snackbar.show('Sanction Details are Required for BookTransfer Bill !!', 'danger')
    }
    else if ((this.SelectDetailHeadd.code == '8443001080000' || this.SelectDetailHeadd.code == '8443001090000') && !(this.SelectDivision)) {
      this.snackbar.show('Please Select Division when budget head is 8443-00-108-00-00 or 8443-00-109-00-00', 'danger')
    }
    else if (BTAmount) {
      console.log("inbt__asdfasdf", BtSanctionNo, BTSanctionDate);

      if (SumOfBTAmt <= BalanceDiff) {
        this.SumBTAmt = SumOfBTAmt

        console.log("billentry_modal_before__", this.SelectDetailHeadd, this.SelecBTObjecthead, BTBFCType, BTHeadtype);

        let Newbt_Body = {
          "detailHead": this.SelectDetailHeadd.code,
          "objectHead": "00",
          "votedCh": BTHeadtype,
          "pnp": BTBFCType,
          "finYear": "2023"
        }
        console.log("new_body__hawan__", Newbt_Body, BTSanctionDate);


        this.ApiMethods.postresultservice(this.ApiService.VerifyNewBT, Newbt_Body).subscribe((resp: any) => {

          console.log("Bt_verifybefor_add", resp.result);

          if (Object.keys(resp).length > 0) {
            this.loader.setLoading(false);

            if (resp.result != '000000') {
              this.BtAddNewflag = true
              this.OtherBTDeatls.push({
                'OBJECT_HEAD': this.SelecBTObjecthead.objectHeadCode,
                'PDAcNo': this.SelectPdAcc.PDAccNo,
                'AMOUNT': BTAmount,
                'BUDGETHEAD': this.SelectDetailHeadd.groupsubheadname,
                'Sanction_No': BtSanctionNo,
                'Sanction_Date': BTSanctionDate ? formatDate(new Date(BTSanctionDate), 'dd/MM/yyyy', 'en') : '',
                'For_Treasury': this.Tcode.Treasury_Code,
                'Concern_PDAcNo': this.SelectConPdAcc.PDAccNo,
                'Concern_BudgetHead': this.SelectBTConDetailHead.groupsubheadname,
                'Concern_BFC_TYPE': BTConBFCType,
                'Concern_HEAD_TYPE': BTConHeadtype,
                'Concern_ObjectHead': this.SelecBTConObjecthead.objectHeadCode,
                'Concern_Division': this.SelectConDivision.PDAccNo
              })
              this.OtherBTDeatls = [...this.OtherBTDeatls]


              console.log("btarr_fbbbb", this.OtherBTDeatls, BalanceDiff, BTAmount);
            }
            else {
              this.snackbar.show('Bt not available', 'danger')

            }

          }
        },
          (res: any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')

            }
          })
      }
      else {
        this.snackbar.show('BT Total Amount Should Be Equal To The Differece Of Gross and Net Amount', 'danger')

      }

    }
    else {
      this.snackbar.show('Please enter BT Amount', 'danger')
    }
  }

  onChange(UpdatedValue: any): void {
    let GrossAMT = this.BillEntryForm.controls['GrossAmt'].value;  //TokenNum controller

    console.log("onchangefunclall__", UpdatedValue);
    if (Math.abs(GrossAMT - UpdatedValue) != 0) {
      this.BTAutoCHeck = true
      console.log("afteronchanges", Math.abs(GrossAMT - UpdatedValue));
      this.BillEntryForm.patchValue({
        budgetval: Math.abs(GrossAMT - UpdatedValue),
      })
    }
    else {
      this.BTAutoCHeck = false
    }
  }

  OnShowDetails() {

    this.Api_erroFlag = false
    let TokenNum = this.BillTypeForm.controls['TokenNum'].value;  //TokenNum controller


    // stop here if form is invalid
    if (this.BillTypeForm.invalid) {
      console.log('Error');
      return;
    }
    else {

      if (this.loginflag && this.BillTypeForm.valid) {
        this.loader.setLoading(true);

        var GetsalaryBody = {
          tokenNo: TokenNum,
          userId: this.Tcode.UserId,
          ddobillNO: 0,
          treasuryCode: this.Tcode.Treasury_Code,
          finYearFrom: this.Tcode.forwardYear
        }
        console.log("before_set_body__api", GetsalaryBody);
        this.TokenNo = TokenNum
        // this.BillEntry_flag = 2

        // On show details api call
        this.ApiMethods.postresultservice(this.ApiService.getofflinetoken, GetsalaryBody).subscribe((resp: any) => {

          console.log("loadinfo_billentry_verify___", resp);
          let response = resp.result[0]
          this.billentry_info = response
          // this.Popup_error_list = response.out_msg
          this.loader.setLoading(false);

          if (resp.result.length > 0) {


            this.loader.setLoading(false);
            this.BillEntry_flag = 2

            //this.BillTypeForm.reset();


            let DdocodeNamehfilter = this.DdoNameListarr.find((item => item.ddo_code === response.DDO_CODE))
            console.log("ddocodefilter", DdocodeNamehfilter);

            let Billtypefilter = this.BillTypeListarr.find(item => item.Ncode === response.BILL_TYPE)
            console.log("Billtypefilter", Billtypefilter);
            this.getBillSubTypeList(response.BILL_TYPE)

            this.SelectDdoName = DdocodeNamehfilter
            this.SelectBilltype = Billtypefilter
            this.BillEntryForm.patchValue({
              GrossAmt: response.GROSS_AMT,
              NetAmt: response.CASH_AMT,
              DdoName: DdocodeNamehfilter,
              Billtype: Billtypefilter,
              budgetval: Math.abs(response.GROSS_AMT - response.CASH_AMT),
              DetailHead: response.MAJOR_HEAD
            })


            //block open conditon
            if (response.BILL_TYPE == 7 || response.BILL_TYPE == 8) {
              console.log("inifff___");
              this.Service_flag = true
              this.Loan_flag = true
            }
            else {
              console.log("inesleeee___");
              this.Service_flag = false
              this.Loan_flag = false
            }

            if (response.BILL_TYPE == 11) {
              console.log("inifff___ACBlock_flag");
              this.ACBlock_flag = true
            }
            else {
              console.log("inesleeee___ACBlock_flag");
              this.ACBlock_flag = false
            }

            if (response.BILL_TYPE == 9) {
              console.log("inifff___PDAcc_flag");
              this.PDAcc_flag = true
            }
            else {
              console.log("inesleeee___PDAcc_flag");
              this.PDAcc_flag = false
            }
            if (response.BILL_TYPE == 13) {
              console.log("inifff___Grant_in_aid_flag");
              this.Grant_in_aid_flag = true
              this.Institution_flag = true
            }
            else {
              console.log("inesleeee___Grant_in_aid_flag");
              this.Grant_in_aid_flag = false
              this.Institution_flag = false
            }
            if (response.BILL_TYPE == 22) {
              console.log("inifff___WorkB_Flag");
              this.WorkB_Flag = true
              this.Service_flag = true
            }
            else {
              console.log("inesleeee___WorkB_Flag");
              this.WorkB_Flag = false
              this.Service_flag = false
            }

            if (response.BILL_TYPE == 23) {
              console.log("inifff___Pension_flag");
              this.Pension_flag = true
            }
            else {
              console.log("inesleeee___Pension_flag");
              this.Pension_flag = false
            }
            if (response.BILL_TYPE == 26) {
              console.log("inifff___RDCCD_Flag");
              this.RDCCD_Flag = true
            }
            else {
              console.log("inesleeee___RDCCD_Flag");
              this.RDCCD_Flag = false
            }

            if (response.BILL_TYPE == 36) {
              console.log("inifff___WorkInv_Flag");
              this.WorkInv_Flag = true
            }
            else {
              console.log("inesleeee___WorkInv_Flag");
              this.WorkInv_Flag = false
            }
            if (response.BILL_TYPE == 2 || response.BILL_TYPE == 1) {
              console.log("inifff___PayAllow_Flag");
              this.PayAllow_Flag = true
            }
            else {
              console.log("inesleeee___PayAllow_Flag");
              this.PayAllow_Flag = false
            }

            if (Math.abs(response.GROSS_AMT - response.CASH_AMT) != 0) {
              this.BTAutoCHeck = true
            }
            console.log("BillTypeForm==>>", this.BillEntryForm);
          }
          else {
            this.snackbar.show('Data does not related to BILL ENTRY', 'danger')
            this.BillTypeForm.reset()

          }
        },
          (res: any) => {
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
    this.Morehead_flag = false
    this.Section_flag = false
    this.Institution_flag = false
    this.BillEntryForm.reset();
    this.BillTypeForm.reset();
    this.budget_Status = false
    this.Grant_in_aid_flag = false
    this.Tcode.Billtype_error1 = true
    this.Tcode.Billtype_error2 = true
    this.Tcode.Billtype_error3 = true
    this.Tcode.Billtype_error4 = true
    this.Tcode.Billtype_error5 = true
    this.Tcode.Billtype_error6 = true
    this.Tcode.Billtype_error7 = true
    this.Tcode.Billtype_error8 = true
    this.Tcode.Billtype_error9 = true

    this.Tcode.CommonErr1 = true
    this.Tcode.CommonErr2 = true
    this.Tcode.CommonErr3 = true
    this.Tcode.CommonErr4 = true
    this.Tcode.CommonErr5 = true
    this.Tcode.CommonErr6 = true
    this.Tcode.CommonErr7 = true
    this.Tcode.CommonErr8 = true
    this.Tcode.CommonErr9 = true
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
  get Treasury() { return this.BillTypeForm.get('Treasury') }
  get Year() { return this.BillTypeForm.get('Year') }

  get DdoName() { return this.BillEntryForm.get('DdoName') }
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
  get GPFPolicy() { return this.LoanBForm.get('GPFPolicy') }
  get EmployeeN() { return this.LoanBForm.get('EmployeeN') }
  get AuthorityNo() { return this.LoanBForm.get('AuthorityNo') }

  get AC_DC_Pending() { return this.AdvanceC_Form.get('AC_DC_Pending') }
  get AC_Sanction_No() { return this.AdvanceC_Form.get('AC_Sanction_No') }
  get AC_Sanction_Date() { return this.AdvanceC_Form.get('AC_Sanction_Date') }
  get AC_Purpose() { return this.AdvanceC_Form.get('AC_Purpose') }
  get AC_Sanction_Authority() { return this.AdvanceC_Form.get('AC_Sanction_Authority') }

  get PDAccount_No() { return this.PDACCForm.get('PDAccount_No') }

  get FD_SanctionNo() { return this.SanctionDForm.get('FD_SanctionNo') }
  get FD_SanctionDate() { return this.SanctionDForm.get('FD_SanctionDate') }
  get Order_NO() { return this.SanctionDForm.get('Order_NO') }
  get Order_Date() { return this.SanctionDForm.get('Order_Date') }

  get Uc_Required() { return this.GrantInAid_Form.get('Uc_Required') }
  get GA_Sanction_No() { return this.GrantInAid_Form.get('GA_Sanction_No') }
  get GA_Sanction_Date() { return this.GrantInAid_Form.get('GA_Sanction_Date') }
  get GA_Sanction_Valid_Date() { return this.GrantInAid_Form.get('GA_Sanction_Valid_Date') }
  get GA_Sanction_Authority() { return this.GrantInAid_Form.get('GA_Sanction_Authority') }
  get GA_Purpose() { return this.GrantInAid_Form.get('GA_Purpose') }

  get Cheque_No() { return this.WorkDBForm.get('Cheque_No') }
  get Cheque_Date() { return this.WorkDBForm.get('Cheque_Date') }

  get PPoNo() { return this.PensionBForm.get('PPoNo') }
  get PPoFlag() { return this.PensionBForm.get('PPoFlag') }
  get PPoCash() { return this.PensionBForm.get('PPoCash') }

  get Insitituion_Code() { return this.Insitituion_Form.get('Insitituion_Code') }
  get Amount() { return this.Insitituion_Form.get('Amount') }

  get Challan_No() { return this.RDCCDForm.get('Challan_No') }
  get Challan_Date() { return this.RDCCDForm.get('Challan_Date') }
  get RDAmount() { return this.RDCCDForm.get('RDAmount') }
  get Sr_No() { return this.RDCCDForm.get('Sr_No') }
  get Name() { return this.RDCCDForm.get('Name') }

  get Invoice_Date() { return this.WorkInvForm.get('Invoice_Date') }
  get Invoice_No() { return this.WorkInvForm.get('Invoice_No') }
  get WorkO_Date() { return this.WorkInvForm.get('WorkO_Date') }
  get WorkO_No() { return this.WorkInvForm.get('WorkO_No') }
  get WorkIName() { return this.WorkInvForm.get('WorkIName') }

  get PayId() { return this.PayallowForm.get('PayId') }
  get PayAmount() { return this.PayallowForm.get('PayAmount') }


  viewDocument() {
    this.IsOpen = !this.IsOpen;
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



