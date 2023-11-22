import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as Val from '../../utils/Validators/ValBarrel'
import { ApiMethods } from '../../utils/ApiMethods';
import { ApiService } from '../../utils/utility.service';
import { Router } from '@angular/router';
import { IPAYREF, IPayManagerSAVE, IBudgetSAVE } from 'src/app/utils/Master';
//import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { LoaderService } from 'src/app/services/loaderservice';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { findIndex, map, startWith } from 'rxjs/operators';
import { Helper } from 'src/app/utils/Helper';
import { log } from 'console';

@Component({
  selector: 'app-tokenmaster',
  templateUrl: './token-master.component.html',
  styleUrls: ['./token-master.component.scss']
})
export class TOKENMASTERComponent implements OnInit {
  

  // Ddomaster: MatTableDataSource<DDOMaster> = new MatTableDataSource();

  SavePayManagerModal: IPayManagerSAVE = {
    treasuryCode: this.Tcode.Treasury_Code,
    fromFinYear: this.finyear_.year.toString(),
    toFinYear: this.toyear_.finyear.toString(),
    userId: this.usercode_.UserId,
    cdeRefNo: 0,
    ipaddress: '',
    asignmentId: this.asgnId.assignmentId
  }


  SaveBudgetModal: IBudgetSAVE = {
    treasuryCode: this.Tcode.Treasury_Code,
    fromFinYear: this.finyear_.year.toString(),
    toFinYear: this.toyear_.finyear.toString(),
    userId: this.usercode_.UserId,
    cdeRefNo: 0,
    ipaddress: '',
    ddoCode: 0,
    cashAmt: 0,
    grossAmt: 0,
    majorHead: 0,
    asignmentId: this.asgnId.assignmentId

  }

  // PayRefModal: IPAYREF = {
  //   treasurycode: this.Tcode.Treasury_Code,
  //   type: 0,
  //   finyear: this.finyear_.year.toString(),
  //   billnoid: 0
  // }

  datepicker: any = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  PayinputForm: boolean = false;
  // showgetbudgetbtn: boolean = true
  // budgetinputForm: boolean = false
  //  showtrantab: boolean = false
  SelectBilltype: any = ''
  SelectMajorHead: any = ''

  display: boolean = true
  mat_radio_1: boolean = true
  mat_radio_2: boolean = false

  indisplay: boolean = true
  pay_radio: boolean = true
  // budget_radio: boolean = false

  // Form Module
  tokenofflineForm: any;
  tokenonlineForm: any;
  BillTypeoptions: Observable<any[]> | undefined;
  MajorHeadoptions: Observable<any[]> | undefined;
  // MajorHeadobj: any = ''

  //Flags
  loginflag: boolean = true;

  //LIst array
  BillTypeListarr: any = []
  MajorHeadListarr: any = []
  //BudgetRefListarr: any[] = []

