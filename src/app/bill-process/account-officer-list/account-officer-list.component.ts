
import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loaderservice';
// import { IGetAccountOfficerForwardList, IGetAccountOfficerForwardListUpdate, IGetAccountOfficerList, IGetAccountOfficerRevertList, IgetVoucherModelData } from '../Interface/Master';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import * as Val from '../../../app/utils/Validators/ValBarrel'
import { ObjectiondialogComponent } from '../objection-dialog/objection-dialog.component';
import { Helper } from 'src/app/utils/Helper';
import { IGetAccountOfficerForwardList, IGetAccountOfficerForwardListUpdate, IGetAccountOfficerList, IGetAccountOfficerRevertList, IgetVoucherModelData } from 'src/app/utils/Master';
import { Console } from 'console';
import { ViewDocumentComponent } from '../view-document/view-document.component';

export interface AccountOffList {
  TokenNo: number;
  BillCode: number;
  userId: number;
  userType: number;
  pageType: number;
  DDOCode: number;
  BudgetHead: string;
  ObjectHead: string;
  AccDate: string;
  AccRemark: string;
  PaymentMode: string;
  CashAmt: number;
  GrossAmt: number;
}




@Component({
  selector: 'app-account-officer-list',
  templateUrl: './account-officer-list.component.html',
  styleUrls: ['./account-officer-list.component.scss']
})
export class AccountOfficerListComponent implements OnInit {
  BillType: number = 0;

