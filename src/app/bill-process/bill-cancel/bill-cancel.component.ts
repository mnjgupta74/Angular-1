import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
 
import { LoaderService } from 'src/app/services/loaderservice';
import { IBillCancelFetch } from 'src/app/utils/Master';
import { IBillCancelSubmit } from 'src/app/utils/Master';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import * as Val from  '../../../app/utils/Validators/ValBarrel'
import { Helper } from 'src/app/utils/Helper';
 

export interface BillCancelFetchList {
  OfficeId: number;
  //DDOCode: number;
  BillType: string;
  BankBranchCode: number;
  ChequeDate: string;
  ChequeCancelDate: string;
  ChequeNo: string;
  
  TokenNo: number;
  VoucherDate: string;
  BillCode: number;
  VoucherNo:number;

  Reason: string;
 

  
}


@Component({
  selector: 'app-bill-cancel',
  templateUrl: './bill-cancel.component.html',
  styleUrls: ['./bill-cancel.component.scss']
})
export class BillCancelComponent implements OnInit {


  BillCancelFetchListdata: MatTableDataSource<BillCancelFetchList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'TokenNo',
    'OfficeId',
    'DDOCode',
    'BillType',
    'BankBranchCode',
    'ChequeDate',
    'ChequeCancelDate',
    'ChequeNo',
  ];

 // Form Module
 BillCancelForm: any;
 BillCancelFormReason: any;
 loading: any;
 reasonStatus: any;
 radioButtonvalue: any;
 finYr:any;


 showTab_Table: boolean = false
 showTab_Reason: boolean = false
 //BillCancelDetails:any =[];
 BillCancelDetails: MatTableDataSource<BillCancelFetchList> = new MatTableDataSource();
 fetchedTreasRefNo: any;
 IP:any

 mat_radio_1: boolean = true
 mat_radio_2: boolean = false
 mat_radio_3: boolean = false

 enableShowBtn:boolean = true;


 ChooseOption: any = '';
 Treasuryoptions: Observable<any[]> | undefined;
 TreasuryListarr: any[] = []


 @ViewChild(MatSort) set matSort(sort: MatSort) {
  this.BillCancelDetails.sort = sort;
  this.BillCancelDetails.sort = sort;
}
@ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
  this.BillCancelDetails.paginator = paginator;
  this.BillCancelDetails.paginator = paginator;
}


 GetBillCancelFetchListModal: IBillCancelFetch = {
  treaCode: this.TCode.Treasury_Code,
  tokenNo   : "0",
  ddoCode   :  0,
  finyear   : this.finyear_.year.toString(),
  type      : 1

}