  constructor(private router: Router, private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService, public finyear_: Helper, private Tcode: Helper, private toyear_: Helper, private usercode_: Helper, private Fyear_: Helper,private asgnId:Helper) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.getBillTypeList()  // Call Bill Type List
    this.getMajorHeadList()  // Call Major Head List

  }

  radioButtonGroupChange(event: any) {
    console.log("evnenrt______", event.value);
    this.display = !this.display
    if (event.value == 1) {
      this.mat_radio_1 = true
      this.mat_radio_2 = false
      this.tokenofflineForm.reset();
      this.tokenofflineForm.controls['Date'].setValue(this.datepicker)
      this.tokenonlineForm.reset();
      this.tokenonlineForm.controls['Date'].setValue(this.datepicker)
      this.PayinputForm = false;
      // this.budgetinputForm = false
      //  this.showtrantab = false
    }
    else {
      this.mat_radio_2 = true
      this.mat_radio_1 = false
      this.tokenofflineForm.reset();
      this.tokenofflineForm.controls['Date'].setValue(this.datepicker)
      this.tokenonlineForm.reset();
      this.tokenonlineForm.controls['Date'].setValue(this.datepicker)
      this.PayinputForm = false;
      // this.budgetinputForm = false
      //this.showtrantab = false
    }
  }
  radioinnerGroupChange(event: any) {
    console.log(event.value);
    this.indisplay = !this.indisplay
    if (event.value == 1) {
      this.pay_radio = true
      //this.budget_radio = false
    }
    else {
      this.pay_radio = false
      // this.budget_radio = true
    }
  }

  ngOnChanges() {
    alert('ngonchagnes call')
    console.log("ng on change callll");

  }

  ngOnInit() {

    //offline form Group 
    this.tokenofflineForm = new FormGroup({
      Date: new FormControl({ value: this.datepicker, disabled: true }),
      DdoCode: new FormControl('', [Val.Required, Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      DdoName: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(40), Val.SpecialChar]),
      BillType: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      MajorHead: new FormControl('', [Val.maxLength(40), Val.SpecialChar]),
      NetAmt: new FormControl('', [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
      GrossAmt: new FormControl('', [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
      BillTypeControl: new FormControl(''),
      MajorHeadControl: new FormControl(''),
    });

    //onineline form Group 
    this.tokenonlineForm = new FormGroup({
      Date: new FormControl({ value: this.datepicker, disabled: true }),
      payRef: new FormControl('', [Val.maxLength(16), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      BudgetRef: new FormControl({ value: '', disabled: true }, [Val.maxLength(40), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      NDdoCode: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(6), Val.SpecialChar, Val.Numeric, Val.cannotContainSpace]),
      NDdoName: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(40), Val.SpecialChar]),
      NBillType: new FormControl({ value: '', disabled: true }),
      NMajorHead: new FormControl({ value: '', disabled: true }),
      NNetAmt: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
      NGrossAmt: new FormControl({ value: '', disabled: true }, [Val.Required, Val.maxLength(12), Val.SpecialChar, Val.Numeric]),
    })

  }

  onSearch() {
    let payRef = this.tokenonlineForm.controls['payRef'].value;
    console.log("payRef", payRef);

    if (payRef == '' || payRef == null) {
      // this.toastrService.error('Please Enter Reference No!', 'Alert!');
      this.snackbar.show('Please Enter Reference No!', 'alert')
      this.PayinputForm = false
    }
    else {
      this.loader.setLoading(true);


      //api call of get token reference list
      this.ApiMethods.getservice(this.ApiService.PayManagerRef + this.Tcode.Treasury_Code + '/' + payRef).subscribe(resp => {

        console.log("After_API_Search_Result__", resp);
        // let resp_data: any = []

        // resp.result.map((res: any) => {
        //   console.log("test___", resp.result
        //   ); return resp_data = res

        // });
        // console.log("resp_bj", resp_data)


        if (Object.keys(resp.result).length > 0 ) {
          //console.log(resp.result);
          let data = resp.result
          console.log("after api data__", data)
          let resultMessageArr: any = [];
          data.forEach((resultArr: any) => {
            if (resultArr.Message != undefined && resultArr.Message != null) {
              resultMessageArr.push(resultArr.Message);
            }
          });
          // console.log("JSONResult",JSON.stringify(resultMessageArr));
          //console.log("nuisdfh",resultMessageArr)












          if (data[1].out_err_msg == '0') {
            //  if (data.status==null) {
            this.loader.setLoading(false);
            // this.tokenonlineForm.reset()
            this.tokenonlineForm.patchValue({
              Date: this.datepicker,
              NDdoCode: data[0].ddoCode,
              NDdoName: data[0].officename,
              NBillType: data[0].BillType,
              NMajorHead: data[0].budgethead,
              NNetAmt: data[0].cashAmoumt,
              NGrossAmt: data[0].grossAmount
            })
            this.PayinputForm = true
          }






            //Bill Type list filteration
            // if (this.BillTypeListarr) {
            //   var newArray = this.BillTypeListarr.filter(function (el: any) {
            //     return el.NCode == data.BillType
            //   })
            //   console.log("newarray_Biltype", newArray);
            //   this.tokenonlineForm.patchValue({
            //     NBillType: newArray[0].BillType,
            //   })
            // }
            //Major head list filteration
            // if (this.MajorHeadListarr) {
            //   var newArray = this.MajorHeadListarr.filter(function (el: any) {
            //     return el.majorheadcode == data.budgethead
            //   })
            //   console.log("newarray_val", newArray);
            //   this.tokenonlineForm.patchValue({
            //     NMajorHead: newArray[0].majorheadname,
            //   })
            // }
            // this.budgetinputForm = false
          // else if (data.Status == -9) {
          //   //this.toastrService.info('Reference Number Is Used For Token No' + '-' + data.TokenNO);
          //   this.snackbar.show('Reference Number Is Used For Token No' + '-' + data.TokenNO,'Info')
          //   this.loader.setLoading(false);
          // }
          else if (data.out_err_msg != 0) {
            this.snackbar.show(JSON.stringify(resultMessageArr).substring(1, JSON.stringify(resultMessageArr).length - 1), 'danger')
            this.loader.setLoading(false);
            this.PayinputForm = false
            // console.log("data____", data.Message)
          }
            // for (let i = 0; i < resp.result.length; i++) {
            //   this.snackbar.show(resp.result[this.i], 'Info!')

            //   console.log("dhu", resp.result)
            // }
            // resp.result.map((res: any) => {
            //   console.log("test___", resp.result
            //   );
            // let i=resp.result.length-1
            // console.log("jf",i)
            // this.snackbar.showMultipleMessages();



            // })
            //  this.toastrService.info('Bill yet not forwarded to Treasury !', 'Info!');

        }
         else {
         //  this.toastrService.info('No Data Found!', 'Info!');
          this.snackbar.show('No Data Found!', 'Info!')
          this.loader.setLoading(false);
        }

      },
        (res) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')
            this.PayinputForm = false

            // this.snackbar.showMultipleMessages();
          }
        }

      );

    }
  }

  onPayManagerSave() {

    let payRef = this.tokenonlineForm.controls['payRef'].value;
    console.log("data__onupadate", payRef);


    if (payRef) {

      console.log("Paymangatesaveeee___", this.SavePayManagerModal);
      this.SavePayManagerModal.cdeRefNo = this.tokenonlineForm.controls['payRef'].value;  //  "deptType" (14)

      this.SavePayManagerModal.ipaddress = "http://172.22.32.102"
      let billtype = this.tokenonlineForm.controls['NBillType'].value;  //Gross Amount controller
      let Netamount = this.tokenonlineForm.controls['NNetAmt'].value;  //Net Amount controller
      let Grossamount = this.tokenonlineForm.controls['NGrossAmt'].value;  //Gross Amount controller
      console.log("aftervalue___", this.SavePayManagerModal);


      // stop here if form is invalid
      if (this.tokenonlineForm.invalid) {
        console.log('Error');
        return;
      }
      // else if (JSON.parse() > JSON.parse(Grossamount)) {
      else if (Number(Netamount) > Number(Grossamount)) {

        console.log("netttttt___", Netamount,);
        console.log("grGrossAmountoss", Grossamount);
        console.log("netammount");

        // this.toastrService.error('Net amount cannot be greater than GrossAmount amount', 'Error!');
        this.snackbar.show('Net amount cannot be greater than GrossAmount amount', 'Error!')
      }
      else if (billtype == 20 && Netamount != 0) {
        // this.toastrService.error('Net amount should be 0 when billtype is 20', 'Error!');
        this.snackbar.show('Net amount should be 0 when billtype is 20', 'Error!')
      }
      else {

        if (this.loginflag && this.tokenonlineForm.valid) {
          console.log("Before_API_Save_Result", this.SavePayManagerModal);
          this.loader.setLoading(true);

          // Office id verify api call
          this.ApiMethods.postresultservice(this.ApiService.SavePayManager, this.SavePayManagerModal).subscribe(resp => {

            console.log("office_verify___", resp.result);
            let data = resp.result[0]
            console.log("dataval___", data)
            if (data.str == 1) {
              console.log("data", data.NewTokenNo);
              // this.toastrService.success('Successfully Inserted and Note TOKEN NUMBER :' + '\n' + this.Tcode.Treasury_Code +'-v ' +'2324-' + '' + data.NewTokenNo.toString(), 'Success!');
              this.snackbar.show(' TOKEN NUMBER :' + '\n' + this.Tcode.Treasury_Code + '-' + this.Fyear_.forwardYear + '-' + data.NewTokenNo.toString() + '\n' + "Generated Successfully", 'success')
              //  this.toastrService.success('Successfully Inserted and Note TOKEN NUMBER :' +  data.NewTokenNo.toString());
              this.loader.setLoading(false);
              this.tokenonlineForm.reset();
              this.display = true
              this.mat_radio_1 = true
              this.mat_radio_2 = false
              this.indisplay = true
              // this.budget_radio = false
              // this.budgetinputForm = false
              this.PayinputForm = false
            }
            else if (data.Status == -9) {
              // this.toastrService.info('Reference Number Is Used For Token No' + "-" + data.NewTokenNo.toString());
              this.snackbar.show('Reference Number Is Used For Token No' + "-" + data.NewTokenNo.toString(), 'alert')
              this.loader.setLoading(false);
            }



          },
            (res) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
                this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')

              }
            })


        }
        else {
          alert('Captcha Failed');
        }
      }
    }


  }

  // onBudgetSave() {

  //   let BudgetRef = this.tokenonlineForm.controls['BudgetRef'].value;
  //   console.log("data__BudgetRef", BudgetRef);


  //   if (BudgetRef) {

  //     console.log("Save_Else_Part", this.SaveBudgetModal);
  //     this.SaveBudgetModal.billnoid = this.tokenonlineForm.controls['BudgetRef'].value;  //budgetRef controller
  //     this.SaveBudgetModal.ddoCode = this.tokenonlineForm.controls['NDdoCode'].value;  //DdoCode controller
  //     this.SaveBudgetModal.cashAmt = this.tokenonlineForm.controls['NNetAmt'].value;  //Net Amount controller
  //     this.SaveBudgetModal.grossAmt = this.tokenonlineForm.controls['NGrossAmt'].value;  //Gross Amount controller
  //     let billtype = this.tokenonlineForm.controls['NBillType'].value;  //Gross Amount controller

  //     let majorhead = this.MajorHeadobj
  //     console.log("major_head-obj_", majorhead);

  //     this.SaveBudgetModal.majorHead = majorhead.majorheadcode  //Gross Amount controller
  //     this.SaveBudgetModal.ipaddress = "http://172.22.32.102"

  //     console.log("aftervalue___", this.SaveBudgetModal);
  //     // stop here if form is invalid
  //     if (this.tokenonlineForm.invalid) {
  //       console.log('Error');
  //       return;
  //     }
  //     else if (Number(this.SaveBudgetModal.cashAmt) > Number(this.SaveBudgetModal.grossAmt)) {
  //      // this.toastrService.error('Net amount cannot be greater than gross amount', 'Error!');
  //      this.snackbar.show('Net amount cannot be greater than gross amount', 'Error!')
  //     }
  //     else if (billtype == 20 && this.SaveBudgetModal.cashAmt != 0) {
  //     //  this.toastrService.error('Net amount should be 0 when billtype is 20', 'Error!');
  //     this.snackbar.show('Net amount should be 0 when billtype is 20', 'Error')
  //     }
  //     else {

  //       if (this.loginflag && this.tokenonlineForm.valid) {
  //         console.log("Before_API_Save_Result", this.SaveBudgetModal);
  //         this.loader.setLoading(true);

  //         // Office id verify api call
  //         this.ApiMethods.postresultservice(this.ApiService.SaveBudget, this.SaveBudgetModal).subscribe(resp => {

  //           console.log("office_verify___", resp.result);
  //           let data = resp.result[0]
  //           if (data.UsedTokenNo == 0) {
  //             this.snackbar.show('Successfully Inserted and TOKEN NUMBER :' + this.Tcode.Treasury_Code + '-0000-' + data.NewTokenNo, 'success!')
  //           //  this.toastrService.success('Successfully Inserted and TOKEN NUMBER :' + this.Tcode.Treasury_Code + '-0000-' + data.NewTokenNo, 'Success!');
  //             this.loader.setLoading(false);
  //             this.tokenonlineForm.reset();
  //             this.display = true
  //             this.mat_radio_1 = true
  //             this.mat_radio_2 = false
  //             this.indisplay = true
  //             this.budget_radio = false
  //             this.budgetinputForm = false
  //             this.PayinputForm = false
  //             this.pay_radio = true
  //             this.showgetbudgetbtn = true
  //             this.MajorHeadobj = ''
  //           }
  //           else if (data.UsedTokenNo == -9) {
  //             //this.toastrService.info('Reference Number Is Used For Token No' + '-' + data.NewTokenNo);
  //             this.snackbar.show('Reference Number Is Used For Token No' + '-' + data.NewTokenNo, 'alert')
  //             this.loader.setLoading(false);
  //           }



  //         },
  //           (res) => {
  //             console.log("errror message___", res.status);
  //             if (res.status != 200) {
  //               this.loader.setLoading(false);
  //             //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
  //             this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')

  //             }
  //           })


  //       }
  //       else {
  //         alert('Captcha Failed');
  //       }
  //     }
  //   }


  // }

  // onGetBudget() {
  //   this.budgetinputForm = false
  //   console.log("ip__adddd_", this.ApiMethods.ippAddress);

  //   this.loader.setLoading(true);
  //   this.PayRefModal.type = 1
  //   console.log("payref_modal", this.PayRefModal);

  //   //api call of Budget Ref List
  //   this.ApiMethods.postresultservice(this.ApiService.BudgetRefList, this.PayRefModal).subscribe(resp => {

  //     console.log("After_API_Budgetref_Result__", resp);
  //     if (resp.result.length > 0) {
  //       console.log("BudgetRef___", resp.result);
  //       this.BudgetRefListarr = resp.result
  //       this.showtrantab = true
  //       this.loader.setLoading(false);
  //       document.getElementById("myelem")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     }
  //     else {
  //      // this.toastrService.info('No Budget Reference Details Found !', 'Info!');
  //      this.snackbar.show('No Budget Reference Details Found !', 'Info')
  //       this.loader.setLoading(false);
  //     }
  //   },
  //     (res) => {
  //       console.log("errror message___", res.status);
  //       if (res.status != 200) {
  //         this.loader.setLoading(false);
  //       ///  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
  //       this.snackbar.show('Something Went Wrong! Please Try Again', 'danger')

  //       }
  //     }
  //   );

  // }

  displayFn(selectedoption: any) {
    console.log("displayfuncall");

    return selectedoption ? selectedoption.BillType : undefined;
  }

  //get Bill type list api call
  getBillTypeList() {
    this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe(resp => {
      console.log("Treasury__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.BillTypeListarr = resp.result
      }
      console.log("treasury_inbetween", this.BillTypeListarr);
      this.BillTypeoptions = this.tokenofflineForm.controls['BillTypeControl']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
           console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.BillTypeListarr
        }),
        map((BillType: any) => {
           console.log("second__map", BillType);

          return BillType ? this._filter(BillType, data) : data.slice()
        })
      );

     })

  }

  _filter(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.BillType.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayMajor(selectedoption: any) {
    console.log("displayfuncall");
   let displayResult:any=selectedoption.majorheadcode +"-"+ selectedoption.majorheadname
    return selectedoption ? displayResult: undefined;
  }

  //get Major Head list api call
  getMajorHeadList() {
    this.ApiMethods.getservice(this.ApiService.MajorHeadList + 0).subscribe(resp => {
      console.log("MajorHeadList__res", resp);
      let data = resp.result
      if (resp.result && resp.result.length > 0) {
        this.MajorHeadListarr = resp.result
      }
      console.log("MajorHeadList_inbetween", this.MajorHeadListarr);
      this.MajorHeadoptions = this.tokenofflineForm.controls['MajorHeadControl']
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("firstmap__", value);
          return typeof value === 'string' ? value : value.MajorHeadListarr
        }),
        map((majorheadname: any) => {
          // console.log("second__map", majorheadname);

          return majorheadname ? this._filterMajor(majorheadname, data) : data.slice()
        })
      );

    })

  }

  _filterMajor(value: string, data: any) {
    // console.log("filterval__", value);
    return data.filter((option: any) => {
      // console.log("option_val__", option);
      return option.majorheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  SearchFn(selected: any) {
    console.log("searchfuncall");

    return selected ? selected.ddo_code : undefined;
  }

  OnBillTypeSelected(SelectBilltype: any) {
    console.log("befort______SelectBilltype", SelectBilltype);
    console.log("slelction__________option_____________", this.SelectBilltype);
    this.SaveBudgetModal.cdeRefNo = this.SelectBilltype.Ncode
  }

  OnMajorHeadSelected(SelectMajorHead: any) {
    console.log("befort______SelectMajorHead", SelectMajorHead);
    console.log("slelction__________option__majorhead", this.SelectMajorHead);
    this.SaveBudgetModal.majorHead = this.SelectMajorHead.majorheadcode
  }

  Search_filter(value: string, data: any) {
    // console.log("filterval__search", value, data);

    return data.filter((option: any) => {
      // console.log("option_val__search", option);

      return option.ddo_code.toString().includes(value.toString())
    });
  }


  // onSelectBudget(value: any) {
  //   console.log("onSelectvalu__", value);
  //   this.loader.setLoading(true);
  //   this.showgetbudgetbtn = false
  //   if (value) {
  //     this.PayRefModal.type = 2
  //     this.PayRefModal.billnoid = value.RefNo
  //     console.log("payref_modal_budgetref", this.PayRefModal);

  //     //api call of Budget Ref List
  //     this.ApiMethods.postresultservice(this.ApiService.BudgetRefList, this.PayRefModal).subscribe(resp => {

  //       console.log("After_API_Budgetref_Result__", resp);


  //       if (resp.result.length > 0) {
  //         console.log("BudgetRef___selected", resp.result);
  //         let data = resp.result[0];
  //         console.log("arraydastarewesult_", data)
  //         if (true) {

  //           this.loader.setLoading(false);
  //           this.tokenonlineForm.reset()
  //           this.tokenonlineForm.patchValue({
  //             Date: this.datepicker,
  //             NDdoCode: data.DDOCode,
  //             NDdoName: data.officename,
  //             // NBillType: data.BillType,
  //             // NMajorHead: data.budgethead,
  //             NNetAmt: data.CashAmoumt,
  //             NGrossAmt: data.GrossAmount,
  //             BudgetRef: value.RefNo
  //           })
  //           this.showtrantab = false

  //           //Bill Type list filteration
  //           if (this.BillTypeListarr) {
  //             var newArray = this.BillTypeListarr.filter(function (el: any) {
  //               return el.NCode == data.BillType
  //             })
  //             console.log("newarray_Biltype", newArray);
  //             this.tokenonlineForm.patchValue({
  //               NBillType: newArray.BillType,
  //             })
  //           }
  //           //Major head list filteration
  //           if (this.MajorHeadListarr) {
  //             var newArray = this.MajorHeadListarr.filter(function (el: any) {
  //               return el.majorheadcode == data.budgethead
  //             })
  //             console.log("newarray_val", newArray);
  //             this.MajorHeadobj = newArray[0]
  //             this.tokenonlineForm.patchValue({
  //               NMajorHead: newArray[0].majorheadname,
  //             })
  //           }
  //           this.PayinputForm = false
  //           this.budgetinputForm = true

  //         }
  //         else if (data.status == -9) {
  //           this.snackbar.show('Reference Number Is Used For Token No (' + data.TokenNo + ')', 'Info')
  //         //  this.toastrService.info('Reference Number Is Used For Token No (' + data.TokenNo + ')', 'Info!');
  //           this.loader.setLoading(false);
  //         }

  //       }
  //       else {
  //         this.snackbar.show('No Budget Reference Details Found !', 'Info')
  //        // this.toastrService.info('No Budget Reference Details Found !', 'Info!');
  //         this.loader.setLoading(false);

  //       }
  //     },
  //       (res) => {
  //         console.log("errror message___", res.status);
  //         if (res.status != 200) {
  //           this.loader.setLoading(false);
  //          // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
  //          this.snackbar.show('Something Went Wrong! Please Try Again', 'alert')

  //         }
  //       }

  //     );
  //   }
  //   else {
  //     this.loader.setLoading(false)
  //   }
  // }

  onReset() {
    this.tokenofflineForm.reset();
    this.display = true
    this.mat_radio_1 = true
    this.mat_radio_2 = false
    this.indisplay = true
    this.pay_radio = true
    this.PayinputForm = false
    // this.budget_radio = false
    // this.budgetinputForm = false
    //this.showgetbudgetbtn = true
  }

  OnSaveOffline() {

    console.log("Save_Else_Part", this.SaveBudgetModal);
    console.log("billtpeee_________", this.SaveBudgetModal.cdeRefNo, this.SelectBilltype);

    this.SaveBudgetModal.ddoCode = this.tokenofflineForm.controls['DdoCode'].value;  //DdoCode controller
    this.SaveBudgetModal.cashAmt = this.tokenofflineForm.controls['NetAmt'].value;  //Net Amount controller
    this.SaveBudgetModal.grossAmt = this.tokenofflineForm.controls['GrossAmt'].value;  //Gross Amount controller
    this.SaveBudgetModal.ipaddress = "http://172.22.32.102"
    console.log("aftervalue___", this.SaveBudgetModal);


    // stop here if form is invalid
    if (this.tokenofflineForm.invalid) {
      console.log('Error');
      return;
    }
    else if (!this.SelectBilltype || this.SaveBudgetModal.cdeRefNo <= 0) {
      //  this.toastrService.error('Please Select Bill Type!', 'Alert!');
      this.snackbar.show('Please Select Bill Type!', 'alert')
    }
    else if (!this.SelectMajorHead || this.SaveBudgetModal.majorHead <= 0) {
      // this.toastrService.error('Please Select Major Head!', 'Alert!');
      this.snackbar.show('Please Select Major Head!', 'alert')
    }
    else if (this.SaveBudgetModal.cdeRefNo == 20 && this.SaveBudgetModal.cashAmt != 0) {
      console.log("trffff");
      //  this.toastrService.error('Net amount should be 0 when billtype is 20', 'Error!');
      this.snackbar.show('Net amount should be 0 when billtype is 20', 'Error')
    }
    else if (Number(this.SaveBudgetModal.cashAmt) > Number(this.SaveBudgetModal.grossAmt)) {
      console.log("trueeeeee");

      // this.toastrService.error('Net amount cannot be greater than gross amount', 'Error!');
      this.snackbar.show('Net amount cannot be greater than gross amount', 'Error')
    }
    else {

      if (this.loginflag && this.tokenofflineForm.valid) {
        console.log("Before_API_Save_Result", this.SaveBudgetModal);
        this.loader.setLoading(true);

        // Office id verify api call
        this.ApiMethods.postresultservice(this.ApiService.SaveTokenOffline, this.SaveBudgetModal).subscribe(resp => {

          console.log("office_verify___", resp.result);
          let data = resp.result[0]
          if (data.str == 1) {

            console.log("test", data.v_NewTokenNo);
            // this.toastrService.success('Successfully Inserted and TOKEN NUMBER : ' + this.Tcode.Treasury_Code + '-2223-' + " " + data.v_NewTokenNo.toString(), 'Success!');
            this.snackbar.show('TOKEN NUMBER : ' + this.Tcode.Treasury_Code + '-' + this.Fyear_.forwardYear + "- " + data.v_NewTokenNo.toString() + '\n' + "Generated Successfully", 'success')
            this.loader.setLoading(false);
            this.tokenofflineForm.reset();
            this.display = true
            this.mat_radio_1 = true
            this.mat_radio_2 = false
            this.indisplay = true
            this.PayinputForm = false
            this.pay_radio = true
            //this.budget_radio = false
            // this.budgetinputForm = false
            // this.showgetbudgetbtn = true

            this.SaveBudgetModal.treasuryCode = this.Tcode.Treasury_Code
            this.SaveBudgetModal.fromFinYear = this.finyear_.year.toString()
            this.SaveBudgetModal.toFinYear = this.toyear_.finyear.toString()
            this.SaveBudgetModal.userId = this.usercode_.UserId
            this.SaveBudgetModal.cdeRefNo = 0
            this.SaveBudgetModal.ipaddress = ''
            this.SaveBudgetModal.ddoCode = 0
            this.SaveBudgetModal.cashAmt = 0
            this.SaveBudgetModal.grossAmt = 0
            this.SaveBudgetModal.majorHead = 0
          }
          else if (data.str == -9) {
            //  this.toastrService.info('Reference Number Is Used For Token No (' + data.v_NewTokenNo.toString() + ')', 'Info!');
            this.snackbar.show('Reference Number Is Used For Token No (' + data.v_NewTokenNo.toString() + ')', 'Info')
            this.loader.setLoading(false);
          }



        },
          (res) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              // this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
              this.snackbar.show('Something Went Wrong! Please Try Again', 'alert')

            }
          })


      }
      else {
        alert('Captcha Failed');
      }
    }


  }

  onFocusOutEvent(event: any) {
    console.log("onfouncsvaluuu", event.target.value);
    const text = event.target.value
    if (text) {
      this.loader.setLoading(true);

      // api call for Verify DDO Code
      this.ApiMethods.getservice(this.ApiService.Verify_DDO_Code + event.target.value).subscribe(resp => {
        console.log("verifyddocode__res", resp.result);
        let respp = resp.result
        if (respp.count != 0) {

          // api call for get DDO Name
          this.ApiMethods.getservice(this.ApiService.GetDDOName + event.target.value + '/' + this.Tcode.Treasury_Code).subscribe(resp => {
            let data = resp.result[0]
            console.log("DDOName__res", data);
            if (data.str != '-') {
              this.loader.setLoading(false);
              this.tokenofflineForm.controls['DdoName'].setValue(data.OfficeName)
            }
            else {
              this.loader.setLoading(false);
              this.tokenofflineForm.controls['DdoCode'].setValue('')
              this.tokenofflineForm.controls['DdoName'].setValue('')
              // this.toastrService.error('DDO Name Not Found', 'Alert!');
              this.snackbar.show('DDO Code Not Found', 'alert')
            }
          },
            (res) => {
              console.log("errror message___", res.status);
              if (res.status != 200) {
                this.loader.setLoading(false);
                //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
                this.snackbar.show('Something Went Wrong! Please Try Again', 'alert')
              }
            })

        }
        else {
          //  this.toastrService.error('Please enter valid ddo code', 'Alert!');
          this.snackbar.show('Please enter valid ddo code', 'alert')
          this.loader.setLoading(false);
        }


      },
        (res) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
            //  this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
            this.snackbar.show('Something Went Wrong\n Please Try Again', 'alert')

          }
        })
    }
  }

  get DdoCode() { return this.tokenofflineForm.get('DdoCode') }
  get DdoName() { return this.tokenofflineForm.get('DdoName') }
  get BillType() { return this.tokenofflineForm.get('BillType') }
  get MajorHead() { return this.tokenofflineForm.get('MajorHead') }
  get NetAmt() { return this.tokenofflineForm.get('NetAmt') }
  get GrossAmt() { return this.tokenofflineForm.get('GrossAmt') }
  get payRef() { return this.tokenonlineForm.get('payRef') }
  // get BudgetRef() { return this.tokenonlineForm.get('BudgetRef') }
  get NDdoCode() { return this.tokenonlineForm.get('NDdoCode') }
  get NDdoName() { return this.tokenonlineForm.get('NDdoName') }
  get NBillType() { return this.tokenonlineForm.get('NBillType') }
  get NMajorHead() { return this.tokenonlineForm.get('NMajorHead') }
  get NNetAmt() { return this.tokenonlineForm.get('NNetAmt') }
  get NGrossAmt() { return this.tokenonlineForm.get('NGrossAmt') }

}
