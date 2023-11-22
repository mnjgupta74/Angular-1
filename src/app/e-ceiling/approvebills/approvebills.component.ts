import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSliderChange } from '@angular/material/slider';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BehaviorSubject, Observable, Subject, map, of, startWith } from 'rxjs';
import { pdCalculationDetail } from 'src/app/Reports/Interface';

import { MatSort } from '@angular/material/sort';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/utils/Helper';
import { MatDialog } from '@angular/material/dialog';

export type FadeState = 'visible' | 'hidden';



@Component({
  selector: 'app-approvebills',
  templateUrl: './approvebills.component.html',
  styleUrls: ['./approvebills.component.scss'],
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
export class ApprovebillsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tableDataSource = new MatTableDataSource<any>();
  approveBillForm!: FormGroup;
  selection = new SelectionModel<any>(true, []);
  selectedBills:any
  state!: FadeState;
  private _show!: boolean;
  fileSelectionList:any[]=[]
  // userType ="Maker"
  userType ="C"
  // userType ="A"
  // userType ="P"
  get show() {
    return this._show;
  }
  @Input()
  set show(value: boolean) {
    if (value) {
      // show the content and set it's state to trigger fade in animation
      this._show = value;
      this.state = 'visible';
    } else {
      // just trigger the fade out animation
      this.state = 'hidden';
    }
  }



  displayedColumns1 = [ 'CDE_REFNO', 'AMOUNT'];
  displayedColumns4 = ['CDE_REFNO', 'TOTAL_AMOUNT'];
 

  maxDate = new Date();
  hideContent: boolean = false;

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
  
  userinfo: any;
  amountPercent: any;
  PdAccountNoData: any[] = [];
  PdAccountNolist: Observable<any[]> | undefined;

  submitted: boolean = false;
 

  onSliderChange(event: MatSliderChange) {
    console.log(event.value);
  }
  refNoWiseData= new MatTableDataSource();


 
  uploadedMedia: Array<any> = [];
  @ViewChild('myTemplate')
  myTemplate!: TemplateRef<unknown>;

 

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

    public dialog: MatDialog
  ) {
  this.currentFinancialDate= this.getCurrentFinancialYear()
  }

  ngOnInit(): void {
    // this.tableDataSource.data=this.data

      this.approveBillForm = this.fb.group({
      transctionType: [''],
      filterChip: [''],
    });

    
    this.userinfo = this.ApiMethods.getUserInfo();
    
    //record Date Form
    this.RecordDateForm = this.fb.group({
      recordDate: new FormControl(new Date(), Validators.required),
      recBillType: [''],
      recSubBillType: [''],
      recBudgetHead: [''],
      recObjectHead: [''],
    });
 
    this.GetBudgetHeadData();
    this.getObjectHeadData();
    this.getBilltypeList();
  
  }


  animationDone(event: any) {
    // now remove the 
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      // this._show = false;
      this._show = false;
      // this.state=
    }
  }

  displayedColumns = ['SrNo', 'CEILING_TYPE','CEILING VALUE','Percentage/Range','BILL_COUNT','PERMISSION_DATE','TOTAL_AMOUNT'];
  ngAfterViewInit() {
    // this.tableDataSource.paginator = this.paginator;

    if(this.userType =='A' ||this.userType =='C'){
      this.initialWorkProcess()
    }
    
  }


  initialWorkProcess(){

    this.displayedColumns.push('SelectionList')
    this.selectedBills =this.tableDataSource.filteredData.length
    this.selection.changed.subscribe((item)=>{
    
      let uniqueArray:any[]=[]
      this.tableDataSource.filteredData.forEach(ele1 => {
        this.selection.selected.forEach(ele2 => ele1 === ele2 && uniqueArray.push(ele1));
      });
    
      this.selectedBills =uniqueArray.length
    })
  }
