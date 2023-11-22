
import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { IGetTreasuryOfficerList } from 'src/app/utils/Master';
import { IGetTreasuryOfficerForwardList } from 'src/app/utils/Master';
import { IGetTreasuryOfficerRevertList } from 'src/app/utils/Master';
import { IGetTreasuryOfficerListRemark } from 'src/app/utils/Master';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import * as Val from  '../../../app/utils/Validators/ValBarrel'
import { ObjectiondialogComponent } from '../objection-dialog/objection-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IgetVoucherModelData } from 'src/app/utils/Master';
import { Helper } from 'src/app/utils/Helper';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { EventEmitter } from 'stream';
import { ViewDocumentComponent } from '../view-document/view-document.component';

export interface TreasOffList {
  TokenNo: number;
  BillCode: number;
  DDOCode: number;
  BudgetHead: string;
  ObjectHead: string;
  AccDate: string;
  AccRemark: string;
  PaymentMode: string;
  CashAmt: number;
  GrossAmt: number;
  Remark: string;
}




@Component({
  selector: 'app-treasury-officer-list',
  templateUrl: './treasury-officer-list.component.html',
  styleUrls: ['./treasury-officer-list.component.scss']
})
export class TreasuryOfficerListComponent implements OnInit {

  

  TreasOffListdata: MatTableDataSource<TreasOffList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'TokenNo',
    'ddocode',
    'Budgethead',
    'ObjectHead',
    'ACCTDate',
    'ACCTFlag',
    'Paymentmode',
    'CashAmt',
    'GrossAmt',
    'ViewDocs',
    'Chk_Pass',
    //'Chk_Revert',
    'Btn_Remark',

  ];
  checked: any;
  Ischecked: boolean = false;
  IscheckedRevert: boolean = false;

  // Form Module
  TreasOfficeForm: any;
  TreasOfficeFormRemark: any;
  Auditoroptions: Observable<any[]> | undefined;
  chk_ForwardList: any = []
  Forwardstatus: any;
  financialYr:any;
  finYr:any;
  chk_RevertList: any = []
  Revertstatus: any;

  //LIst array
  AuditorListarr: any = []
  SelectAuditor: any = ''

  selectionPass = new SelectionModel<TreasOffList>(true, []);
  selectionRevert = new SelectionModel<TreasOffList>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) Sort!: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.TreasOffListdata.sort = sort;
    // this.tokendeleteARR.sort = sort;
  }

  loading: any;


  rowBillcode: any;
  isChkDisabled: boolean[]=[];
  isButtonDisabledObj: boolean[]=[];
  isButtonDisabledRemark: boolean[]=[];

  //btnRemark: boolean = false;   // Button Visibiliy true/false
  popup = false
   //showTab_TODetail: boolean = false
  showTab_BtnForward: boolean = false

  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  isViewDocs: boolean[]=[]

  GetTreasOfficeListModal: IGetTreasuryOfficerList = {
    type: 0,
    tokenNo: "0",
    //userid: 0,
    treasuryCode: this.TCode.Treasury_Code,
    auditor: 0,
  }


  GetTreasOfficeListforwardModal: IGetTreasuryOfficerForwardList = {
    treasuryRefNo: 0,
    userid: this.UId.UserId,
    asignmentId: this.asgnId.assignmentId
  }

  GetTreasOfficeListRevertModal: IGetTreasuryOfficerRevertList = {
    treasuryRefNo: 0,
    type: 2
  }

 

  VoucherModelDataModal: IgetVoucherModelData = {
    type: 3,
    treasuryCode: this.TCode.Treasury_Code,
    treasuryRefNo: 0,
    finYearFrom: this.finyear_.year.toString(),
    finYearTo: this.toyear_.finyear.toString(),
  }


  page: any = {
    pageIndex: 0,
    pageSize: 5
  };