  AccountOffListdata: MatTableDataSource<AccountOffList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'TokenNo',
    'Ddocode',
    'Budgethead',
    'ObjectHead',
    'AuditDate',
    'AuditiorFlag',
    'Paymentmode',
    'CashAmt',
    'GrossAmt',
    'ViewDocs',
    'Chk_Pass',
    // 'Chk_Revert',
    'Clickme',
  ];

  checked: any;
  Ischecked: boolean = false;
  IscheckedRevert: boolean = false;
  isObjBtnDisabled: boolean = false; // Set this variable to true or false based on your condition

  // Form Module
  AccountOfficeForm: any;
  SelectAuditor: any = ''
  chk_ForwardList: any = []
  Forwardstatus: any;
  Auditoroptions: Observable<any[]> | undefined;
  chk_RevertList: any = []
  Revertstatus: any;
  AuditorListarr: any = []
  financialYr: any;
  finYr: any;


  isChkDisabled: boolean[] = []
  isButtonDisabled: boolean[] = []
  IscheckedRevertArray: boolean[] = []
  IscheckedArray: boolean[] = []



  selection = new SelectionModel<AccountOffList>(true, []);
  selection2 = new SelectionModel<AccountOffList>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  //@ViewChild(MatSort) Sort!: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.AccountOffListdata.sort = sort;
    // this.tokendeleteARR.sort = sort;
  }

  loading: any;


  Regular_radio: boolean = true
  eKuber_radio: boolean = false

  showTab_BtnForward: boolean = false


  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []


  GetAccountOfficeListModal: IGetAccountOfficerList = {
    type: 0,
    tokenNo: "0",
    treasuryCode: this.TCode.Treasury_Code,
    auditor: 0,
  }

  VoucherModelDataModal: IgetVoucherModelData = {
    type: 3,
    treasuryCode: this.TCode.Treasury_Code,
    treasuryRefNo: 0,
    finYearFrom: this.finyear_.year.toString(),
    finYearTo: this.toyear_.finyear.toString(),
  }


  GetAccountOfficeListforwardModal: IGetAccountOfficerForwardList = {
    tokenNo: '',
    userid: this.UId.UserId,
  }

  GetAccountOfficeListforwardupdateModal: IGetAccountOfficerForwardListUpdate = {
    //type: 0,
    treasuryRefNo: 0,
    userid: this.UId.UserId,
    asignmentId: this.asgnId.assignmentId
    //auditor: 0,
    //treasuryCode: this.TCode.Treasury_Code,
  }


  // dialog: any;
  selectedOption: any;

  //isViewDocs: any ;
  isViewDocs: boolean[] = []

  GetAccountOfficeListRevertModal: IGetAccountOfficerRevertList = {
    treasuryRefNo: 0,
    type: 1,
  }


  page: any = {
    pageIndex: 0,
    pageSize: 5
  };


  constructor(private router: Router, private ApiMethods: ApiMethods, private snackbar: SnackbarService, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private asgnId: Helper, private IPAdd: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };
    this.getAuditorList();


  }


  ngOnInit() {
    console.log('Test Account Officer List');
    this.financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324
    //this.finYr = this.finyear_.year.toString()   // It Shows = 2023
    //Bill type form
    this.GetAccountOfficeListforwardupdateModal.asignmentId = this.asgnId.assignmentId;

    console.log("assignmentId", this.asgnId);

    console.log("GetAccountOfficeListforwardupdateModal", this.GetAccountOfficeListforwardupdateModal);
    this.AccountOfficeForm = new FormGroup({
      // Treasury: new FormControl({ value: this.GetAccountOfficeListModal.treasuryCode, disabled: true }),
      Year: new FormControl({ value: this.financialYr, disabled: true }),
      TokenNum: new FormControl('0', [Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
      // AuditorControl: new FormControl('',{ validators: [this.autocompleteObjectValidator()] }),
      AuditorControl: new FormControl('',),
      chk_Auditor: new FormControl(''),
      chk_Acountant: new FormControl(''),
      TreasuryControl: new FormControl({ value: this.GetAccountOfficeListModal.treasuryCode }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    });

    this.getTreasuryList();

    this.GetAccountOfficeList();

    //this.GetVoucherModellist();



  }

  checkIsDisabled = (row: any, row2: any): boolean => {
    console.log("any===>", row2);
    if (parseInt(row.ObjeType) >= 5000) {
      return true;
    }
    else {
      return false;
    }

  }


  // "Revert" - Check Box Disable Or Enable---------------
  checkIsDisabledRevert = (row: any): boolean => {
    if (parseInt(row.ObjeType) >= 5000) {
      return true
    }
    return false;
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
        this.Treasuryoptions = this.AccountOfficeForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filterTreas(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
        this.AccountOfficeForm.patchValue({
          TreasuryControl: treasury

        })

        if (this.TCode.Treasury_Code != "5000") {
          this.AccountOfficeForm.controls['TreasuryControl'].disable();
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


  // Call Auditor List API >>>------------------->
  getAuditorList() {
    //let url=this.ApiService.TreasuryOfficerAuditorList;
    //this.ApiMethods.getservice(url).subscribe(resp => {
    this.ApiMethods.getservice(this.ApiService.AuditorList + 1 + '/' + this.TCode.Treasury_Code).subscribe((resp:any)=> {

      // this.ApiMethods.getservice(this.ApiService.TreasuryOfficerAuditorList).subscribe(resp => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.AuditorListarr = resp.result
      }
      console.log("Show_Treasury_AuditorList", this.AuditorListarr);
      this.Auditoroptions = this.AccountOfficeForm.controls['AuditorControl'].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          // console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.Auditor
        }),
        map((Auditor: any) => {
          // console.log("second__map", Auditor);

          return Auditor ? this._filter(Auditor, data) : data.slice()
        })
      );

    })

  }
  // private _filter(Auditor: any, data: any): any {
  //   throw new Error('Method not implemented.');
  // }


  //  Auditor List filter >>>------------------->
  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.EmployeeId.toLowerCase().includes(value.toLowerCase())
    });
  }


  GetAccountOfficeList() {
    // this.loader.setLoading(true);
    // setTimeout(() => {
      // Get TokenNum Page Control value
      this.GetAccountOfficeListModal.tokenNo = "0",
        this.GetAccountOfficeListModal.type = 0;
      this.GetAccountOfficeListModal.auditor = 0;
      // Get TokenNum Page Control value

      let tokenVal = this.AccountOfficeForm.controls['TokenNum'].value;
      if (tokenVal != "") {
        console.log("Token_Value", tokenVal);
        this.GetAccountOfficeListModal.tokenNo = tokenVal;
        this.GetAccountOfficeListModal.type = 1;
      }

      let AuditorVal = this.AccountOfficeForm.controls['AuditorControl'].value;
      console.log("Auditor_ValueXXXXXXXX", AuditorVal);
      if (AuditorVal != "") {
        console.log("Auditor_Value", AuditorVal.UserId);
        this.GetAccountOfficeListModal.type = 1;
        this.GetAccountOfficeListModal.auditor = AuditorVal.UserId;
      }

      let chk_AuditorVal = this.AccountOfficeForm.controls['chk_Auditor'].value;
      if (chk_AuditorVal == true) {
        this.GetAccountOfficeListModal.type = 4;
      }

      let btnVal = this.AccountOfficeForm.controls['chk_Auditor'].value;
      if (chk_AuditorVal == true) {
        this.GetAccountOfficeListModal.type = 4;
      }
      //this.budgetinputForm = false
      //console.log("ip__adddd_", this.ApiMethods.ippAddress);

      this.loader.setLoading(true);
      //this.GetOnlineBillListModal.type = 1
      console.log("Before_Calling_API_AccountOfficerList_Result", this.GetAccountOfficeListModal);

      //api call of Treasury Officer List
      //this.ApiMethods.getservice(this.ApiService.TreasuryOfficerList + this.GetTreasOfficeListModal.type+ '/' + this.GetTreasOfficeListModal.tokenNo + '/' + this.GetTreasOfficeListModal.userId+ '/' + this.GetTreasOfficeListModal.treasuryCode+ '/' + this.GetTreasOfficeListModal.auditor+ '/' + this.GetTreasOfficeListModal.pageIndex).subscribe(resp => {
      this.ApiMethods.postresultservice(this.ApiService.AccountOfficerForward, this.GetAccountOfficeListModal).subscribe((resp:any) => {

        console.log("After_Calling_API_AccountOfficerListt_Result", resp);

        if (resp.result.length > 0) {

          console.log("AccountOfficerList__", resp.result);

          this.AccountOffListdata.data = resp.result;

          this.AccountOffListdata.paginator = this.paginator;
          //this.AccountOffListdata.sort = this.Sort;
          this.showTab_BtnForward = true;

          this.disableElementArray(resp.result);


          this.loader.setLoading(false);
          document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
          // alert("hi")
          //this.snackbar.show('No Transaction Found to Forward !', 'alert');
          // this.snackbar.show('No Account Officer List Found !', 'Info !');
          this.loader.setLoading(false);
          this.AccountOffListdata.data = [];
          this.showTab_BtnForward = false;
        }

      },



        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            // this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
            this.showTab_BtnForward = false;
          }
        }

      );
    // }, 5000)

    console.log("Before_Calling_API_VoucherModelDataModal_Result_____", this.VoucherModelDataModal);
  }

  GetAccountOfficeListReset() {
    window.location.reload();
  }

  GetVoucherModellist() {
    this.loader.setLoading(true);
    // this.GetAccountOfficeListModal.type = 10440443;
    this.ApiMethods.postresultservice(this.ApiService.VoucherModelData, this.VoucherModelDataModal).subscribe((resp:any) => {

      console.log("After_Calling_API_VoucherModelDataModal", resp);

      if (resp.result.length > 0) {
        this.BillType = resp.result.BillType;
        console.log("AccountOfficerList__", resp.result);
        //  this.openDialog(resp.result.BillType);

        // this.AccountOffListdata.data = resp.result;
        // this.AccountOffListdata.paginator = this.paginator;
        // this.AccountOffListdata.sort = this.Sort;




        // this.loader.setLoading(false);
        // document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else {
        // this.toastrService.info('No Treasury Officer List Found !', 'Info!');
        // this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          // this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');

        }
      }
    );
    console.log("Before_Calling_API_VoucherModelDataModal_Result_____", this.VoucherModelDataModal);
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  applyFilter(filterValue: string) {
    this.AccountOffListdata.filter = filterValue.trim().toLowerCase();

    // if (this.AccountOffListdata.paginator) {
    //   this.AccountOffListdata.paginator.firstPage();
    // }
  }

  onChangePage(pe: PageEvent) {
    this.page = pe;
    this.Ischecked = false;
    this.IscheckedRevert = false;
    this.masterToggle({ checked: false })
    this.masterToggle_Revert({ checked: false })
  }


  OnAuditorSelected(SelectAuditor: any) {
    console.log("befort______Select_Auditor", SelectAuditor);
    console.log("slelction__________option_____________", SelectAuditor);
    this.GetAccountOfficeListModal.auditor = SelectAuditor
  }

  displayFn(selectedoption: any) {
    console.log("display_fun_call");
    return selectedoption ? selectedoption.EmployeeId : undefined;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.AccountOffListdata.data.length;
    return numSelected === numRows;
    //   const numSelected = this.selection.selected.length;
    //   const page = this.AccountOffListdata.paginator?.pageSize;
    //   let endIndex: number;
    //   First check whether data source length is greater than current page index multiply by page size.
    //   If yes then endIdex will be current page index multiply by page size.
    //   If not then select the remaining elements in current page only.
    //   if (this.AccountOffListdata.data.length > (this.AccountOffListdata.paginator.pageIndex + 1) * this.AccountOffListdata.paginator.pageSize) {
    //     endIndex = (this.AccountOffListdata.paginator?.pageIndex. + 1) * this.dataSource.paginator.pageSize;
    //   } else {
    //     endIndex = this.AccountOffListdata.data.length - (this.AccountOffListdata.paginator?.firstPage * this.AccountOffListdata.paginator?.pageSize);
    //   }
    //   return numSelected === endIndex;
    // }

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(data: any) {
    this.Ischecked = data.checked;
    if (data.checked) {
      this.AccountOffListdata.data.forEach((row: any) => {
        if (row.AuditiorFlag == 'Objection' && parseInt(row.ObjeType) >= 5000) {
          row.IsChecked = false;
        }
        else {
          row.IsChecked = true;
          // this.selection.select(row)
        }

      });
    } else {
      this.AccountOffListdata.data.forEach((row: any) => { row.IsChecked = false; })
    }
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle_Revert(data: any) {
    console.log("After_Call_CheckALL_masterToggle_Revert___");
    this.IscheckedRevert = data.checked;
    if (data.checked) {
      this.AccountOffListdata.data.forEach((row: any) => {
        if (parseInt(row.ObjeType) >= 5000) {
          row.IscheckedRevert = false;
        }
        else {
          row.IscheckedRevert = true;
          // this.selection.select(row)
        }

      });
    } else {
      this.AccountOffListdata.data.forEach((row: any) => { row.IscheckedRevert = false; })
    }
  }



  AcctForward_Submit() {

    // chk_ForwardList
    this.chk_ForwardList = [];
    console.log(this.page)
    const dt = [...this.AccountOffListdata.data];
    //console.log(dt)
    //const data = dt.splice(this.page.pageIndex * this.page.pageSize, this.page.pageSize);
    //const finalData = data.filter((x: any) => x.IsChecked === true)
    const finalData = dt.filter((x: any) => x.IsChecked === true)
    console.log(finalData)
    // For Store Multiple Bill Code
    console.log("selection value", this.selection);
    finalData.forEach(s => {
      this.chk_ForwardList.push(s.BillCode.toString())
    })
    this.GetAccountOfficeListforwardupdateModal.treasuryRefNo = this.chk_ForwardList;


    // chk_RevertList    
    this.chk_RevertList = [];
    console.log(this.page)
    const dtRevert = [...this.AccountOffListdata.data];
    const dataRevert = dtRevert.splice(this.page.pageIndex * this.page.pageSize, this.page.pageSize);
    const finalDataRevert = dataRevert.filter((x: any) => x.IscheckedRevert === true)
    console.log(finalDataRevert)
    // For Store Multiple Bill Code
    finalDataRevert.forEach(s => {
      this.chk_RevertList.push(s.BillCode.toString())
    })
    this.GetAccountOfficeListRevertModal.treasuryRefNo = this.chk_RevertList;



    // if (this.chk_ForwardList.length > 0 && this.chk_RevertList.length > 0)   // For ForWard Process
    // {
    //   console.log("ZZZZZZZZ_before___selel__", this.chk_ForwardList);
    //   console.log("AAAAAAAA_before___selel__", this.chk_RevertList);
    //   this.snackbar.show('Please Check Any One Pass Or Revert  !', 'alert');
    // }


    if (this.chk_ForwardList.length > 0)   // For ForWard Process
    {

      console.log("AAAAAAAA_myObject_Result", this.GetAccountOfficeListforwardupdateModal); // "Begin Time"
      this.loader.setLoading(true);
      console.log("Before_Calling_API_TOforwardUpdate_Result", this.GetAccountOfficeListforwardupdateModal);
      this.ApiMethods.postresultservice(this.ApiService.AccountOfficerForwardUpdate, this.GetAccountOfficeListforwardupdateModal).subscribe((resp:any) => {
        this.Forwardstatus = resp.result;
        if (this.Forwardstatus == true) {
          // this.snackbar.show('Bill Forwarded to TO/ATO ', 'Alert!');
          this.snackbar.show('Bill Forwarded to TO/ATO', 'success');
          this.GetAccountOfficeListforwardupdateModal.treasuryRefNo = 0;
          // setTimeout(()=>{
          this.GetAccountOfficeList();
          // },1000)

          this.masterToggle(0);
          this.chk_ForwardList = []
          this.selection = new SelectionModel<AccountOffList>(true, [])
          this.paginator.firstPage()
        }
 
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            // this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
          }
        }
      );
    }

    else if (this.chk_RevertList.length > 0)   // For Revert Process
    {
      console.log("chk_RevertList_Result", this.chk_RevertList); // "Begin Time"
      this.loader.setLoading(true);
      console.log("Before_Calling_API_Accountant_RevertUpdate_Result", this.GetAccountOfficeListRevertModal);
      this.ApiMethods.postresultservice(this.ApiService.AccountOfficerRevert, this.GetAccountOfficeListRevertModal).subscribe((resp:any) => {
        console.log("After_Calling_API_Accountant_RevertUpdate_Result", resp.result);
        this.Revertstatus = resp.result;
        if (this.Revertstatus == true) {
          this.snackbar.show('Bill Revert To Auditor !', 'success');
          this.GetAccountOfficeList();
          this.chk_RevertList = []
          this.selection2 = new SelectionModel<AccountOffList>(true, [])
          //window.location.reload();
          //this.showTab_TODetail= true;
          this.masterToggle_Revert(0);
          this.paginator.firstPage();
          console.log(this.page)
        }

        if (resp.result.length > 0) {
          this.loader.setLoading(false);
          document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
          //this.toastrService.info('No Treasury Officer Update List Found !', 'Info!');
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
            //this.showTab_TODetail= false;
          }
        }
      );

    }

    else {
      this.snackbar.show('Please Check Any One Record  !', 'alert');
    }
  }


  openDialog(row: any) {
    if (row.IsChecked) {
      // this.snackbar.show('Please Uncheck  Pass and Revert !', 'alert');
      this.snackbar.show('Please Uncheck Pass !', 'alert');
      return;
    }

    if (row.IscheckedRevert) {
      // this.snackbar.show('Please Uncheck  Pass and Revert !', 'alert');   
      this.snackbar.show('Please Uncheck Pass !', 'alert');
      return;
    }


    //console.log("result==>>",row);

    let treasRefNo = row.BillCode;
    this.loader.setLoading(true);


    this.isObjBtnDisabled = false;

    console.log("XXXXXXX_Open_row.IsChecked==false")
    // this.GetAccountOfficeListModal.type = 10440443;
    this.VoucherModelDataModal.treasuryRefNo = treasRefNo;
    console.log("XXXXXXX_Before SHow of TreasuryRefNo", this.VoucherModelDataModal.treasuryRefNo)
    this.ApiMethods.postresultservice(this.ApiService.VoucherModelData, this.VoucherModelDataModal).subscribe((resp:any) => {

      if (resp.message = "Success") {
        this.showmodal(treasRefNo, resp.result.BillType);
        this.loader.setLoading(false);
        console.log("Before SHow of BillType", resp.result.BillType)
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          // this.snackbar.show('Something Went Wrong! Please Try Again', 'Alert !');
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
        }
      }
    );
 

  }

  showmodal(billcode: any, biltype: number) {
    const dialogRef = this.dialog.open(ObjectiondialogComponent,
      {
        width: "30%",
        disableClose: true,
        data: {
          // result: ''
        }
      }

    );

     //alert('dddddddddddddd');
    dialogRef.componentInstance.BillCode = billcode;
    dialogRef.componentInstance.userId = this.UId.UserId,
    dialogRef.componentInstance.userType = 4;
    dialogRef.componentInstance.pageType = "1";
    dialogRef.componentInstance.BillType = biltype;

    // Back From Objection Dialogbox and refresh AccountOfficer List page-----------------------begiN-------
    dialogRef.afterClosed().subscribe(res => {
      if (res === 1) {
        this.GetAccountOfficeList();
      }
    })
    // --------------------------------------------------------------------------------------------enD-------

  }



  viewDocumentPopup(row: any) {
    this.showmodalViewDocs(row);
    this.disableElement(row);
  }




  showmodalViewDocs(row: any) {
    let billnoid = row.billnoid;
    const dialogRef = this.dialog.open(ViewDocumentComponent,
      {
        // width: '50%',
        // height: '63%',
        width: '1000px',
        height: '800px',
        disableClose: true
        // , data: {
        //   // result: ''
        // }
      }

    );
    dialogRef.componentInstance.getBase64ImgDocumentId(billnoid);

    // Back From Objection Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res === 1) {
    //    // this.GetTreasOfficeList();
    //   }
    // })
    // --------------------------------------------------------------------------------------------enD-------

    this.isViewDocs[row.BillCode] = true;
  }

  disableElementArray(rowdata: any) {
    rowdata.forEach((row: any) => {
      if (parseInt(row.ObjeType) >= 5000) {
        this.isChkDisabled[row.BillCode] = false;
        this.isButtonDisabled[row.BillCode] = false;
      }
    });

  }
  disableElement(row: any): void {
    this.isButtonDisabled[row.BillCode] = true;
    if (parseInt(row.ObjeType) < 5000) {
      this.isChkDisabled[row.BillCode] = true;
    }
  }





  get TokenNum() { return this.AccountOfficeForm.get('TokenNum') }
  get AuditorControl() { return this.AccountOfficeForm.get('AuditorControl') }
}
