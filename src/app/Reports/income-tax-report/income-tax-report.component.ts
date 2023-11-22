

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
  selector: 'app-income-tax-report',
  templateUrl: './income-tax-report.component.html',
  styleUrls: ['./income-tax-report.component.scss']
})
export class IncomeTaxReportComponent implements OnInit {

  IncomeTaxReportForm: any;
  IncomeTaxReport: boolean=false
  ACBillReport: boolean=false
  WithoutDivisionCode: boolean=false
  CashZeroReports: boolean=false
  
 
  
  constructor( private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService,  public _helperMsg: Helper,   private TCode: Helper,
    private UId: Helper, private IPAdd: Helper, public dialog: MatDialog, private Helper: Helper, private finyear_: Helper, private toyear_: Helper, private asgnId: Helper,
    private http: HttpClient,private apiMethods: ApiMethods) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    
  }

  ngOnInit(): void {

   
 
    this.IncomeTaxReportForm = new FormGroup({
      toDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
       fromDate: new FormControl({ value: '', disabled: false }, [Val.Required, Val.maxLength(12)]),
     
    });

   
  }


  onReset(){
    window.location.reload() 
  }



}




