
import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loaderservice';
// import { IGetAccountOfficerForwardList, IGetAccountOfficerForwardListUpdate, IGetAccountOfficerList, IGetAccountOfficerRevertList, IgetVoucherModelData } from '../Interface/Master';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import * as Val from '../../../app/utils/Validators/ValBarrel'
//import { ObjectiondialogComponent } from '../objection-dialog/objection-dialog.component';
import { Helper } from 'src/app/utils/Helper';
import { IGetAccountOfficerForwardList, IGetAccountOfficerForwardListUpdate, IGetAccountOfficerList, IGetAccountOfficerRevertList, IPFMS, IgetVoucherModelData } from 'src/app/utils/Master';
import { Console, log } from 'console';
//import { ViewDocumentComponent } from '../view-document/view-document.component';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export interface NewTokenReportList {
  DDoCode:number;
  TokenNo:number;
  Majorhead:string;
  GrossAmt:number;
  CashAmt:number;
  Billtype:number;
  Cde_refNo:number;
}




@Component({
  selector: 'app-new-token-report',
  templateUrl: './new-token-report.component.html',
  styleUrls: ['./new-token-report.component.scss']
})
export class NewTokenReportComponent implements OnInit {
  BillType: number = 0;

  NewTokenReportData: MatTableDataSource<NewTokenReportList> = new MatTableDataSource();
  displayedColumns = [
    'SrNo',
    'DDoCode',
    'TokenNo',
    'Majorhead',
    'CashAmt',
    'GrossAmt',
    'Billtype',
    'Cde_refNo',
  ];




  checked: any;
  Ischecked: boolean = false;
  IscheckedRevert: boolean = false;
  isObjBtnDisabled: boolean = false; // Set this variable to true or false based on your condition

  // Form Module
  NewTokenReportForm: any;
  SelectAuditor: any = ''
  chk_ForwardList: any = []
  Check_All: any = []

  Forwardstatus: any;
  Auditoroptions: Observable<any[]> | undefined;
  chk_RevertList: any = []
  Revertstatus: any;
  AuditorListarr: any = []
  financialYr: any;
  finYr: any;


  isChkDisabled: boolean[] = []
  isButtonDisabled: boolean[] = []
  IscheckedRevertArray: boolean[] = []
  IscheckedArray: boolean[] = []

