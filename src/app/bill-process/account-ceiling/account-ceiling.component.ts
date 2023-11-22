import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiService } from 'src/app/utils/utility.service';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import * as Val from 'src/app/utils/Validators/ValBarrel'
import { formatDate } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { IAccountCeiling, IAccountCeilingTransLimit } from 'src/app/utils/Master'
// import autoTable from 'jspdf-autotable';
import { Helper } from 'src/app/utils/Helper';
 

@Component({
  selector: 'app-account-ceiling',
  templateUrl: './account-ceiling.component.html',
  styleUrls: ['./account-ceiling.component.scss']
})


export class AccountCeilingComponent implements OnInit {
  // @ViewChild('myTable', { static: false }) el!: ElementRef;
  SelectBilltype: any = ''

  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en-in');
  picker1: any = formatDate(new Date(), 'dd/MM/yyyy', 'en-in');
  picker2: any = formatDate(new Date(), 'dd/MM/yyyy', 'en-in');

  Accountceilingform: any;
  BillTypelist: any = '';

  // getTokenl: TOKENLIST = new TOKENLIST();
  toastr: any;
  Report: any = [];

  sum: any;
  item: any;
  Name: any;
  resps: any;
  selectfrom: any;

  MyData = []
  hideButton1 = true;
  //Slider config
  autoTicks = false;
  // disabled = false;
  // invert = false;
  perval: number | null = null;
  selectedsum = 0;
  sumof = 0;
  max:number = 0;
  min:number= 0;

  // step = 1;
  // thumbLabel = false;
  slidevalue = 0;
  percentage = 0;

  accountceiling: IAccountCeiling = {
    fromDate:this.finyear_.year.toString(),
    toDate:this.toyear_.finyear.toString(),
    limitAmount: 0,
    billType: 0,
    // Sselectedsum:0
  }
  accountceilingtranslimit: IAccountCeilingTransLimit = {
    fromDate:this.finyear_.year.toString(),
    toDate:this.toyear_.finyear.toString(),
    // limitAmount: 0,
    billType: 0,
    setLimitAmount: 0,
    amountTotal: 0,
    recCount: 0,
    makerId:this.UId.UserId,
  }
  getTokenl: any;
  UserId: any;



  constructor(private ApiMethods: ApiMethods, public loader: LoaderService, private snackbar: SnackbarService, private ApiService: ApiService,private finyear_:Helper,private toyear_:Helper,private TCode:Helper,private UId:Helper) {


    this.getBillTypeList()
    // this.getAuditorList()  //call auditor list
    // this.getTokenList()
  }


  Amount: any


  onInput(event: Event) {
    this.slidevalue = 0
    const target = event.target as HTMLInputElement;
    console.log(target.value);
    this.perval = parseInt(target.value)
    console.log(this.perval);
    if (this.perval >= 0 && this.perval <= 100) {
      console.log("Hi, It's working fine", this.perval);
      let cal = (this.perval / 100) * this.max
      this.slidevalue = Math.floor(cal)
      console.log("Calc_Per_val", this.slidevalue);

      const dt1 = [...this.resps];
      const data = dt1.splice(0, (this.slidevalue));
      console.log("% val_data", data);

      let pervalsum = 0;
      if (data.length > 0) {
        pervalsum = data
          .map((x: any) => parseFloat(x.GrossAmt))
          .reduce((x: any, y: any) => {
            return x + y;
          });
        this.selectedsum = pervalsum;
        console.log("total_selected_rec_Sum", this.selectedsum);
        // console.log(event.value);
      } else {
        console.log("Not a valid input")
      }


    } else {
      alert("Please enter value between 0% to 100%")
    }
  }

  GetBillTypeListCode() {
    this.accountceiling.billType = this.Accountceilingform.value.BillTypeControl;
    let BillCode = this.accountceiling.billType;
    console.log("biilcode__", BillCode);
  }

  //onSliderChange(event: MatSliderChange) {
  onSliderChange(event:any= MatSliderChange) {
    // this.selectedsum = 0;
    const dt = [...this.resps];
    const data = dt.splice(0, (this.slidevalue));
    let slideselectedsum = 0;
    if (data.length > 0) {
      console.log("slide data", data);

      slideselectedsum = data
        .map((a: any) => parseFloat(a.GrossAmt))
        .reduce((a: any, b: any) => {
          return a + b;
        });
    }
    this.selectedsum = slideselectedsum;
    console.log("total_selected_rec_Sum", this.selectedsum);
    console.log(event.value);
  }