selectionUpdate(){

      let uniqueArray:any[]=[]
      this.tableDataSource.filteredData.forEach(ele1 => {
        this.selection.selected.forEach(ele2 => ele1 === ele2 && uniqueArray.push(ele1));
      });
 
      this.selectedBills =uniqueArray.length
  
  
}
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();

    }
    setTimeout(()=>{
      this.selectionUpdate()
    },500)

  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableDataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    let params:any[]=[]
    this.selection.selected.forEach(s =>{ console.log(s)
    params.push(s)});
 
    let uniqueArray:any[] = [];
  
    this.tableDataSource.filteredData.forEach(ele1 => {
      params.forEach(ele2 => ele1 === ele2 && uniqueArray.push(ele1));
    });
    console.log(uniqueArray);
    this.submit(uniqueArray)
  }

  ParentComponent(data:any){
    console.warn(data);
    this.fileSelectionList=data
}
  calculate(field:string){
    let total = 0
   let calc = 'Amount'
  if(calc){
  this.tableDataSource.filteredData.forEach(element => {
  total= total + element[field] 
   });
return total;
}
    return ''
  }



  myDialogRef!: any;
  // @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
  //   this.RecordData.paginator = paginator;

  // }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.tableDataSource.sort = sort;
    this.refNoWiseData.sort = sort;
  }
  // @ViewChild(MatSort) set matSort(sort: MatSort) {
  //   this.tableDataSource.sort = sort;
  //   this.refNoWiseData.sort = sort;
  // }
 
 
  
  navgateHistoryBack() {
    history.back();
  }
  loctionBack() {
    // this.location.back();
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
 
 

  onBillTypeSelected(form?: any) {
    let choosedBillType: any = {};
    if (form == 'recordDate') {
      this.recSubBillTypeData = [];
      this.RecordDateForm.controls['recSubBillType'].setValue('');
      choosedBillType = this.RecordDateForm.value.recBillType;
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
     
          this.recBudgetHeadData = data.result;
          this.budgetHeadData = data.result;
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
      } 
    }
   
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
 

  _filterPdAccount(value: string, data: any) {
    return data.filter((option: any) => {
      return option.PDAccName.toLowerCase().includes(value.toLowerCase());
    });
  }

  displayPdAccountNo(selectedoption: any) {
    return selectedoption ? selectedoption.PDAccName : undefined;
  }


  calculateTotal() {
    // return this.RecordData.data.reduce(
    //   (accum: any, curr: any) => accum + curr?.GrossAmt,
    //   0
    // );
  }
  onReset() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/eCeiling']);
    });
  }
 
  isVisible$:BehaviorSubject<any> = new BehaviorSubject(false);
  destroyAndReload(func:any) {
    this.isVisible$.next(!func);
    setTimeout(() => {
        this.isVisible$.next(func);
    }, 1);
}
  getRecords() {
    // alert(this.userType)
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
        userType:this.userType
      };
      this.ApiMethods.postresultservice(
        `${this.ApiService.recordList}`,obj
      ).subscribe(
        (response:any) => {
          this.selection.clear() 
          // this.masterToggle() 
          this.refNoWiseData.data =[]
          this.tableDataSource.data =[]
            
            if (response.result && response?.result?.Object1.length > 0 || response?.result?.Object2?.length >0 ) {
              
              
                
              this.tableDataSource.data = response?.result?.Object1;
              
              
                this.refNoWiseData.data =  response?.result?.Object2;
                this.masterToggle() ;
            if(response?.result?.Object2?.length >0 ){
              this.destroyAndReload(true) 
            }
             
              
             
            
              
     
    
              this.loader.setLoading(false);
            } else {
             
              this.tableDataSource.data = [];
              this.refNoWiseData.data = []
              this.destroyAndReload(this.refNoWiseData.data.length)
              this.loader.setLoading(false);
              this.snackbar.show('No Record Found on this Date!', 'alert');
            }
          
            
            this.show = Boolean( this.tableDataSource.data.length)
       
       
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




 







 

  openDialog(template: TemplateRef<unknown>) {
    this.myDialogRef = this.dialog.open(template);
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
   
    doc.setFontSize(11);
    doc.setTextColor(100);

    
    
    let finalY3 = doc?.lastAutoTable?.finalY ? doc?.lastAutoTable?.finalY:5 ;

  

    if (this.tableDataSource.data.length>0) {
      doc.text('CD Referece No. Wise ECS Permission', 120, finalY3 + 10);
    }

   
    (this.tableDataSource.data.length>0) && autoTable(doc, {
      html: '#table1',
      showFoot: 'lastPage',
      startY: finalY3 + 15,
    });

    let finalY2 = doc?.lastAutoTable?.finalY ? doc?.lastAutoTable?.finalY:5 ;

    

    if (this.refNoWiseData.data.length) {
      doc.text('File Uploaded ECS Permission', 120, finalY2 + 10);
    }
    autoTable(doc, {
      html: '#table3',
      showFoot: 'lastPage',
      startY: finalY2 + 15,
    });

    
    doc.text('https://rajkosh.rajasthan.gov.in', 10, 200);
    doc.save('ECSPermissionDocument.pdf');
    // doc.output('dataurlnewwindow');
    // this.makePdf();
  }
  @ViewChild('pdf') pdf!: ElementRef;


  table1 = 'table1';
  table3 = 'table3';


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
  
 submit(data:any){

let arr1:any[]=[]
const final =[...data]
final.forEach(item=>{
  arr1.push(item.FILTER_LOG_IDS)
})
console.log(arr1);

let arr2:any[]=[]
this.fileSelectionList.forEach(item=>{
  arr2.push(item.CDE_REFNO)
})


if (arr1.length > 0 || arr2.length > 0) {
  // this.loader.setLoading(true);
 
  let Date1 = this.RecordDateForm.controls['recordDate'].value;
  let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
  let obj = {
    "filterlogId":arr1,
    "cdeRefNo":arr2,
  userType:this.userType

  };
  console.log(obj);
  
  this.ApiMethods.postresultservice(
    `${this.ApiService.CheckerFlag}`,obj
  ).subscribe(
    (response:any) => {
    
      
        if (response.result.out_str == "1" ) {
        
          this.snackbar.show('Record Process Successfully!', 'success');
          this.loader.setLoading(false);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/approveBills']);
          });
        } else {
         
          this.loader.setLoading(false);
          this.snackbar.show(response.result.out_err_msg, 'alert');
        }
      
   
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
}else{
  this.snackbar.show(
    'No Bill Selected to Process',
    'alert'
  );
}
 }


}
