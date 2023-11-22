import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel'
import { Observable, map, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IGetACBillStatus } from 'src/app/utils/Master';
@Component({
  selector: 'app-ac-bill',
  templateUrl: './ac-bill.component.html',
  styleUrls: ['./ac-bill.component.scss']
})
export class AcBillComponent implements OnInit {
  ACBILLLForm:any;
  displayACBill:boolean=true;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []
  finYr: any;
  treasury: any;

 getacbillreportmodel:IGetACBillStatus= {
    fromDate: "",
    toDate: "",
    treasuryCode: this.Tcode.Treasury_Code
}
  constructor(public dialog: MatDialog,private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
      
    };
      }

  ngOnInit(): void {
    this.getTreasuryList();
    this.finYr = this.finyear_.forwardYear.toString();
    this.ACBILLLForm = new FormGroup({
      finyear: new FormControl({ value:this.finYr, disabled: true }),
      treasuryval: new FormControl({ value: '', disabled: true }, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      toDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
       fromDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
    })
  
  }

  getTreasuryList() {
    this.loader.setLoading(true);
     this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
        console.log("Auditor__res", resp);
       let data = resp.result
       if (resp.result && resp.result.length > 0) {
         this.TreasuryListarr = resp.result
         //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
         this.Treasuryoptions = this.ACBILLLForm.controls['treasuryval'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {
 
             return treasury ? this._filtertreasury(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Tcode.Treasury_Code)[0];
         this.ACBILLLForm.patchValue({
          treasuryval: treasury
          })
         }
     })
     this.loader.setLoading(false);
   }
 
   _filtertreasury(value: string, data: any) {
     return data.filter((option: any) => {
       return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
     });
   }
   displaytreasury(selectedoption: any) {
     console.log("display_fun_call aaa", selectedoption.TreasuryName);
     return selectedoption ? selectedoption.TreasuryName : undefined;
   }


   onReset(){
    window.location.reload() 
  }

  ACLIst(){
    this.loader.setLoading(true);
    let Date1 = this.ACBILLLForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    let Date2 = this.ACBILLLForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

    this.getacbillreportmodel.fromDate = fDate!;
    this.getacbillreportmodel.toDate = tDate!;
      // this.getacbillreportmodel.finYear = this.finyear_.year!;
    this.loader.setLoading(true);
    console.log("getbill__", this.getacbillreportmodel)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.acbillview, this.getacbillreportmodel).subscribe((resp:any) => {
      if (resp.result.length > 0) {
       // this.tableData = true;
       // this.tableDataSource.data = resp.result;
       // this.tableDataSource.paginator = this.paginator;
       // this.tableDataSource.sort = this.Sort;
        this.loader.setLoading(false);
        this.ACBILLLForm.disable();
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
      //  this.tableData = false;
      //  this.tableDataSource.data = []
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong! Please Try Again !', 'danger')
          this.loader.setLoading(false);
        }
      }
    );

  }
}
