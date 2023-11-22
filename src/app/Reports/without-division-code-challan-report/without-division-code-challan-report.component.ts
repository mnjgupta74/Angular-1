import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { Helper } from 'src/app/utils/Helper';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http';
import * as Val from '../../../app/utils/Validators/ValBarrel'
import * as fileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';




@Component({
  selector: 'app-without-division-code-challan-report',
  templateUrl: './without-division-code-challan-report.component.html',
  styleUrls: ['./without-division-code-challan-report.component.scss']
})
export class WithoutDivisionCodeChallanReportComponent implements OnInit {
  exportcompletedata:any[]=[]
  WithoutDivisionCodeChallanReportForm: any;
  IncomeTaxReport: boolean=false
  ACBillReport: boolean=false
  WithoutDivisionCode: boolean=false
  CashZeroReports: boolean=false
  BTMajorHeadListarr: any[] = []
  BTMajorHeadList: Observable<any[]> | undefined;
  SelectMajorHead: any = ''
  
 
  
  constructor( private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService,  public _helperMsg: Helper,   private TCode: Helper,
    private UId: Helper, private IPAdd: Helper, public dialog: MatDialog, private Helper: Helper, private finyear_: Helper, private toyear_: Helper, private asgnId: Helper,
    private http: HttpClient,private apiMethods: ApiMethods) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    
  }

  ngOnInit(): void {

   
 
    this.WithoutDivisionCodeChallanReportForm = new FormGroup({
      toDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
       fromDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
       BTMajorHead: new FormControl(''),
     
    });

    this.getMajorHeadList()

   
  }

  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.getMajorheadlist).subscribe((resp:any) => {
      // console.log("Majorhead__res", resp);
      if (resp.result && resp.result.length > 0) {

        this.BTMajorHeadListarr = resp.result;

        this.BTMajorHeadList = this.WithoutDivisionCodeChallanReportForm.controls['BTMajorHead'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            // console.log("Majorheadp__", value);
            return typeof value === 'string' ? value : value.MajorHeadCodeName
          }),
          map((MajorHeadCodeName: any) => {
            // console.log("sMajorhead_", MajorHeadCodeName);
            return MajorHeadCodeName ? this.MajorHead_filter(MajorHeadCodeName, resp.result) : resp.result.slice()
          })
        );
      }
    })
  }

  //  Major Head List filter >>>------------------->
  MajorHead_filter(value: string, data: any) {
    // console.log("filterval__Major", value);
    return data.filter((option: any) => {
      // console.log("option_val__Major", option);
      return option.MajorHeadCodeName.toLowerCase().includes(value.toLowerCase())
    });
  }

   //  Major Head display Function >>>------------------->
   display_Major(selectedoption: any) {
    // console.log('selectedoption===>>>', selectedoption);
    // console.log("display_fun_call_Major", selectedoption);
    //  return selectedoption ? selectedoption.MajorHeadCodeName : 'undefined';
    return selectedoption ? selectedoption.MajorHeadCodeName : selectedoption.MajorHeadCodeName
      ;
  }

  onReset(){
    window.location.reload() 
  }

}





