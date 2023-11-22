import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { IGetAutoProcessStatus } from 'src/app/utils/Master';
import { ApiService } from 'src/app/utils/utility.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { Renderer2} from '@angular/core';

@Component({
  selector: 'app-pd-account-closing-status',
  templateUrl: './pd-account-closing-status.component.html',
  styleUrls: ['./pd-account-closing-status.component.scss']
})
export class PdAccountClosingStatusComponent implements OnInit {
  PdClosingStatusForm:any;
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = [];
  selectedOption: any;
  accountDatalist:any;
  pdAccountNoArray:any= [];
  finalPdAccountNoArray:any;
  finalPdAccountNoString:any;
  pdAccountNo = new FormControl();
  pdAccountNoControl=new FormControl();
  accountDataSource: MatTableDataSource<any> = new MatTableDataSource();
  isAccountDataSource:boolean=false;
  pdAccountNoArrayvalue:any

  constructor(private renderer: Renderer2,private TCode:Helper,private ApiService: ApiService,private loader: LoaderService,private ApiMethods:ApiMethods,private _liveAnnouncer: LiveAnnouncer,private snackbar:SnackbarService,private finyear_:Helper,private toyear_:Helper) {
    this.getTreasuryList();

   }

   GetAutoProcessStatusModal: IGetAutoProcessStatus = {
    treasuryCode: this.TCode.Treasury_Code,
    tblName : "TreasuryMst"
  }

  displayedColumns = [
    'srNo',
    'PdAccNo',
    'BudgetHead',
    'Blockamt',
    'Opening_Bal',
    'DelFlag',
    'action',
  ];

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.accountDataSource.sort = sort;
    this.accountDataSource.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator:MatPaginator){
    this.accountDataSource.paginator = paginator;
    this.accountDataSource.paginator = paginator;
  }


  ngAfterViewInit() {
    setTimeout(() => {
      var elem = this.renderer.selectRootElement('#myInput');
      this.renderer.listen(elem, "focus", () => { console.log('focus') });
      this.renderer.listen(elem, "blur", () => { console.log('blur') });
      elem.focus();
    }, 1000);
  }

  focusMyInput() {
    this.renderer.selectRootElement('#myInput').focus();
  }

  ngOnInit(): void {
    let financialYr  = this.finyear_.year.toString().substring(2,4) + this.toyear_.finyear.toString().substring(2,4);   // It Shows = 2324

    this.PdClosingStatusForm=new FormGroup({
      TreasuryControl: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      dateFrom: new FormControl({ value: new Date(), disabled: false },Validators.required),
      dateTo: new FormControl({ value: new Date(), disabled: false },Validators.required),
      pdAccountNo: new FormControl(''),
      myInput: new FormControl(''),
      selectPDAccountNo:new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      Year: new FormControl({ value:  financialYr, disabled: true }),



    });

    this.GetAutoProcessStatusModal.treasuryCode=this.TCode.Treasury_Code;

    this.SelectPdAccountData();

  }

  getTreasuryList() {
    this.loader.setLoading(true);
  //  this.ApiMethods.getservice(this.ApiService.autoProcessStatus + this.GetAutoProcessStatusModal.treasuryCode +"/"+this.GetAutoProcessStatusModal.tblName).subscribe((resp:any) => {
       this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0)
        {
           this.TreasuryListarr = resp.result
             this.Treasuryoptions = this.PdClosingStatusForm.controls['TreasuryControl'].valueChanges.pipe(
              startWith(''),
              map((value: any) => {
                return typeof value === 'string' ? value : value.treasuryCode
              }),
              map((treasury: any) => {

                return treasury ? this._filter(treasury, data) : data.slice()
              })
            );
            const treasury = this.TreasuryListarr.filter((item:any)=> item.TreasuryCode === this.TCode.Treasury_Code)[0];
            this.PdClosingStatusForm.patchValue({
            TreasuryControl: treasury
            })
            this.selectedOption = treasury;


            console.log("this.TCode.Treasury_Code__res", this.TCode.Treasury_Code);

            if(this.TCode.Treasury_Code !="5000")
            {
              this.PdClosingStatusForm.controls['TreasuryControl'].disable();
            }
      }
    })
     this.loader.setLoading(false);
 }

 _filter(value: string, data: any) {
  return data.filter((option: any) => {
    return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
  });
}

