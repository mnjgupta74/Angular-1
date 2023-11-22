
export class ICheckValidation {
  treasurycode!: string
  billnoid!: number
  finyear!: number
  tokenNo!: number
  officeId!: number
  ddoCode!: number
  detailHead!: number
  objectHead!: number
  planNonPlan!: string
  votedCharged!: string
  pdAcNo!: number
  billtype!: number
  billsubtype!: number
  billmonth!: number
  billyear!: number
  majorHead!: string
  divcode!: number
}

// export class ISaveBillEntry {
//   treasCode!: string
//   billNoID!: number
//   tokenFinYear!: string
//   finYearFrom!: number
//   chequeDate!: string
//   payType!: number
//   tokenNo!: number
//   ecsnonecs!: string
//   auditiorflag!: string
//   budgetAmount!: string
//   aisGNG!: string
//   transType!: number
//   insAssFlag!: number
//   objectionTypeCode!: string
//   ipAddress!: string
//   bankCode!: number
//   userId!: number
//   billSubType!: number
//   divcode!: number
//   oldBillCode!: number
//   demandNo!: number
//   pdacno!: number
//   hod!: number
// }

export class ISaveBillEntry {
  finYearFrom!: number
  chequeDate!: string
  auditiorflag!: string
  objectionTypeCode!: any
  bankCode!: number
  userId!: any
  refNo!: number
  assignMentId!: number
  ipAddress!: any
}

export class ICheckbillentrysave {
  treasCode!: string
  objectHead!: number
  transType!: number
  billSubType!: number
  majorHead!: number
  detailHead!: number
  divCode!: number
  pd_AcNo!: number
  votedCh!: string
  pnp!: string
  type!: number
  finYear!: number
  demandno!: number
}


// Bill voucher Interface----->
export class GetBillVoucher {
  treasuryCode!: string;
  finYearFrom!: number
  treasuryRefNo!: number;
  finYearTo!: number;
  type!: number
}




// Objectionlist Interface----->
export class IGetObjectionDataList {
  type!: number;
  userId!: any;
  userType!: number;
  billNo!: any;
}
// GetOnlineBillList Interface----->
export class IGetOnlineBillList {
  treasurycode!: string;
  finyear!: string
  userid!: any;
  type!: string;
}

// GetTreasuryOfficerList Interface----->
export class IGetTreasuryOfficerList {
  type!: number;
  tokenNo!: string;
  //userid!: number;
  treasuryCode!: string;
  auditor!: number;
}


// GetTreasuryOfficerForwardList Interface----->
export class IGetTreasuryOfficerForwardList {
  treasuryRefNo!: number;
  userid!: any;
  asignmentId!: number;
}

// GetTreasuryOfficerRevertList Interface----->
export class IGetTreasuryOfficerRevertList {
  treasuryRefNo!: number;
  type!: number;
}
// GetObjectionlist Interface----->
export class IbillExist {
  treasurycode!: string;
  billnoid!: number;
  finyear!: number;
  tokenNo!: number;
}
// Bill Check no Interface----->
export class GetBIllDup {
  treasuryCode!: string;
  finyear!: number
  ddoCode!: number;
  finTo!: number;
  ddoBillNo!: number
  majorhead!: number
}
// GetTreasuryOfficerListRemark Interface----->
export class IGetTreasuryOfficerListRemark {
  billcode!: number;
  userId!: any;
  remark!: string;

}


// Bill Cancel Fetch Interface----->
export class IBillCancelFetch {
  treaCode!: string;
  tokenNo!: string;
  ddoCode!: number;
  finyear!: string;
  type!: number;

}

// Bill Cancel Submit Interface----->
export class IBillCancelSubmit {
  treasuryRefno!: number;
  assignmentId!: any;
  userId!: any;
  reason!: string;
  ipAddress!: string;
}


// Bill Cancel Submit Interface----->
export class ISaveObjection {
  userid!: any;
  treasuryRefNo!: number;
  // pageType!: string;
  // type!: number;
  otherList!: any;
  objectionlist!: any;
  userType!: number;
}

 

// DDO Master Interface----->
export class IDDOMaster {
  treasCode!: string;
  officeid!: string;
  tanNo!: string;
  email!: string;
  city!: string;
  district!: string;
  pinCode!: string;
  department!: string;
  ddoRegNo!: string;
  ddoName!: string;
  address!: string;
  address2!: string;
  address3!: string;
  type!: number;
  userid!: number;
  deptType!: string;
  mappedDDOCode!: number;
}

// Division Master Interface----->
export class IDIVISONSEARCH {
  treasuryCode!: number
  agDivCode!: string
  divisionCode!: number
}
export class IDIVISONSAVE {
  treasuryCode!: number
  agDivCode!: string
  divisionCode!: number
  divisionName!: string
  oldDivisionCode!: number
  officeId!: number
}