BillCode: any;

  constructor(private router: Router, private ApiMethods: ApiMethods,public loader: LoaderService, private ApiService: ApiService,private snackbar: SnackbarService,
    private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper,private asgnId: Helper, private IPAdd: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };

    //this.GetTreasOfficeList();  // Call Treasury Forward Load Data

    this.getAuditorList();   // Call Auditor List

  }




  ngOnInit() {
    console.log('Test Treasury Officer List');
    this.financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);   // It Shows = 2324
    //this.finYr = this.finyear_.year.toString()   // It Shows = 2023
    
    //Treasury Officer form
    this.TreasOfficeForm = new FormGroup({
      //Treasury: new FormControl({ value: this.GetTreasOfficeListModal.treasuryCode, disabled: true }),
      Year: new FormControl({ value: this.financialYr, disabled: true }),
      TokenNum: new FormControl('0',[ Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
      //TokenNum: new FormControl('', [Val.Numeric]),
      //Auditor: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      AuditorControl: new FormControl(''),
      chk_Auditor: new FormControl(''),
      chk_Acountant: new FormControl(''),
      TreasuryControl: new FormControl({ value: this.GetTreasOfficeListModal.treasuryCode}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),

    });

    this.TreasOfficeFormRemark = new FormGroup({
      Remark: new FormControl({ value: '', disabled: false }),
    });

    this.getTreasuryList();

    this.GetTreasOfficeList();

  }

  // "Pass" - Check Box Disable Or Enable---------------
  checkIsDisabledPass = (row: any): boolean => {
    if (row.ACCTFlag == 'Delay' || parseInt(row.ObjeType) >= 5000) {
      return true
    }
    return false;
  }

  // "Revert" - Check Box Disable Or Enable---------------
  checkIsDisabledRevert = (row: any): boolean => {
    if (row.ACCTFlag == 'Delay' || parseInt(row.ObjeType) >= 5000) {
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
             this.Treasuryoptions = this.TreasOfficeForm.controls['TreasuryControl'].valueChanges.pipe(
               startWith(''),
               map((value: any) => {
                 return typeof value === 'string' ? value : value.treasuryCode
               }),
               map((treasury: any) => {
     
                 return treasury ? this._filterTreas(treasury, data) : data.slice()
               })
             );
             const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
             this.TreasOfficeForm.patchValue({
               TreasuryControl: treasury
     
             })
     
             if(this.TCode.Treasury_Code !="5000")
              {
                this.TreasOfficeForm.controls['TreasuryControl'].disable();
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
     //this.ApiMethods.getservice(this.ApiService.TreasuryOfficerAuditorList).subscribe(resp => {
      this.ApiMethods.getservice(this.ApiService.AuditorList  + 1 + '/' + this.TCode.Treasury_Code).subscribe((resp:any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.AuditorListarr = resp.result
      }
      console.log("Show_Treasury_AuditorList", this.AuditorListarr);

      this.Auditoroptions = this.TreasOfficeForm.controls['AuditorControl'].valueChanges.pipe(
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


  //  Auditor List filter >>>------------------->
  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.EmployeeId.toLowerCase().includes(value.toLowerCase())
    });
  }

  //  Auditor List Select >>>------------------->
  OnAuditorSelected(SelectAuditor: any) {
    console.log("befort______Select_Auditor", SelectAuditor);
    console.log("slelction__________option_____________", SelectAuditor);
    this.GetTreasOfficeListModal.auditor = SelectAuditor
  }


  //  Auditor display Function >>>------------------->
  displayFn(selectedoption: any) {
    console.log("display_fun_call");
    return selectedoption ? selectedoption.EmployeeId : undefined;
  }



  // Call TO Load Data API >>>------------------->
  GetTreasOfficeList() {

    // Get TokenNum Page Control value
    this.GetTreasOfficeListModal.tokenNo = "0",
    this.GetTreasOfficeListModal.type = 0;
    this.GetTreasOfficeListModal.auditor = 0;


    // Get TokenNum Page Control value
    let tokenVal = this.TreasOfficeForm.controls['TokenNum'].value;
    if (tokenVal != "") {
      console.log("Token_Value", tokenVal);
      this.GetTreasOfficeListModal.tokenNo = tokenVal;
      this.GetTreasOfficeListModal.type = 1;
    }

    let AuditorVal = this.TreasOfficeForm.controls['AuditorControl'].value;
    console.log("Auditor_ValueXXXXXXXX", AuditorVal);
    if (AuditorVal != "") {
      console.log("Auditor_Value", AuditorVal.UserId);
      this.GetTreasOfficeListModal.type = 1;
      this.GetTreasOfficeListModal.auditor = AuditorVal.UserId;
    }


    let chk_AuditorVal = this.TreasOfficeForm.controls['chk_Auditor'].value;
    if (chk_AuditorVal == true) {
      this.GetTreasOfficeListModal.type = 4;
    }


    let chk_AcountantVal  = this.TreasOfficeForm.controls['chk_Acountant'].value;
    if (chk_AcountantVal == true) {
      this.GetTreasOfficeListModal.type = 0;
    }

    //this.budgetinputForm = false
    //console.log("ip__adddd_", this.ApiMethods.ippAddress);

    this.loader.setLoading(true);
    //this.GetOnlineBillListModal.type = 1
    console.log("Before_Calling_API_TreasuryOfficerList_Result", this.GetTreasOfficeListModal);

    //api call of Treasury Officer List
    //this.ApiMethods.getservice(this.ApiService.TreasuryOfficerList + this.GetTreasOfficeListModal.type+ '/' + this.GetTreasOfficeListModal.tokenNo + '/' + this.GetTreasOfficeListModal.userId+ '/' + this.GetTreasOfficeListModal.treasuryCode+ '/' + this.GetTreasOfficeListModal.auditor).subscribe(resp => {
    this.ApiMethods.postresultservice(this.ApiService.TreasuryOfficerList, this.GetTreasOfficeListModal).subscribe((resp:any) => {
      console.log("After_Calling_API_TreasuryOfficerList_Result", resp);
      if (resp.result.length > 0) {
        console.log("TreasuryOfficerList__", resp.result);
        this.TreasOffListdata.data = resp.result;
        //this.showTab_TODetail= true;
        this.TreasOffListdata.paginator = this.paginator;
        //this.TreasOffListdata.sort = this.Sort;
        this.showTab_BtnForward = true;

        this.disableElementArray(resp.result);

        //   resp.result.map((x: any) => {
        //   console.log("x___val__", x);

        //   if (x.ACCTFlag.trim() == 'Delay') {         //=====> matching the current step
        //     console.log("_if_x.AccRemark_", x.ACCTFlag);
        //     this.btnRemark = true;            // Button Visibiliy true/false         
        //     this.btnObjection = false;        // Button Visibiliy true/false
        //   }
        //   //if (x.ACCTFlag != 'Delay')       //=====> matching the current step
        //   else
        //   {
        //     console.log("_else_x.AccRemark_", x.ACCTFlag);
        //     this.btnObjection = false;          // Button Visibiliy true/false
        //     this.btnRemark = true;           // Button Visibiliy true/false
        //   }
        // })


        this.loader.setLoading(false);
        document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      }
      else {
        //this.snackbar.show('No Transaction Found to Forward !', 'alert');
        this.loader.setLoading(false);
        this.TreasOffListdata.data = [];
        //this.showTab_TODetail= false;
        this.showTab_BtnForward = false;
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
          //this.showTab_TODetail= false;
          this.showTab_BtnForward = false;
        }
      }
    );

  }

  GetTreasOfficeListReset() {
    window.location.reload();
  }

  // TO Load Data Sorting >>>------------------->
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  // TO Load Data Searching..............
  applyFilter(filterValue: string) {
    this.TreasOffListdata.filter = filterValue.trim().toLowerCase();

    if (this.TreasOffListdata.paginator) {
      this.TreasOffListdata.paginator.firstPage();
    }
  }

  onChangePage(pe: PageEvent) {
    this.page = pe;
    this.Ischecked = false;
    this.IscheckedRevert = false;
    this.masterToggle({ checked: false })
    this.masterToggle_Revert({ checked: false })

  }



  // TO Forward Check Functionality >>>------------------->
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedPass() {
    //console.log("After isAllSelected Selection___");
    const numSelectedPass = this.selectionPass.selected.length;
    //console.log("numSelected_Result___",numSelected)
    const numRowsPass = this.TreasOffListdata.data.length;
    //console.log("numRows_Result___",numRows)

    return numSelectedPass === numRowsPass;

  }

 


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(data: any) {
    this.Ischecked = data.checked;
    if (data.checked) {
      console.log("After_Call_CheckALL_masterToggle___");

      this.TreasOffListdata.data.forEach((row: any) => {
        if (row.ACCTFlag == 'Delay' || parseInt(row.ObjeType) >= 5000) {

          row.IsChecked = false;
        }
        else {
          row.IsChecked = true;
          // this.selection.select(row)
        }

      });
    } else {
      this.TreasOffListdata.data.forEach((row: any) => { row.IsChecked = false; })
    }
  }



  // TO Revert Check Functionality >>>------------------->
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedRevert() {
    //console.log("After isAllSelected Selection___");
    const numSelectedRevert = this.selectionRevert.selected.length;
    const numRowsRevert = this.TreasOffListdata.data.length;
    return numSelectedRevert === numRowsRevert;
  }

 



  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle_Revert(data: any) {
    console.log("After_Call_CheckALL_masterToggle_Revert___");
    this.IscheckedRevert = data.checked;
    if (data.checked) {
      this.TreasOffListdata.data.forEach((row: any) => {
        if (row.ACCTFlag == 'Delay' || parseInt(row.ObjeType) >= 5000) {
          row.IscheckedRevert = false;
        }
        else {
          row.IscheckedRevert = true;
          // this.selection.select(row)
        }

      });
    } else {
      this.TreasOffListdata.data.forEach((row: any) => { row.IscheckedRevert = false; })
    }
  }

 

  // Call TO Forward API >>>------------------->
  TOForward_Submit() {

     
  // chk_ForwardList
    this.chk_ForwardList = [];
    console.log(this.page)
    const dt = [...this.TreasOffListdata.data];
    // const data = dt.splice(this.page.pageIndex * this.page.pageSize, this.page.pageSize);
    // const finalData = data.filter((x: any) => x.IsChecked === true)
     const finalData = dt.filter((x: any) => x.IsChecked === true)
    console.log(finalData)
    // For Store Multiple Bill Code
    finalData.forEach(s => {
      this.chk_ForwardList.push(s.BillCode.toString())
    })
    this.GetTreasOfficeListforwardModal.treasuryRefNo = this.chk_ForwardList;




    // chk_RevertList    
    this.chk_RevertList = [];
    console.log(this.page)
    const dtRevert = [...this.TreasOffListdata.data];
    const dataRevert = dtRevert.splice(this.page.pageIndex * this.page.pageSize, this.page.pageSize);
    const finalDataRevert = dataRevert.filter((x: any) => x.IscheckedRevert === true)
    console.log(finalDataRevert)
    // For Store Multiple Bill Code
    finalDataRevert.forEach(s => {
      this.chk_RevertList.push(s.BillCode.toString())
    })
    this.GetTreasOfficeListRevertModal.treasuryRefNo = this.chk_RevertList;
 


    // if (this.chk_ForwardList.length > 0 && this.chk_RevertList.length > 0)   // For ForWard Process
    // {
    //   console.log("ZZZZZZZZ_before___selel__", this.chk_ForwardList);
    //   console.log("AAAAAAAA_before___selel__", this.chk_RevertList);
    //   this.snackbar.show('Please Check Any One Pass Or Revert  !', 'alert');
    // }

 if (this.chk_ForwardList.length > 0)   // For ForWard Process
    {
      // console.log("ZZZZZZZZ_before___selel__", this.selectionPass.selected.length);
      //   this.selectionPass.selected.forEach(s => {
      //     console.log("before___selel__", s);

      //     this.chk_ForwardList.push(s.BillCode.toString())
      //   })

      //this.GetTreasOfficeListforwardModal.tokenNo = this.chk_ForwardList + ",";

      console.log("Chk_ForwardList_Result", this.chk_ForwardList); // "Begin Time"
      this.loader.setLoading(true);
      console.log("Before_Calling_API_TOforwardUpdate_Result", this.GetTreasOfficeListforwardModal);
      this.ApiMethods.postresultservice(this.ApiService.TreasuryOfficerForward, this.GetTreasOfficeListforwardModal).subscribe((resp:any) => {
        console.log("After_Calling_API_TOforwardUpdate_Result", resp.result);

        this.Forwardstatus = resp.result;
        if (this.Forwardstatus == true) {
          this.snackbar.show('Bill Forwarded To Next Level !', 'success');
          this.GetTreasOfficeListforwardModal.treasuryRefNo = 0
          this.GetTreasOfficeList();
          this.chk_ForwardList = []
          this.selectionPass = new SelectionModel<TreasOffList>(true, [])
          //window.location.reload();
          //this.showTab_TODetail= true;
          this.masterToggle(0);
          this.paginator.firstPage()
        }

 
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
            //this.showTab_TODetail= false;
          }
        }
      );

    }

    else if (this.chk_RevertList.length > 0)   // For Revert Process
    {
       

      console.log("chk_RevertList_Result", this.chk_RevertList); // "Begin Time"
      this.loader.setLoading(true);
      console.log("Before_Calling_API_TORevertUpdate_Result", this.GetTreasOfficeListRevertModal);
      this.ApiMethods.postresultservice(this.ApiService.TreasuryOfficerRevert, this.GetTreasOfficeListRevertModal).subscribe((resp:any) => {
        console.log("After_Calling_API_TORevertUpdate_Result", resp.result);
        this.Revertstatus = resp.result;
        if (this.Revertstatus == true) {
          this.snackbar.show('Bill Revert To Accountant!', 'success');
          this.GetTreasOfficeList();
          this.chk_RevertList = []
          this.selectionRevert = new SelectionModel<TreasOffList>(true, [])
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
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
            //this.showTab_TODetail= false;
          }
        }
      );

    }

    else {
      this.snackbar.show('Please Check Any One Record  !', 'alert');
    }

  }


  
  GetRowBillcode(bcode: any) {
    this.rowBillcode = bcode.BillCode;
    console.log("XXXXX_RowBillcode_Result", this.rowBillcode);
  }

 
  // popup For 'ObjectionDialog' ------------------------------------------begiN-------->
  objectionDialog(row: any) {
    if(row.IsChecked){     
      //this.snackbar.show('Please Uncheck  Pass and Revert !', 'alert');   
      this.snackbar.show('Please Uncheck Pass !', 'alert');       
      return;
    }

    if(row.IscheckedRevert){ 
      // this.snackbar.show('Please Uncheck  Pass and Revert !', 'alert');        
      this.snackbar.show('Please Uncheck Pass !', 'alert');        
      return;
    }

    let treasRefNo=row.BillCode;
    this.loader.setLoading(true);
    // this.GetAccountOfficeListModal.type = 10440443;
    this.VoucherModelDataModal.treasuryRefNo = treasRefNo;
    console.log("Before SHow of billcode", this.VoucherModelDataModal.treasuryRefNo)
    this.ApiMethods.postresultservice(this.ApiService.VoucherModelData, this.VoucherModelDataModal).subscribe((resp:any) => {

      if (resp.message = "Success") {
        this.showmodal(treasRefNo, resp.result.BillType);

        console.log("After SHow of BillType", resp.result.BillType)

        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');

        }
      }
    );

  }

  showmodal(billcode: any, biltype: number) {
    const dialogRef = this.dialog.open(ObjectiondialogComponent,
      {
        width: "30%",
        disableClose: true
        , data: {
          // result: ''
        }
      }

    );
    dialogRef.componentInstance.BillCode = billcode;
    dialogRef.componentInstance.userType = 2;  // For 'TO' MstRole (userType) = 2 
    dialogRef.componentInstance.userId = this.UId.UserId,
    dialogRef.componentInstance.BillType = biltype;
    dialogRef.componentInstance.pageType = "1";

    // Back From Objection Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
    dialogRef.afterClosed().subscribe(res => {
      if (res === 1) {
        this.GetTreasOfficeList();
      }
    })
    // --------------------------------------------------------------------------------------------enD-------
  }
 // ---------------------------------------------------- --------------------------enD----->

    // common popup For 'reasonDialog' ------------------------------->
    //reasonDialog(field: any, title: any, btnText: any) {
      reasonDialog(billcode: any) {
        const reasondialogRef = this.dialog.open(CommonDialogComponent,
        {
          panelClass: 'dialog-w-50', autoFocus: false
          ,
          height: "auto",
          width: "30%",
          data: {
            reasonBillCode: billcode,
            //field: field,
            id: 'TOReasonDialog',
            //btnText: btnText
            // reasonBillCode:billcode
          }
        }
      );
 
       // Back From Comman Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
      reasondialogRef.afterClosed().subscribe(res => {
      if (res === 2) {
        //console.log("04-May-2023_errror message___", res.status);
        this.GetTreasOfficeList();
      }
    })
     
    
    }
// ---------------------------------------------------- --------------------------enD----->



    onLogin(user: any) {
      alert(user);
      console.log("my id", user);
  
    }

     
    viewDocumentPopup(row: any) {
      //this.loader.setLoading(true);
      this.showmodalViewDocs(row);

      this.disableElement(row);
    
    }
  
  
    
    showmodalViewDocs(row: any) {
 
      let billnoid=row.billnoid;

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
      dialogRef.componentInstance.getBase64ImgDocumentId(billnoid) ;
     
      // Back From Objection Dialogbox and refresh TreasuryOfficer List page-----------------------begiN-------
      // dialogRef.afterClosed().subscribe(res => {
      //   if (res === 1) {
      //    // this.GetTreasOfficeList();
      //   }
      // })
      // --------------------------------------------------------------------------------------------enD-------

      this.isViewDocs[row.BillCode]=true;

    }

    
  get TokenNum() { return this.TreasOfficeForm.get('TokenNum') }
  get AuditorControl() { return this.TreasOfficeForm.get('AuditorControl') }

   getServerData(page: any) {
    console.log(page)
  }
 

  disableElementArray(rowdata:any){
    rowdata.forEach((row: any) => {
      if (parseInt(row.ObjeType) >= 5000 || row.ACCTFlag=="Delay" ) {
        this.isChkDisabled[row.BillCode] =false;
        this.isButtonDisabledObj[row.BillCode] =false;
        this.isButtonDisabledRemark[row.BillCode] =false;
      }      
    });

    
  }

  disableElement(row:any): void 
  {
    if (row.ACCTFlag=="Delay" ) {
      this.isChkDisabled[row.BillCode] =false;
      this.isButtonDisabledObj[row.BillCode] =false;
      this.isButtonDisabledRemark[row.BillCode] =true;
    }

   else if (parseInt(row.ObjeType) >= 5000) {
      this.isChkDisabled[row.BillCode] =false;
      this.isButtonDisabledObj[row.BillCode] =true;
      this.isButtonDisabledRemark[row.BillCode] =false;
    }

    else
    {
      this.isChkDisabled[row.BillCode] =true;
      this.isButtonDisabledObj[row.BillCode] =true;
      this.isButtonDisabledRemark[row.BillCode] =false;
      
     
    }

    
  }


}
