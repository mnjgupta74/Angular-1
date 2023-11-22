
import { DatePipe } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxModule } from './inbox/inbox.module';
import { SharedModule } from '../shared/shared.module';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AutoProcessStatusComponent } from '../Reports/auto-process-status/auto-process-status.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { OnlineBillListComponent } from './online-bill-list/online-bill-list.component';
import { BillEntryComponent } from './bill-entry/bill-entry.component';
import { TreasuryLoginComponent } from '../treasury-login/treasury-login.component';
import { AccountOfficerListComponent } from './account-officer-list/account-officer-list.component';
import { TreasuryOfficerListComponent } from './treasury-officer-list/treasury-officer-list.component'
import { ObjectiondialogComponent } from './objection-dialog/objection-dialog.component';
import { TOKENMASTERComponent } from './tokenmaster/tokenmaster.component';
import { AccountCeilingComponent } from './account-ceiling/account-ceiling.component';
import { MheadmappingComponent } from './mheadmapping/mheadmapping.component';
import { BillCancelComponent } from './bill-cancel/bill-cancel.component';
import { CheckmasterComponent } from './checkmaster/checkmaster.component';
import { BillEncashmentComponent } from './bill-encashment/bill-encashment.component';
import { ChequeIssueListComponent } from './cheque-issue-list/cheque-issue-list.component';
import { ChequeCancelComponent } from './cheque-cancel/cheque-cancel.component';
import { TokenUpdateComponent } from './token-update/token-update.component';
import { BillObjectionListComponent} from './bill-objection-list/bill-objection-list.component'
import { OnlineTokenEntryComponent } from './Online-Token-Entry/online-token-entry.component';
import { BillEntryOfflineComponent } from './bill-entry-offline/bill-entry-offline.component';
import { PDMasterReportComponent } from '../Reports/pdmaster-report/pdmaster-report.component'
import { TransactionReportComponent } from '../Reports/transaction-report/transaction-report.component';
import { TransferDeleteChequeSeriesComponent } from './transfer-delete-cheque-series/transfer-delete-cheque-series.component';
import { ChequePrintComponent } from './cheque-print/cheque-print.component';
import { CheckBudgetComponent } from './check-budget/check-budget.component';
import { PdAccountCertificationComponent } from './pd-account-certification/pd-account-certification.component';
import { VoucherDetailComponent } from '../Reports/voucher-detail/voucher-detail.component';
import { AutomationBillReportComponent } from '../Reports/automation-bill-report/automation-bill-report.component';
import { ChequeCancelApprovalComponent } from './cheque-cancel-approval/cheque-cancel-approval.component';
import { PdAccountClosingStatusComponent } from './pd-account-closing-status/pd-account-closing-status.component';
import { BillStatusComponent } from './bill-status/bill-status.component'; 
import { TokenDispatchComponent } from './token-dispatch/token-dispatch.component';
import { PdBalanceReportComponent } from '../Reports/pd-balance-report/pd-balance-report.component';
import { PdpassbookformatReportComponent } from '../Reports/pdpassbookformat-report/pdpassbookformat-report.component';
import { GrnMinusEntryComponent } from './grn-minus-entry/grn-minus-entry.component';
import { PdCalculationComponent } from './pd-calculation/pd-calculation.component';
import { SettingComponent } from '../e-ceiling/setting/setting.component';
import { TableComponent } from './table/table.component';
import { P2FComponent } from './p2-f/p2-f.component';
import { EmployeeSignatureComponent } from './employee-signature/employee-signature.component';
import { SignVerificationComponent } from './sign-verification/sign-verification.component';
import { TokenTrailComponent } from './token-trail/token-trail.component';
import { BankMasterComponent } from './bank-master/bank-master.component';
import { VoucherDateUpdationComponent } from './voucher-date-updation/voucher-date-updation.component';
import { ErrorLogReportComponent } from '../Reports/error-log-report/error-log-report.component';
import { TeVoucherEntryComponent } from './te-voucher-entry/te-voucher-entry.component';
import { AgDivisionUpdateComponent} from './ag-division-update/ag-division-update.component';
import { PfmsApilogComponent } from '../Reports/pfms-apilog/pfms-apilog.component';
import { PfmsBillToPaymangerComponent } from '../Reports/pfms-bill-to-paymanger/pfms-bill-to-paymanger.component';
import { PFMSComponent } from './pfms/pfms.component';
import { PfmsTrackReportComponent } from '../Reports/pfms-track-report/pfms-track-report.component';
import { DayCloseComponent } from './day-close/day-close.component';
import { ApprovebillsComponent } from '../e-ceiling/approvebills/approvebills.component';
import { ApprovebillsProcessComponent } from '../e-ceiling/approvebills-process/approvebills-process.component';
import { ApprovebillsAutherComponent } from '../e-ceiling/approvebills-auther/approvebills-auther.component';
import { ECeilingReportComponent } from '../e-ceiling/e-ceiling-report/e-ceiling-report.component';
import { PaymentscrollComponent } from './paymentscroll/paymentscroll.component';
import { ReceiptscrollComponent } from './receiptscroll/receiptscroll.component';
import { ObjectedTokenEntryComponent } from './objected-token-entry/objected-token-entry.component';
import { DrapAndDropDirective } from '../directives/drap-and-drop.directive';
import { PfmsCnComponent } from '../Reports/pfms-cn/pfms-cn.component';
import { PfmsDnFileReportComponent } from '../Reports/pfms-dn-file-report/pfms-dn-file-report.component';
import { RBIPaymentFilesComponent } from '../Reports/rbipayment-files/rbipayment-files.component';
import { ChallanEntryComponent } from '../Receipt/challan-entry/challan-entry.component';
import { PdAcCreationComponent } from './pd-ac-creation/pd-ac-creation.component';
import { PdReportsComponent } from '../Reports/pd-reports/pd-reports.component';
import { VoucherEntryComponent } from './voucher-entry/voucher-entry.component';
import { PDAcStatusReportComponent } from '../Reports/pdac-status-report/pdac-status-report.component';
import { TransctionDetailByTokenNoComponent } from '../Reports/transction-detail-by-token-no/transction-detail-by-token-no.component';
import { PfmsReportComponent } from '../Reports/pfms-report/pfms-report.component';
import { InactivePdAccountComponent } from '../Reports/inactive-pd-account/inactive-pd-account.component';
import { IncomeTaxReportComponent } from '../Reports/income-tax-report/income-tax-report.component';
import { AcBillComponent } from '../Reports/ac-bill/ac-bill.component';
import { WithoutDivisionCodeChallanReportComponent } from '../Reports/without-division-code-challan-report/without-division-code-challan-report.component';
import { CashZeroReportComponent } from '../Reports/cash-zero-report/cash-zero-report.component';
import { MisReportsComponent } from '../Reports/mis-reports/mis-reports.component';
import { DigitalSignComponent } from './digital-sign/digital-sign.component';
import { TreasuryLopReportComponent } from '../Reports/treasury-lop-report/treasury-lop-report.component';
import { TreasuryReportComponent } from '../Reports/treasury-report/treasury-report.component';
import { PaymentsReportsComponent } from '../Reports/payments-reports/payments-reports.component';
import { MasterReportsComponent } from '../Reports/master-reports/master-reports.component';
import { PfmsPaymentlogComponent } from '../Reports/pfms-paymentlog/pfms-paymentlog.component';
import { PaymentReconcilationlogComponent } from '../Reports/payment-reconcilationlog/payment-reconcilationlog.component';
import { NewTokenReportComponent } from '../Reports/new-token-report/new-token-report.component';