  BillTypeList: Observable<any[]> | undefined;
  BillTypeListarr: any[] = []
  DdoNameListarr:any;
  DodoNameList:any;
  selectedDDOCode:any;
  filename = "NewTokenReport.xlsx";
  exportcompletedata:any[]=[]


 
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.NewTokenReportData.paginator = paginator;
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.NewTokenReportData.sort = sort;
  }

  loading: any;


  showTab_BtnForward: boolean = false


  ChooseOption: any = '';
  SchemaCodeoptions: Observable<any[]> | undefined;
  SchemaCodeListarr: any[] = []



  GetIPFMS: IPFMS = {
    asignmentId: 0,
    userid: this.UId.UserId,
    ipAddress: "172.22.32.105",
    cde_refNo: 0,
    schemecode: 0,
  }


  // dialog: any;
  selectedOption: any;

  //isViewDocs: any ;




  page: any = {
    pageIndex: 0,
    pageSize: 5
  };


  constructor(private router: Router, private ApiMethods: ApiMethods, private snackbar: SnackbarService, public loader: LoaderService, private ApiService: ApiService, private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private finyear_: Helper, private toyear_: Helper, private TCode: Helper, private UId: Helper, private asgnId: Helper, private IPAdd: Helper,
    private Helper:Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);

    };
    this.getBillTypeList() //call bill type list
    this.getDdoNameList();
    //this.GetNewTokenReportList()


  }


  ngOnInit() {
    console.log('Test Account Officer List');
    this.financialYr = this.finyear_.year.toString().substring(2, 4) + this.toyear_.finyear.toString().substring(2, 4);
    this.GetIPFMS.asignmentId = this.asgnId.assignmentId;

    console.log("assignmentId", this.asgnId);

    console.log("GetIPFMS", this.GetIPFMS);
    this.NewTokenReportForm = new FormGroup({
      fromDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      toDate: new FormControl({ value: new Date(), disabled: false }, [Validators.required, Validators.maxLength(12)]),
      Billtype: new FormControl(''),
      DDOCode: new FormControl(''),
      grossAmount: new FormControl(),
      netAmount: new FormControl(),
    });

  }


 

  _filterSchemcode(value: string, data: any) {
    return data.filter((option: any) => {
      return option.schemeCode.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayTreasFn(selectedoption: any) {
    console.log("display_funschemeCode", selectedoption.schemeCode);
    return selectedoption ? selectedoption.schemeCode : undefined;
  }

  

  

  GetNewTokenReportList() {
    this.loader.setLoading(true);
    
    let FrmDate = this.NewTokenReportForm.controls['fromDate'].value
    let ToDate = this.NewTokenReportForm.controls['toDate'].value

    let grossAmount:number = this.NewTokenReportForm.controls['grossAmount'].value
    if(grossAmount==null){
      grossAmount=0;
    }
    let netAmount:number  = this.NewTokenReportForm.controls['netAmount'].value
    if(netAmount==null){
      netAmount=0;
    }

    let DDOCode = this.NewTokenReportForm.controls['DDOCode'].value
    console.log("DDOCode : ",DDOCode)
    if(DDOCode==undefined){
      DDOCode=0
    }else{
      DDOCode= DDOCode.ddo_code
    }

    let Billtype = this.NewTokenReportForm.controls['Billtype'].value
    console.log("Billtype : ",Billtype)
    if(Billtype==''){
      Billtype=0
    }else{
      Billtype= Billtype.Ncode
    }

    var body = {
      "fromDate": formatDate(new Date(FrmDate), 'yyyy-MM-dd', 'en'),
      "toDate": formatDate(new Date(ToDate), 'yyyy-MM-dd', 'en'),
      "grossAmt": grossAmount,
      "cashAmt": netAmount,
      "billType": Billtype,
      "ddoCode": DDOCode,
    }
    console.log("Body_before", body);

    this.ApiMethods.postresultservice(this.ApiService.NewTokenReportDetails, body).subscribe((resp: any) => {

    
     // this.loader.setLoading(false);

      if (resp.result.length > 0 ) {


        console.log("SchemaCode_details_", resp.result);

        this.NewTokenReportData.data = resp.result;
        this.exportcompletedata=resp.result;

        this.showTab_BtnForward = true;
        // this.disableElementArray(resp.result);
        console.log("chek_kr___", this.NewTokenReportData.data);
        this.NewTokenReportForm.disable();

        this.loader.setLoading(false);
      }
      else {
        this.loader.setLoading(false);
        //this.snackbar.show(resp.result[0].MSG, 'danger');
        this.NewTokenReportData.data = [];
      }

    },

      (res: any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');
          this.showTab_BtnForward = false;
        }
      }

    );

  }

  GetNewTokenReportReset() {
    window.location.reload();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce('Sorted ${sortState.direction}ending');
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(filterValue: string) {
    this.NewTokenReportData.filter = filterValue.trim().toLowerCase();

   
  }

  onChangePage(pe: PageEvent) {
    this.page = pe;
    this.Ischecked = false;
  }

  displayFn(selectedoption: any) {
    console.log("display_fun_call");
    return selectedoption ? selectedoption.BillType : undefined;
  }



// Calling API for Bill Type List
getBillTypeList() {
 // console.log("BillTypeList_before", this.BankList);

  this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe((resp: any) => {
    console.log("BillTypeList__res", resp);
    if (resp.result && resp.result.length > 0) {
      // this.BillTypeList = resp.result
      this.BillTypeListarr = resp.result

      this.BillTypeList = this.NewTokenReportForm.controls['Billtype'].valueChanges.pipe(
        startWith(''),

        map((value: any) => {
          // console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.BillType
        }),
        map((BillType: any) => {
          // console.log("second__map", BillType);

          return BillType ? this._filter(BillType, resp.result) : resp.result.slice()
        })
      );
    }

  })
 // console.log("BillTypeList_after", this.BankList);
}

//  Auditor List filter >>>------------------->
_filter(value: string, data: any) {
  // console.log("filterval__", value);
  return data.filter((option: any) => {
    console.log("option_val__", option);
    return option.BillType.toLowerCase().includes(value.toLowerCase())
  });
}

getDdoNameList() {
  //alert();
  this.ApiMethods.getservice(this.ApiService.getDdoNamelist + this.Helper.Treasury_Code + '/0').subscribe((resp:any) => {
     console.log("getDdoNameList__res", resp);
    if (resp.result && resp.result.length > 0) {
      // this.DodoNameList = resp.result;
      // console.log("");

      this.DdoNameListarr = resp.result;

  //  console.log("DdoNameListarr",this.DdoNameListarr);

      this.DodoNameList = this.NewTokenReportForm.controls['DDOCode'].valueChanges.pipe(
        startWith(''),
        map((value: any) => {
           console.log("firstmap__DdoName", value);
          return typeof value === 'string' ? value : value.DDO_NAME
        }),
        map((DDO_NAME: any) => {
          // console.log("second__map_DdoName", DDO_NAME);
          return DDO_NAME ? this.DdoName_filter(DDO_NAME, resp.result) : resp.result.slice()
        })
      );

      const ddoNameList = this.DdoNameListarr.filter((item: any) => item.ddo_code === this.selectedDDOCode)[0];
      this.NewTokenReportForm.patchValue({
        DDOCode: ddoNameList

      });
    // this.getOfficeNameList();
    }
  })
}

DdoName_filter(value: string, data: any) {
  return data.filter((option: any) => {
    return option.DDO_NAME.toLowerCase().includes(value.toLowerCase())
  });
}

displayDdoName(selectedoption: any) {
  return selectedoption ? selectedoption.DDO_NAME :undefined;
}

exportToPdf() {
  this.loader.setLoading(true);
  setTimeout(() => {
    let str:string=''
    let heading:any=[' Sr No.',' DDO Code','Token No','Major Head','Cash Amount','Gross Amount','Bill Type','Cde Ref No / Sanction Ref No']
    let table = document.createElement('table');
    table.setAttribute('id','testpdTable');
    let heasRow=''
    heading.forEach((value:any)=> {
      heasRow = heasRow+`<th scope="col" >${value}</th>`
    })
    heasRow= `<tr>${heasRow} <tr> `
    let tableData = this.NewTokenReportData.data.map((value1:any,index) => {
    
    str =  str + `<td >${index+1}</td>`
    this.displayedColumns.map((value:any)=> {
      if(value !==  'SrNo'){
        str=  str + `<td >${value1[value]}</td>`
        
      }

    })
  
    let str1 =`<tr>${str} <tr> `
    str=''
      return (
      str1
      );
  
    }).join('');
    const footer:any = document.querySelector("#footer");
    // footer.setAttribute('class','thead-dark')
    table.innerHTML = `<thead><tr>${heasRow} <tr></thead> `+ `<tbody>${tableData}</tbody>` 
    var doc = new jsPDF("l", "mm", "a2");
   // doc.text("pfmsApilog", 170, 10);
    autoTable(doc, { html: table });
   
   // doc.text("https://rajkosh.rajasthan.gov.in", 10, 200);
    doc.save("NewTokenReport.pdf");
    this.loader.setLoading(false);
  }, 500);
 
}


exportexcel(json: any[], excelFileName: string): void {
  var Heading: any = [
    [' Sr No.',' DDO Code','Token No','Major Head','Cash Amount','Gross Amount','Bill Type','Cde Ref No / Sanction Ref No']
  ];
  let arr:any[]=[]
  json.forEach((item:any,index:any)=>{
    let a={
      " Sr No.":index+1,
      "DDO Code":item.DDoCode,
      "Token No":item.TokenNo,
      "Major Head":item.Majorhead,
      "Cash Amount":item.CashAmt,
      "Gross Amount":item.GrossAmt,
      "Bill Type":item.Billtype,
      "Cde Ref No / Sanction Ref No":item.Cde_refNo,
        }

       
arr.push(a)
//console.log("a__",a)
  })
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arr);
 // var elt = document.getElementById('LIST');
 // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elt);
  XLSX.utils.sheet_add_aoa(worksheet, Heading)
 // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  // fileSaver.saveAs(exportcompletedata, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  fileSaver.saveAs(data, fileName);
}

}