  // post main mthod
  onShow() {
 
    this.hideButton1 = false;
    console.log('ss', this.Accountceilingform.value)
    this.accountceiling.limitAmount = this.Accountceilingform.value.Amount
    this.accountceiling.fromDate = this.selectfrom;
    // this.accountceiling.toDate = this.Accountceilingform.value.toDate.toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
    this.accountceiling.fromDate = this.Accountceilingform.value.fromDate
    this.accountceiling.toDate = this.Accountceilingform.value.toDate


    this.loader.setLoading(true);
    this.ApiMethods.postresultservice(this.ApiService.AmountCappingPost, this.accountceiling).subscribe({
      next: (res:any)=> {
        // res.result
        if (res.result.length > 0) {
          let sum = res.result.map((a: any) => parseFloat(a.GrossAmt)).reduce((a: any, b: any) => {
            return a + b;
          });
          console.log("TOTAL RECORD", sum)
          this.Report = res.result.length

          console.log("Total number", res.result);
          console.log("Total number", this.Report);

          this.resps = res.result
          this.max = this.Report
          this.sumof = sum
          console.log("model", this.accountceiling)
          this.loader.setLoading(false);
        }
        else {
          // alert("No record found")
          this.snackbar.show('No record found', 'danger');
          this.loader.setLoading(false);
        }


      },

      error: () => {
        // this.snackbar.show("service is not working", "danger",);
        this.snackbar.show('service is not working', 'danger');
        this.loader.setLoading(false);
      }
    })

    
  }

  onSubmit() {
    if ((this.slidevalue > 0 && this.slidevalue < 100)) {
      this.accountceilingtranslimit.setLimitAmount = this.Accountceilingform.value.Amount
      this.accountceilingtranslimit.amountTotal = this.selectedsum
      this.accountceilingtranslimit.recCount = this.slidevalue
      this.accountceilingtranslimit.billType = this.accountceiling.billType;
      this.accountceilingtranslimit.fromDate = this.Accountceilingform.value.fromDate
      this.accountceilingtranslimit.toDate = this.Accountceilingform.value.toDate
      this.loader.setLoading(true);
      this.ApiMethods.postresultservice(this.ApiService.AmountCappingPostSubmit, this.accountceilingtranslimit).subscribe((x:any) => {
        if (x.result.status = "Y") {
          // chequeFrom = 0;
          console.log("submited");
          this.snackbar.show('Submitted Sucessfully !', 'success');
          // alert("Submitted Sucessfully");
          this.loader.setLoading(false);
           
          // window.location.reload();
          
          // Page Reset Position ---------------------------------------------------begiN----- 
          this.Accountceilingform = new FormGroup({
            toDate: new FormControl({ value: '', disabled: false }),
            fromDate: new FormControl({ value: '', disabled: false }),
            BillTypeControl: new FormControl(''),
            Amount: new FormControl('') 
          })
          
          this.hideButton1 = true;
          // ----------------------------------------------------------------------enD----- 

        }
        else {
          this.snackbar.show('not valid', 'danger');
          this.loader.setLoading(false);
          // alert("not valid");
        }


        ;
      });
    } 
    else{
      // alert("Not A valid Data")
      this.snackbar.show('Not A valid Data', 'danger');
      this.loader.setLoading(false);
    }
    


  }

  // get bill type list
  getBillTypeList() {
    let url=this.ApiService.BillTypeList + 1;
    
    this.ApiMethods.getservice(url).subscribe((resp:any) => {
    // this.ApiMethods.getservice(this.ApiService.BillTypeList).subscribe((data: any) => {
      console.log("Billtype__res", resp.result);
      this.BillTypelist = resp.result;
    })
  }

 

  ngOnInit(): void {
    this.Accountceilingform = new FormGroup({
      toDate: new FormControl({ value: '', disabled: false }),
      fromDate: new FormControl({ value: '', disabled: false }),
      fieldname: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      userType: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      Amount: new FormControl('', [Val.Required, Val.maxLength(12), Val.Numeric]),
      BillTypeControl: new FormControl(''),
      UserControl: new FormControl(''),
      perval: new FormControl(''),

      
    })
    console.log("per value", this.perval);

  }

}