const routes: Routes = [
  {
      path:'',  // Default Path   "TreasuryLogin"
      component:TreasuryLoginComponent
    },

  {
    path:'Dashboard',
    component:DashboardComponent
  },

 {
    path:'AutoBill',
    component:AutoProcessStatusComponent
  },
  
  {
    path:'View-Document',
    component:ViewDocumentComponent
  },

  {
    path:'OnLineBillList',
    component:OnlineBillListComponent
  },

  {
    path:'BillEntry',
    component:BillEntryComponent
  },
  {
    path:'BillEntryOffline',
    component:BillEntryOfflineComponent
  },

  {
    path:'Logins',
    component:LoginComponent
  },
  
  {
    path:'AccAuthorization',
    component:AccountOfficerListComponent
  },

  {
    path:'TOAuthorization',
    component:TreasuryOfficerListComponent
  },

  {
    path:'Objectiondialog',
    component:ObjectiondialogComponent

  },
  
  {
    path:'TokenEntry',
    component:TOKENMASTERComponent
  },

  {
    path:'AccountCeiling',
    component:AccountCeilingComponent
  },

  {
    path:'MHeadUserMapping',
    component:MheadmappingComponent
  },

  {
    path:'BillCancel',
    component:BillCancelComponent
  },
 
  {
    path:'CheckMaster',
    component:CheckmasterComponent
  },

  {
    path:'BillEncashment',
    component:BillEncashmentComponent
  },

  {
    path:'ChequeIssue',
    component:ChequeIssueListComponent
  },
  {
    path:'ChequeCancel',
    component:ChequeCancelComponent
  },
  {
    path:'TokenUpdate',
    component:TokenUpdateComponent
  },
  {
    path:'BillObjection',
    component:BillObjectionListComponent
  },

  {
    path:'OnlineTokenEntry',
    component:OnlineTokenEntryComponent
  },
  {
    path:'PDMasterReport',
    component:PDMasterReportComponent
  },

  {
    path:'TrackOfTransactionReport',
    component:TransactionReportComponent
  },
  {
    path:'TransferDeleteCheque',
    component:TransferDeleteChequeSeriesComponent
  },
  
  {
    path:'ChequePrint',
    component:ChequePrintComponent
  },
  {
    path:'CheckBudget',
    component:CheckBudgetComponent
  },
  
  {
    path:'FrmPdAccountCertification',
    component:PdAccountCertificationComponent
  },
  {
    path:'BankMaster',
    component:BankMasterComponent
  },
  {
    path:'VoucherDetailReport',
    component:VoucherDetailComponent
  },

  {
    path:'AutomationBillReport',
    component:AutomationBillReportComponent
  },
  {
    path:'ChequeCancelApproval',
    component:ChequeCancelApprovalComponent
  },

  {
    path:'PdAccountClosingStatus',
    component:PdAccountClosingStatusComponent
  },
  {
    path:'BillAuthorization',
    component:BillStatusComponent
  }
  ,
  {
    path:'TokenDispatch',
    component:TokenDispatchComponent
  },
  {
    path:'PdBalanceReport',
    component:PdBalanceReportComponent
  },
  {
    path:'PdPassbookformat',
    component:PdpassbookformatReportComponent
  },
  {
    path:'GrnMinusEntry',
    component:GrnMinusEntryComponent
  },
  {
    path:'PdCalculation',
    component:PdCalculationComponent
  },
  {
    path:'eCeiling',
    component:SettingComponent
  },

  {
    path:'P2F',
    component:P2FComponent
  },

  {
    path:'EmployeeSignature',
    component:EmployeeSignatureComponent
  },

  {
    path:'SignVerification',
    component:SignVerificationComponent
  },
  
  
  {
    path:'TokenTrail',
    component:TokenTrailComponent
  },

  {
    path:'VoucherDateUpdation',
    component:VoucherDateUpdationComponent
  },

  {
    path:'ErrorLogReport',
    component:ErrorLogReportComponent
  },

  {
    path:'TE',
    component:TeVoucherEntryComponent
  },
  {
    path:'AGDivision',
    component:AgDivisionUpdateComponent
  },
  {
    path:'PFMSAPILog',
    component:PfmsApilogComponent
  },
  {
    path:'PFMSBillToPaymanger',
    component:PfmsBillToPaymangerComponent
  },
  {
    path:'PFMS',
    component:PFMSComponent
  },
  {
    path:'PFMSTrackReport',
    component:PfmsTrackReportComponent
  },

  {
    path:'DayClose',
    component:DayCloseComponent
  },

  {
    path:'approveBills',
    component:ApprovebillsComponent
  },
  {
    path:'ApprovebyAuth',
    component:ApprovebillsAutherComponent
  },
  {
    path:'ApprovebyProcess',
    component:ApprovebillsProcessComponent
  },
  {
    path:'e-CeilingReport',
    component:ECeilingReportComponent
  },

  {
    path:'PaymentScroll',
    component:PaymentscrollComponent
  },
  {
    path:'ReceiptScroll',
    component:ReceiptscrollComponent
  },
  {
    path:'ObjectedTokenEntry',
    component:ObjectedTokenEntryComponent
  },

  {
    path:'PFMSCNFile',
    component:PfmsCnComponent
  },
  {
      path:'PFMSDNFile',
      component:PfmsDnFileReportComponent
    },
  {
    path:'RBIPaymentFiles',
    component:RBIPaymentFilesComponent
  },
  {
    path:'Challan_Entry',
    component:ChallanEntryComponent
  },

  {
    path:'pdAcCreation',
    component:PdAcCreationComponent
  },
  {
    path:'pdReport',
    component:PdReportsComponent
  },
  {
    path:'VoucherEntry',
    component:VoucherEntryComponent
  },
  {
    path:'PDAcStatusDataReport',
    component:PDAcStatusReportComponent
  },
  {
    path:'TransctionDetailByTokenNo',
    component:TransctionDetailByTokenNoComponent
  },
  {
    path:'PfmsReport',
    component:PfmsReportComponent
  },
  {
    path:'InactivePdAccountReport',
    component:InactivePdAccountComponent
  },
  {
    path:'OtherReports',
    component:MisReportsComponent
  },
  {
    path: 'DigitalSign',
    component: DigitalSignComponent
  },
  {
    path: 'LopReport',
    component: TreasuryLopReportComponent
  },
  
  {
    path: 'LorReport',
    component: TreasuryReportComponent
  },
  {
    path: 'PaymentsReport',
    component: PaymentsReportsComponent
  },
  
  {
    path: 'MasterReport',
    component: MasterReportsComponent
  },

  {
    path: 'PfmsPaymentlogComponent',
    component: PfmsPaymentlogComponent
  },
  
  {
    path: 'PaymentReconcilationlogComponent',
    component: PaymentReconcilationlogComponent
  },
  {
    path:'NewTokenReport',
    component:NewTokenReportComponent
  },
  
]

