import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
// import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel'
import { BillEntryList, SaveBillFromAccount } from 'src/app/utils/Master';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { Helper } from 'src/app/utils/Helper';
import { MatPaginator } from '@angular/material/paginator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface BillTypeMaster {
  FrmToken: number;
}
@Component({
  selector: 'app-bill-objection-list',
  templateUrl: './bill-objection-list.component.html',
  styleUrls: ['./bill-objection-list.component.scss'],
})
export class BillObjectionListComponent implements OnInit {

  @ViewChild('test', { static: false }) el!: ElementRef;
  filename = "BillObjectionList.xlsx";
  exportcompletedata:any[]=[]
  billObjection: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns = ['SrNo', 'TokenNo', 'DDO', 'Billtype', 'ObjectionName', 'Auditor', 'Accountant', 'TO']

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.billObjection.sort = sort;
  }
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.billObjection.paginator = paginator;
  }

  ShowbillObjectionList: boolean = false
  startYear = new Date().getFullYear();
  Years: any[] = [];
  base64data:any;
  ChooseOption: any = '';
  Treasuryoptions: Observable<any[]> | undefined;
  TreasuryListarr: any[] = []


  ObjectionreportList: any = {
    
      "billNo": 1212,
      "reportPath": "/Treasury/MIS/Reports/RPT_GET_BILL_OBJECTION_LIST.xdo",
      "format": "pdf",
      "params": [
          {
              "name": "v_Type",
              "value": 1
          },
          {
              "name": "v_Treasurycode",
              "value": "2100"
          },
          {
              "name": "v_FinYear",
              "value": 2023
          },
          {
              "name": "v_Tokenno",
              "value": 25381
          },
          {
              "name": "v_result_type",
              "value": "A"
          }
      ]
  }

  constructor(private sanitizer: DomSanitizer, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, private TCode: Helper, private finyear_: Helper, private toyear_: Helper) {

  }

  ngOnInit(): void {
    for (let i = 0; i < 2; i++) 
    {
      this.Years.push(this.startYear - i);
    }
    this.getTreasuryList();
    this.billobjectionGroup = new FormGroup({ 
      FrmToken: new FormControl('', [ Val.Required, Val.minLength(1), Val.maxLength(8), Val.cannotContainSpace, Val.Numeric,]),
    //  FrmTreasuryCode: new FormControl({ value: this.forwardBill.treasurycode, disabled: true, }),
      FrmAuditor: new FormControl(''),
      FrmFinYear: new FormControl('',{ validators: [this.ApiMethods.autocompleteObjectValidator(),Validators.required] }),
      TreasuryControl: new FormControl({ value: this.forwardBill.treasurycode}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    });

  }

  billobjectionGroup: any;
  billObjectionList: any = []
  forwardBill: BillEntryList = {
    treasurycode: this.TCode.Treasury_Code,
    tokenNo: 0,
    type: 1,
    finyear: this.finyear_.year.toString(),
  };


  Filter(filterValue: string) {
    this.billObjection.filter = filterValue.trim().toLowerCase();
    if (this.billObjection.paginator) {
      this.billObjection.paginator.firstPage();
      console.log("billdetails", this.billObjection.filter)
    }
  }
  onReset() {
    window.location.reload();
  }

  onsubmit() {
    // this.billObjectionList = [];
    // this.loader.setLoading(true)
    let data = {
      // treaCode: this.billobjectionGroup.controls['FrmTreasuryCode'].value,
      treaCode: this.billobjectionGroup.controls['TreasuryControl'].value.TreasuryCode,
      tokenNo: this.billobjectionGroup.controls['FrmToken'].value,
      type: 1,
      finyear: this.billobjectionGroup.controls['FrmFinYear'].value,
    };
    console.log("data______", data);
    this.loader.setLoading(true)
    this.ApiMethods.postresultservice(this.ApiService.getBillObjectionList, data).subscribe((resp:any) => {
      console.log("After_API_Save_Result__", resp);
      if (resp.result.length > 0) {
        console.log(resp);
        this.billObjectionList = resp.result
        this.billObjection.data = resp.result
        this.ShowbillObjectionList = true
        console.log("data_sendbefore__", this.billObjectionList);
        this.loader.setLoading(false)
        // alert('Successfully Inserted And NewMappedDDOCode is :' + result.result);
        // this.toastrService.success('Successfully Save & DDOCode is :' + result.result, 'Success!');
      }
      else {
        this.snackbar.show("No Data Found !", 'alert')
        this.loader.setLoading(false);
        this.ShowbillObjectionList = false
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
          this.ShowbillObjectionList = false
        }
      });
  }
  //export to pdf 
  // makePdf() {
  //   var doc = new jsPDF("l", "mm", "a4");
  //   autoTable(doc, { html: "#test" });
  //   doc.text("Bill Objection List", 130, 10);
  //   doc.text("Rajkosh.raj.nic.in", 10, 200);
  //   doc.save("sample.pdf");

  // }


  // // // export to excel
  // exportexcel(): void {
  //   let user = document.getElementById('test')
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  //   XLSX.writeFile(wb, this.filename);

  // }

  /// complete excel data
exportexcel(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  // fileSaver.saveAs(exportcompletedata, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  fileSaver.saveAs(data, fileName);
}

  //ORACLE PDF EXPORT ?????????????????????
  exportPdf() {
     this.ObjectionreportList.params[1].value = this.TCode.Treasury_Code;
    this.ObjectionreportList.params[2].value = this.finyear_.currentYear;
       this.ObjectionreportList.params[3].value = this.billobjectionGroup.controls['FrmToken'].value;
    console.log("beforeapi called reportlist_", this.ObjectionreportList)
    this.loader.setLoading(true)
    //api call of Treasury Officer List
    this.ApiMethods.postresultservice(this.ApiService.OracleReport, this.ObjectionreportList).subscribe((resp:any) => {
      console.log("imgresp__", resp)
      var response = resp.data
      if (Object.keys(response).length > 0) {
        let documentArray = resp.data.report;
        console.log("docc__", documentArray)
        this.base64data = "data:application/pdf;base64," + documentArray.content;
        console.log("base64", this.base64data)
        this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(documentArray.content) as any).changingThisBreaksApplicationSecurity;
       // this.showReport = true
       let w = window.open('about:blank', 'mywindow', "width=1200, height=800");
        w?.document.write(' <iframe id="ireport" style="width:100%; min-height:875px;" scrolling="no" frameborder="0" allowfullscreen></iframe>')
        w?.document.getElementById('ireport')?.setAttribute("src", this.base64data);
        this.loader.setLoading(false)
      }
      else {
        this.snackbar.show('No Data Found !', 'alert')
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
           this.Treasuryoptions = this.billobjectionGroup.controls['TreasuryControl'].valueChanges.pipe(
             startWith(''),
             map((value: any) => {
               return typeof value === 'string' ? value : value.treasuryCode
             }),
             map((treasury: any) => {
   
               return treasury ? this._filter(treasury, data) : data.slice()
             })
           );
           const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.TCode.Treasury_Code)[0];
           this.billobjectionGroup.patchValue({
             TreasuryControl: treasury
   
           })
   
           if(this.TCode.Treasury_Code !="5000")
           {
             this.billobjectionGroup.controls['TreasuryControl'].disable();
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
    console.log("display_fun_call aaa", selectedoption.TreasuryName);
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }

  get FrmToken() {
    return this.billobjectionGroup.get('FrmToken');
  }
  // get BillRef() { return this.BillTypeForm.get('BillRef') }
  get FrmTreasuryCode() 
  {
    //return this.billobjectionGroup.get('FrmTreasuryCode');
    return this.billobjectionGroup.get('TreasuryControl');
  }
  get FrmFinYear() 
  {
    return this.billobjectionGroup.get('FrmFinYear');
  }
}
