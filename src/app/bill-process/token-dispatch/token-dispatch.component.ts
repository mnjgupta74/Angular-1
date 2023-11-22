import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { DispatchRecieptModel, dispatchDetailsubmitList, ecsDispatchModel, } from 'src/app/utils/Master';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import * as Val from '../../../app/utils/Validators/ValBarrel';
import * as moment from 'moment';
import { Helper } from 'src/app/utils/Helper';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { log } from 'console';

export interface dispatchRecieptList {
  BillType: string;
  Status: string;
  TokenNo: number;
  DDOCode: number;
  MajorHead: string;
  grossamt: number;
  CashAmt: number;
  ChequeNo: number;
}

@Component({
  selector: 'app-token-dispatch',
  templateUrl: './token-dispatch.component.html',
  styleUrls: ['./token-dispatch.component.scss'],
})
export class TokenDispatchComponent implements OnInit {
  dataToDispatch: MatTableDataSource<dispatchRecieptList> =new MatTableDataSource();
  tokenToDispatch: MatTableDataSource<any> = new MatTableDataSource();
  startYear = new Date().getFullYear();
  Years: any[] = [];
  rowSelected = false;
  displayedColumns = [
    'SrNo',
    'TokenNo',
    'MajorHead',
    'DDOCode',
    'BillType',
    'CashAmt',
    'grossamt',
    'ChequeNo',
    'Status',
    'Select',
  ];
  dispatchdisplayedColumns = [
    'SrNo',
    'TokenNO',
    'MajorHead',
    'DDOCode',
    'BillType',
    'CashAmt',
    'grossamt',
    'Status',
    'DispatchDate',
    'DispatchName',
    'Select'
  ];

