import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ApiMethods } from 'src/app/utils/ApiMethods';

@Injectable({
  providedIn: 'root'
})


export class Helper {

  public officeid_valid: boolean = false
  public BT_valid: boolean = false
  public Payid_valid: boolean = false
  public BillNoId_valid: boolean = false
  public budgetHead_valid: any = ''
  public New_billcode_flag: boolean = false
  public grant_valid: boolean = false
  public instituation_valid: boolean = false
  public AcBlock_valid: boolean = false
  public Loan_valid: boolean = false
  public moreHead_valid: boolean = false
  public headgross_valid: boolean = false
  public Cashamt_valid: boolean = false
  public Rbi_valid: boolean = false
  public BillNoDuplicate: boolean = false
  public Pdac_valid: boolean = false
  public Rupess_valid: boolean = false
  public CommonErr1: boolean = false
  public CommonErr2: boolean = false
  public CommonErr3: boolean = false
  public CommonErr4: boolean = false
  public CommonErr5: boolean = false
  public CommonErr6: boolean = false
  public CommonErr7: boolean = false
  public CommonErr8: boolean = false
  public CommonErr9: boolean = false
  public Billtype_error1: boolean = false
  public Billtype_error2: boolean = false
  public Billtype_error3: boolean = false
  public Billtype_error4: boolean = false
  public Billtype_error5: boolean = false
  public Billtype_error6: boolean = false
  public Billtype_error7: boolean = false
  public Billtype_error8: boolean = false
  public Billtype_error9: boolean = false
  public Billtype_error10: boolean = false
  
  //public Treasury_Code: any = localStorage.getItem("tCode");
  userinfo:any={};
  public Treasury_Code: any = this.userinfo.treasCode;

  //public BillNo_error: string = "Bill No Not Valid" //shubhang
  // public Montserrat: "Montserrat";
  // public sansserif: "sans-serif"  
  // public Yes: "Y";
  // public NO: 'N';
  preEncashStr: any     // Encashment Declarations 

  //public UserId = this.userinfo.userId;
   //public UserId=''
  public UserId = sessionStorage.getItem("rajkoshId")
  
  public IpAddress: string = '172.32.22.106'
  public assignmentId: any 

  // constructor() {
    constructor(private ApiMethods: ApiMethods,) {
    this.userinfo = this.ApiMethods.getUserInfo();
    this.preEncashStr = 'Not Available for Voucher because ';  // Encashment preEncashStr 
    this.UpdateYear();
    
    // For Online :-------------------------------------------------------------->
    this.Treasury_Code = this.userinfo.treasCode;
   // this.UserId = this.userinfo.userId;
    // this.UserId =  this.ApiMethods.getrajkoshIdInfo();
    this.assignmentId= this.userinfo.aid;

    // For Offline :-------------------------------------------------------------->
    //  this.Treasury_Code = "5000";  
  }



  CommanMsg()    // Comman Message 
  {
    return 'Data Not Found ! !';
  }

  APIErrorMsg()   // API Error Message 
  {
    return 'Something Went Wrong! Please Try Again !';
  }

  //================|| Validation Messages For Bill Encashment Component ||================================================================begiN=============

  En1() // Encashment Message - 1  -------------//if (TOFlag == "" || TOFlag == null)
  {
    return this.preEncashStr + 'To Action Is Pending !';
  }

  En2() // Encashment Message - 2  -------------if (TOFlag == "C" || TOFlag == "O")
  {
    return this.preEncashStr + 'Either TO Cancelled the Bill or put objection on the Bill !';
  }

  En3() // Encashment Message - 3  -------------if ((ChequeNo == null || ChequeNo == "" || ChequeNo == "0") && (double.Parse(CashAmt) > 0) && EcsnonEcs == "C")
  {
    return this.preEncashStr + 'Cheque Printing is Pending !';
  }

  En4() // Encashment Message - 4  ------------- if ((double.Parse(CashAmt) > 0) && EcsnonEcs == "C")  -----&-------  // if (dispatchdate == "")
  {
    return this.preEncashStr + 'token not dispatched !';
  }

  En5() // Encashment Message - 5  ------------- if ((double.Parse(CashAmt) > 0) && EcsnonEcs == "C")  -----&-------  //  if (BankSoftCopyFlag.ToString() == "N")
  {
    return this.preEncashStr + 'Bank has not Updated the Transaction Status !';
  }