displayFn(selectedoption: any) {
  return selectedoption ? selectedoption.TreasuryName : undefined;
}

OnTreasurySelected(SelectTreasury: any) {
  this.GetAutoProcessStatusModal.treasuryCode = SelectTreasury.TreasuryCode
}

  PdClosingStatusFormReset(){
     window.location.reload();

     //this.router.navigateByUrl('/route');
   // this.PdClosingStatusForm.reset();

  }

  PdClosingStatusFormSubmit(){
    let postData={
      "treasuryCode":this.GetAutoProcessStatusModal.treasuryCode,
      "pdaACC":this.finalPdAccountNoString,
     // "pdaACC":"476",
      "fromdate" : this.PdClosingStatusForm.value.dateFrom,
  }
    this.ApiMethods.postresultservice(this.ApiService.openingBal,postData).subscribe((resp:any) => {
      this.PdClosingStatusForm.disable();
      this.accountDataSource.data=[];
      if(resp.result.length>0){
        this.isAccountDataSource=true;
        this.accountDataSource.data=resp.result;
        console.log(this.accountDataSource);
      }
    });

  }

  SelectPdAccountData(){
    this.pdAccountNoArray=[];
    this.ApiMethods.getservice(this.ApiService.budgetHeadList +'/'+ this.GetAutoProcessStatusModal.treasuryCode).subscribe((resp:any) => {
      if(resp.result.length>0){
        this.pdAccountNoArray=resp.result;

        // Call Again Search List Afger User Wise Filter ------------------------begiN-----------
        this.$pdAccountNo = this.pdAccountNo.valueChanges.pipe(
          startWith(null),
          debounceTime(200),
          switchMap((res: any) => {
            if (!res) return of(this.pdAccountNoArray);
            let fff = res;
            console.log("shyam",fff);
            return of(
               this.pdAccountNoArray.filter(
                  (x: any) => x.PDAccName.toString().toLowerCase().indexOf(fff) >= 0

               )
            );
          })
        );
      }
    });
  }

  selectionChange(option: any) {
    let value = this.pdAccountNoControl.value || [];
    if (option.selected) value.push(option.value);
    else value = value.filter((x: any) => x != option.value);
    this.pdAccountNoControl.setValue(value);
    this.pdAccountNoArrayvalue = value;
    console.log('QQQQQQQQQQQQQQQQQ_value', value);
    let names : string[] = this.pdAccountNoArrayvalue.map((a:any) => a.PdAccNo);
   this.finalPdAccountNoString = [];
    this.finalPdAccountNoString = names;

    console.log('finalPdAccountNoString==>>', this.finalPdAccountNoString);

  }



  $pdAccountNo = this.pdAccountNo.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((resp: any) => {
      if (!resp) return of(this.pdAccountNoArray);
      let fff = resp.toLowerCase();
      console.log("fff555", fff);
      return of(
        this.pdAccountNoArray.filter(
          (x: any) => x.PDAccName.toString().toLowerCase().indexOf(fff) >= 0
          //majorheadname
        )
      );
    })
  );


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  removePDAcount(row:any){
    if (window.confirm('Are you sure you want to delete this PD Account ?')) {
    let postData={
      "treasuryCode":this.GetAutoProcessStatusModal.treasuryCode,
      "pdNO":row.PdAccNo,
  }
    this.ApiMethods.postresultservice(this.ApiService.pdaccountDelete,postData).subscribe((resp:any) => {
      if (resp.result) {
        this.snackbar.show('PD Account Remove successfully ', 'success');
        this.PdClosingStatusFormSubmit();

      }else{
        this.snackbar.show('PD Account Not Changes', 'alert');
        this.PdClosingStatusFormSubmit();
      }

    });
  }

  }

  // TO Load Data Searching..............
  applyFilter(filterValue: string) {
    this.accountDataSource.filter = filterValue.trim().toLowerCase();

    if (this.accountDataSource.paginator) {
      this.accountDataSource.paginator.firstPage();
    }
  }




}
