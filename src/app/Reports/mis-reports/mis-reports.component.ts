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





@Component({
  selector: 'app-mis-reports',
  templateUrl: './mis-reports.component.html',
  styleUrls: ['./mis-reports.component.scss']
})
export class MisReportsComponent implements OnInit {

  MISReportsForm: any;
  IncomeTaxReport: boolean=false
  ACBillReport: boolean=false
  WithoutDivisionCodeChallanReport: boolean=false
  CashZeroReport: boolean=false
  
 
  
  constructor( private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService,  public _helperMsg: Helper,   private TCode: Helper,
    private UId: Helper, private IPAdd: Helper, public dialog: MatDialog, private Helper: Helper, private finyear_: Helper, private toyear_: Helper, private asgnId: Helper,
    private http: HttpClient,private apiMethods: ApiMethods) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    
  }

  ngOnInit(): void {

   
 
    this.MISReportsForm = new FormGroup({
      ReportType: new FormControl('',Validators.required),
     
    });

   
  }


  get ReportType() { return this.MISReportsForm.get('ReportType') }

  selectReport(event:any){
    console.log("Inside selectReport",event.value)
    if(event.value=='1'){
      this.IncomeTaxReport=true
      this.ACBillReport=false
      this.WithoutDivisionCodeChallanReport=false
      this.CashZeroReport=false
    }
    else if (event.value=='2'){
      this.ACBillReport=true
      this.IncomeTaxReport=false
      this.WithoutDivisionCodeChallanReport=false
      this.CashZeroReport=false
    }
    else if (event.value=='3'){

      this.WithoutDivisionCodeChallanReport=true
      this.ACBillReport=false
      this.IncomeTaxReport=false
      this.CashZeroReport=false
    } 
    else if (event.value=='4'){
      this.CashZeroReport=true
      this.WithoutDivisionCodeChallanReport=false
      this.ACBillReport=false
      this.IncomeTaxReport=false
      
    }
    
  }
   


}