  En6() // Encashment Message - 6  ---- if (double.Parse(CashAmt) == 0 || EcsnonEcs == "E") --&-- //  if if (EcsnonEcs == "E") --&- //if (billnoid != paymanagerbillnoid)
  {
    return this.preEncashStr + 'Bank has not Updated the Transaction Status / Digital Signed Documents not uploaded !';
  }

  En7() // Encashment Message - 7 ---- TV No. Generation Message
  {
    return 'TV No. Generated !';
  }

  En8() // Encashment Message - 8 ---- Day has been closed Message
  {
    return 'Day has been closed for selected date !';
  }

  En9() // Encashment Message - 9 ---- Not TV No. Generation Message
  {
    return 'Voucher No. could not be Generated ! Please Try after some time !';
  }

  En10() // Encashment Message - 10 ---- Voucher And Scroll Amount Not Match Message
  {
    return 'Voucher And Scroll Amount Not Match !';
  }
  //================|| Validation Messages For Bill Encashment Component ||================================================================enD=============



  //================|| Validation Messages For Cheque Cancel Component ||================================================================begiN=============
  ChqCan1() // Cheque Cancel Message - 1  ---- Cheque has been Cancel Msg
  {
    return 'Cheque has been Cancel !';
  }


  ChqCan2() // Cheque Cancel Message - 2  ---- // Please Select Reason Msg
  {
    return 'Please Select Reason for cheque Cancel !';
  }

  date: Date = new Date();
  currentYear!: number;
  year!: number;

  month!: number;
  finyear!: number;
  fwdYear1!: String;
  fwdYear2!: String;
  forwardYear!: string;
  FinancialYear!: string;
  

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  //  constructor(){
  //   this.updateMonth();
  //  }
  public UpdateYear(type?: string) {
    if (this.month <= 3) {

      this.currentYear = ((new Date()).getFullYear());
      this.finyear = this.year - 1;
      console.log("yearr_vin", this.finyear)
      this.month = this.date.getMonth() + 1;
      console.log("month__", this.month);
      console.log("monthvalue__", this.date.getMonth())
      this.fwdYear1 = this.currentYear.toString();
      console.log("fwddate1--", this.fwdYear1);
      this.fwdYear2 = this.finyear.toString();
      console.log("fwddate2--", this.fwdYear2);
      console.log("curentyear__", this.currentYear)
      //this.forwardYear = this.fwdYear1 + "" + this.fwdYear2
      this.forwardYear = this.fwdYear1.toString().substring(2) + "" + this.fwdYear2.toString().substring(2)
      this.FinancialYear = this.fwdYear1 + "-" + this.fwdYear2
      console.log("forwarddate__", this.forwardYear);
    }
    else {
      this.currentYear = ((new Date()).getFullYear());
      this.year = this.date.getFullYear();
      console.log("year__", this.year)
      this.finyear = this.year + 1;
      console.log("fyear_", this.finyear)
      this.month = this.date.getMonth() + 1;
      console.log("month__", this.month);
      console.log("monthvalue__", this.date.getMonth())
      this.fwdYear1 = this.currentYear.toString();
      console.log("fwddate1--", this.fwdYear1);
      this.fwdYear2 = this.finyear.toString();
      console.log("fwddate2--", this.fwdYear2);
      console.log("curentyear__", this.currentYear)
      this.forwardYear = this.fwdYear1.toString().substring(2) + "" + this.fwdYear2.toString().substring(2)
      console.log("forwarddate__", this.forwardYear);
      this.FinancialYear = this.fwdYear1 + "-" + this.fwdYear2
    }
  }


  BillNo() {
    return { ObjectionC: 0, Billtype: 'Bill No Not Valid' }
  }

  OfficeID() {
    return { ObjectionC: 200, OfficeIDtype: 'Office Id Not Valid' }
  }

  PDAccount() {
    return { ObjectionC: 201, Accounttype: ' Pd Account not valid' }
  }

