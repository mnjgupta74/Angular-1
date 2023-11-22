
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
  selector: 'app-objected-token-entry',
  templateUrl: './objected-token-entry.component.html',
  styleUrls: ['./objected-token-entry.component.scss']
})
export class ObjectedTokenEntryComponent implements OnInit {

  ObjectionTokenFormControl: any;

  ObjectionTokenFormData: any;
  
  OfficeName: any = '';
  BillTypeList: Observable<any[]> | undefined;
  BillTypeListarr: any[] = []
  SelectBilltype: any = ''
  treasuryCode: any;
  ddoList:Observable<any[]> | undefined
  ddoOptions :Observable<any[]> | undefined;
  selectddoCode!:any
  BillTypeOptions:any
  SelectBillType: any = ''
  majorHeadlist:any
  majorHeadData:any;
  enableShowBtn:boolean=true
  enableSubmitBtn:boolean=true
  userId:any
  //enterBtnEnable:boolean=true
  showTab_Table: boolean = false

  constructor( private ApiMethods: ApiMethods, public loader: LoaderService, private ApiService: ApiService, private snackbar: SnackbarService,  public _helperMsg: Helper,   private TCode: Helper,
    private UId: Helper, private IPAdd: Helper, public dialog: MatDialog, private Helper: Helper, private finyear_: Helper, private toyear_: Helper, private asgnId: Helper,
    private http: HttpClient,private apiMethods: ApiMethods) {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    this.fetchMajorHead();
  }

  ngOnInit(): void {

    this.ObjectionTokenFormControl = new FormGroup({
     
      // tokenNo: new FormControl('', [Validators.pattern('^[0-9]*$'), Val.Required, Val.minLength(1), Val.maxLength(6), Val.cannotContainSpace, Val.Numeric]),
      // CDRefNo: new FormControl('', [Validators.pattern('^[0-15]*$'), Val.Required, Val.minLength(1), Val.maxLength(10), Val.cannotContainSpace, Val.Numeric])

      tokenNo: new FormControl('', [Validators.pattern('^[0-9]*$'), Val.minLength(1), Val.maxLength(6), Val.cannotContainSpace, Val.Numeric]),
      CDRefNo: new FormControl('', [Validators.pattern('^[0-E]*$'), Val.minLength(1), Val.maxLength(16), Val.cannotContainSpace, Val.Numeric])
    });

    
    this.ObjectionTokenFormData = new FormGroup({
      Date: new FormControl({ value: '', disabled: true }),
      ddoCode: new FormControl({ value: '', disabled: true }),
      ddoName: new FormControl({ value: '', disabled: true }),
      BillType: new FormControl({ value: '', disabled: true }),
      majorHead: new FormControl({ value: '', disabled: true }),
      netAmount: new FormControl({ value: '', disabled: true }),
      grossAmount: new FormControl({ value: '', disabled: true }),
      
    });

    this.getBillTypeList();
    this.getDDOList()
  }


  get tokenNo() { return this.ObjectionTokenFormControl.get('tokenNo') }

  get CDRefNo() { return this.ObjectionTokenFormControl.get('CDRefNo') }

  //   display Function >>>------------------->
  displayFn(selectedoption: any) {
    // console.log("display_fun_call");
    return selectedoption ? selectedoption.BillType : undefined;
  }



  // Function : Reset >>>------------------->
  Reset() {
    window.location.reload();
  }

 
  objectionTokenEntryFormSubmit(){

    
    this.loader.setLoading(true);
    const formData ={
      
        "oldtokenNo": this.ObjectionTokenFormControl.controls.tokenNo.value,
        "asignmentId": this.asgnId.assignmentId,
        "userId": this.UId.UserId,
        "ddoCode": this.ObjectionTokenFormData.controls.ddoCode.value,
        "treasuryCode": this.treasuryCode,
        "majorHead": this.ObjectionTokenFormData.controls.majorHead.value,
        "billType": this.ObjectionTokenFormData.controls.BillType.value,
        "cashAmt": this.ObjectionTokenFormData.controls.netAmount.value,
        "grossAmt": this.ObjectionTokenFormData.controls.grossAmount.value,
        "fromFinYear": this.finyear_.year.toString(),
        "toFinYear": this.toyear_.finyear.toString(),
        "cdeRefNo": this.ObjectionTokenFormControl.controls.CDRefNo.value,
    
    }
    

       console.log("display_XXXXXXXXXXXX___formData",formData);

    this.ApiMethods.postresultservice(this.ApiService.saveObjectionTokenEntry, formData).subscribe((resp:any) => {
      
      this.loader.setLoading(false);
      let ResultData= resp.result;
      console.log(" Save ResultData==",ResultData)
      console.log("Error code :",resp.result.ERR_CODE)
      if(resp.result.ERR_CODE=='0000'){
        this.snackbar.show('Objection Token Entry has been Sucessfully Done !', 'success');
          this.showTab_Table = false;
          this.ObjectionTokenFormControl.reset(); 
          this.ObjectionTokenFormControl.enable();
      }
      else {
       // this.snackbar.show(' Ag Division already exists !', 'warning');
       //{"ERR_CODE":"0000","ERR_STATUS_CODE":"0000","MSG":"SUCCESSFULLY DONE"}
       this.snackbar.show('Internal Server Error!', 'danger');
      }
     
    },
    (res:any) => {
          console.log("errror message___", res.status);
          if (res.status != 200) {
            this.loader.setLoading(false);
           
          }
        });
  }

 
 