//Token Master Interface-------->
export class IPAYREF {  // get budget list interface
  treasurycode!: string
  type!: number
  finyear!: string
  billnoid!: number
}
//get token list 
export class TOKENLIST {  // get token list interface
  treasurycode: string = "2100"
  type: number = 1
  finyear: string = "2022"

}
export class IPayManagerSAVE {  //pay manager data save interface
  treasuryCode!: string
  fromFinYear!: string
  toFinYear!: string
  userId!: any
  cdeRefNo!: any
  ipaddress!: string
  asignmentId!: number
}
export class IBudgetSAVE { //budget manager data save interface
  treasuryCode!: string
  fromFinYear!: string
  toFinYear!: string
  userId!: any
  cdeRefNo!: number
  ipaddress!: string
  ddoCode!: number
  cashAmt!: number
  grossAmt!: number
  majorHead!: number
  asignmentId!: number
}

// Bill type online Interface------>

export class IBillStatus { //bill type online check details interface
  treasurycode!: string
  billnoid!: number
  finyear!: number
  tokenNo!: number
  // oldbillcode!: number
  // tokenFinYear!: string
}

export class IBillEntrySave { //bill type online check details interface
  treasurycode!: number
  billnoid!: number
  finyear!: number
  tokenNo!: number
  oldbillcode!: number
  tokenFinYear!: number
}

export class IBudgetAmountCheck {
  treasurycode!: string
  detailHead!: number
  objectHead!: number
  bfcType!: string
  headType!: string
  pdAcNo!: number
  finyear!: number
  officeId!: number
  billtype!: number
  billsubtype!: number
  billmonth!: number
  billyear!: string
}

// bill entry offline interface----------->
export class IBillEntryfatch {
  treasuryCode!: string
  finYearFrom!: string
  ddobilldate!: any
  userId!: number
  ddobillNO!: number
  tokenNo!: number
  type!: any
  ddoCode!: any
}



// GetAccountOfficerList Interface----->
export class IGetAccountOfficerList {
  type!: number;
  tokenNo!: string;
  // userid!: number;
  treasuryCode!: string;
  auditor!: number;
  //finYr!: string;

}


// GetAccountOfficerForwardList Interface----->
export class IGetAccountOfficerForwardList {
  tokenNo!: string;
  userid!: any;

  // pageIndex:"null"
}

// GetVoucherModelData Interface----->
export class IgetVoucherModelData {
  type!: number;
  treasuryRefNo!: number;
  treasuryCode!: string;
  finYearFrom!: string;
  finYearTo!: string;
}
// GetAccountOfficerForwardList Interface----->
export class IGetAccountOfficerForwardListUpdate {
  //type!: number;
  // userid!: number;
  treasuryRefNo!: number;
  userid!: any;
  asignmentId!: number;
  //auditor!: number;
  //treasuryCode!: string;
  // pageIndex:"null"
}
 


export class IGetAccountObjectiondata {
  type!: number;
  billNo!: number;
  userId!: number;
  userType!: number;
}

// GetAccountOfficerRevertList Interface----->
export class IGetAccountOfficerRevertList {
  treasuryRefNo!: number;
  type!: number;
}
// GetObjectionlist Interface----->
export class IGetObjectionDetail {
  type!: number;
  billNo!: number;
  userId!: number;
  userType!: number;
}

// Bill Encashment Fetch Interface----->
export class IGetBillEncashmentFetchList {
  treasuryCode!: string;
  voucherdate!: string;
  tokenNo!: number;
}


// Bill Encashment Submit Interface----->
export class IGetBillEncashmentSubmitList {
  treasuryCode!: string;
  voucherdate!: string;
  userid!: any;
  billcodenew!: number;
  ipaddress!: string;
}


// Cheque Cancel Fetch Interface----->
export class IGetChequeCancelFetchList {
  tokenno!: number;
  treasurycode!: string;
  tokenfinYear: any;
  chequeType!: string;
}



// Cheque Cancel Submit Interface----->
export class IGetChequeCancelSubmitList {
  chequeno!: string;
  treasurycode!: string;
  tokenNo!: number;
  bankBranchCode!: number;
  reason!: number;
  userID!: any;
  tokenfinYear: any;
  treasuryRefno!: number;
  assignmentId!: number;
  ipAddress!: any;
}



