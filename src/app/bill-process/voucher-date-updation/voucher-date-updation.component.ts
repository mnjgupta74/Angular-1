import { Component, OnInit, Pipe } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { ApiService } from 'src/app/utils/utility.service';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-voucher-date-updation',
  templateUrl: './voucher-date-updation.component.html',
  styleUrls: ['./voucher-date-updation.component.scss']
})
export class VoucherDateUpdationComponent implements OnInit {


  VoucherDateUpdationForm: any;
  TreasuryListarr: any;
  Treasuryoptions: Observable<any[]> | undefined;
  ChooseOption: any = '';
  mat_radio_1: boolean = true
  mat_radio_2: boolean = false
  radioButtonvalue: any = 1;
  matDatepickerDisable: boolean = false;

  VDateChange: boolean = false;  // Visible False
  // VDateChange:boolean=true;   // Visible True

  VoucherDateUpdationFormData: any;
  VoucherDateStatusResult: any;
  DivisionData: any;
  maxDate: any;
  DivCodeVal: any
  FetchedTreasRefNo: any
IP:any


  constructor(public dialog: MatDialog, private ApiMethods: ApiMethods, private snackbar: SnackbarService, private finyear_: Helper, public loader: LoaderService, public ApiService: ApiService, public Helper: Helper,private asgnId: Helper) {
    this.maxDate = new Date();
    this.IP= this.ApiMethods.clientIP;
  }