  numberOnly(event:any): boolean {
    console.log("Inside numberOnly",event)
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    this.enableShowBtn=false
    return true;

  }

   //DDO List Api CAll
   getDDOList() {
    this.loader.setLoading(true);
    this.treasuryCode = this.TCode.Treasury_Code;

  // this.treasuryCode=2100
    let ddolist = `${this.ApiService.getDdoCode}/${this.treasuryCode}`;
    this.apiMethods.getservice(ddolist).subscribe(
      (resp) => {
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.ddoList = resp.result;
        }
        this.ddoOptions = this.ObjectionTokenFormData.controls[
          'ddoCode'
        ].valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            return typeof value === 'string' ? value : value.ddoList;
          }),
          map((ddoName: any) => {
            return ddoName ? this._ddoFilter(ddoName, data) : data.slice();
          })
        );
        this.loader.setLoading(false);
      },
      (res) => {
        if (res.status != 200) {
          this.loader.setLoading(false);
          
        }
      }
    );
  }
  // DDlo list filter function
  _ddoFilter(value: string, data: any) {
    return data.filter((option: any) => {
      return option.ddoName.toLowerCase().includes(value.toLowerCase());
    });
  }
  //DDo List Display Function
  ddoDisplayFn(selectedoption: any) {
    return selectedoption ? selectedoption.ddoName : undefined;
  }

    // Call bill List API >>>------------------->
    getBillTypeList() {
      this.ApiMethods.getservice(this.ApiService.BillTypeList + 1).subscribe(resp => {
        console.log("BillType__res", resp);
        let data = resp.result
        if (resp.result && resp.result.length > 0) {
          this.BillTypeListarr = resp.result
        }
        console.log("Show_Treasury_BillList", this.BillTypeListarr);
        this.BillTypeOptions=this.BillTypeListarr

      })
  
    }
    //  bill List filter >->
    _filter(value: string, data: any) {
      // console.log("filterval__", value);
      return data.filter((option: any) => {
        // console.log("option_val__", option);
        return option.BillType.toLowerCase().includes(value.toLowerCase())
      });
    }

     //  biil List Select >------>
  OnBillTypeSelected(SelectBillType: any) {
    console.log("befort______Select_Bill", SelectBillType);

    
    console.log("slelction__________option_____________", SelectBillType);
   // this.PayMangerTokenModel.billType = SelectBillType
  }

  fetchMajorHead(){
    let type=2
    let userID=this.UId.UserId
    this.treasuryCode= this.TCode.Treasury_Code
   // this.ApiMethods.getservice(this.ApiService.MajorHeadList+ '/' +9 ).subscribe((data) => {
    this.ApiMethods.getservice( this.ApiService.GetMajorHeadMappingList + type + '/' +  userID + '/' + this.treasuryCode) .subscribe((data) => {
      if (data.result.length > 0) {
        this.majorHeadData = data.result;
        console.log('majorHeadData', this.majorHeadData);
      }
      this.majorHeadlist=this.majorHeadData
     
    });

  }

  _filterMajorHead(value: string, data: any) {
    return data.filter((option: any) => {
      return option.majorheadname.toLowerCase().includes(value.toLowerCase())
    });
  }

  displayMajorHead(selectedoption: any) {
    console.log("displayfuncall");
    return selectedoption ? selectedoption.majorheadname : undefined;
  }
  // getToken(){
  //   console.log("Inside getToken",this.ObjectionTokenFormControl.controls.tokenNo.length)
  //   if(this.ObjectionTokenFormControl.controls.tokenNo.value==''){
  //     this.enterBtnEnable=true
  //   }else{
  //     this.enterBtnEnable=false
  //   }
    
  // }



  onInput(event: Event, row: any): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    input.value = newValue; // Update the input field's value
    if (row == 1 && newValue !='') 
    {
      this.ObjectionTokenFormControl.get('CDRefNo').reset();
      // this.ObjectionTokenFormControl.get('CDRefNo').disable();
      this.enableShowBtn=false;
    }
   else if (row == 2 && newValue !='') 
   {
      this.ObjectionTokenFormControl.get('tokenNo').reset();
      // this.ObjectionTokenFormControl.get('tokenNo').disable();
      this.enableShowBtn=false;
    }
    else
    {
      this.enableShowBtn=true;
    }
  }

  objectionTokenEnterForm_ShowDetail(){

    this.loader.setLoading(true);
    let tokenNo=0
    let CDRefNo=null
    
    if(this.ObjectionTokenFormControl.controls.tokenNo.value!=undefined){
      tokenNo=this.ObjectionTokenFormControl.controls.tokenNo.value
      //this.enterBtnEnable=true

    }else if(this.ObjectionTokenFormControl.controls.CDRefNo.value!=undefined){
      CDRefNo=this.ObjectionTokenFormControl.controls.CDRefNo.value
     // this.enterBtnEnable=true
    }
    
    this.treasuryCode = this.TCode.Treasury_Code;

    const formData ={
    "type": "2", // set 2 
    "tokenNo": tokenNo,
    "treasuryCode": this.treasuryCode,
    "fromFinYear": this.finyear_.year.toString(),
    "toFinYear": this.toyear_.finyear.toString(),
    //"fromFinYear": "2020",
    //"toFinYear": "2023"
    "cdeRefNo": CDRefNo,

    }
    console.log("Token No : ",tokenNo)
    console.log("treasuryCode :",this.treasuryCode)
    console.log("finyear_ :",this.finyear_.year.toString())
    console.log("finYearTo :",this.toyear_.finyear.toString())
    console.log("this.asgnId :",this.asgnId.assignmentId)
    console.log("User Id  :",this.UId.UserId)
    console.log("CDE RefNo  :", CDRefNo)

    console.log("XXXXXXXXXXXXXX_formData  :", formData)

    this.ApiMethods.postresultservice(this.ApiService.getObjectionTokenDetails, formData).subscribe((resp:any) => {
      this.loader.setLoading(false);
      let ResultData= resp.result[0];
      console.log("ResultData",resp.result)
      console.log("ResultData0",resp.result[0])
      if(ResultData!=undefined){
        this.showTab_Table = true;
        this.userId=this.UId.UserId
        this.ObjectionTokenFormData.reset(); 
        console.log("ResultData",ResultData)  
        this.ObjectionTokenFormData.get('Date').patchValue(ResultData.forwarddate);
        this.ObjectionTokenFormData.get('ddoCode').patchValue(ResultData.DDOCode);
        this.ObjectionTokenFormData.get('ddoName').patchValue(ResultData.officename);
        this.ObjectionTokenFormData.get('BillType').patchValue(ResultData.BillType);
        this.ObjectionTokenFormData.get('majorHead').patchValue(ResultData.MajorHead);
        this.ObjectionTokenFormData.get('netAmount').patchValue(ResultData.CashAmt);
        this.ObjectionTokenFormData.get('grossAmount').patchValue(ResultData.GrossAmt);
        this.enableSubmitBtn=false
        this.ObjectionTokenFormControl.disable();
      }
      else 
      {
        this.showTab_Table = false;
        this.snackbar.show('Token Not Dispatch Or Bill Not Forward !', 'alert');
        this.ObjectionTokenFormData.reset(); 
      }
     
    },
    (res:any) => {
          console.log("errror message___", res.status);

          if (res.status != 200) {
            this.loader.setLoading(false);
           
          }
        });


  }

  isFormValid() : boolean { 
    return this.ObjectionTokenFormData.disabled ? true : this.ObjectionTokenFormData.valid
  }

  Fun_Reset(){
   // this.ObjectionTokenFormData.reset(); 
   // this.ObjectionTokenFormData.get('tokenNo').reset();
    // this.ObjectionTokenFormControl.reset(); 
   window.location.reload();

  }

   

}