GetBillCancelSubmitListModal: IBillCancelSubmit = {
  treasuryRefno : 0,
  assignmentId : this.asgnId.assignmentId,
  userId   : this.UId.UserId,
  reason : "",
  ipAddress : this.IPAdd.IpAddress,
}


  
  constructor(private router: Router, private ApiMethods: ApiMethods, private snackbar: SnackbarService, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private finyear_:Helper,private toyear_:Helper,private TCode:Helper,private UId:Helper,private IPAdd:Helper,private asgnId: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
    history.go(1);
    };
    this.IP= this.ApiMethods.clientIP;
  }

 
  
  ngOnInit() {
    console.log('Test Treasury Officer List');
    //Bill Cancel form
     let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324
     this.finYr = this.finyear_.year.toString()   // It Shows = 2023
     this.BillCancelForm = new FormGroup({
    //Treasury: new FormControl({ value: this.GetBillCancelFetchListModal.treaCode, disabled: true }),
    TreasuryControl: new FormControl({ value: this.GetBillCancelFetchListModal.treaCode}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    //Year: new FormControl({ value: "2324", disabled: true }),
    Year: new FormControl({ value:  financialYr, disabled: true }),
    TokenNum: new FormControl('', [Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
    //DDOCode: new FormControl('0', [Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric]),
    rblTypeCtrl: new FormControl('1', Validators.required),
    });



    this.BillCancelFormReason = new FormGroup({
      Reason: new FormControl({value:'',disabled:false}),
    });
    
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
             this.Treasuryoptions = this.BillCancelForm.controls['TreasuryControl'].valueChanges.pipe(
               startWith(''),
               map((value: any) => {
                 return typeof value === 'string' ? value : value.treasuryCode
               }),
               map((treasury: any) => {
     
                 return treasury ? this._filterTreas(treasury, data) : data.slice()
               })
             );
             const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
             this.BillCancelForm.patchValue({
               TreasuryControl: treasury
     
             })
     
             if(this.TCode.Treasury_Code !="5000")
             {
               this.BillCancelForm.controls['TreasuryControl'].disable();
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

  radioButtonGroupChange(event: any) {
    // console.log("XXXXXXXXXXXXXXX_mat_radioVal", event.value);
    if (event.value == 1) {
      this.radioButtonvalue = 1
    }
    else if (event.value == 2) {
      this.radioButtonvalue = 2
    }
    else
    {
      this.radioButtonvalue = 3
    }
  }

  
  // Call TO Load Data API >>>------------------->
  BillCancelFetch() {
   
    let tokenVal = this.BillCancelForm.controls['TokenNum'].value;
   // let ddoVal = this.BillCancelForm.controls['DDOCode'].value; 
    let ddoVal!: any;
    
    console.log("tokenVal", tokenVal);
    console.log("ddoVal", ddoVal);

    if( (tokenVal == "" || tokenVal == null) && (ddoVal == "" || ddoVal == null || ddoVal == 0)  )
    { 
        this.snackbar.show('Please Enter Token No. / DDO Code  !', 'alert');
        return;
    }

    if(this.radioButtonvalue == 2) 
    { 
      if(tokenVal=="")
      {
        this.snackbar.show('Token No. Required for PD !', 'alert');
        return;
      }
    }


    this.GetBillCancelFetchListModal.tokenNo = tokenVal;
    this.GetBillCancelFetchListModal.ddoCode = ddoVal;
    if(this.radioButtonvalue == undefined)
    {
      this.GetBillCancelFetchListModal.type =  1;

    }
    else
    {
      this.GetBillCancelFetchListModal.type =  this.radioButtonvalue;
    }
   
    console.log("tokenVal", tokenVal);
    console.log("ddoVal", ddoVal);
    console.log("mat_radioVal", this.radioButtonvalue);

    this.loader.setLoading(true);
    //this.GetOnlineBillListModal.type = 1
    console.log("Before_Calling_API_BillCancelFetchList_Result", this.GetBillCancelFetchListModal);

    //api call of Bill Cancel Fetch List
    this.ApiMethods.postresultservice(this.ApiService.BillCancelFetch, this.GetBillCancelFetchListModal).subscribe((resp:any) => {
      console.log("After_Calling_API_BillCancelFetchList_Result", resp);
      //console.log("After_Calling_API_BillCancelFetchList_Result", resp.result.length);
 
      const objLen = Object.keys(resp.result).length;
      //console.log("Object_Length__", objLen);
      if (objLen > 0) {
        
       if(resp.result[0].Status!="001") 
       {
        console.log("BillCancelFetchList__", resp.result);
        //this.BillCancelFetchListdata.data = resp.result;
        this.showTab_Table = true;
        this.showTab_Reason= true;

        // this.BillCancelDetails = resp.result;
        this.BillCancelDetails.data = resp.result;
        
        this.BillCancelForm.disable()
 
        console.log("XXXXXXXXXXXXXXXXXXXXXXXX_this.BillCancelDetails.data__", this.BillCancelDetails.data);

         this.fetchedTreasRefNo = resp.result[0].TREASURY_REFNO;

         //console.log("BBBBBBBBBBBBillcode_BillCancelFetchList__", this.fetchedTreasRefNo);

        // (<any>this.BillCancelFormReason.get('reasonStatus')).nativeElement.focus();
        // this.BillCancelFormReason.get('reasonStatus').nativeElement.focus();

        this.loader.setLoading(false);
        document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        //this.BillCancelForm.controls.rblTypeCtrl.disable();
        //this.enableShowBtn = false;

        this.BillCancelForm.disable();
  
       }

       else  
       {
        this.snackbar.show(resp.result[0].Msg, 'alert');
        this.loader.setLoading(false);
       }
       

      }
      else {
        this.snackbar.show('No Data Found !', 'alert');
        this.loader.setLoading(false);
        this.BillCancelFetchListdata.data = [];
        this.showTab_Table = false;
        this.showTab_Reason= false;
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
          this.showTab_Table = false;
          this.showTab_Reason= false;

        }
      }
    );

  }

 
  BillCancelSubmit() {
    
    this.loader.setLoading(true);
    this.GetBillCancelSubmitListModal.reason = this.BillCancelFormReason.controls['Reason'].value;
    this.GetBillCancelSubmitListModal.treasuryRefno = this.fetchedTreasRefNo;

    console.log("Before_Calling_API_BillCancelSubmitList_Result", this.fetchedTreasRefNo );

    //api call of Bill Cancel Submit remark
    this.ApiMethods.postresultservice(this.ApiService.BillCancelSubmit, this.GetBillCancelSubmitListModal).subscribe((resp:any) => {
     
    console.log("After_Calling_API_BillCancelSubmitList_Result", resp);
    this.reasonStatus = resp.result.Status; 
    
    if (this.reasonStatus  == "200" )  
    { 
      //this.snackbar.show('Bill cancel Successfully !', 'success');
      this.snackbar.show(resp.result.Msg, 'success');
      this.loader.setLoading(false);
      this.reasonStatus = ''; 
      this.showTab_Table = false;
      this.showTab_Reason= false;
      //window.location.reload();

      this.BillCancelForm.enable();
      this.BillCancelForm.controls['TokenNum'].setValue("");
      
    }

    //else if(this.reasonStatus  == 2 )
    else
    {
     console.log("XXXXXXXXXXXXXXXXX", resp.result.status );
     //this.snackbar.show('Soft copy has been generated !  Bill canot be Cancel.', 'danger');
     this.snackbar.show(resp.result.Msg, 'success');
     this.loader.setLoading(false);
    }

      if (resp.result.length > 0) {
        this.loader.setLoading(false);
        document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else {
        //this.toastrService.info('No Data Found !', 'Info!');
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');

        }
      }
    );
  }



  BillCancelShowReset() {
    window.location.reload();
  }

  BillCancelSubmitReset() {
    //window.location.reload();
    //this.BillCancelFormReason.controls['Reason'].value = "";
    this.reasonStatus = ''; 
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
    this.BillCancelFetchListdata.filter = filterValue.trim().toLowerCase();

    if (this.BillCancelFetchListdata.paginator) {
      this.BillCancelFetchListdata.paginator.firstPage();
    }
  }



  get TokenNum() { return this.BillCancelForm.get('TokenNum') }
  //get DDOCode() { return this.BillCancelForm.get('DDOCode') }
  get Reason() { return this.BillCancelForm.get('Reason') }
}