@NgModule({
  declarations: [
    DashboardComponent,
    AutoProcessStatusComponent,
    ViewDocumentComponent,
    OnlineBillListComponent,
    BillEntryComponent,
    BillEntryOfflineComponent,
    LoginComponent,
    CommonDialogComponent,
    AccountOfficerListComponent,
    TreasuryOfficerListComponent,
    ObjectiondialogComponent,
    TOKENMASTERComponent,
    AccountCeilingComponent,
    MheadmappingComponent,
    BillCancelComponent,
    CheckmasterComponent,
    BillEncashmentComponent,
    ChequeIssueListComponent,
    ChequeCancelComponent,
    TokenUpdateComponent,
    ChallanEntryComponent,
    BillObjectionListComponent,
    OnlineTokenEntryComponent,
    PDMasterReportComponent,
    TransactionReportComponent,
    TransferDeleteChequeSeriesComponent,
    ChequePrintComponent,
    CheckBudgetComponent,
    PdAccountCertificationComponent,
    VoucherDetailComponent,
    AutomationBillReportComponent,
    ChequeCancelApprovalComponent,
    PdAccountClosingStatusComponent,
    BillStatusComponent,
    TokenDispatchComponent,
    PdBalanceReportComponent,
    PdpassbookformatReportComponent,
    GrnMinusEntryComponent,
    PdCalculationComponent,
    SettingComponent,
    TableComponent,
    P2FComponent,
    EmployeeSignatureComponent,
    SignVerificationComponent,
    TokenTrailComponent,
    BankMasterComponent,
    VoucherDateUpdationComponent,
    ErrorLogReportComponent,
    TeVoucherEntryComponent,
    AgDivisionUpdateComponent,
    PfmsApilogComponent,
   PfmsBillToPaymangerComponent,
   PFMSComponent ,
   PfmsTrackReportComponent,
   DayCloseComponent,
   ApprovebillsComponent,
   ApprovebillsAutherComponent,
   ApprovebillsProcessComponent,
   ECeilingReportComponent,
   PaymentscrollComponent,
   ReceiptscrollComponent,
   ObjectedTokenEntryComponent,
   DrapAndDropDirective,
   PfmsCnComponent,
   PfmsDnFileReportComponent,
   RBIPaymentFilesComponent,
   PdAcCreationComponent,
   PdReportsComponent,
   VoucherEntryComponent,
   PDAcStatusReportComponent,
   TransctionDetailByTokenNoComponent,
   PfmsReportComponent,
   InactivePdAccountComponent,
   MisReportsComponent,
   IncomeTaxReportComponent,
   AcBillComponent,
   WithoutDivisionCodeChallanReportComponent,
   CashZeroReportComponent,
   DigitalSignComponent,
   TreasuryLopReportComponent,
   TreasuryReportComponent,
   PaymentsReportsComponent, 
   MasterReportsComponent,
   PfmsPaymentlogComponent,
   PaymentReconcilationlogComponent,
   NewTokenReportComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    InboxModule,
    SharedModule,
  ],
  providers: [DatePipe],
})
export class CommonappModule { }