  Amount() {
    return { ObjectionC: 202, Amounttype: 'Deduction Amount should be equal to difference of gross and cash Amount' }
  }
  PayAllounceAmount() {
    return { ObjectionC: 203, PayAmounttype: 'PayAllowance Amount should be equal to gross Amount' }
  }
  GrantBill() {
    return { ObjectionC: 1110, GrantBilltype: 'Grant In Aid Details Not Found' }
  }
  ACCblock() {
    return { ObjectionC: 1111, GrantBilltype: ' Advance Contingency block data not found' }
  }
  GrossAmount() {
    return { ObjectionC: 1112, Amounttype: ' Gross amount should be equal to loan amount' }
  }
  Instituation() {
    return { ObjectionC: 1113, InstituationType: 'Instituation Details Not Found' }
  }
  morehead() {
    return { ObjectionC: 1114, moreheadType: 'Gross Amount should be equal to sum of head gross and morehead total' }
  }
  headgross() {
    return { ObjectionC: 5015, headgrossType: 'Gross Amount should be greter than the head gross amount' }
  }
  CAShAmount() {
    return { ObjectionC: 1115, CashamountType: 'Gross Amount should be greter than the cash amount' }
  }
  RBI() {
    return { ObjectionC: 1116, DeatilType: ' Rbi bank not allow if cash amount is 0' }
  }
  Decimal() {
    return { ObjectionC: 1117, DType: 'decimal value not allow in amount' }
  }

  CE1() {
    return { ObjectionC: 1118, CE1Type: 'Budget Head=8443001060000 is not allowed when Billtype = 20 ' }
  }
  CE2() {
    return { ObjectionC: 1119, CE2Type: ' Pd A/c is compulsory with this BudgetHead !' }
  }
  CE3() {
    return { ObjectionC: 1120, CE3Type: ' PdAcNo. is Not Required in Non PD BillType' }
  }
  CE4() {
    return { ObjectionC: 5015, CE4Type: 'Amount mismatch at paymanager' }
  }
  CE5() {
    return { ObjectionC: 0., CE5Type: 'BudgetHead entry not allowed' }
  }
  CE6() {
    return { ObjectionC: 0, CE6Type: 'Budget Head should be same' }
  }
  CE7() {
    return { ObjectionC: 0, CE7Type: 'Entries are not proper at paymanager Please Contact PayManager Team.' }
  }
  CE8() {
    return { ObjectionC: 5002, CE8Type: 'BT Details Not Found' }
  }
  CE9() {
    return { ObjectionC: 5005, CE9Type: 'Second detail Budget Insufficient' }
  }
  BillTypeError1() {
    return { ObjectionC: 5007, BE1Type: ' Please Check Sanction/Institutions' }
  }
  BillTypeError2() {
    return { ObjectionC: 5009, BE2Type: 'Mapping of ObjectHead to Billtype is not valid' }
  }
  BillTypeError3() {
    return { ObjectionC: 5008, BE3Type: 'Only Salary Bill allowed month of May' }
  }
  BillTypeError4() {
    return { ObjectionC: 5003, BE4Type: 'BudgetHead not Found in below region OR Duplicate entry found or 8782 Not Allowed in BT!' }
  }
  BillTypeError5() {
    return { ObjectionC: 5002, BE5Type: ' BT Amount could not be fraction i  Rupees !' }
  }
  BillTypeError6() {
    return { ObjectionC: 5016, BE6Type: ' PD A/C No Compulsory With  8443001060000 in BT Detail' }
  }
  BillTypeError7() {
    return { ObjectionC: 4, BE7Type: 'BillSubType is not valid for selected Bill.' }
  }
  BillTypeError8() {
    return { ObjectionC: 5, BE8Type: 'PayManager Data not Correct...' }
  }
  BillTypeError9() {
    return { ObjectionC: 6, BE9Type: 'Token No already Exist for this financial year.' }
  }
  BUdgetEr1() {
    return { ObjectionC: 5005, BuType: 'Budget Insufficient' }
  }
  BUdgetEr2() {
    return { ObjectionC: 5006, Bu2Type: 'MAJOR HEAD is not proper for selected BILL TYPE' }
  }
  BUdgetEr3() {
    return { ObjectionC: 5007, Bed2Type: 'InCorrect Division Code' }
  }
  BUdgetEr4() {
    return { ObjectionC: 5008, B3Type: 'Invalid PD Account No.' }
  }
  BUdgetEr5() {
    return { ObjectionC: 5003, B5Type: ' Please check the BudgetHead,ObjectHead,State Fund/Central Assistance,Voted/Charged or BillType , BillSubType' }
  }
  BUdgetEr6() {
    return { ObjectionC: 5006, B6Type: ' Bill No is Already Exist in this year' }
  }

 

  ngOnInit() {
    //console.log('value', this.value);
    // Set value if default date is present
    // if (this.value) this.date = new Date(this.value);
    //    this.UpdateYear();
  }
} 