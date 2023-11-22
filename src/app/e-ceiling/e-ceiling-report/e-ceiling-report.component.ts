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
import { BehaviorSubject, Observable, Subject, forkJoin, map, of, startWith } from 'rxjs';
import { pdCalculationDetail } from 'src/app/Reports/Interface';

import { MatSort } from '@angular/material/sort';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/utils/Helper';
import { MatDialog } from '@angular/material/dialog';
import { Console } from 'console';

export type FadeState = 'visible' | 'hidden';

@Component({
  selector: 'app-e-ceiling-report',
  templateUrl: './e-ceiling-report.component.html',
  styleUrls: ['./e-ceiling-report.component.scss'],
  animations: [
    trigger('state', [
      state(
        'visible',
        style({
          opacity: '1',
        })
      ),
      state(
        'hidden',
        style({
          opacity: '0',
        })
      ),
      transition('* => visible', [animate('500ms ease-in')]),
      transition('visible => hidden', [animate('500ms ease-out')]),
    ]),
  ],
})
export class ECeilingReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tableDataSource = new MatTableDataSource<any>();
  approveBillForm!: FormGroup;
  selection = new SelectionModel<any>(true, []);
  selectedBills: any;
  state!: FadeState;
  private _show!: boolean;
  fileSelectionList: any[] = [];
  // userType ="Maker"
  // userType ="C"
  // userType ="A"
  userType = 'P';
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

  displayedColumns1 = ['FILTERID', 'CDE_REFNO', 'AMOUNT'];
  displayedColumns4 = ['CDE_REFNO', 'TOTAL_AMOUNT','DTA STATUS'];

  maxDate = new Date();
  hideContent: boolean = false;

  RecordDateForm!: FormGroup;
 
  userinfo: any;
  amountPercent: any;
 
  @ViewChild('pdf') pdf!: ElementRef;
  tablesDiv = 'tablesDiv';
  table2 = 'table2';
  table1 = 'table1';
  table3 = 'table3';
  table4 = 'table4';
  showTablesBoard = false;
  refNoWiseData = new MatTableDataSource();
  todayDate = new Date();
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

  }

  ngOnInit(): void {
   
    this.userinfo = this.ApiMethods.getUserInfo();

    //record Date Form
    this.RecordDateForm = this.fb.group({
      recordDate: new FormControl(new Date(), Validators.required),
 
    });

  }

  animationDone(event: any) {
    // now remove the
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      // this._show = false;
      this._show = false;
      // this.state=
    }
  }

  displayedColumns = ['SrNo', 'CDE_REFNO', 'AMOUNT'];
  ngAfterViewInit() {

  }



 

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.tableDataSource.sort = sort;
    this.refNoWiseData.sort = sort;
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
  RecordList = new MatTableDataSource();
  rangerWiseData = new MatTableDataSource();
  percentWiseData = new MatTableDataSource();
  displayedColumns2 = [
    'CEILING TYPE',
    'Ceiling Value',
    'BILL COUNT',
    
    'AMOUNT PERCENTAGE',
    'PERMISSION DATE',
    'TOTAL AMOUNT',
    'Record Percent',
    'DTA STATUS'
  ];
  displayedColumns3 = [
    'CEILING TYPE',
    'Ceiling Value',
    'BILL COUNT',
 
    'Max Amt',
    'Min Amt',
    'PERMISSION DATE',
    'TOTAL AMOUNT',
    'Record Percent',
    'DTA STATUS'
  ];

  
 async getRecords() {
    if (this.RecordDateForm.valid) {
      this.loader.setLoading(true);
      let data= await this.permissionApiCall();
      this.percentWiseData.data =  this.percentageWiseBills(data);
      let data2= await this.rangeApiCall();
      this.rangerWiseData.data =  this.rangeWiseBills(data2);
      let data3:any= await this.fileApiCall();
      if(data3?.length){
        data3.forEach((i:any)=>{
        i['DTA STATUS'] = (i.PROCESS_FLAG =="Y") ?"Approved": (i.PROCESS_FLAG =="N" )?"Pending":'-'
        })
      }

      this.refNoWiseData.data =  data3;
      if(this.percentWiseData.data.length >0  || this.percentWiseData.data.length >0 ||this.refNoWiseData.data.length > 0){
       this.showTablesBoard =true;
       this.show=Boolean(true)
      }else{
        this.showTablesBoard =false;
        this.show=Boolean(false)
        this.snackbar.show('No Record Found on this Date!', 'alert');
      }
    
    }
  }

  rangeApiCall(){
    return new Promise((resolve) => {
      if (this.RecordDateForm.valid) {
        this.loader.setLoading(true);
  
        let Date1 = this.RecordDateForm.controls['recordDate'].value;
        let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
       this.ApiMethods.getservice(
              `${this.ApiService.rangeWiseRpt}${fDate}`
            ).subscribe(
              (response:any) => {
  
                this.rangerWiseData.data = [];
  
                setTimeout(()=>{
                  if (response.result ) {
                    this.loader.setLoading(false);
              
                    resolve(     response.result )
                    // this.percentageWiseBills(response.result )
  
                    
                  } else {
  
                    this.rangerWiseData.data = [];
                    resolve(  [])
                    this.loader.setLoading(false);
                    this.snackbar.show('No Record Found on this Date!', 'alert');
                  }
                })
  
              },
              (res:any) => {
                if (res.status != 200) {
                  this.loader.setLoading(false);
                  resolve(    [])
                  this.snackbar.show(
                    'Something Went Wrong ! Please Try Again',
                    'danger'
                  );
                }
              }
            );
      }
    });
    
    
  

  }
  permissionApiCall(){
    return new Promise((resolve) => {
      if (this.RecordDateForm.valid) {
        this.loader.setLoading(true);
  
        let Date1 = this.RecordDateForm.controls['recordDate'].value;
        let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
       this.ApiMethods.getservice(
              `${this.ApiService.percentageWiseRpt}${fDate}`
            ).subscribe(
              (response:any) => {
  
                this.percentWiseData.data = [];
  
                setTimeout(()=>{
                  if (response.result ) {
                    this.loader.setLoading(false);
              
                    resolve(     response.result )
                    // this.percentageWiseBills(response.result )
  
                    
                  } else {
  
                    this.percentWiseData.data = [];
                    response.result =[];
                    resolve(    [])
                    this.loader.setLoading(false);
                    this.snackbar.show('No Record Found on this Date!', 'alert');
                  }
                })
  
              },
              (res:any) => {
                if (res.status != 200) {
                  this.loader.setLoading(false);
                  resolve(    [])
                  this.snackbar.show(
                    'Something Went Wrong ! Please Try Again',
                    'danger'
                  );
                }
              }
            );
      }
    });
    
    
  

  }
  fileApiCall(){
    return new Promise((resolve) => {
      if (this.RecordDateForm.valid) {
        this.loader.setLoading(true);
  
        let Date1 = this.RecordDateForm.controls['recordDate'].value;
        let fDate = new DatePipe('en-US').transform(Date1, 'yyyy-MM-dd');
       this.ApiMethods.getservice(
              `${this.ApiService.fileWiseRpt}${fDate}`
            ).subscribe(
              (response:any) => {
  
                this.refNoWiseData.data = [];
  
                setTimeout(()=>{
                  if (response.result ) {
                    this.loader.setLoading(false);
              
                    resolve(     response.result )
                    // this.percentageWiseBills(response.result )
  
                    
                  } else {
  
                    this.refNoWiseData.data = [];
                    
                    resolve(    [])
                    this.loader.setLoading(false);
                    this.snackbar.show('No Record Found on this Date!', 'alert');
                  }
                })
  
              },
              (res:any) => {
                if (res.status != 200) {
                  this.loader.setLoading(false);
                  resolve(    [])
                  this.snackbar.show(
                    'Something Went Wrong ! Please Try Again',
                    'danger'
                  );
                }
              }
            );
      }
    });
    
    
  

  }



  percentageWiseBills(data: any) {
    let array = [];

    for (let key in data) {
      array.push(...data[key]);
    }

    console.log(array);

    let final: any[] = [];

    array.forEach((item: any) => {
      let element: any;
      item.PERMISSION_DATE = new DatePipe('en-US').transform(
        item.PERMISSION_DATE,   
        "d MMMM y h:mm a"
      );
      if (item['BUDGET_HEAD']) {
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value':
            item.BUDGET_HEAD,
            'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'AMOUNT PERCENTAGE': item.PERCENTAGE ? item.PERCENTAGE +'%' : 100,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      } else if (item['PD_ACCOUNT']) {
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value':
            item['PD_ACCOUNT'],
            'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'AMOUNT PERCENTAGE': item.PERCENTAGE ? item.PERCENTAGE +'%' : 100,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      } else if (item['BILL_TYPE']) {
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'Ceiling Value':
            item['BILL_TYPE']  + (item['BILL_SUBTYPE'] ? ( '/' + item['BILL_SUBTYPE']):''),
            'Record Percent':item.BILL_PERCENT+'%' ,
            'CEILING TYPE':item.CEILING_TYPE,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'AMOUNT PERCENTAGE': item.PERCENTAGE ? item.PERCENTAGE +'%' : 100,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      } else if(item['OBJECT_HEAD']){
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value': item.OBJECT_HEAD,
          'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'AMOUNT PERCENTAGE': item.PERCENTAGE ? item.PERCENTAGE +'%' : 100,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      }else{
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value': '-',
          'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'AMOUNT PERCENTAGE': item.PERCENTAGE ? item.PERCENTAGE +'%' : 100,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      }
      console.log(element);

      final.push(element);
    });
    console.log(final);
    return  final
        this.percentWiseData.data = final;
    this.showTablesBoard = true;
    this.show = Boolean(this.percentWiseData.data.length);
  }

  rangeWiseBills(data: any) {
    let array = [];

    for (let key in data) {
      array.push(...data[key]);
    }
    let final: any[] = [];
    array.forEach((item: any) => {
      let element: any;
      item.PERMISSION_DATE = new DatePipe('en-US').transform(
        item.PERMISSION_DATE,
        "d MMMM y h:mm a"
      );
      if (item['BUDGET_HEAD']) {
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value':
            item.BUDGET_HEAD,
            'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'Max Amt': item.END_AMOUNT,
          'Min Amt': item.START_AMOUNT,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      } else if (item['PD_ACCOUNT']) {
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value':
            item['PD_ACCOUNT'],
            'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'Max Amt': item.END_AMOUNT,
          'Min Amt': item.START_AMOUNT,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item?.PROCESS_FLAG =="Y") ?"Approved": (item?.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      } else if (item['BILL_TYPE']) {
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value':
          item['BILL_TYPE']  + (item['BILL_SUBTYPE'] ? ( '/' + item['BILL_SUBTYPE']):''),
          'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'Max Amt': item.END_AMOUNT,
          'Min Amt': item.START_AMOUNT,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':item.PROCESS_FLAG
        };
      } else if(item['OBJECT_HEAD']){
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value': item.OBJECT_HEAD,
          'Record Percent':item.BILL_PERCENT+'%',
          'PERMISSION DATE': item.PERMISSION_DATE,
          'Max Amt': item.END_AMOUNT,
          'Min Amt': item.START_AMOUNT,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      }else{
        element = {
          'BILL COUNT': item.BILL_COUNT,
          'CEILING TYPE':item.CEILING_TYPE,
          'Ceiling Value': '-',
          'Record Percent':item.BILL_PERCENT+'%' ,
          'PERMISSION DATE': item.PERMISSION_DATE,
          'Max Amt': item.END_AMOUNT,
          'Min Amt': item.START_AMOUNT,
          'TOTAL AMOUNT': item.TOTAL_AMOUNT,
          'DTA STATUS':(item.PROCESS_FLAG =="Y") ?"Approved": (item.PROCESS_FLAG =="N" )?"Pending":'-'
        };
      }
      console.log(element);

      final.push(element);
    });
    console.log(final);
    // this.rangerWiseData.data = final;
  return final
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
            item.SETTING['OBJECT_HEAD'] ? '/' + item.SETTING['OBJECT_HEAD'] : ''
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

  exportToPdf() {
    var header = function (data: any) {
      doc.setFontSize(18);
      doc.setTextColor(40);

      //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
      doc.text('Testing Report', data.settings.margin.left, 50);
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
    if (this.percentWiseData.data.length) {
      doc.text('Percentage Wise ECS Permission', 120,20);
    }

    autoTable(doc, { html: '#tablesDiv', showFoot: 'lastPage', startY: 25 });
    let finalY = doc?.lastAutoTable.finalY; // The y position on the page

    if (this.rangerWiseData.data.length) {
      doc.text('Amount Range Wise ECS Permission', 120, finalY + 10);
 
    }



    autoTable(doc, {
      html: '#table2',
      showFoot: 'lastPage',
      startY: finalY + 15,
    });

    let finalY3 = doc?.lastAutoTable.finalY;

    if (this.refNoWiseData.data.length) {
      doc.text('File Uploaded  Reference Number ECS Permission', 120, finalY3 + 10);
    }
    autoTable(doc, {
      html: '#table3',
      showFoot: 'lastPage',
      startY: finalY3 + 15,
    });

    let finalY2 = doc?.lastAutoTable.finalY;
    if (this.RecordList.data.length) {
      doc.text('CD Referece No. Wise ECS Permission', 120, finalY2 + 10);
    }


    autoTable(doc, {
      html: '#table4',
      showFoot: 'lastPage',
      startY: finalY2 + 15,
    });

  
    // doc.addHTML(pdfContentEl.innerHTML)
    doc.text('https://rajkosh.rajasthan.gov.in', 10, 200);
    doc.save('ECSPermissionDocument.pdf');
    // doc.output('dataurlnewwindow');
    // this.makePdf();
  }

 



}
