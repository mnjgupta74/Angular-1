import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import * as Val from '../../utils/Validators/ValBarrel'
import { BehaviorSubject, Observable, Subject, async, combineLatest, elementAt, filter, map, of, startWith, switchMap, takeLast } from 'rxjs';
import { pdCalculationDetail } from 'src/app/Reports/Interface';
import { DatePipe, Location } from '@angular/common';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MatSliderChange } from '@angular/material/slider';
import { LoaderService } from 'src/app/services/loaderservice';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/utils/Helper';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatExpansionPanel } from '@angular/material/expansion';
import { error } from 'console';
import { animate, state, style, transition, trigger } from '@angular/animations';
const repolistdata=[{
  
  
    "AMOUNT": 0,
    "CDE_REFNO": 0

}]
export type FadeState = 'visible' | 'hidden';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: [
    trigger('state', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ),
      state(
        'hidden',
        style({
          opacity: '0'
        })
      ),
      transition('* => visible', [animate('500ms ease-in')]),
      transition('visible => hidden', [animate('500ms ease-out')])
    ])
  ],
})
export class SettingComponent implements OnInit {
  RecordList = new MatTableDataSource();
  RecordData = new MatTableDataSource();
  myDialogRef!: any;
  // @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
  //   this.RecordData.paginator = paginator;