  ngOnInit(): void {

    this.VoucherDateUpdationForm = new FormGroup({
      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
      VoucherNo: new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]),

    });

    this.VoucherDateUpdationFormData = new FormGroup({
      VoucherNoVal: new FormControl({ value: '', disabled: true }),
      BillTypeVal: new FormControl({ value: '', disabled: true }),
      VoucherDateVal: new FormControl({ value: '', disabled: true }),
      GrossAmountVal: new FormControl({ value: '', disabled: true }),
      CashAmountVal: new FormControl({ value: '', disabled: true }),
      PaymentModeVal: new FormControl({ value: '', disabled: true }),
      BudgetHeadVal: new FormControl({ value: '', disabled: true }),
      OfficeIDVal: new FormControl({ value: '', disabled: true }),
      NewVoucherDateVal: new FormControl(new Date(), [Validators.required]),
      DivCode: new FormControl({ value: '', disabled: true }),

    });

    this.getTreasuryList();

  }


  getTreasuryList() {

    this.loader.setLoading(true);

    if (this.Helper.Treasury_Code != "5000") {
      this.VoucherDateUpdationForm.controls['TreasuryControl'].disable();
    }

    this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any) => {
      console.log("Auditor__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.TreasuryListarr = resp.result
        //console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
        this.Treasuryoptions = this.VoucherDateUpdationForm.controls['TreasuryControl'].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.treasuryCode
          }),
          map((treasury: any) => {

            return treasury ? this._filterTreas(treasury, data) : data.slice()
          })
        );
        const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Helper.Treasury_Code)[0];
        this.VoucherDateUpdationForm.patchValue({
          TreasuryControl: treasury

        })


      }
    })
    this.loader.setLoading(false);

  }


  _filterTreas(value: string, data: any) {
    return data.filter((option: any) => {
      return option.TreasuryName.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayTreasFn(selectedoption: any) {
    return selectedoption ? selectedoption.TreasuryName : undefined;
  }


  radioButtonGroupChange(event: any) {
    this.matDatepickerDisable = false;
    if (event.value == 1) {
      this.radioButtonvalue = 1
      this.VoucherDateUpdationFormData = new FormGroup({
        NewVoucherDateVal: new FormControl({ value: '', disabled: false }),
        DivCode: new FormControl({ value: '', disabled: true }),
      });
    }
    else {
      this.radioButtonvalue = 2
      this.VoucherDateUpdationFormData = new FormGroup({
        DivCode: new FormControl({ value: this.DivCodeVal.toString(), disabled: false }),
        NewVoucherDateVal: new FormControl({ value: '', disabled: true }),
      });

      this.matDatepickerDisable = true;
      this.VoucherDateUpdationFormData.get('DivCode').enable();

      // this.VoucherDatepick.disable=true;
    }
    console.log("XXXXXXX_mat_radioButtonvalue", this.radioButtonvalue);

    console.log("XXXXXXX_mat_DivCodeVal", this.DivCodeVal);
  }


  VoucherInfoShow() {

    this.getDivisionlist();

    let tCode = this.VoucherDateUpdationForm.controls['TreasuryControl'].value.TreasuryCode;
    let voucherNO = this.VoucherDateUpdationForm.controls['VoucherNo'].value;
    // let finYr = this.finyear_.year.toString();
    let finYr = 2022; // Only For Test


    let dataPost = {
      "treasuryCode": tCode,
      "voucherNo": voucherNO,
      "finYear": finYr,
    }



    this.loader.setLoading(true);

    console.log("Before_Calling_API_VoucherInfoShow_Result", dataPost);

    //api call Voucher Date / Division  Update Show
    this.ApiMethods.postresultservice(this.ApiService.VoucherDateUpdateShow, dataPost).subscribe((resp:any) => {

      if (resp.result.length > 0) {
        this.VDateChange = true;   //  Visible True "Update Voucher Date/Division MatCard Details" 

        // let VoucherDateUpdationResultArray = resp.result;
        // this.VoucherDateStatusResult = VoucherDateUpdationResultArray[0];

        this.VoucherDateStatusResult = resp.result[0];
        
        this.FetchedTreasRefNo = resp.result[0].treasury_refno;
         
        //console.log("After_Calling_API_FetchedRefNoVal_Result", this.FetchedTreasRefNo);


        this.loader.setLoading(false);

        if (Object.keys(this.VoucherDateStatusResult).length > 0) {
          this.VoucherDateUpdationFormData.patchValue({
            VoucherNoVal: this.VoucherDateStatusResult.voucherno,
            BillTypeVal: this.VoucherDateStatusResult.billtype,
            //VoucherDateVal: this.VoucherDateStatusResult.voucherdate,
            VoucherDateVal: formatDate(new Date(this.VoucherDateStatusResult.voucherdate), 'dd/MM/yyyy', 'en'),
            GrossAmountVal: this.VoucherDateStatusResult.GROSSAMT,
            CashAmountVal: this.VoucherDateStatusResult.netamt,
            PaymentModeVal: this.VoucherDateStatusResult.ecs,
            BudgetHeadVal: this.VoucherDateStatusResult.budgethead,
            // DivCode  : this.VoucherDateStatusResult.divcode.toString(),
            //DivCode  : '204',  // Only For Test 
            OfficeIDVal: this.VoucherDateStatusResult.officeid,

          });

          this.DivCodeVal = this.VoucherDateStatusResult.divcode.toString() 
          // this.DivCodeVal = 204  // Only For Test 


          console.log("YYYYYYYYY_mat_DivCodeVal", this.DivCodeVal);

          //this.VoucherDateUpdationFormData.get('DivCode').patchValue('204');

          if (this.VoucherDateStatusResult.PaymentMode == "ECS" && this.Helper.Treasury_Code != "5000") {
            this.snackbar.show('Update in Voucher Date not allowed for ECS Bills !', 'alert');
          }

        }

      }
      else {
        this.VDateChange = false;
        this.snackbar.show('No Data Found !', 'alert');
        this.loader.setLoading(false);
      }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');

        }
      }
    );

  }


  getDivisionlist() {
    let tCode = this.VoucherDateUpdationForm.controls.TreasuryControl.value.TreasuryCode;
    //let strBudgetHead = this.VoucherDateUpdationFormData.controls['BudgetHeadVal'].value.slice(0, 4);;
    let strBudgetHead = "8782"; // for Testing
    this.ApiMethods.getservice(this.ApiService.getDivisionlist + '/' + tCode + '/' + strBudgetHead).subscribe((resp:any) => {
      if (resp.result && Object.keys(resp.result).length > 0) {
        this.DivisionData = resp.result;

        console.log("XXXXXXXXXXXXXX_this.Division_result", this.DivisionData);

      }

    });

  }

  VoucherInfoUpdation() {

    this.loader.setLoading(true);


    let treasuryRefCode = this.FetchedTreasRefNo;
    let NewVoucherDtVal = this.VoucherDateUpdationFormData.controls.NewVoucherDateVal.value;
    var datePipe = new DatePipe("en-US");
    let VDate = datePipe.transform(NewVoucherDtVal, 'yyyy-MM-dd');         // Get Date Value
    let uid = sessionStorage.getItem('rajkoshId');
    let ipAdd = "172.22.32.102"  // For Test
    let divCode = this.VoucherDateUpdationFormData.controls.DivCode.value;     // Get DivCode Value
   // let assignmentId =this.asgnId.assignmentId;


    // Checking Existing Grn Entry Code >>------------------------------------------->
   
    // Checking transaction is belong to Integration
      this.ApiMethods.getservice(this.ApiService.CheckGrnEntryExist  + treasuryRefCode).subscribe((resp:any) => {

      if (resp.result == 0) 
      {
        this.loader.setLoading(false);
        this.snackbar.show('DMFT / WAM / Department Integrated Transactions can not be update !', 'alert');
      }
      // else {
      //   this.snackbar.show('No Data Found !', 'alert');
      //   this.loader.setLoading(false);
      // }
    },
      (res:any) => {
        console.log("errror message___", res.status);
        if (res.status != 200) {
          this.loader.setLoading(false);
          this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');

        }
      }
    );


    // New Voucher Date Updation Code >>------------------------------------------->
    if (this.radioButtonvalue == 1) {
      let UpdateVoucherDatePost = {
        "treasuryRefNo": treasuryRefCode,
        "voucherDate": VDate,
        "userId": uid,
        "ipAddress": ipAdd,
      }

      console.log("Before_Calling_API_UpdateVoucherDatePost_Result", UpdateVoucherDatePost);

      
      //this.loader.setLoading(true);

      // Checking transaction is belong to Integration
      // exec TrgCheckexistingGrn @Billcode=10441499  -- SQL SP
      this.ApiMethods.postresultservice(this.ApiService.VoucherDateUpdateSubmit, UpdateVoucherDatePost).subscribe((resp:any) => {       // ---------  ?????? 

        if (resp.result == true) {
          this.loader.setLoading(false);
          this.snackbar.show('Voucher Date Updated Successfully !', 'success');
        }
        else {
          this.snackbar.show('Voucher Date could not be Update !', 'alert');
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');

          }
        }
      );
    }


    // New Div Code Updation Code >>------------------------------------------->
    else if (this.radioButtonvalue == 2) {
      let UpdateDivCodePost = {
        "treasuryRefNo": treasuryRefCode,
        "divisionCode": divCode,
      }

      console.log("Before_Calling_API_UpdateDivCodePost_Result", UpdateDivCodePost);

      //this.loader.setLoading(true);

      // Checking transaction is belong to Integration
      // exec TrgCheckexistingGrn @Billcode=10441499  -- SQL SP
      this.ApiMethods.postresultservice(this.ApiService.VoucherDivUpdateSubmit, UpdateDivCodePost).subscribe((resp:any) => {

        if (resp.result == true) {
          this.loader.setLoading(false);
          this.snackbar.show('Division Code Updated Successfully !', 'success');
        }
        else {
          this.snackbar.show('Division Code could not be Update !', 'alert');
          this.loader.setLoading(false);
        }
      },
        (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger');

          }
        }
      );
    }

  }

  Reset() {
    window.location.reload();
  }
}
