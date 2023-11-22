import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {


    // >>>---|| LoginVerify API's ||----------------------> 
    public LoginVerify: string = environment.BaseUrl + 'SSO/check/login/rajkosh'  // (Post) API, Used Components:- 'TreasuryLogin/Dashboard' 
    public SsoLogin: string = environment.BaseUrl + 'SSO/insert/mapping'          // (Post) API, Used Component:- 'Login' 
    public getdepartment: string = environment.BaseUrl + 'mst/getdepartment/'     // (Get)  API, Used  Component:- 'Header' 


    // >>>---|| Auto Bill Process API's ||---------------------->
    public autoProcessStatus: string = environment.BaseUrl + 'mst/treasury/list/'    // (Post) API, Used Component:- 'AutoProcessStatus/PDMasterReport' 
    public autoProcessView: string = environment.BaseUrl + 'mst/getautotransaction' //  (Post) API, Used Component:- 'AutoProcessStatus' 


    // >>>---|| Get Files For View Document API's ||---------------------->
    public getfiles: string = environment.ifms_BaseUrl + 'wcc/getfiles'            // (Post) API, Used Component:- 'ViewDocument' 
    public Base64Img: string = environment.BaseUrl + 'mst/get/base64/'            // (Get) API, Used Component:- 'ViewDocument/BillEntry' 

    // >>>---|| Account Ceiling API's ||---------------------->
    public AmountCappingPost: string = environment.BaseUrl + 'token/get/cappingList'        // (Post) API, Used Component:- 'AccountCeiling' 
    public AmountCappingPostSubmit: string = environment.BaseUrl + 'token/set/cappingList'  // (Post) API, Used Component:- 'AccountCeiling' 


    // >>>---|| Major Head Mapping API's ||---------------------->
    public GetMajorHeadMappingList: string = environment.BaseUrl + 'mst/getMapping/MajorHeadList/'  // (Get) API, Used Component:- 'MHeadMapping' 
    // public InsertMappingList: string = environment.BaseUrl + 'payid/save/auditor/mapping'           // (Post) API,Used Component:- 'MHeadMapping' 
    // public updateMajorHeadMapping: string = environment.BaseUrl + 'payid/update/auditor/mapping'    // (Post) API,Used Component:- 'MHeadMapping' 
    public GetMappingUserList: string = environment.BaseUrl + 'mst/mapping/userList/'               // (Get) API, Used Component:- 'MHeadMapping' 
    public MHMappingList: string = environment.BaseUrl + 'mst/getMapping/details/'                  // (Get) API, Used Component:- 'MHeadMapping' 


    public majorHeadMapping: string = environment.BaseUrl + 'payid/save/majorHead/auditor/mapping'  // (Get) API, Used Component:- 'MHeadMapping'
    public budgetHeadMapping: string = environment.BaseUrl + 'payid/save/budgetHead/auditor/mapping'           // (Post) API,Used Component:- 'MHeadMapping'
    public ddoCodeMapping: string = environment.BaseUrl + 'payid/save/ddoCode/auditor/mapping'           // (Post) API,Used Component:- 'MHeadMapping'
    public fetchMajorHeadMapping: string = environment.BaseUrl + 'payid/majorHead/mapping/'  // (Get) API, Used Component:- 'MHeadMapping'
    public fetchBudgetHeadMapping: string = environment.BaseUrl + 'payid/budgetHead/mapping/'           // (Post) API,Used Component:- 'MHeadMapping'
    public fetchDdoCodeMapping: string = environment.BaseUrl + 'payid/ddoCode/mapping/'           // (Post) API,Used Component:- 'MHeadMapping'
    public updateMajorMapping: string = environment.BaseUrl + 'payid/update/majorHead/auditor/mapping'  // (Get) API, Used Component:- 'MHeadMapping'
    public updateBudgetHeadMapping: string = environment.BaseUrl + 'payid/update/budgetHead/auditor/mapping'           // (Post) API,Used Component:- 'MHeadMapping'
    public updateDdoCodeMapping: string = environment.BaseUrl + 'payid/update/ddoCode/auditor/mapping'           // (Post) API,Used Component:- 'MHeadMapping'


    // >>>---|| Token Entry API's ||---------------------->
    public PayManagerRef: string = environment.BaseUrl + 'token/view/'                      // (Get) API, Used Component:-'TokenMaster' 
    public MajorHeadList: string = environment.BaseUrl + 'token/majorHead/'                 // (Get) API, Used Component:-'TokenMaster/TokenUpdate/PDMasterReport' 
    public BillTypeList: string = environment.BaseUrl + 'token/BillTypeList/'               // (Get) API, Used Components:-'AccountCeiling/TokenMaster/OnlineTokenEntry/TokenUpdate/BillEntry/BillEntryOffline' 
    public SavePayManager: string = environment.BaseUrl + 'token/pay/save'                  // (Post) API, Used Component:-'TokenMaster' 
    public Verify_DDO_Code: string = environment.BaseUrl + 'token/check/ddo_info/ddo_code/' // (Get) API, Used Component:- 'TokenMaster' 
    public GetDDOName: string = environment.BaseUrl + 'token/ddo/'                          // (Get) API, Used Component:- 'TokenMaster' 
    public SaveTokenOffline: string = environment.BaseUrl + 'token/offline/save'            // (Post) API, Used Component:- 'TokenMaster' 


    // >>>---|| Bulk Token Entry API's  ||---------------------->
    public PayManagerTokenlist: string = environment.BaseUrl + 'token/paymanager/tokenList'   // (Post) API, Used Component:-'OnlineTokenEntry' 
    public TokenGenerate: string = environment.BaseUrl + 'token/auto/paymanager'              // (Post) API, Used Component:-'OnlineTokenEntry' 
    public TokenReceipt: string = environment.BaseUrl + 'token/Nodetail'                      // (Post) API, Used Component:-'CommanDialog' 


    // >>>---|| Token Edit and Delete API's ||---------------------->
    public AllTokenList: string = environment.BaseUrl + 'token/get/all/tokenlist'       // (Post) API, Used Component:- 'TokenUpdate' 
    public FetchTokenEditList: string = environment.BaseUrl + 'token/fetch/tokenedit'   // (Post) API, Used Component:- 'TokenUpdate' 
    public UpdateToken: string = environment.BaseUrl + 'token/update'                   // (Post) API, Used Component:- 'TokenUpdate' 
    public DeleteViewToken: string = environment.BaseUrl + 'token/fetch/deleteview'     // (Post) API, Used Component:- 'TokenUpdate' 
    public DeleteTokenUpdate: string = environment.BaseUrl + 'token/delete/update'      // (Post) API, Used Component:- 'TokenUpdate' 


    // >>>---|| Online Bill List API's ||---------------------->
    public OnlineBillList: string = environment.BaseUrl + 'get/bill/list/'      // (Get) API, Used Component:- 'OnLineBillList' 


    // >>>---|| Bill Entry (Online) API's ||---------------------->
    public BankList: string = environment.BaseUrl + 'get/bill/bank/'                           // (Get) API, Used Component:- 'BillEntry/ChequeIssueList/ChequePrint' 
    public GetSalary: string = environment.BaseUrl + 'get/bill/getSalary'                       // (Post) API, Used Component:- 'BillEntry' 
    public BillSubType: string = environment.BaseUrl + 'get/bill/subtype/'                      // (Get) API, Used Component:- 'BillEntry' 
    public CheckBudgetAmt: string = environment.BaseUrl + 'get/bill/budget/amount'              // (Post) API, Used Component:- 'BillEntry' 
    public BillEntySave: string = environment.BaseUrl + 'get/bill/save'                         // (Post) API, Used Component:- 'BillEntry' 
    public BillVoucherDetail: string = environment.BaseUrl + 'billprocess/voucherModel'         // Post API, Used Component:- 'BillEntry' 
    public Savewithobjection: string = environment.BaseUrl + 'billprocess/bill/underObjection'  // (Post) API, Used Component:- 'BillEntry/BillEntryObjection/ObjectionDialog' 
    public BillExist_Verify: string = environment.BaseUrl + 'get/bill/check'                    // (Post) API, Used Component:- 'BillEntry' 
    public OfficeId_Verify: string = environment.BaseUrl + 'get/bill/check/office/'             // (Get) API, Used Component:- 'BillEntry' 
    public CheckBillDuplicy: string = environment.BaseUrl + 'billprocess/checkBillNo'           // (Post) API, Used Component:- 'BillEntry' 
    public BudgetHeadvalidation: string = environment.BaseUrl + 'get/bill/check/head/'          // (Get) API, Used Component:- 'BillEntry' 
    public amountcheckvalidation: string = environment.BaseUrl + 'get/bill/check/amount/'       // (Get) API, Used Component:- 'BillEntry' 
    public Checkbillsave_Verify: string = environment.BaseUrl + 'get/bill/checkBillSave'        // (Post) API, Used Component:- 'BillEntry' 
    public getpdaccount_status: string = environment.BaseUrl + 'get/bill/checkPdAc/'            // (Get) API, Used Component:- 'BillEntry' 


    // >>>---|| Bill Entry (Offline) API's ||---------------------->
    public getobjectheadlist: string = environment.BaseUrl + 'mst/trgGetObjectheadCode/'        // (Get) API, Used Component:- 'BillEntryOffline' 
    public getDdoNamelist: string = environment.BaseUrl + 'mst/payTrgGetDDOCode/'               // (Get) API, Used Component:-  'BillEntryOffline' 
    public getofflinetoken: string = environment.BaseUrl + 'get/bill/token/details'               // get bill token for offline bill entry
    public getMajorheadlist: string = environment.BaseUrl + 'mst/getAllMajorHeadList/'          // BT Major head code list api call for offline bill entry
    public getDivisionlist: string = environment.BaseUrl + 'mst/trgGetDivisionsListBILL/'       // BT Division code list api call for offline bill entry
    public getDetailHeadlist: string = 'http://172.22.32.105:9090/rajkosh/3.0/' + 'billprocess/getgroupSubHead/WithBillType/'  // BT Details head code list api call for offline bill entry
    public getPDAccountlist: string = environment.BaseUrl + 'payid/getpayid/list/'                //  BT Pd Account list api call for offline bill entry
    public getObjectheadAllList: string = environment.BaseUrl + 'mst/trgGetObjectheadCode'        // Pd Account list api call for offline bill entry
    public VerifyNewBT: string = environment.BaseUrl + 'token/validate/bt'                        // Pd Account list api call for offline bill entry


    // >>>---|| Account Authorization API's ||---------------------->
    public AuditorList: string = environment.BaseUrl + 'mst/auditor/list/'                          // (Get) API, Used Component:- 'AccountOfficerList/TreasuryOfficerList' 
    public AccountOfficerForward: string = environment.BaseUrl + 'billprocess/accountantforward'             // (Post) API, Used Component:- 'AccountOfficerList' 
    public AccountOfficerForwardUpdate: string = environment.BaseUrl + 'billprocess/accountantforwardupdate' // (Post) API, Used Component:- 'AccountOfficerList' 
    public AccountOfficerRevert: string = environment.BaseUrl + 'billprocess/trgRevert'                      // (Post) API, Used Component:- 'AccountOfficerList'  
    public VoucherModelData: string = environment.BaseUrl + 'billprocess/voucherModel'              // (Post) API, Used Component:- 'AccountOfficerList/TreasuryOfficerList'


    // >>>---|| Treasury Officer Authorization API's ||---------------------->
    public TreasuryOfficerList: string = environment.BaseUrl + 'billprocess/toForward'              // (Post) API, Used Component:- 'TreasuryOfficerList'  
    public TreasuryOfficerForward: string = environment.BaseUrl + 'billprocess/toForward/update'    // (Post) API, Used Component:- 'TreasuryOfficerList'  
    public TreasuryOfficerRevert: string = environment.BaseUrl + 'billprocess/trgRevert'            // (Post) API, Used Component:- 'TreasuryOfficerList'
    public TreasuryOfficerListRemark: string = environment.BaseUrl + 'billprocess/insertToAction'   // (Post) API, Used Component:- 'CommanDialog'


    // >>>---|| Objection Detail API's ||---------------------->
    public ObjectionDetail: string = environment.BaseUrl + 'mst/objection/details/'         // (Get) API, Used Component:- 'ObjectionDialog/BillEntry' 
    public BillObjectionData: string = environment.BaseUrl + 'mst/objection/code'          // (Post) API, Used Component:- 'BillEntry/BillEntryObjection/ObjectionDialog'


    // Bill Encashment API's ||---------------------->   
    public BillEncashmentFetch: string = environment.BaseUrl + 'get/bill/voucher/get'     // (Post) API, Used Component:- 'BillEncashment'  
    public BillEncashmentSubmit: string = environment.BaseUrl + 'get/bill/voucher/save'  // (Post) API, Used Component:- 'BillEncashment'  
    public BillEncashmentViewBil: string = environment.BaseUrl + 'bill/view/get/'       // (Get) API, Used Component:- 'BillEncashment'  


    // >>>---|| Bill Cancel API's ||---------------------->
    public BillCancelFetch: string = environment.BaseUrl + 'billprocess/billCancelFetch'      // (Post) API, Used Component:- 'BillCancel'  
    public BillCancelSubmit: string = environment.BaseUrl + 'billprocess/billCancelSubmit'    // (Post) API, Used Component:- 'BillCancel'  


    // >>>---|| Cheque Cancel API's ||---------------------->
    public ChequeCancelFetch: string = environment.BaseUrl + 'bill/view/chequeCancelFetch'              // (Post) API, Used Component:- 'ChequeCancel'  
    public ChequeCancelReasonList: string = environment.BaseUrl + 'bill/view/chequeCancelReasonFetch'   // (Get) API, Used Component:- 'ChequeCancel'  
    public ChequeCancelSubmit: string = environment.BaseUrl + 'bill/view/ChequeCancelSubmit'             // (Post) API, Used Component:- 'ChequeCancel'  



    // >>>---|| Cheque Cancel Approval API's ||---------------------->
    public ChequeCancelApprovalFetch: string = environment.BaseUrl + 'cheque/cancel/approval/'         // (Get) API, Used Component:- 'ChequeCancelApproval'  
    public ChequeCancelApprovalSubmit: string = environment.BaseUrl + 'cheque/cancel/approval/save'    // (Post) API, Used Component:- 'ChequeCancelApproval'  


    // >>>---|| Cheque Master API's ||---------------------->
    public FetchChequeDetails: string = environment.BaseUrl + 'bill/view/trgChequeMaster'    // (Post) API, Used Component:- 'ChequeMaster'  
    public BankBillList: string = environment.BaseUrl + 'get/bill/bank'                    // (Get) API, Used Component:- 'ChequeMaster'


    // >>>---|| Cheque Issue API's ||---------------------->
    public BankUserList: string = environment.BaseUrl + 'mst/treasury/list/'            // (Get) API, Used Component:- 'ChequeIssueList/ChequePrint'
    public ChequeSeries: string = environment.BaseUrl + 'bill/view/getchequeModule'     // (Post) API, Used Component:- 'ChequeIssueList'  
    public ChequeSubmit: string = environment.BaseUrl + 'bill/view/chequeModuleInsert'  // (Post) API, Used Component:- 'ChequeIssueList'  


    // >>>---|| Cheque Print API's ||---------------------->
    public checkPrintList: string = environment.BaseUrl + 'cheque/data'                      // (Post) API, Used Component:- 'ChequePrint'  
    public checkPrintGetChequeNo: string = environment.BaseUrl + 'cheque/number/get'         // (Post) API, Used Component:- 'ChequePrint'  
    public ChequePrintPreviewDetail: string = environment.BaseUrl + 'bill/view/chequeModule' // (Post) API, Used Component:- 'ChequePrint' 
    public ChequePrintAction: string = environment.BaseUrl + 'cheque/update'                 // (Post) API, Used Component:- 'ChequePrint'  



    // >>>---||  Cheque Issue Updation API's ||---------------------->
    public PMEditChequeIssuedUser: string = environment.BaseUrl + 'cheque/PMEditChequeIssuedUser'     // (Post) API, TransferDeleteChequeSeriesComponent Component:- 'PMEditChequeIssuedUser'
    public PMUpdateChequeIssuedUse: string = environment.BaseUrl + 'cheque/PMUpdateChequeIssuedUser'  // (Post) API, TransferDeleteChequeSeriesComponent Component:- 'PMUpdateChequeIssuedUse'
    public getChequeDeleteView: string = environment.BaseUrl + 'cheque/delete/detailView'             // (Post) API, TransferDeleteChequeSeriesComponent Component:- 'fetch Cheque Delete View'
    public deactivateChequeSeries: string = environment.BaseUrl + 'cheque/deactivate/ChequeSeries'    // (Post) API, TransferDeleteChequeSeriesComponent Component:- 'Deactivate Cheque Series'



    // >>>---|| Get Bill ObjectionList API's ||---------------------->
    public getBillObjectionList: string = environment.BaseUrl + 'billprocess/getBillObjectionList'  // (Post) API, Used Component:- 'BillObjectionList'  


    // >>>---|| Get PD Master Report API's ||---------------------->
    public getPDMasterList: string = environment.BaseUrl + 'mst/pd/account/masterReport'       // (Post) API, Used Component:- 'PDMasterReport'  


    // >>>---|| Track Of Transaction  Report API's ||---------------------->
    public TrackOfTransaction: string = environment.BaseUrl + 'mst/track/transaction'      // (Post) API, Used Component:- 'TrackOfTransaction' 



    // >>>---|| Check Budget API's ||---------------------->
    public trgGetObjectHeadCodelist: string = environment.BaseUrl + 'mst/trgGetObjectHeadCodelist' // (Get) API,Used Component:-CheckBudget'  
    public treasuryList: string = environment.BaseUrl + 'mst/all/treasuryList'                    // (Get) API, Used Component:-CheckBudget'  
    public payTrgGetDDOCode: string = environment.BaseUrl + 'mst/payTrgGetDDOCode'                // (Get) API, Used Component:-CheckBudget'  
    public officeNameList: string = environment.BaseUrl + 'mst/office/nameList'                   // (Get) API, Used Component:-CheckBudget'  
    public checkBudgetAmount: string = environment.BaseUrl + 'get/bill/check/budget/amount'       // (Post) API,Used Component:-CheckBudget'  



    // >>>---|| Pd Account Certifications API's ||---------------------->
    public fetchGroupSubHead: string = environment.BaseUrl + 'mst/group/subHead/'              // (Get) API, Used Component:- 'PdAccountCertification'
    public fetchpdaccount: string = environment.BaseUrl + 'pdaccount/get/'                    // (Get) API, Used Component:- 'PdAccountCertification'
    public pdaCertification: string = environment.BaseUrl + 'pdaccount/check/certification'  // (Post) API, Used Component:- 'PdAccountCertification'
    public pdaCertifyUpdate: string = environment.BaseUrl + 'pdaccount/certify/pdDate'      // (Post) API, Used Component:- 'PdAccountCertification'


    // >>>---|| Voucher Detail  Report API's ||---------------------->
    public voucherDetail: string = environment.BaseUrl + 'mst/voucher/detail'          // (Post) API,Used Component:-VoucherDetailReport'  


    // >>>---|| Auto TXN Log Report API's ||---------------------->
    public autoBillReport: string = environment.BaseUrl + 'mst/trg/log'            // (Post) API, Used Component:-AutomationBillReport'  


    // >>>---|| Pd Account Closing Status API's ||---------------------->
    public budgetHeadList: string = environment.BaseUrl + 'pdaccount/budgetHeadList'    // (Get) API, Used Component:- 'PdAccountClosingStatus'
    public openingBal: string = environment.BaseUrl + 'pdaccount/current/opening/bal'   // (Post) API, Used Component:- 'PdAccountClosingStatus'
    public pdaccountDelete: string = environment.BaseUrl + 'pdaccount/delete'           // (Post) API, Used Component:- 'PdAccountClosingStatus'


    // >>>---|| Bill Authorization API's ||---------------------->
    public BillAuthorizationDetails: string = environment.BaseUrl + 'bill/view/billAuthorization/PaymentFetch'       // (Post) API, Used Component:-'BillStatus'
    public BillAuthorizationUpdate: string = environment.BaseUrl + 'bill/view/billAuthorization/PaymentUpdate'      // (Post) API, Used Component:-'BillStatus'

    //   bill/view/billAuthorization/PaymentFetch
 

    // >>>---||Token Dispatch API's ||---------------------->
    public dispatchToken: string = environment.BaseUrl + 'billprocess/ecs/dispatchToken'  // (Get) API, Used Component:-Token-dispatch'  
    public dispatchEntry: string = environment.BaseUrl + 'token/dispatchEntry'            // (Post) API, Used Component:-Token-dispatch'  
    public dispatchDetail: string = environment.BaseUrl + 'token/dispatchDetail'        // (Post) API, Used Component:-Token-dispatch'  
    public ecsdispatch: string = environment.BaseUrl + 'token/update/ecsdispatch'       // (Post) API, Used Component:-Token-dispatch'  


    // >>>---|| PD Balance Report API's ||---------------------->
    public PDbalancecheck: string = environment.BaseUrl + 'pdaccount/getpdbalance'       // (Post) API, Used Component:-PDBalanceReport' 

    // >>>---|| PD Passbook Format Report API's ||---------------------->
    public getpdCurrentStatus: string = environment.BaseUrl + 'pdaccount/getpdcurrent/status' // (Post) API, Used Component:- PassbookFormatReport'  
    public AmtforPdAcc: string = environment.BaseUrl + 'pdaccount/block/AmtforPdAcc'         // (GET) API, Used Component:-PassbookFormatReport'  
    public ReceivingAmt: string = environment.BaseUrl + 'pdaccount/get/ReceivingAmt'         // (GET) API, Used Component:-PassbookFormatReport'   


    // >>>---|| PD Calculation  API's ||---------------------->
    public pdCalculation: string = environment.BaseUrl + 'payid/pd/calculation'          // (Post) API, Used Component:-pdCalculation'  


    // >>>---|| eCeiling  API's ||---------------------->
    public getCappingList: string = environment.BaseUrl + 'token/get/cappingList'        // (Post) API, Used Component:-E-Ceiling'  
    public setCappingList: string = environment.BaseUrl + 'token/set/cappingList'        // (Post) API, Used Component:E-Ceiling'  
    public recordList: string = environment.BaseUrl + 'token/ceiling/rpt'               // (Post) API, Used Component:E-Ceiling  
    public ceilingSetFile: string = environment.BaseUrl + '/token/ceiling/setFile'               // (Post) API, Used Component:E-Ceiling  
    public CheckerFlag: string = environment.BaseUrl + '/token/ceiling/Update/CheckerFlag'               // (Post) API, Used Component:E-Ceiling  
    public allPDaccountList: string = environment.BaseUrl + 'mst/get/allPDaccount/List'               // (Post) API, Used Component:E-Ceiling  
    public percentageWiseRpt: string = environment.BaseUrl + 'token/ceiling/percentage/wise/rpt/'               // (GET) API, Used Component:E-Ceiling  
    public rangeWiseRpt: string = environment.BaseUrl + 'token/ceiling/range/wise/rpt/'               // (GET) API, Used Component:E-Ceiling  
    public fileWiseRpt: string = environment.BaseUrl + 'token/ceiling/file/wise/rpt/'


    // >>>---||GRN Voucher Entry API's ||---------------------->
    public getGrnDetails: string = environment.BaseUrl + 'DDO/get/grnDetails/'        // (GET) API, Used Component:-GrnMinusEntryComponent'
    // public chequeSubmit:string = environment.BaseUrl+ 'cheque/submit'               // (GET) API, Used Component:-GrnMinusEntryComponent'
    public grnSave: string = environment.BaseUrl + 'billprocess/grnSave'  // (GET) API, Used Component:-GrnMinusEntryComponent'
    public getHod: string = environment.BaseUrl + 'mst/get/hod/'                      // (GET) API, Used Component:-GrnMinusEntryComponent'

    // >>>---||PDF API's ||---------------------->
    // http://ifmstest.rajasthan.gov.in/integration/v1.0/report/singlereport
    public OracleReport: string = 'https://ifmstest.rajasthan.gov.in/integration/v1.0/report/singlereport'    // (POST) API, Used Component:-automation Bill report'


    // >>>---|| P2F Submit API's ||---------------------->
    public p2fSubmit: string = environment.BaseUrl + 'voucher/insert/scroll'                      // (Post) API, Used Component:- 'P2FComponent'
    public chequeValidateToken: string = environment.BaseUrl + 'cheque/Validate/token'           // (Post) API, Used Component:- 'P2FComponent'
    public getVoucherScroll: string = environment.BaseUrl + 'voucher/get/scroll'                // (Post) API, Used Component:- 'P2FComponent'
    public getVoucherImage: string = environment.BaseUrl + 'voucher/get/image'                 // (Post) API, Used Component:- 'P2FComponent'
    public voucherUpdateScroll: string = environment.BaseUrl + 'voucher/update/scroll'         // (Post) API, Used Component:- 'P2FComponent'


    // >>>---||Employee Signature API's ||---------------------->
    public getDdoCode: string = environment.BaseUrl + 'mst/getDdo/Code/'  // (GET) API, Used Component:-GrnMinusEntryComponent'
    public checkEmployee: string = environment.BaseUrl + '/employee/imgview/'  // (GET) API, Used Component:-GrnMinusEntryComponent'
    public employeeSignMode: string = environment.BaseUrl + '/employee/sign/mode'  // (GET) API, Used Component:-GrnMinusEntryComponent'
    public employeeSignUpdate: string = environment.BaseUrl + '/employee/sign/update'  // (GET) API, Used Component:-GrnMinusEntryComponent'


    // >>>---||TokenTrail API's ||---------------------->
    public paymangerStatus: string = environment.BaseUrl + 'token/paymanger/status'              // (Post) API, Used Component:- 'TokenTrailComponent'
    public tokenTrailStatus: string = environment.BaseUrl + 'token/status'                      // (Post) API, Used Component:- 'TokenTrailComponent'
    public objectionAudit: string = environment.BaseUrl + 'token/objection/audit/'              // (Post) API, Used Component:- 'TokenTrailComponent'



    // >>>>>>>----Bank Master ||---------------------->
    public getbankDetils: string = environment.BaseUrl + 'bank/detail'       // (Post) API, Used Component:-bank-master'  
    public BankDeactive: string = environment.BaseUrl + 'bank/deActive'       // (Post) API, Used Component:-bank-master'  



    // >>>>>>>----Update Voucher Date / Division ||---------------------->
    public VoucherDateUpdateShow: string = environment.BaseUrl + 'voucher/getDate'       // (Post) API, Used Component:-Voucher-date-updation'  
    public CheckGrnEntryExist: string = environment.BaseUrl + 'voucher/check/existing/Grn/'       // (Post) API, Used Component:-Voucher-date-updation'  
    public VoucherDateUpdateSubmit: string = environment.BaseUrl + 'voucher/change/Date'       // (Post) API, Used Component:-Voucher-date-updation'  
    public VoucherDivUpdateSubmit: string = environment.BaseUrl + 'voucher/update/division'       // (Post) API, Used Component:-Voucher-date-updation'  


    // >>>>>>>----Error Log Report  ||---------------------->
    public ErrorLogView: string = environment.BaseUrl + 'log' //  (Post) API, Used Component:- 'ErrorLogReport' 



    // >>>---||TeVoucherEntry  API's ||---------------------->
    public voucherBookEntery: string = environment.BaseUrl + 'voucher/book/entery'                      // (Post) API, Used Component:- 'TeVoucherEntryComponent'
    public voucherBudgetDetail: string = environment.BaseUrl + 'voucher/budget/Detail'                  // (Post) API, Used Component:- 'TeVoucherEntryComponent'
    public budgetAllocationSave: string = environment.BaseUrl + 'voucher/budgetAllocation/save'         // (Post) API, Used Component:- 'TeVoucherEntryComponent'
    public budgetDetailTE: string = environment.BaseUrl + 'voucher/budget/DetailTE/'                     // (Post) API, Used Component:- 'TeVoucherEntryComponent'
    public budgetAllocationTe: string = environment.BaseUrl + 'voucher/delete/budget/allocationTe'       // (Post) API, Used Component:- 'TeVoucherEntryComponent'
    public tebookTransferDetail: string = environment.BaseUrl + 'voucher/get/tebook/transfer/detail'     // (Post) API, Used Component:- 'TeVoucherEntryComponent'
    public getBtTeDetail: string = environment.BaseUrl + 'voucher/get/btTe/detail/'                      // (Post) API, Used Component:- 'TeVoucherEntryComponent'


    // AG Division Update API's 
    public agAgOfficeDetail: string = environment.BaseUrl + 'Ag/get'                    // (Post) API, Used Component:- 'AgDivisionUpdate'
    public agDivisionSave: string = environment.BaseUrl + 'Ag/save'                     // (Post) API, Used Component:- 'AgDivisionUpdate'
    public agDivisionUpdate: string = environment.BaseUrl + 'Ag/update'                 // (Post) API, Used Component:- 'AgDivisionUpdate'
    public getVerifyDivTreasury: string = environment.BaseUrl + '/Ag/verify/DivCode'     // (GET) API, Used Component:- 'AgDivisionUpdate'
    public getVerifyOfficeId: string = environment.BaseUrl + '/Ag/verify/OfficeId'        // (GET) API, Used Component:- 'AgDivisionUpdate'
    public agDivisionDeactivate: string = environment.BaseUrl + '/Ag/deactive/divison/code'  // (Post) API, Used Component:- 'AgDivisionUpdate'


    // >>>---|| UPDATE PAY ID API's ||---------------------->
    public UpdatePaymanagerDivison: string = environment.BaseUrl + 'payid/update/div/details' //  (Post) API, Used Component:- 'UpdatePayidsComponent' 
    public getPaymanagerData: string = environment.BaseUrl + 'payid/get/paymanager/data'        //  (Post) API, Used Component:- 'UpdatePayidsComponent' 
    public getPaymanagerDivison: string = environment.BaseUrl + 'payid/get/division/details'    //  (Post) API, Used Component:- 'UpdatePayidsComponent' 

    // >>>>>>>----PFMS LOG Report  ||---------------------->
    public PFMSlogview: string = environment.BaseUrl + 'pfms/get/log' //  (Post) API, Used Component:- 'PfmsApilogComponent' 


    // >>>>>>>----PFMS Bill To Paymanger Report  ||---------------------->
    public PFMSbilltopaymangerview: string = environment.BaseUrl + 'pfms/bill/toPaymanager/list' //  (Post) API, Used Component:- 'PfmsBillToPaymangerComponent' 
    public getcdeRefNo: string = environment.BaseUrl + 'pfms/get/cdeRefNo/'                     // (Get) API, Used Component:- 'CommonDialogComponent'

    // >>>---|| PFMS Certifications API's ||---------------------->
    public SchemaCode: string = environment.BaseUrl + 'pfms/get/schecode'                   //  (Post) API, Used Component:- 'PfmsComponent' 
    public SchemaCode_details: string = environment.BaseUrl + 'pfms/get/schecode/detail/'   //  (Post) API, Used Component:- 'PfmsComponent' 
    public SchemaSave: string = environment.BaseUrl + 'pfms/refno'                         //  (Post) API, Used Component:- 'PfmsComponent' 


    // >>>---|| PFMS Track Report API's ||---------------------->
    public PFMSTrack: string = environment.BaseUrl + 'mst/track/glance'    //  (Post) API, Used Component:- 'PfmsTrackComponent' 


    // >>>---|| Treasury Closing API's ||---------------------->
    public treasuryClosing: string = environment.BaseUrl + 'token/treasury/closing' //(Post) API, Used Component:- 'DayCloseComponent'


    // >>>---||Payment/Receipt Scroll API's ||---------------------->
    public PaymentScrollResp: string = environment.BaseUrl + 'Scroller/upload/payment'  // (POST) API, Used Component:-PaymentScrollComponent'
    public ReceiptScrollResp: string = environment.BaseUrl + 'Scroller/upload/receipt'  // (POST) API, Used Component:-ReceiptScrollComponent'


    // >>>---||Objection Token Entry API's ||---------------------->
    public getObjectionTokenDetails: string = environment.BaseUrl + 'token/detailBy'          // (POST) API, Used Component:-ObjectionTokenEntryComponent'
    public saveObjectionTokenEntry: string = environment.BaseUrl + 'token/mode/objection'      // (POST) API, Used Component:-ObjectionTokenEntryComponent'


    // >>>---||PFMS CN File API's ||---------------------->
    public PFMSCNTrack: string = environment.BaseUrl + 'pfms/CN/file/rpt'    //  (Post) API, Used Component:- 'PFMSCNComponent'


    // // >>>---||PFMS DN File API's ||---------------------->
    public PFMSDNFile: string = environment.BaseUrl + 'pfms/DN/file/rpt'    //  (Post) API, Used Component:- 'PFMSDNComponent' 


    // >>>---||RBI Payment Files API's ||---------------------->
    public getRBIPaymentFilesDetails: string = environment.BaseUrl + 'pfms/rbi/payment/file/rpt' // (POST) API, Used Component:-RBIPaymentFilesComponent'
   // public getRBIPaymenmatchfileDetails: string = environment.BaseUrl + 'pfms/payment/match/file' // (POST) API, Used Component:-RBIPaymentFilesComponent'


    // >>>---|| Voucher entry API's ||---------------------->
    public GetObjectHeadCodelist: string = environment.BaseUrl + 'mst/trgGetObjectHeadCodelist/'  // (Get) API, Used Component:- 'VoucherEntryComponent' 


    // >>>---|| Digital Sign API's ||---------------------->
    public Getddosignlist: string = environment.BaseUrl + 'pfms/ddosign'    // (Get) API, Used Component:- 'DigitalSignComponent' 


    // >>>---||Cash Zero  API's ||---------------------->
    public getCashZeroReportDetails: string = environment.BaseUrl + 'mst/cash/zerorpt'  // (POST) API, Used Component:-CashZeroComponent'


    // >>>---|| Treasury Lop Report API's ||---------------------->
    public Getloplist: string = environment.BaseUrl + 'mst/rpt/eklop'        // (Get) API, Used Component:- 'TreasuryLopReportComponent' 


    // >>>---|| Treasury Lor Report API's ||---------------------->
    public Getlorlist: string = environment.BaseUrl + 'mst/rpt/ekloR'        // (Get) API, Used Component:- 'TreasuryReportComponent' 
     
     // >>>>>>>----Ac Bill Report  ||---------------------->
     public acbillview: string = environment.BaseUrl + 'mst/acBill/Report' //  (Post) API, Used Component:- 'Ac Bill Report' 


      // >>>---|| IP used Component API's ||---------------------->
    public getIp:string="https://ifmstest.rajasthan.gov.in/rajkosh/3.0/mst/info" // USED Component:-'BillCancelComponent,BillEncashmentComponent,ChequeCancelComponent,ChequeCancelApprovalComponent,DigitalSignComponent,OnlineTokenEntryComponent,PFMSComponent,TOKENMASTERComponent,VoucherDateUpdationComponent,LoginComponent';

    // // >>>---||PFMS DN File API's ||---------------------->
    public pfmsdnFileDetails: string = environment.BaseUrl + 'pfms/dnFileDetails'       //  (Post) API, Used Component:- 'PFMSDNComponent'

   // // >>>---||PFMS reconciliation File API's ||---------------------->
  public PFMSreconciliation: string = environment.BaseUrl + 'pfms/reconciliation'    //  (Post) API, Used Component:- 'PaymentReconcilationlogComponent' 

  public PFMSreconciliationpayload: string = environment.BaseUrl + 'pfms/get/reconciliation/payload'    //  (Post) API, Used Component:- 'PaymentReconcilationlogComponent' 

  // // >>>---||Pfms Paymentlog API's ||---------------------->
  public PFMSdebit: string = environment.BaseUrl + 'pfms/debit/component'    //  (Post) API, Used Component:- 'PfmsPaymentlogComponent' 


  // // >>>---||Pfms Paymentlog File API's ||---------------------->
  public PFMScredit: string = environment.BaseUrl + 'pfms/credit/component'    //  (Post) API, Used Component:- 'PfmsPaymentlogComponent'

  // >>>---|| New Token Report Details||---------------------->
  public NewTokenReportDetails: string = environment.BaseUrl + 'token/new/report'   //  (Post) API, Used Component:- 'NewTokenReportComponent' 
     
}