  // }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.RecordData.sort = sort;
  }
  state!: FadeState;
  displayedColumns = ['SrNo', 'CDE_REFNO', 'GrossAmt'];
  displayedColumns1 = ['FILTER ID', 'CDE_REFNO', 'AMOUNT'];
  displayedColumns4 = ['CDE_REFNO', 'AMOUNT'];
  ECSFile: any;

  maxDate = new Date();
  hideContent: boolean = false;
  EceilingForm!: FormGroup;
  RecordDateForm!: FormGroup;
  billTypeData: any[] = [];
  subBillTypeData: any[] = [];
  recSubBillTypeData: any[] = [];
  billTypeSelected: boolean = false;
  budgetHeadlist: Observable<any[]> | undefined;
  billTypelist: Observable<any[]> | undefined;
  recBudgetHeadlist: Observable<any[]> | undefined;
  recBillTypelist: Observable<any[]> | undefined;
  budgetHeadData: any = [];
  recBudgetHeadData: any = [];
  objectHeadData: any = [];
  objectHeadOptions: Observable<any[]> | undefined;
  recObjectHeadOptions: Observable<any[]> | undefined;
  showBudgetHead: boolean = false;
  showObjectHead: boolean = false;
  showBillType: boolean = false;
  showPdAccount: boolean = false;
  caplistData: any;
  totalAmount: any = 0;
  countToken: any = 0;
  reportDetails: any;
  userinfo: any;
  amountPercent: any;
  PdAccountNoData: any[] = [];
  PdAccountNolist: Observable<any[]> | undefined;
  pdCalculationDetail: pdCalculationDetail = {
    fromDate: '',
    toDate: '',
    treasuryCode: '',
    pdacc: 0,
    interest: 0,
  };
  cdRefList: any = [];
  autoTicks = true;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  submitted: boolean = false;
  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  onSliderChange(event: MatSliderChange) {
    console.log(event.value);
  }
  caplistModel: any = {
    treasurycode: this.Tcode.Treasury_Code,
    fromDate: null,
    toDate: null,
    billType: 0,
    // limitAmount: 50000,
    grossAmt: 0,
    budgetHead: null,
    objectHead: null,
    billSubType: null,
    type: null,
    startAmt: 0,
    endAmt: 0,
    perAmt: 100,
  };
  percentWiseData = new MatTableDataSource();
  rangerWiseData = new MatTableDataSource();
  displayedColumns2 = [
    'Bill Type/BILL SUBTYPE/Object Head/Budget Head/PD AccountNo',
    // "BILL SUBTYPE",
    'FILTER ID',
    'Bill Count',
    'AMOUNT PERCENT',
    // "CDE REFNO",
    'AMOUNT TOTAL',
    // "AMOUNT",
  ];
  displayedColumns3 = [
    'Bill Type/BILL SUBTYPE/Object Head/Budget Head/PD AccountNo',
    // "BILL SUBTYPE",
    'FILTER ID',
    'Bill Count',
    'Min. Amount',
    'Max. Amount',
    // "CDE REFNO",
    'AMOUNT TOTAL',
    // "AMOUNT",
  ];
  uploadedMedia: Array<any> = [];
  @ViewChild('myTemplate')
  myTemplate!: TemplateRef<unknown>;

  @ViewChild('panel1') firstPanel!: MatExpansionPanel;

  currentFinancialDate:any
  todayDate =new Date()
  constructor(
    private fb: FormBuilder,
    private ApiMethods: ApiMethods,
    private ApiService: ApiService,
    public loader: LoaderService,
    private snackbar: SnackbarService,
    private router: Router,
    private http: HttpClient,
    private Tcode: Helper,
    private location: Location,
    public dialog: MatDialog
  ) {
  this.currentFinancialDate= this.getCurrentFinancialYear()
  }
  ishidden:boolean = false;
  sh:any
  favoriteSeason='1';
  radioButtonChanged(event:any){
    let radioValue = event
     if(radioValue ==1){
      this.EceilingForm.controls['amountPercentage'].setValue('');
      this.amountPercent=null;
       this.ishidden = true;
     }else{
      this.EceilingForm.controls['startAmountRange'].setValue('');
      this.EceilingForm.controls['amountRange'].setValue('');
       this.ishidden = false;
     }
  }
  ngOnInit(): void {
   
    // String containing multiple spaces
    let str = '       Welcome    to   Geeks    for   Geeks   ';
    console.log(str);
    // Remove multiple spaces with single space
    let newStr = str.replace(/\s+/g, ' ');

    // Display the result
    console.log(newStr);
    
    this.userinfo = this.ApiMethods.getUserInfo();
    // The Eceiling From
    this.EceilingForm = this.fb.group({
      permission: [null, Validators.required],
      EceilingType: [''],
      Manager: [''],
      billType: ['', Validators.required],
      subBillType: [''],
      fromDate: new FormControl(this.currentFinancialDate),
      toDate: new FormControl(new Date, [
        this.ApiMethods.autocompleteObjectValidator(),
        Validators.required,
      ]),

      createBy: [''],
      startAmountRange: ['', [Val.Numeric, Val.Decimal]],
      amountRange: ['', [Val.Numeric, Val.Decimal]],
      amountPercentage: [''],
      budgetHead: [
        '',
        [this.ApiMethods.autocompleteObjectValidator(), Validators.required],
      ],
      objectHead: [
        '',
        [this.ApiMethods.autocompleteObjectValidator(), Validators.required],
      ],
      pdAccNo: [
        '',
        [this.ApiMethods.autocompleteObjectValidator(), Validators.required],
      ],
    });

    //record Date Form
    this.RecordDateForm = this.fb.group({
      recordDate: new FormControl('', Validators.required),
      recBillType: [''],
      recSubBillType: [''],
      recBudgetHead: [''],
      recObjectHead: [''],
    });
    this.EceilingForm.controls['budgetHead'].disable();
    this.EceilingForm.controls['objectHead'].disable();
    this.EceilingForm.controls['billType'].disable();
    this.EceilingForm.controls['subBillType'].disable();
    this.EceilingForm.controls['pdAccNo'].disable();
    this.EceilingForm.controls['fromDate'].disable();
    this.EceilingForm.controls['startAmountRange'].valueChanges
      .pipe()
      .subscribe((fromRange) => {
        if (
          this.EceilingForm.controls['amountRange'].value !== '' &&
          Number(this.EceilingForm.controls['amountRange'].value) <
            Number(fromRange)
        ) {
          this.EceilingForm.controls['startAmountRange'].setValue(
            fromRange.slice(0, fromRange.length - 1)
          );

          this.snackbar.show(
            'From range value should be less than To Amount range value',
            'alert'
          );
        }
      });
    this.EceilingForm.controls['amountRange'].valueChanges
      .pipe()
      .subscribe((ToRange) => {
        if (
          this.EceilingForm.controls['startAmountRange'].value !== '' &&
          ToRange !== '' &&
          Number(this.EceilingForm.controls['startAmountRange'].value) >
            Number(ToRange)
        ) {
          // this.EceilingForm.controls['startAmountRange'].setValue(ToRange.slice(0,ToRange.length-1))
          this.EceilingForm.controls['amountRange'].setErrors({
            incorrect: true,
          });
          // this.snackbar.show('start range value should be less than To amount range value','alert')
        } else if (
          this.EceilingForm.controls['startAmountRange'].value !== '' &&
          ToRange !== '' &&
          Number(this.EceilingForm.controls['startAmountRange'].value) <
            Number(ToRange)
        ) {
          this.EceilingForm.controls['amountRange'].setErrors(null);
        } else if (ToRange == '') {
        }
      });
  
    this.GetBudgetHeadData();
    this.getObjectHeadData();
    this.getBilltypeList();
    this.onBudgetHeadSelected();
  }
  navgateHistoryBack() {
    history.back();
  }
  loctionBack() {
    this.location.back();
  }


  getCurrentFinancialYear() {
    var fiscalyear = "";
    var today = new Date();
    console.log('today',today);
    
    let currDate:any
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
      currDate=new Date('04/01/'+ (today.getFullYear() - 1))
    } else {
      fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
      currDate=new Date('04/01/'+ (today.getFullYear() ))
    }
    console.log(currDate);
    
    return currDate
  }
  getBilltypeList() {
    this.ApiMethods.getservice(
      this.ApiService.BillTypeList + '/' + 1
    ).subscribe(
      (data:any) => {
        this.loader.setLoading(false);
        if (data.result.length > 0) {
          this.billTypeData = data.result;
          this.billTypelist = this.EceilingForm.controls[
            'billType'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.BillType;
            }),
            map((BillType: any) => {
              return BillType
                ? this.filterBillType(BillType, this.billTypeData)
                : this.billTypeData.slice();
            })
          );
          this.recBillTypelist = this.RecordDateForm.controls[
            'recBillType'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.BillType;
            }),
            map((BillType: any) => {
              return BillType
                ? this.filterBillType(BillType, this.billTypeData)
                : this.billTypeData.slice();
            })
          );
        }
      },
      (error:any) => {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong ', 'danger');
      }
    );
  }

  filterBillType(value: string, data: any) {
    return data.filter((option: any) => {
      return option.BillType.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayBillType(selectedoption: any) {
    return selectedoption ? selectedoption.BillType : undefined;
  }
  showfields() {
    let permission = this.EceilingForm.value.permission;
    if (permission) {
      this.billTypeSelected = true;
    }
  }
  onTypeSelected() {
    let selectedTypes = this.EceilingForm.value.EceilingType;

    this.showBillType = selectedTypes?.includes('1');


    if (this.showBillType) {
      this.EceilingForm.controls['billType'].enable();
      this.EceilingForm.controls['subBillType'].enable();
    } else {
      this.EceilingForm.controls['billType'].disable();
      this.EceilingForm.controls['subBillType'].disable();
      // this.EceilingForm.controls['billType'].disable();
      // this.EceilingForm.controls['subBillType'].disable();
    }
    this.showBudgetHead = selectedTypes?.includes('2');
    if (this.showBudgetHead) {
      this.EceilingForm.controls['budgetHead'].enable();
    } else {
      // if (this.showPdAccount && selectedTypes?.includes('4')) {
      //   selectedTypes.pop('4');
      //   console.log(selectedTypes);
      //   this.showPdAccount = false;
      //   this.PdAccountNoData = [];
      //   this.EceilingForm.controls['EceilingType'].setValue(selectedTypes);
      //   // this.onTypeSelected()
      // }
      // this.EceilingForm.controls['pdAccNo'].disable();
      // this.EceilingForm.controls['budgetHead'].reset()
      this.EceilingForm.controls['budgetHead'].disable();
    }
    this.showObjectHead = selectedTypes?.includes('3');
    if (this.showObjectHead) {
      this.EceilingForm.controls['objectHead'].enable();
    } else {
      // this.EceilingForm.controls['objectHead'].reset();
      this.EceilingForm.controls['objectHead'].disable();
    }
    this.showPdAccount = selectedTypes?.includes('4');
    if (this.showPdAccount) {
      // if (!selectedTypes?.includes('2')) {
      //   selectedTypes.push('2');
      //   console.log(selectedTypes);

      //   this.EceilingForm.controls['EceilingType'].setValue(selectedTypes);
      //   this.EceilingForm.controls['budgetHead'].enable();
      //   this.showBudgetHead = selectedTypes?.includes('2');
      // }
      this.EceilingForm.controls['pdAccNo'].enable();
    } else {
      // this.EceilingForm.controls['pdAccNo'].reset()
      this.EceilingForm.controls['pdAccNo'].disable();
    }
  }

  onBillTypeSelected(form?: any) {
    let choosedBillType: any = {};
    if (form == 'recordDate') {
      this.recSubBillTypeData = [];
      this.RecordDateForm.controls['recSubBillType'].setValue('');
      choosedBillType = this.RecordDateForm.value.recBillType;
    } else {
      this.subBillTypeData = [];
      this.EceilingForm.controls['subBillType'].setValue('');
      choosedBillType = this.EceilingForm.value.billType;
    }

    if (choosedBillType?.Ncode) {
      this.loader.setLoading(true);
      this.ApiMethods.getservice(
        this.ApiService.BillSubType + '/' + choosedBillType.Ncode + '/' + 0
      ).subscribe(
        (data:any) => {
          if (form == 'recordDate') {
            this.recSubBillTypeData = data.result;
          } else {
            this.subBillTypeData = data.result;
          }
          this.loader.setLoading(false);
        },
        (error:any) => {
          this.snackbar.show('Something Went Wrong ', 'danger');
          this.loader.setLoading(false);
        }
      );
    }
  }

  // Getting BudgetHead Details
  GetBudgetHeadData() {
    this.loader.setLoading(true);
    this.ApiMethods.getservice(
      this.ApiService.fetchGroupSubHead + 6 + '/' + 0
    ).subscribe(
      (data:any) => {
        this.loader.setLoading(false);
        if (data.result.length > 0) {
          this.budgetHeadData = data.result;
          this.recBudgetHeadData = data.result;
          // this.fulldata =  this.budgetHeadData ;
          let a = [...this.budgetHeadData];
          while (a.length) {
            this.fulldata.push(a.splice(0, 10));
            // console.log(a.splice(0,10));
          }

          let arr = [];

          let len =
            this.budgetHeadData.length < 1000
              ? this.budgetHeadData.length
              : Math.round(this.budgetHeadData.length / 10);

          for (let index = 0; index < len; index++) {
            const element = this.budgetHeadData[index];
            arr.push(element);
          }

          this.budgetHeadlist = of(arr);
          this.recBudgetHeadlist = of(arr);
        }
      },
      (error:any) => {
        this.loader.setLoading(false);
        this.snackbar.show('Something Went Wrong ', 'danger');
      }
    );
  }
  fulldata: any[] = [];

  applyFilter(value: string, form?: any) {
    // this.fulldata.filter = filterValue.trim().toLowerCase().includes(filterValue.toLowerCase());;
    let arr = [];

    let len =
      this.budgetHeadData.length < 1000
        ? this.budgetHeadData.length
        : Math.round(this.budgetHeadData.length / 10);
    console.log(len);

    if (value == null || value == '') {
      for (let index = 0; index < len; index++) {
        const element = this.budgetHeadData[index];
        arr.push(element);
      }
      if (form == 'recorddate') {
        this.recBudgetHeadlist = of(arr);
      } else {
        let selectedTypes = this.EceilingForm.value.EceilingType;
        if (selectedTypes?.includes('4')) {
          this.PdAccountNolist = of([]);
          this.EceilingForm.controls['pdAccNo'].reset();
        }
        this.budgetHeadlist = of(arr);
      }
    } else {
      if (form == 'recorddate') {
        this.recBudgetHeadlist = of(
          this.recBudgetHeadData.filter((option: any) => {
            return option.groupsubheadname
              .toLowerCase()
              .includes(value.toLowerCase());
          })
        );
      } else {
        this.budgetHeadlist = of(
          this.budgetHeadData.filter((option: any) => {
            return option.groupsubheadname
              .toLowerCase()
              .includes(value.toLowerCase());
          })
        );
      }
    }
    //  this.fulldata =this.budgetHeadData.filter((option: any) => {
    //   return option.groupsubheadname
    //     .toLowerCase()
    //     .includes(filterValue.toLowerCase());
    // });
    // if (this.dataToDispatch.paginator) {
    //   this.dataToDispatch.paginator.firstPage();
    // }
  }
  _filterSubHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.groupsubheadname
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  }

  displayBudgetHead(selectedoption: any) {
    return selectedoption ? selectedoption.groupsubheadname : undefined;
  }

  getObjectHeadData() {
    this.ApiMethods.getservice(
      `${this.ApiService.trgGetObjectHeadCodelist}/1/1`
    ).subscribe(
      (response:any) => {
        if (response.result.length > 0) {
          this.objectHeadData = response.result;
          if( this.objectHeadData ){

          }
          this.objectHeadOptions = this.EceilingForm.controls[
            'objectHead'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.objectHeadData;
            }),
            map((objectHeadCodeName: any) => {
              return objectHeadCodeName
                ? this._objectFilter(objectHeadCodeName, response.result)
                :  this.objectHeadData .slice();
            })
          );
          this.recObjectHeadOptions = this.RecordDateForm.controls[
            'recObjectHead'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value.objectHeadData;
            }),
            map((objectHeadCodeName: any) => {
              return objectHeadCodeName
                ? this._objectFilter(objectHeadCodeName, response.result)
                : response.result.slice();
            })
          );
        }
        // this.loader.setLoading(false);
      },
      (res:any) => {
        if (res.status != 200) {
          this.snackbar.show('Something Went Wrong ', 'danger');
          // this.loader.setLoading(false);
        }
      }
    );
  }

  _objectFilter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.objectHeadCodeName
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  }

  objectDisplayFn(selectedoption: any) {
    return selectedoption ? selectedoption.objectHeadCodeName : undefined;
  }
  chechPdAccountList() {
    if (this.PdAccountNoData && this.PdAccountNoData.length > 0) {
    } else if (
      this.EceilingForm.value.budgetHead &&
      this.EceilingForm.value.budgetHead.code
    ) {
      this.snackbar.show(
        'No Pd ACCOUNT Available for Selected Budget Head Please Select another Bughet Head',
        'alert'
      );
    } else {
      this.snackbar.show('Please Select a Bughet Head', 'alert');
    }
  }
  onBudgetHeadSelected(event?: any) {
    // console.log(event);
    // console.log(event.source.value);
    // http://172.22.32.117:9095/rajkosh/3.0/mst/get/allPDaccount/List
    // this.EceilingForm.controls['budgetHead'].patchValue(event.source.value);
    // this.loader.setLoading(true);
    // this.EceilingForm.controls['pdAccNo'].reset();
    // // console.log(this.EceilingForm.value.budgetHead);

    // let budgetHeadcode = this.EceilingForm.value.budgetHead.code;
    setTimeout(() => {
      this.ApiMethods.getservice(
        this.ApiService.allPDaccountList
      ).subscribe(
        (data:any) => {
          this.PdAccountNoData = data.result;
          // if(data.result && data.result.length >0){
          this.PdAccountNoData = data.result;
          this.loader.setLoading(false);
          this.PdAccountNolist = this.EceilingForm.controls[
            'pdAccNo'
          ].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
              return typeof value === 'string' ? value : value?.PdAccountNoData;
            }),
            map((PdAccName: any) => {
              return PdAccName
                ? this._filterPdAccount(PdAccName, this.PdAccountNoData)
                : this.PdAccountNoData.slice();
            })
          );
          // }else{
          if (data.result?.length <= 0) {
            let selectedTypes = this.EceilingForm.value.EceilingType;
            if (selectedTypes?.includes('4')) {
              this.snackbar.show(
                'NO PD Account Found for the Selected Budget Head.',
                'danger'
              );
            }
          }
        },
        (error:any) => {
          this.loader.setLoading(false);
          if (error.status != 200) {
            this.snackbar.show('Something Went Wrong ', 'danger');
            // this.loader.setLoading(false);
          }
        }
      );
    }, 1000);
  }

  _filterPdAccount(value: string, data: any) {
    return data.filter((option: any) => {
      return option.PDAccName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayPdAccountNo(selectedoption: any) {
    return selectedoption ? selectedoption.PDAccName : undefined;
  }

  myMethod() {
    if (
      this.EceilingForm.controls['amountPercentage'].value &&
      this.EceilingForm.controls['amountPercentage'].value !== ''
    ) {
      this.EceilingForm.controls['amountPercentage'].setValue(
        this.EceilingForm.controls['amountPercentage'].value?.replace('%', '')
      );
    }
  }

  handleChange(input: any) {
    let per = input?.target?.value?.replace('%', '');
    if (Number(per) > 0 && Number(per) <= 100) {
      return true;
    } else {
      this.EceilingForm.controls['amountPercentage'].setValue(
        this.EceilingForm.controls['amountPercentage'].value.slice(0, 2)
      );
      this.EceilingForm.controls['amountPercentage'].setErrors({
        incorrect: true,
      });
      return false;
    }
  }
  sign(input: any) {
    let per = input?.target?.value?.replace('%', '');
    if (per !== '') {
      this.amountPercent = Number(per);
      this.EceilingForm.controls['amountPercentage'].setValue(per + '%');
    } else {
      this.amountPercent = 0;
      this.EceilingForm.controls['amountPercentage'].setErrors(null);
    }

    return true;
  }

  gridsize: any = '0';

  showAmtTypeRow() {
    let Date1 = this.EceilingForm.controls['fromDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');

    let Date2 = this.EceilingForm.controls['toDate'].value;
    let tDate = new DatePipe('en-US').transform(Date2, 'yyyy-MM-dd');
    let selectedTypes = this.EceilingForm.value.EceilingType;
    this.caplistModel.fromDate = fDate! ? fDate! : null;
    this.caplistModel.toDate = tDate! ? tDate! : null;
    this.caplistModel.grossAmt = this.EceilingForm.controls['amountRange'].value
      ? Number(this.EceilingForm.controls['amountRange'].value)
      : 0;
    this.caplistModel.type = Number(this.EceilingForm.value.permission);
    this.caplistModel.billType = this.EceilingForm.value.billType?.Ncode
      ? this.EceilingForm.value.billType?.Ncode
      : 0;
    this.caplistModel.billSubType = this.EceilingForm.value.subBillType
      ?.NSubCode
      ? this.EceilingForm.value.subBillType.NSubCode
      : 0;
    if (selectedTypes.includes('2')) {
      this.caplistModel.budgetHead = this.EceilingForm.value.budgetHead?.code
        ? this.EceilingForm.value.budgetHead.code
        : null;
    } else {
      this.caplistModel.budgetHead = null;
    }
    if (selectedTypes.includes('3')) {
      this.caplistModel.objectHead = this.EceilingForm.value.objectHead
        .objectHeadCode
        ? this.EceilingForm.value.objectHead.objectHeadCode
        : null;
    } else {
      this.caplistModel.objectHead = null;
    }
    if (selectedTypes.includes('4')) {
      this.caplistModel.pdAccNo = this.EceilingForm.value.pdAccNo.PdAccNo
        ? this.EceilingForm.value.pdAccNo.PdAccNo
        : null;
    } else {
      this.caplistModel.pdAccNo = null;
    }
    this.caplistModel.startAmt = this.EceilingForm.controls['startAmountRange']
      .value
      ? Number(this.EceilingForm.controls['startAmountRange'].value)
      : 0;
    this.caplistModel.endAmt = this.EceilingForm.controls['amountRange'].value
      ? Number(this.EceilingForm.controls['amountRange'].value)
      : 0;
      if(this.caplistModel.startAmt ||   this.caplistModel.endAmt ){
        this.caplistModel.perAmt = 0;
      }else{
        this.caplistModel.perAmt = this.amountPercent ? this.amountPercent : 100;
      }
 
    this.loader.setLoading(true);

    this.ApiMethods.postresultservice(
      this.ApiService.getCappingList,
      this.caplistModel
    ).subscribe(
      (response:any) => {
        this.caplistData = response.result;

        if (this.caplistData['OUT_STR1']) {
          this.gridsize = 0;
          this.updateSetting(0);
          this.RecordData.data = this.caplistData['OUT_STR1'];
        } else {
          this.totalAmount = 0;
          this.countToken = 0;
          this.gridsize = 0;
        }
        if (
          response.result['OUT_STR2'] &&
          response.result['OUT_STR2'][0] &&
          response.result['OUT_STR2'][0].TotalToken > 0
        ) {
          this.reportDetails = response.result['OUT_STR2'][0];
        } else {
          this.gridsize = 0;
          this.totalAmount = 0;
          this.countToken = 0;
          this.value = 0;
          this.reportDetails = undefined;
          this.snackbar.show('No DATA Found', 'alert');
        }

        this.loader.setLoading(false);
      },
      (res:any) => {
        if (res.status != 200) {
          this.snackbar.show(
            'Something Went Wrong ! Please Try Again',
            'danger'
          );
          this.loader.setLoading(false);
        }
      }
    );
    this.hideContent = !this.hideContent;
  }

  updateSetting(value: any) {
    this.gridsize = value;
    this.cdRefList = [];
    if (this.caplistData['OUT_STR1']) {
      let data = this.caplistData['OUT_STR1'];
      let TotalList = this.caplistData['OUT_STR2'][0].TotalToken;
      let per = (TotalList * this.gridsize) / 100;

      let length = Math.round(per);

      let elementTot = 0;
      for (let index = 0; index < length; index++) {
        elementTot = elementTot + data[index]['GrossAmt'];
        this.cdRefList.push(data[index]['CDE_REFNO']);
      }
      this.countToken = length;
      this.submitted = this.countToken > 0 ? true : false;

      this.totalAmount = elementTot;
    }
  }
  setCappingList() {
    let selectedTypes = this.EceilingForm.value.EceilingType;
    this.loader.setLoading(true);
    let cap = { ...this.caplistModel };
    cap.amountTotal = this.totalAmount;
    cap.rowCount = this.countToken;
    cap.makerId = this.userinfo.userId;
    cap.cdeRefNo = this.cdRefList;
    cap.billPercent = this.gridsize;
    this.ApiMethods.postresultservice(
      this.ApiService.setCappingList,
      cap
    ).subscribe(
      (response:any) => {
        if (
          response.result &&
          response.message == 'Success' &&
          response.result.status == 'Y'
        ) {
          this.snackbar.show('Updated Successfully  ', 'alert');
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/eCeiling']);
            });
          this.loader.setLoading(false);
        } else {
          this.snackbar.show(
           'Please try again',
            'alert'
          );
        }

        this.loader.setLoading(false);
      },
      (res:any) => {
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show(
            'Something Went Wrong ! Please Try Again',
            'danger'
          );
        }
      }
    );
  }

  calculateTotal() {
    return this.RecordData.data.reduce(
      (accum: any, curr: any) => accum + curr?.GrossAmt,
      0
    );
  }
  onReset() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/eCeiling']);
    });
  }
  validateDates(field: string) {
    const start = this.EceilingForm.controls['fromDate'].value;
    const end = this.EceilingForm.controls['toDate'].value;
    if (
      start !== null &&
      end !== null &&
      start !== '' &&
      end !== '' &&
      start > end
    ) {
      if (field == 'fromDate') {
        this.snackbar.show('start date should be less then End date!', 'alert');
        this.EceilingForm.controls['fromDate'].reset();
      } else {
        this.snackbar.show(
          'End date should be grater then start date!',
          'alert'
        );
        this.EceilingForm.controls['toDate'].reset();
      }
    }
  }
 array=new MatTableDataSource()
 change:BehaviorSubject<any> =  new BehaviorSubject(true);
 val=true
  getRecords() {
    console.log(this.RecordDateForm.value);
    
    if (this.RecordDateForm.valid) {
      this.loader.setLoading(true);
     
      let Date1 = this.RecordDateForm.controls['recordDate'].value;
      let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
      let obj = {
        date: fDate,
        billType: this.RecordDateForm.controls['recBillType'].value.Ncode!=='' ?this.RecordDateForm.controls['recBillType'].value.Ncode:null,
        billSubType:this.RecordDateForm.controls['recSubBillType'].value.NSubCode!==''?this.RecordDateForm.controls['recSubBillType'].value.NSubCode:null,
        budgetHead:this.RecordDateForm.controls['recBudgetHead'].value.code?this.RecordDateForm.controls['recBudgetHead'].value.code:null,
        objectHead: this.RecordDateForm.controls['recObjectHead'].value.objectHeadCode?this.RecordDateForm.controls['recObjectHead'].value.objectHeadCode:null,
      };
      this.ApiMethods.postresultservice(
        `${this.ApiService.recordList}`,obj
      ).subscribe(
        (response:any) => {
          let arr: any[] = [];
          this.RecordList.data = [];
          this.rangerWiseData.data = [];
          this.percentWiseData.data = [];
          this.change.next(!this.val)
          setTimeout(()=>{
            if (response.result ) {
              this.RecordList.data = response?.result?.outStr;
              this.refNoWiseData.data =  response?.result?.outStr1?.FILE;
           
              this.extractTableData(response?.result?.outStr);
              // response?.result?.outStr?.forEach((element: any) => {
              //   arr.push({
              //     AMOUNT: element.AMOUNT,
              //     CDE_REFNO: element.CDE_REFNO,
              //     'FILTER ID': element.FILTER_LOG_ID,
              //   });
              // });
              // console.log(   this.RecordList.data );
              
              // this.RecordList.data = arr;
              this.array.data=arr
              this.loader.setLoading(false);
            } else {
              this.RecordList.data = [];
              this.rangerWiseData.data = [];
              this.percentWiseData.data = [];
              this.loader.setLoading(false);
              this.snackbar.show('No Record Found on this Date!', 'alert');
            }
          })
       
        },
        (res:any) => {
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show(
              'Something Went Wrong ! Please Try Again',
              'danger'
            );
          }
        }
      );
    }
  }

  // Total Bill Amount
  extractTableData(data: any) {
    let percentageWise: any[] = [];
    let rangerWise: any[] = [];

    data.forEach((item: any) => {
      if (
        item?.SETTING?.['END_AMOUNT'] !== 0 ||
        item?.SETTING?.['START_AMOUNT'] !== 0
      ) {
        let obj = {
          'CDE REFNO': item['CDE_REFNO'],
          AMOUNT: item['AMOUNT'],
          FILTER_LOG_ID: item['FILTER_LOG_ID'],
          'Bill Type/BILL SUBTYPE/Object Head/Budget Head/PD AccountNo': `${
            item.SETTING['BILL_TYPE'] ? item.SETTING['BILL_TYPE'] : ''
          }${
            item.SETTING['BILL_SUBTYPE']
              ? '/' + item.SETTING['BILL_SUBTYPE']
              : ''
          }${
            item.SETTING['OBJECT_HEAD']
              ? '/' + item.SETTING['OBJECT_HEAD']
              : ''
        } ${
            item.SETTING['BDGET_HEAD'] ? '/' + item.SETTING['BDGET_HEAD'] : ''
          }${
            item.SETTING['PD_ACCOUNT'] ? '/' + item.SETTING['PD_ACCOUNT'] : ''
          } `,
          'Max. Amount': item.SETTING['END_AMOUNT']
            ? item.SETTING['END_AMOUNT']
            : null,
          'Min. Amount': item.SETTING['START_AMOUNT']
            ? item.SETTING['START_AMOUNT']
            : null,
          'AMOUNT TOTAL': item.SETTING['AMOUNT_TOTAL']
            ? item.SETTING['AMOUNT_TOTAL']
            : null,
        };

        rangerWise.push(obj);
      } else {
        let obj = {
          'CDE REFNO': item['CDE_REFNO'],
          AMOUNT: item['AMOUNT'],
          FILTER_LOG_ID: item['FILTER_LOG_ID'],
          'Bill Type/BILL SUBTYPE/Object Head/Budget Head/PD AccountNo': `${
            item?.SETTING['BILL_TYPE'] ? item?.SETTING['BILL_TYPE'] : ''
          } ${
            item?.SETTING['BILL_SUBTYPE']
              ? '/' + item?.SETTING['BILL_SUBTYPE']
              : ''
          }${
            item?.SETTING['OBJECT_HEAD']
              ? '/' + item?.SETTING['OBJECT_HEAD']
              : ''
          } ${
            item?.SETTING['BDGET_HEAD'] ? '/' + item?.SETTING['BDGET_HEAD'] : ''
          }${
            item?.SETTING['PD_ACCOUNT'] ? '/' + item?.SETTING['PD_ACCOUNT'] : ''
          } `,
          'AMOUNT PERCENT': item?.SETTING['AMOUNT_PERCENT']
            ? item?.SETTING['AMOUNT_PERCENT']
            : null,
          'AMOUNT TOTAL': item?.SETTING['AMOUNT_TOTAL']
            ? item?.SETTING['AMOUNT_TOTAL']
            : null,
        };
        percentageWise.push(obj);
      }
    });
    this.rangerWiseData.data = this.filterByLogID(rangerWise, 'range');
    this.percentWiseData.data = this.filterByLogID(percentageWise, 'percent');
  }
  filterByLogID(arr: any, type: string) {
    let rangObj: any = {};
    arr.forEach((item: any) => {
      if (rangObj[item['FILTER_LOG_ID']]) {
        rangObj[item['FILTER_LOG_ID']]['Bill Count'] =
          rangObj[item['FILTER_LOG_ID']]['Bill Count'] + 1;
      } else {
        rangObj[item['FILTER_LOG_ID']] = {
          'CDE REFNO': item['CDE_REFNO'],
          // "AMOUNT":item["AMOUNT"],
          'FILTER ID': item['FILTER_LOG_ID'],
          'BILL SUBTYPE': item['BILL SUBTYPE'] ? item['BILL SUBTYPE'] : 'All',
          'Bill Type/BILL SUBTYPE/Object Head/Budget Head/PD AccountNo':
            item['Bill Type/BILL SUBTYPE/Object Head/Budget Head/PD AccountNo'],
          'AMOUNT PERCENT': item['AMOUNT PERCENT']
            ? item['AMOUNT PERCENT']
            : null,
          ...(type == 'range' && {
            'Max. Amount': item['Max. Amount'] ? item['Max. Amount'] : null,
          }),
          ...(type == 'range' && {
            'Min. Amount': item['Min. Amount'] ? item['Min. Amount'] : null,
          }),

          'AMOUNT TOTAL': item['AMOUNT TOTAL'] ? item['AMOUNT TOTAL'] : null,
          'Bill Count': 1,
        };
      }
    });
    let finalArr = [];
    for (let key in rangObj) {
      finalArr.push(rangObj[key]);
    }
    return finalArr;
  }

  content: any;
  file: any;
  uploadFile(event: any) {
    const reader = new FileReader();

    // reader.readAsDataURL(event.target.files[0])
    // : 'handle exception'
    // const uploadfile:any = event.target.files;
    // const uploadfile:any\
    let uploadfile;
    if (event.type == 'drop') {
      uploadfile = event.dataTransfer.files;
    } else {
      uploadfile = event.target.files;
    }

    //  AbortController.txt
    let fileExt = uploadfile[0].name.split('.').pop().toLowerCase();
    let allowedExtensions = ['txt'];
    if (!allowedExtensions.includes(fileExt)) {
      // this.P2FForm.get("chequeNumber").reset();
      this.snackbar.show('File Extension Only txt Allow', 'danger');
      return;
    }

    // this.file =uploadfile[0]
    reader.onload = () => {
      this.ECSFile = reader.result;

      this.content = this.ECSFile.replaceAll('\r', '')
        .split('\n')
        .filter((n: any) => n);
      console.log(this.content);
    };

    reader.readAsText(uploadfile[0]);

    this.processFiles(uploadfile[0]);
  }

  processFiles(files: any) {
    // for (const file of files) {
    var reader = new FileReader();

    reader.readAsDataURL(files); // read file as data url
    reader.onload = (event: any) => {
      this.uploadedMedia = [];
      // called once readAsDataURL is completed
      // this.content=this.ECSFile.replaceAll('\r','') .split("\n").filter((n:any) => n)
      // console.log(this.content);
      this.uploadedMedia.push({
        FileName: files.name,
        FileSize:
          this.getFileSize(files.size) + ' ' + this.getFileSizeUnit(files.size),
        FileType: files.type,
        FileUrl: event.target.result,
        FileProgessSize: 0,
        FileProgress: 0,
        ngUnsubscribe: new Subject<any>(),
      });

      this.startProgress(files, this.uploadedMedia.length - 1);
    };
    // }
  }

  async startProgress(file: any, index: any) {
    let filteredFile = this.uploadedMedia
      .filter((u, index) => index === index)
      .pop();

    if (filteredFile != null) {
      let fileSize = this.getFileSize(file.size);
      let fileSizeInWords = this.getFileSizeUnit(file.size);

      for (var f = 0; f < fileSize + fileSize * 0.0001; f += fileSize * 0.01) {
        filteredFile.FileProgessSize = f.toFixed(2) + ' ' + fileSizeInWords;
        var percentUploaded = Math.round((f / fileSize) * 100);
        filteredFile.FileProgress = percentUploaded;
        await this.fakeWaiter(Math.floor(Math.random() * 35) + 1);
      }
    }
  }

  fakeWaiter(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  removeImage(idx: number) {
    this.uploadedMedia = this.uploadedMedia.filter((u, index) => index !== idx);
    console.log(this.fileInput.nativeElement.files);
    this.fileInput.nativeElement.value = null;
    this.Disabledfile = '';
  }
  fileSizeUnit: number = 1024;
  public isApiSetup = false;

  // constructor(private http: HttpClient) {}

  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }

    return fileSize;
  }

  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = 'bytes';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }



  public toggleFirstPanel() {
    // this.firstPanel.toggle();
  }
  refNoWiseData = new MatTableDataSource();
  Disabledfile: any;
  uploadCdrefList() {
    let finalContent: any[] = [];
    if (this.content.length > 0) {
      for (let index = 0; index < this.content.length; index++) {
        const element = this.content[index];
        if (Number(element)) {
          finalContent.push(Number(element));
        } else {
          // this.snackbar.show('your format of not correct','danger')
          finalContent = [];
          this.openDialog(this.myTemplate);
          break;
        }
      }

      console.log(this.content);
      console.log(finalContent);
      if (finalContent.length > 0) {
        let obj = {
          cdeRefNo: finalContent,
          makerId: this.userinfo.userId,
        };
        this.loader.setLoading(true);
        this.ApiMethods.postresultservice(
          this.ApiService.ceilingSetFile,
          obj
        ).subscribe(
          (response:any) => {
            if (response.result && response.result.v_Status.length > 0) {
              this.snackbar.show('SuccessFully Data Saved', 'success');
              this.refNoWiseData.data = response.result.v_Status;
              this.removeImage(0)
              // this.firstPanel.open();
            } else {
              this.snackbar.show(
                ' CD Reference Number already exist or Invalid',
                'alert'
              );
              this.removeImage(0)
              this.refNoWiseData.data = [];
            }

            this.loader.setLoading(false);
          },
          (res:any) => {
            if (res.status != 200) {
              this.snackbar.show(
                'Something Went Wrong ! Please Try Again',
                'danger'
              );
              this.loader.setLoading(false);
            }
          }
        );
      }
    }
  }

  openDialog(template: TemplateRef<unknown>) {
    this.myDialogRef = this.dialog.open(template);
  }

  startRangechange() {
    if (this.EceilingForm.controls['amountPercentage'].value !== '') {
      this.EceilingForm.controls['amountPercentage'].setValue('');
      this.snackbar.show(
        'You have Entered Amount percentage Value with it range field can not be set',
        'alert'
      );
    }
  }
  endRangechange() {
    if (this.EceilingForm.controls['amountPercentage'].value !== '') {
      this.EceilingForm.controls['amountPercentage'].setValue('');
      this.snackbar.show(
        'You have Entered Amount percentage Value with it range field can not be set',
        'alert'
      );
    }
  }
  percentChange() {
    if (
      this.EceilingForm.controls['startAmountRange'].value !== '' ||
      this.EceilingForm.controls['amountRange'].value !== ''
    ) {
      this.EceilingForm.controls['startAmountRange'].setValue('');
      this.EceilingForm.controls['amountRange'].setValue('');
      this.snackbar.show(
        'You have filled range Value with it Percentage field can not be set',
        'alert'
      );
    }
  }
  exportToPdf() {
    var header = function (data: any) {
      doc.setFontSize(18);
      doc.setTextColor(40);

      //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
      doc.text('Testing Report', data.settings.margin.left, 50);
    };

    var options = {
      beforePageContent: header,
      margin: {
        top: 80,
      },
      startY: 20,
    };

    let currDate = new Date();
    let Date1 = this.RecordDateForm.controls['recordDate'].value;
    let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
    var doc: any = new jsPDF('l', 'mm', 'a4');
    doc.text(
      `Government Of Rajasthan e-Payment Advice Report On ${
        fDate ? fDate : currDate
      }`,
      60,
      10
    );
    // doc.text("Range Wise ECS Permission",100 ,20)
    doc.setFontSize(11);
    doc.setTextColor(100);

    doc.setFontSize(11);
    doc.setTextColor(100);
    if (this.percentWiseData.data.length) {
      doc.text('Range Wise ECS Permission', 120, 20);
    }

    doc.setFontSize(11);
    doc.setTextColor(100);
    // doc.setFontSize(9);
    // doc.setTextColor(100)
    let elementHTML: any = document.createElement('h3');
    elementHTML.innerHTML = `<thead><tr><h3>Percentage Wise ECS Permission</h3><tr></thead><br> `;

    autoTable(doc, { html: '#tablesDiv', showFoot: 'lastPage', startY: 25 });
    let finalY = doc?.lastAutoTable.finalY; // The y position on the page

    doc.setFontSize(11);
    doc.setTextColor(100);
    if (this.rangerWiseData.data.length) {
      doc.text('Range Wise ECS Permission', 120, finalY + 10);
    }

    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
      html: '#table2',
      showFoot: 'lastPage',
      startY: finalY + 15,
    });

    let finalY3 = doc?.lastAutoTable.finalY;

    // doc.setFontSize(11);
    // doc.setTextColor(100)
    // doc.setFillColor(204, 204,204,0);
    // doc.rect(10, 10, 150, 160, ,finalY2+10);

    if (this.RecordList.data.length) {
      doc.text('CD Referece No. Wise ECS Permission', 120, finalY3 + 10);
    }

    let str: string = '';
    let table = document.createElement('table');
    table.setAttribute('id', 'testpdTable');
    let heasRow = '';
    this.displayedColumns1.forEach((value: any) => {
      heasRow = heasRow + `<th scope="col" >${value}</th>`;
    });
    heasRow = `<tr>${heasRow} <tr> `;
    let tableData = this.RecordList.data
      .map((value1: any, index) => {
        str = str + `<td >${index + 1}</td>`;
        this.displayedColumns.map((value: any) => {
          if (value !== 'SrNo') {
            str = str + `<td >${value1[value]}</td>`;
          }
        });

        let str1 = `<tr>${str} <tr> `;
        str = '';
        return str1;
      })
      .join('');
    const footer: any = document.querySelector('#footer');
    // footer.setAttribute('class','thead-dark')
    table.innerHTML =
      `<thead><tr>${heasRow} <tr></thead> ` + `<tbody>${tableData}</tbody>`;
    // var doc = new jsPDF('l', 'mm', 'a4');
    // autoTable(doc, { html: table, showFoot: 'lastPage' ,startY:finalY3+15 });
    autoTable(doc, {
      html: '#table4',
      showFoot: 'lastPage',
      startY: finalY3 + 15,
    });

    let finalY2 = doc?.lastAutoTable.finalY;

    // doc.setFontSize(11);
    // doc.setTextColor(100)
    // doc.setFillColor(204, 204,204,0);
    // doc.rect(10, 10, 150, 160, ,finalY2+10);

    if (this.refNoWiseData.data.length) {
      doc.text('Referece No. Wise ECS Permission', 120, finalY2 + 10);
    }
    autoTable(doc, {
      html: '#table3',
      showFoot: 'lastPage',
      startY: finalY2 + 15,
    });

    // doc.addHTML(pdfContentEl.innerHTML)
    doc.text('https://rajkosh.rajasthan.gov.in', 10, 200);
    doc.save('ECSPermissionDocument.pdf');
    // doc.output('dataurlnewwindow');
    // this.makePdf();
  }
  @ViewChild('pdf') pdf!: ElementRef;

  tablesDiv = 'tablesDiv';
  table2 = 'table2';
  table3 = 'table3';
  table4 = 'table4';

  public inputValidator(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