// ChequeSubitSeries Interface----->
export class IGetchequeSubmitObject {
  type!: number;
  bankBranchCode!: number;
  treasurycode!: number;
  chequeinit!: number;
  chequefrom!: number;
  chequeto!: number;
  chequeKey!: number;
  runningChqNo!: number;
  issuedId!: number;
  userID!: any;
}
// ChequeSeries Interface----->
export class IGetChequeSeriesModal {
  type!: number;
  bankBranchCode!: number;
  treasurycode!: number;
}
// ChequeSeries Interface----->
export class IGetChequeSeriesfrom {
  type!: number;
  bankBranchCode!: number;
  treasurycode!: number;
  chequefrom!: number;
  ChequeInit!: number;
  Ckey!: number;
}

//paymangeronlinetokenentry Interface------->
export class IPayMangerToken {
  treasurycode!: string;
  finyear!: string;
  billType!: number;
  type!: number
}

 


//generatetoken no.
export class IGenerateToken {
  treasuryCode!: string;
  fromFinYear!: string;
  tokenfinYear!: string;
  userId!: any;
  cdeRefNo!: number[];
  assignmentId!: any;
 ipaddress!: string
}




//Auto Process Status
export class IGetAutoProcessStatus {
  treasuryCode!: string;
  tblName!: string;
}


//Auto Process Show Status
export class IGetAutoProcessShowStatus {
  fromDate!: string;
  toDate!: string;
  treasuryCode!: string;
}

//login
export class Ilogin {
  username!: string;
  password!: string;
  ipAddress!: string;
}

//Account Celling------>
export class IAccountCeiling{
  fromDate!:string;
  toDate!:string;
  limitAmount!:number
  billType!:Number;
} 
export class IAccountCeilingTransLimit{
  fromDate!:string;
  toDate!:string;
  // limitAmount!:number
  billType!:Number;
  setLimitAmount!:number;
	amountTotal!:number;
	recCount!:number;
	makerId!:any;
}


// MajorHeadMapping Interface----->
export class IUpdateMHeadsModal {
  treasuryCode!: string;
  userId!: any;
  majorHeads!: any;
  action!: string;
}

// Token Edit Interface------->>>>>>>>>>>>>>>>>
export class IGetAllTokenModel{
  treasuryCode!:string;
  //fromFinYear!:string;
 // toFinYear!:string;
 tokenfinYear!:string;
  mode!:null;
  modeValue!:null;
  fromDate!:string;
  toDate!:string
}


export class IfetchTokenEdit{
  treasurycode!:string;
  fromFinYr!:string;
  toFinYr!:string;
  type!:number;
  tokenNo!:number;
}

export class ITokenUpdate{
  oldtokenNo!:number;
  userId!:any;
  ddoCode!:number;
  treasuryCode!:string;
  majorHead!:string;
  billType!:number;
  cashAmt!:number;
  grossAmt!:number;
}

export class ITokenDeleteview{
  treasurycode!:string;
  fromDate!:string;
  toDate!:string;
  billFlag!:string;
  tokenNo!:number;
  finyear!:string;
}

export class ITokenDeleteUpdate{
  
  tokenNo!:number;
  treasurycode!:string;
  billFlag!:string;
  finyear!:string;
  treasRefNo!:number;
  
}


// objection List Details
export class SaveBillFromAccount {  
  treasurycode!: number
  tokenNo!: number
  type!: number
  auditor!:number
  pageIndex!:number
}

export class BillEntryList {  
  treasurycode!: string
  finyear!: string
  tokenNo!: number
  type!: number
}



//////Token-REceipt Model Interface------------------>>
export class TokenReceiptList {  
  treasuryCode!: string
  finYearFrom!: string
  tokenNo!: number
 
}

// Check-Budget Model Interface------------------>>
export interface TreasaryModel {
 
  TreasuryCode: string, 
  TreasuryName: string
  
  }
  
  export interface DdoModel {
    ddo_code: number,
     DDO_NAME:string 
    }

//Automation Bill Report
export class IGetAutomationBillShowStatus {
  fromDate!: string;
  toDate!: string;
  treasuryCode!: string;
  finYear!:string |number;
  reasonStatus!:string
}



//Dispatch Reciept Data
export class DispatchRecieptModel {
  modeValue!:number;
  mode!:string |number;
  treasurycode!: string;
  fromFinYr!:string |number;

}
//Dispatch Reciept Data
export class  dispatchDetailsubmitList {
  treasurycode!: string;
  fromFinYr!:string |number;
  userId!:any;
  tokennolist!:any[];
  dispatchName!:string;
  treasRefNo!:number;

}


//Dispatch Reciept Data
export class ecsDispatchModel {
  treasurycode!: string;
  tokenNo!:number;

}


// PFMS
export class IPFMS {
  userid!: any;
  asignmentId!: number;
  cde_refNo!: number;
  ipAddress!: any;
  schemecode!: any;
}


//Ac Bill Report
export class IGetACBillStatus {
  fromDate!: string;
  toDate!: string;
  treasuryCode!:string;
 }