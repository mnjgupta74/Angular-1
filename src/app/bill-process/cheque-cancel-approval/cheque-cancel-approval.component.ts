import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cheque-cancel-approval',
  templateUrl: './cheque-cancel-approval.component.html',
  styleUrls: ['./cheque-cancel-approval.component.scss']
})
export class ChequeCancelApprovalComponent implements OnInit {

 
chqueCancelApprovalForm: any;
startYear = new Date().getFullYear();
Years: any[] = [];
treasuryCode:any;

checked: any;
Ischecked: boolean = false;
page: any = 
{
  pageIndex: 0,
  pageSize: 5
};

showTab_BtnChequeCancel: boolean = false

treasRefNoList: any = []


ChooseOption: any = '';
Treasuryoptions: Observable<any[]> | undefined;
TreasuryListarr: any[] = []

fetchedTreasuryrefNo:any;


//  ChequeDataList:any = [];
ChequeCancelApprovalFetchList: MatTableDataSource<any> = new MatTableDataSource();
 userinfo: any;
 IP:any;

  showTab_Table: boolean = false

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.ChequeCancelApprovalFetchList.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.ChequeCancelApprovalFetchList.paginator = paginator;
  }
 

  displayedColumns = [
    'SrNo',
    'Chequeno',
    'bankbranchcode',
    'Tokenno',
    'Reason',
    'TransDate',
    'Pass',
  ];


  constructor( private http: HttpClient, private ApiMethods: ApiMethods, private ApiService: ApiService, private snackbar: SnackbarService, public objHelper: Helper, public loader: LoaderService,public dialog: MatDialog,  ) 
  {
    this.IP= this.ApiMethods.clientIP;
  }

  ngOnInit(): void {
    this.userinfo = this.ApiMethods.getUserInfo();
    this.chqueCancelApprovalForm=new FormGroup({
    finYear: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
    TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    });
 
    for (let i = 0; i < 2; i++) {
      this.Years.push(this.startYear - i);
    }
 
    this.getTreasuryList();

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
               this.Treasuryoptions = this.chqueCancelApprovalForm.controls['TreasuryControl'].valueChanges.pipe(
                 startWith(''),
                 map((value: any) => {
                   return typeof value === 'string' ? value : value.treasuryCode
                 }),
                 map((treasury: any) => {
       
                   return treasury ? this._filterTreas(treasury, data) : data.slice()
                 })
               );
               const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.objHelper.Treasury_Code)[0];
               this.chqueCancelApprovalForm.patchValue({
                 TreasuryControl: treasury
       
               })
        
               if(this.objHelper.Treasury_Code !="5000")
               {
                 this.chqueCancelApprovalForm.controls['TreasuryControl'].disable();
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

  //  Fetch Cheque Print Data ---------------------->
  ChequeCancelApproval_Fetch() 
  {
    this.loader.setLoading(true)

    let frYr = this.chqueCancelApprovalForm.controls['finYear'].value;
    let torYr = this.chqueCancelApprovalForm.controls['finYear'].value + 1 ;
     console.log("Test_frYr_Val",frYr);
     console.log("Test_frYr_Val",torYr);

    //let  tokenFinYear=this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);
    let  tokenFinYear = frYr.toString().substring(2,4) + torYr.toString().substring(2,4);
    console.log("Test_tokenFinYear_Val",tokenFinYear);
 
    // Calling API : checkPrintList ----------------------------------->
      this.ApiMethods.getservice(this.ApiService.ChequeCancelApprovalFetch + this.objHelper.Treasury_Code + '/' +  tokenFinYear).subscribe((resp:any) => {
      //console.log("After_API_Save_Result__", resp);
      
      // if (resp.result.length > 0) 
      //if (resp.result[0].length > 0) 
      if(resp.result[0].Status!="001") 
      {
        this.ChequeCancelApprovalFetchList.data = resp.result;
        this.showTab_Table = true;
        this.showTab_BtnChequeCancel = true;
        this.chqueCancelApprovalForm.disable();
        this.fetchedTreasuryrefNo= resp.result[0].treasury_refno;

        //console.log("data_sendbefore__", this.ChequeDataList.data);
        this.loader.setLoading(false)
      }
      else 
      {
        this.snackbar.show(resp.result[0].Msg, 'alert');
        this.showTab_Table = false;
      }
    },
    (res:any) => {
      console.log("errror message___", res.status);
      if (res.status != 200) {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger');
        this.showTab_Table = false;
        
      }
    });
 
  }
 
  applyFilter(filterValue: string) {
    this.ChequeCancelApprovalFetchList.filter = filterValue.trim().toLowerCase();
    if (this.ChequeCancelApprovalFetchList.paginator) {
      this.ChequeCancelApprovalFetchList.paginator.firstPage();
     console.log("XXXXXXXXXXXXXX__", this.ChequeCancelApprovalFetchList.filter);
    }
  }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(data: any) {
      this.Ischecked = data.checked;
      if (data.checked) 
      {
        console.log("After_Call_CheckALL_masterToggle___");
        this.ChequeCancelApprovalFetchList.data.forEach((row: any) => { row.IsChecked = true; })
      } 
      else 
      {
        this.ChequeCancelApprovalFetchList.data.forEach((row: any) => { row.IsChecked = false; })
      }
    }

    
    onChangePage(pe: PageEvent) {
      this.page = pe;
      this.Ischecked = false;
      this.masterToggle({ checked: false })
    }
    
  
Reset() 
  {
      window.location.reload();
  }

    

 ChequeCancelApproval_Submit() 
  {

    // Collect Cheque Cancel List -------------
    this.treasRefNoList = [];
    console.log(this.page)
    const dt = [...this.ChequeCancelApprovalFetchList.data];
    const data = dt.splice(this.page.pageIndex * this.page.pageSize, this.page.pageSize);
    const finalData = data.filter((x: any) => x.IsChecked === true)
    console.log(finalData)
   
    // For Store Multiple Treasury Ref No.
    finalData.forEach(s => {
      this.treasRefNoList.push(s.treasury_refno.toString())
    })

   // let ChqCaneltreasRefNoList = this.treasRefNoList;
    
    let frYr = this.chqueCancelApprovalForm.controls['finYear'].value;
    let torYr = this.chqueCancelApprovalForm.controls['finYear'].value + 1 ;
    let  tokenFinYear = frYr.toString().substring(2,4) + torYr.toString().substring(2,4);
    
    // Parameter Values -----------------
    let paraVal  = 
    {
      
      "finYear": tokenFinYear,
      "treasuryCode": this.objHelper.Treasury_Code,
      "treasuryRefno": this.treasRefNoList,
      "userId": this.objHelper.UserId,
      "assignmentId": this.objHelper.assignmentId,
      "ipAddress": "172.22.32.102"
    };

    console.log("Test_ChequeCancelApproval_Submit_paraVal",paraVal);
    //return;


     
    if (this.treasRefNoList.length > 0)   // For ForWard Process
    {
        // Calling API : Cheque Print Cancel ----------------------------------->
        this.ApiMethods.postresultservice(this.ApiService.ChequeCancelApprovalSubmit, paraVal).subscribe((resp:any) => {
          console.log("After_API_ChequePrintAction_Cancel_Result__", resp);
          if (resp.result) 
          {
            this.snackbar.show(resp.result.Msg, 'success');
            this.showTab_Table = false;
            this.loader.setLoading(false)
          }
          else 
          {
            this.snackbar.show('Cheque Cancel has not been Approval !', 'alert');
            this.showTab_Table = false;
          }
        },
        (res:any) => {
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger');
          }
        });
 
      }

      else {
        this.snackbar.show('Please Check Any One Record  !', 'alert');
      }
  }

}