  // Form Module
  dispatchTokenForm!: FormGroup;
  dispatchForm!: FormGroup;
  removedispatchForm!: FormGroup;
  BillEncashmentViewBillForm: any;
  loading: any;
  dataToDispatchsubmit: boolean = false;
  dataToTokensubmit: boolean = false;
  showTab_Table: boolean = false;
  showTab_Label: boolean = false;
  showDispatch_Table: boolean = false;
  remove_Dispatch: boolean = false;
  selection = new SelectionModel<any>(true, []);
  fetchedTreasRefNo!:any;


  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataToDispatch.sort = sort;
    // this.tokenToDispatch.sort = sort;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatSort) set matSort1(Sort1: MatSort) {
    this.tokenToDispatch.sort = Sort1;
  }
  // @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
  //   this.dataToDispatch.paginator = paginator;
  //   // this.tokenToDispatch.paginator = paginator;
  // }
  // @ViewChild(MatPaginator) set MatPaginator1(paginator1: MatPaginator) {
  //   // this.dataToDispatch.paginator = paginator;
  //   this.tokenToDispatch.paginator = paginator1;
  // }

  DispatchRecieptModel: DispatchRecieptModel = {
    treasurycode: this.TCode.Treasury_Code,
    fromFinYr: '',
    mode: '',
    modeValue: 0,
  };
  ecsDispatchModel: ecsDispatchModel = {
    treasurycode: this.TCode.Treasury_Code,
    tokenNo:0
  };

  dispatchDetailModal: dispatchDetailsubmitList = {
    treasurycode: this.TCode.Treasury_Code,
    userId: this.UId.UserId,
    tokennolist: [],
    fromFinYr: '',
    dispatchName: '',
    treasRefNo:0,
  };

  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []

  constructor(
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private ApiService: ApiService,
    private snackbar: SnackbarService,
    private _liveAnnouncer: LiveAnnouncer,
    public _helperMsg: Helper,
    private TCode: Helper,
    private UId: Helper,
    public dialog: MatDialog
  ) {
    // history.pushState(null, '', location.href);
    // window.onpopstate = function () {
    //   history.go(1);
    // };
  }

  ngOnInit() {
    // Dispatch Token Form
    this.dispatchTokenForm = new FormGroup({
      TreasuryControl: new FormControl({ value: this.DispatchRecieptModel.treasurycode}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      TokenNum: new FormControl('', [ Val.Required,Val.minLength(1),Val.maxLength(8),Val.cannotContainSpace,Val.Numeric,]),
      searchOn: new FormControl('', [Val.Required]),
      finYear: new FormControl('', [Val.Required]),
    });

    //Submit Dispatch Form
    this.dispatchForm = new FormGroup({
      dispatchName: new FormControl('', [Val.Required,Val.Alphabet]),
      dispatchDate: new FormControl({ value: new Date(), disabled: false }, [Val.Required,]),
    });

    //Remove Token Form
    this.removedispatchForm = new FormGroup({
      TokenNo: new FormControl('', [Val.Required,Val.minLength(1),Val.maxLength(8),Val.cannotContainSpace,Val.Numeric,]),
    });

    // Final Year field Data
    for (let i = 0; i < 2; i++) {
      this.Years.push(this.startYear - i);
    }
  // Getting Treasary  List
    this.getTreasuryList();

    this.dataToDispatch.paginator = this.paginator;
    this.tokenToDispatch.paginator = this.paginator1;
  }

        // Call Treasury List API >>>------------------->
   
        getTreasuryList() {
          this.loader.setLoading(true);
         
             this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
       
         
             let data = resp.result
             if (resp.result && resp.result.length > 0) {
               this.TreasuryListarr = resp.result
              
               this.Treasuryoptions = this.dispatchTokenForm.controls['TreasuryControl'].valueChanges.pipe(
                 startWith(''),
                 map((value: any) => {
                   return typeof value === 'string' ? value : value.treasuryCode
                 }),
                 map((treasury: any) => {
       
                   return treasury ? this._filterTreas(treasury, data) : data.slice()
                 })
               );
               const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
               this.dispatchTokenForm.patchValue({
                 TreasuryControl: treasury
               })
       
               if(this.TCode.Treasury_Code !="5000")
               {
                 this.dispatchTokenForm.controls['TreasuryControl'].disable();
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
        
        return selectedoption ? selectedoption.TreasuryName : undefined;
      }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;   
    const numRows = this.dataToDispatch.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataToDispatch.data.forEach((row) => this.selection.select(row));
  }

  //Dispatch Data Form Submission
  dispatchDataFormSubmit() {
    let tokenList: any = [];

    if (this.dispatchForm.status == 'VALID') {
      this.loader.setLoading(true);
      this.selection.selected.forEach((s) => {
        tokenList.push(s.TokenNo);
        // tokenList.push(s)
      });


      this.dispatchDetailModal.fromFinYr = this.dispatchTokenForm.value.finYear ? this.dispatchTokenForm.value.finYear : '',
      this.dispatchDetailModal.dispatchName =   this.dispatchForm.value.dispatchName,
      this.dispatchDetailModal.tokennolist = tokenList,
      this.dispatchDetailModal.treasRefNo =  this.fetchedTreasRefNo,
      

        // Dispatch Detail Api Calling
        this.ApiMethods.postresultservice( this.ApiService.dispatchDetail,this.dispatchDetailModal).subscribe( (resp:any) => {
           setTimeout(() => {
              this.loader.setLoading(false);
            }, 1000);
            if (resp.result == true) {
              this.snackbar.show( 'Dispatch Details Successfully Saved !','success')
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/TokenDispatch']);
            }); 
            } 
            else 
            {
              this.snackbar.show('No Dispatch Token !','alert' );
            }
          },
          (res:any) => {
            if (res.status != 200) {
              this.snackbar.show('Something Went Wrong! Please Try Again !','danger' );
              this.loader.setLoading(false);
            }
          }
        );
  
    } else {
      this.snackbar.show('Please Enter the missing Details! Please Try Again !','alert' );
    }
  }

  // set the date Formate
  convert(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }


  removeDispatch() {
    this.remove_Dispatch = true;
  }

  //Remove dispatch Table show
  showTable() {
    this.loader.setLoading(true);
    this.dataToTokensubmit = true;

    // At remove dispatch Date dispatch Token Api calling.
    this.ApiMethods.getservice( this.ApiService.dispatchToken +'/' + this.TCode.Treasury_Code +'/' + this.removedispatchForm.value.TokenNo ).subscribe((resp:any) => {
        setTimeout(() => {
          this.loader.setLoading(false);
        }, 1000);

        if (resp.result.length > 0) {
          this.tokenToDispatch.data = resp.result;
          this.showDispatch_Table = true;
        } else {
          this.tokenToDispatch.data = [];
          this.showDispatch_Table = false;
        }
      },
      (res:any) => {
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong! Please Try Again !','Success!' );
          this.loader.setLoading(false);
        }
      }
    );
  }

  // reset Button Event
  dispatchFormReset() {
    this.dispatchForm.controls['dispatchName'].setValue('');
    this.selection.clear();
  }

  // first Finyear with mode search Form Submission
  dispatchTokenSubmit() {
   

    if (this.dispatchTokenForm.status == 'VALID') {
      this.loader.setLoading(true);

      this.DispatchRecieptModel.fromFinYr = this.dispatchTokenForm.value.finYear.toString();
      this.DispatchRecieptModel.mode = this.dispatchTokenForm.value.searchOn;
      this.DispatchRecieptModel.modeValue = Number(this.dispatchTokenForm.value.TokenNum);

      //dispatchEntry Api CALLING
      this.ApiMethods.postresultservice( this.ApiService.dispatchEntry, this.DispatchRecieptModel ).subscribe((resp:any) => {
         

          if (resp.result.length > 0) {
            this.dataToDispatch.data = resp.result;
            setTimeout(() => {
              this.loader.setLoading(false);
              this.showTab_Table = true;
            }, 1000);


            this.fetchedTreasRefNo = resp.result[0].TREASURY_REFNO;
          // alert(this.fetchedTreasRefNo);

          } else {
            this.dataToDispatch.data = [];
           
            setTimeout(() => {
              this.loader.setLoading(false);
              this.showTab_Table = false;
            }, 1000)
          }
        },
        (res:any) => {
          if (res.status != 200) {
            this.snackbar.show('Something Went Wrong! Please Try Again !','Success!');
            this.loader.setLoading(false);
          }
        }
      );
      this.dataToDispatchsubmit = true;
    } else {
    }
  }

  hideremovedispatch() {
    this.removedispatchForm.reset();
    this.showDispatch_Table = false;
    this.remove_Dispatch = false;
    this.dataToTokensubmit = false;
  }

  // TO Load Data Sorting >>>------------------->
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  // TO Load Token Sorting >>>------------------->
  announceSortChangeToken(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  // TO Load data To Dispatch Data Searching..............
  applyFilter(filterValue: string) {
    this.dataToDispatch.filter = filterValue.trim().toLowerCase();

    if (this.dataToDispatch.paginator) {
      this.dataToDispatch.paginator.firstPage();
    }
  }

  // TO Load Token To Dispatch Data Searching..............
  applyFilterToken(filterValue: string) {
    this.tokenToDispatch.filter = filterValue.trim().toLowerCase();

    if (this.tokenToDispatch.paginator) {
      this.tokenToDispatch.paginator.firstPage();
    }
  }

  // common popup For SuccessFull Submission ------------------------------->
  showPopUp(msg: string) {
    const EncashdialogRef = this.dialog.open(CommonDialogComponent, {
      panelClass: 'dialog-w-50',
      autoFocus: false,
      height: 'auto',
      width: '50%',
      data: {
        message: msg,
        redirectPath: '/TokenDispatch',
        id: 5,
      },
    });
  }

  alphaOnly(event :any) {
       var charCode = event.which ? event.which : event.keyCode;
      // Only Numbers A-Z/a-z space
      if (charCode < 48 || charCode > 57) {
        return true;
      } else {
        
        event.preventDefault();
        return false;
      }
    };
    
// Update Token
 UpdateToken(element:any){

this.loader.setLoading(true);
this.ecsDispatchModel.tokenNo=element.TokenNO;


  //  update Token Api CALLING
   this.ApiMethods.postresultservice( this.ApiService.ecsdispatch, this.ecsDispatchModel ).subscribe((resp:any) => {
         

    if (resp.message == 'Success' && resp.result == true) {
      this.snackbar.show('Token SuccessFully Updated!','Success!');
      this.tokenToDispatch.data = this.tokenToDispatch.data.filter((ele) => {
        return JSON.stringify(ele) !== JSON.stringify(element)
      });
      setTimeout(() => {
        this.loader.setLoading(false);
    
      }, 1000);

    } else {
 
      this.snackbar.show('Something Went Wrong! Please Try Again !','Success!');
      setTimeout(() => {
        this.loader.setLoading(false);
    
      }, 1000)
    }
  },
  (res:any) => {
    if (res.status != 200) {
      this.snackbar.show('Something Went Wrong! Please Try Again !','Success!');
      this.loader.setLoading(false);
    }
  }
);

console.log(this.tokenToDispatch.data);

   } 
  get TokenNum() {
    return this.dispatchTokenForm.get('TokenNum');
  }
  get TokenNo() {
    return this.removedispatchForm.get('TokenNo');
  }
  get VoucherDate() {
    return this.dispatchTokenForm.get('VoucherDate');
  }
  get dispatchName() {
    return this.dispatchForm.get('dispatchName');
  }
}
