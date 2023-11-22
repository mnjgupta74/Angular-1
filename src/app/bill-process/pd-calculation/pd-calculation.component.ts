import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { DatePipe, formatDate } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
//import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";

import autoTable from 'jspdf-autotable';
import { Helper } from 'src/app/utils/Helper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, interval, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'src/app/bill-process/common-dialog/common-dialog.component';
import { pdCalculationDetail} from 'src/app/Reports/Interface';

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('fromDate');
  const end = control.get('toDate');  
  return start?.value !== null && end?.value !== null && start?.value <= end?.value 
  ? null :{ dateValid:true };
    }
    

@Component({
  selector: 'app-pd-calculation',
  templateUrl: './pd-calculation.component.html',
  styleUrls: ['./pd-calculation.component.scss']
})
export class PdCalculationComponent implements OnInit {
  @ViewChild('test', { static: false }) el!: ElementRef;
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
   this.ReportData.paginator = paginator;
 }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
   this.ReportData.sort = sort;
  }
   ReportData: MatTableDataSource<any> = new MatTableDataSource();
   displayedColumns = [
         'SrNo',
         'transDate',
         'minBalance', 
         'intrestAmount', 
         
        ]

   budgetHeadlist: Observable<any[]> | undefined;
   PdAccountNolist: Observable<any[]> | undefined;
   budgetHeadData:any;
   PdAccountNoData:any;
   reportDetailsCard:boolean =false;
   datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
   picker1: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
   picker2: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
   transactionref: boolean = false;
   pdCalculationForm: any;//
   Report: any = [];
  
 
  
   // Model Track OF Reports
   pdCalculationDetail: pdCalculationDetail = {
     fromDate: '',
     toDate: '',
     treasuryCode: this.Tcode.Treasury_Code,
     pdacc:0,
     interest:0
   }
   reportDetails: any = {
    rateOfInterest: 0,
   formula:''
  };

  constructor(
    public finyear_: Helper,
    private Tcode: Helper,
    private toyear_: Helper,
    private router: Router,
    private ApiMethods: ApiMethods,
    public loader: LoaderService,
    private ApiService: ApiService,
    private snackbar: SnackbarService,
    public _helperMsg: Helper,
    public dialog: MatDialog
  ) {
    history.pushState(null, '', location.href);
  }

  max = new Date();
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = [];

  ngOnInit(): void {

 
    this.pdCalculationForm = new FormGroup(
      {
        fromDate: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.maxLength(12),
        ]),
        toDate: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.maxLength(12),
        ]),
        TreasaryCode: new FormControl(
          { value: this.pdCalculationDetail.treasuryCode },
          {
            validators: [
              this.ApiMethods.autocompleteObjectValidator(),
              Validators.required,
            ],
          }
        ),
        budgetHead: new FormControl('0', {validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required]}),
        pdAccNum: new FormControl('', [this.ApiMethods.autocompleteObjectValidator(),
          Val.maxLength(40),
          Val.SpecialChar,
          Validators.required,
        ]),
        interest:new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.maxLength(12),
          Val.Decimal
        ])
      },
      { validators: dateValidator }
    );

    this.GetBudgetHeadData();
    this.getTreasuryList();
    


  }
  // Call Treasury List API >>>------------------->

  getTreasuryList() {
    this.loader.setLoading(true);

    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe(
      (resp:any) => {
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.TreasuryListarr = resp.result;

          this.Treasuryoptions = this.pdCalculationForm.controls[
            'TreasaryCode'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.treasuryCode;
            }),
            map((treasury: any) => {
              return treasury
                ? this._filterTreas(treasury, data)
                : data.slice();
            })
          );
          const treasury = this.TreasuryListarr.filter(
            (item: any) => item.TreasuryCode === this.Tcode.Treasury_Code
          )[0];
          this.pdCalculationForm.patchValue({
            TreasaryCode: treasury,
          });

          this.pdCalculationForm.controls['TreasaryCode'].disable();
        }
      }
    );
    this.loader.setLoading(false);
  }

  _filterTreas(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayTreasFn(selectedoption: any) {
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  displayBudgetHead(selectedoption: any) {
    return selectedoption ? selectedoption.groupsubheadname : undefined;
  }

  // Getting BudgetHead Details
  GetBudgetHeadData() {
    this.ApiMethods.getservice(
      this.ApiService.fetchGroupSubHead + 3 + '/' + null
    ).subscribe((data:any) => {
      if (data.result.length > 0) {
        this.budgetHeadData = data.result;
      }
      this.budgetHeadlist = this.pdCalculationForm.controls['budgetHead'].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.groupsubheadname;
        }),
        map((groupsubheadname: any) => {
          return groupsubheadname
            ? this._filterSubHead(groupsubheadname, this.budgetHeadData)
            : this.budgetHeadData.slice();
        })
      );
    });
  }

  _filterSubHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.groupsubheadname
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  }

  onBudgetHeadSelected() {
    this.pdCalculationForm.controls['pdAccNum'].setValue('');
    let budgetHeadcode = this.pdCalculationForm.value.budgetHead.code;

    // Calling PD Account Data
    this.ApiMethods.getservice(
      this.ApiService.fetchpdaccount +
        this.pdCalculationDetail.treasuryCode +
        '/' +
        budgetHeadcode
    ).subscribe((data:any) => {
      this.PdAccountNoData = data.result;
      if (data.result.length <= 0) {
        this.snackbar.show(
          'No Pd Account Found for This Budget Head !',
          'alert'
        );
      }
      this.PdAccountNolist = this.pdCalculationForm.controls[
        'pdAccNum'
      ].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          return typeof value === 'string' ? value : value.PdAccountNoData;
        }),
        map((PdAccName: any) => {
          return PdAccName
            ? this._filterPdAccount(PdAccName, this.PdAccountNoData)
            : this.PdAccountNoData.slice();
        })
      );
    });
  }

  _filterPdAccount(value: string, data: any) {
    return data.filter((option: any) => {
      return option.PdAccName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayPdAccountNo(selectedoption: any) {
    return selectedoption ? selectedoption.PdAccName : undefined;
  }

  // post main mthod
  onShowCalculations() {
  
    if (
      this.pdCalculationForm.controls['fromDate'].value == null ||
      this.pdCalculationForm.controls['toDate'].value == null
    ) {
      this.Report = [''];
      this.transactionref = false;
      this.snackbar.show('Please Select Date !', 'alert');
    } else {
      this.loader.setLoading(true);
      let Date1 = this.pdCalculationForm.controls['fromDate'].value;
      let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

      let Date2 = this.pdCalculationForm.controls['toDate'].value;
      let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');

      this.pdCalculationDetail.fromDate = fDate!;
      this.pdCalculationDetail.toDate = tDate!;
      // this.pdCalculationDetail.budgethead =
      //   this.pdCalculationForm.controls['budgetHead'].value.code; 
      this.pdCalculationDetail.pdacc = Number(
        this.pdCalculationForm.controls['pdAccNum'].value.PdAccNo

      ); 
      this.pdCalculationDetail.interest = Number(
      
        this.pdCalculationForm.controls['interest'].value

      ); 

      this.transactionref = false;

      // current Status Api Call
      this.ApiMethods.postresultservice(
        this.ApiService.pdCalculation,
        this.pdCalculationDetail
      ).subscribe(
        (user: any) => {
          this.Report = user.result;
          if (Object.keys(this.Report).length === 0 ) {
            this.snackbar.show('No Data Found !', 'alert');
            this.loader.setLoading(false);
          } else {
            this.Report = user.result;
            this.reportDetailFunc(this.Report['dataset2']);
            if (Object.keys(user.result['dataset1']).length !== 0) {
              this.addCurrenttableData(user.result['dataset1'], this.Report);
            } else {
              this.ReportData.data = [];
            }

            this.transactionref = true;
            this.loader.setLoading(false);
          }
        },
        (res:any) => {
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show(
              'Something Went Wrong! Please Try Again',
              'danger'
            ); /// API Error Message
          }
        }
      );
    }
  }
  addCurrenttableData(data: any, all: any) {

    this.ReportData.data = data;
  }

  reportDetailFunc(data: any) {
    if (data?.length > 0) {
      let inObj = data[0];
      this.reportDetails.rateofintrest = inObj.rateofintrest;
      this.reportDetails.formula = inObj.formula;
    
      this.reportDetails.data = true;
      this.reportDetailsCard = true;
    } else {
      // this.reportDetailsCard =true
      // this.reportDetails.data = false;
    }
  }

  applyFilter(filterValue: string) {
    this.ReportData.filter = filterValue.trim().toLowerCase();
    if (this.ReportData.paginator) {
      this.ReportData.paginator.firstPage();
    }
  }

  //export to pdf
  makePdf() {
    var doc = new jsPDF('l', 'mm', 'a4');
    autoTable(doc, { html: '#test' });
    doc.text('Track Of Transaction', 130, 10);
    doc.text('https://rajkosh.rajasthan.gov.in', 10, 200);
    doc.save('sample.pdf');
  }

  onReset() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/PdCalculations']);
    });
  }

  calculateTotal() {
    return this.ReportData.data.reduce(
      (accum: any, curr: any) => accum + curr?.intrestAmount,
      0
    );
  }



  validateDates(field: string) {
    const start = this.pdCalculationForm.controls['fromDate'].value;
    const end = this.pdCalculationForm.controls['toDate'].value;
    if (start !== null && end !== null && start > end) {
      if (field == 'fromDate') {
        this.snackbar.show('start date should be less then End date!', 'alert');
        this.pdCalculationForm.controls['fromDate'].reset();
      } else {
        this.snackbar.show(
          'End date should be grater then start date!',
          'alert'
        );
        this.pdCalculationForm.controls['toDate'].reset();
      }
    }
  }

  get TreasaryCode() {
    return this.pdCalculationForm.get('TreasaryCode');
  }
  

 

}
