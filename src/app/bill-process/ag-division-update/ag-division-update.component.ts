import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { ApiService } from 'src/app/utils/utility.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Helper } from 'src/app/utils/Helper';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import * as Val from  '../../../app/utils/Validators/ValBarrel'
import { SnackbarService } from 'src/app/utils/snackbar.service';

interface AgDivision {
  name: string;
  nickname: string;
  email: string;
  password: string;
  showPassword: boolean;
}

@Component({
  selector: 'app-ag-division-update',
  templateUrl: './ag-division-update.component.html',
  styleUrls: ['./ag-division-update.component.scss']
})
export class AgDivisionUpdateComponent implements OnInit {
  user: AgDivision;

  constructor(public loader: LoaderService,private ApiMethods: ApiMethods,private ApiService: ApiService,private Helper:Helper,private snackbar: SnackbarService) { 
    this.user = {} as AgDivision;
  }

  TreasuryListarr: any[] = []
  Treasuryoptions: Observable<any[]> | undefined;
  AgDivisionSearchForm:any;
  AgDivisionUpdateForm:any;
  ChooseOption: any = '';
  verifyOfficeId:boolean=false
  verifyDivCode:boolean=false
  show = false;
  insertShow:boolean=false
  updateShow:boolean=false
  newBtnShow:boolean=false
  deActivateShow:boolean=false
  deactivatedDir:boolean=false

  ngOnInit(): void {

    this.AgDivisionSearchForm = new FormGroup({
     
      AGDivCode: new FormControl('',[Val.Required]),
      DivisionCode: new FormControl('',[Val.Required]),
      TreasuryControl: new FormControl({}, { validators: [this.ApiMethods.autocompleteObjectValidator(), Validators.required], }),
    });
     
    this.AgDivisionUpdateForm = new FormGroup({
      OfficeId: new FormControl('',[Val.Required]),
      AGDiv: new FormControl('',[Val.Required]),
      Division: new FormControl('',[Val.Required]),
      DivisionName: new FormControl('',[Val.Required]),
    });

    this.getTreasuryList()
  }

  getTreasuryList() {
    this.loader.setLoading(true);
       this.ApiMethods.getservice(this.ApiService.treasuryList).subscribe((resp:any)  => {

       console.log("Auditor__res", resp);
       let data = resp.result
       if (resp.result && resp.result.length > 0) {
         this.TreasuryListarr = resp.result
         console.log("Show_Treasury_AuditorList", this.TreasuryListarr);
         this.Treasuryoptions = this.AgDivisionSearchForm.controls['TreasuryControl'].valueChanges.pipe(
           startWith(''),
           map((value: any) => {
             return typeof value === 'string' ? value : value.treasuryCode
           }),
           map((treasury: any) => {

             return treasury ? this._filterTreas(treasury, data) : data.slice()
           })
         );
         const treasury = this.TreasuryListarr.filter((item: any) => item.TreasuryCode === this.Helper.Treasury_Code)[0];
         this.AgDivisionSearchForm.patchValue({
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
      console.log("display_fun_call aaa", selectedoption.TreasuryName);
      return selectedoption ? selectedoption.TreasuryName : undefined;
    }

    get AGDivCode() { return this.AgDivisionSearchForm.get('AGDivCode') } 

    get DivisionCode() { return this.AgDivisionSearchForm.get('DivisionCode') } 

    GetAgOfficeDetail(){

      console.log("Inside GetAgOfficeDetail")
      
      this.loader.setLoading(true);
      console.log("AGDivCode==",this.AgDivisionSearchForm.controls.AGDivCode.value)
      console.log("DivisionCode==",this.AgDivisionSearchForm.controls.DivisionCode.value)
      console.log("TreasuryControl==",this.AgDivisionSearchForm.controls.TreasuryControl.value.TreasuryCode)
      let treasuryCode=this.AgDivisionSearchForm.controls.TreasuryControl.value.TreasuryCode
      let agDivCode=this.AgDivisionSearchForm.controls.AGDivCode.value
      let divisionCode=this.AgDivisionSearchForm.controls.DivisionCode.value
      if(agDivCode=='' || divisionCode=='' || divisionCode==''){
        this.snackbar.show('Please Enter AGDivCode, DivisionCode And TreasuryCode Value !', 'alert');
        this.loader.setLoading(false);
        return
      } 
     
      const formData ={
        
        "treasuryCode":treasuryCode,
        "agDivCode": agDivCode,
        "divisionCode":divisionCode
      
      }

      this.ApiMethods.postresultservice(this.ApiService.agAgOfficeDetail, formData).subscribe((resp:any)  => {

        this.loader.setLoading(false);
        let ResultData= resp.result;
       console.log("resp.result",resp.result)
       console.log("resp.result condition : ",resp.result>0)
       console.log("resp.result flag : ",resp.result.flag)
        this.deactivatedDir=true;
        if(resp.result.flag=='D'){
         this.snackbar.show('Division Code has been already Deactivated !', 'alert');
         this.deactivatedAlready()
        
          }
      
        console.log("ResultData==",resp.result.treasuryCode)
        if (resp.result.treasuryCode!=undefined ) {
          this.updateShow=true
          this.newBtnShow=true
          this.deActivateShow=true
          console.log("updateShow :",this.updateShow)
          this.AgDivisionUpdateForm.get('OfficeId').patchValue(ResultData.officeId);
        this.AgDivisionUpdateForm.get('AGDiv').patchValue(ResultData.agDivCode);
        this.AgDivisionUpdateForm.get('Division').patchValue(ResultData.divisionCode);
        this.AgDivisionUpdateForm.get('DivisionName').patchValue(ResultData.divisionName);
        this.onHideShow()
        this.insertShow=false
        this.AgDivisionSearchForm.disable();

        }else{
          this.snackbar.show('Data Not Found !', 'alert');
          this.newBtnShow=false
        }
     

      },
      (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
              this.snackbar.show('Something Went Wrong! Please Try Again', 'danger');
  
            }
          });

    }

    SaveAgOfficeDetail(id:any){

      console.log("Inside SaveAgOfficeDetail",id)

     
      this.getVerifyDivCodeTreasurycode()
      this.getVerifyOfficeId()
     
        setTimeout(()=>{
      if(this.verifyOfficeId && this.verifyDivCode){
        console.log("Inside saveAgOfficeDetails Office Id ",this.verifyOfficeId + " Div Code "+this.verifyDivCode)
      
       if(id=='insert'){
        console.log("Inside Insert")
        this.saveAgOfficeDetails()
       }else if(id=='update'){
        console.log("Inside Update")
        this.updateAgOfficeDetails()
       }else{
        console.log("Inside Deactivate")
        if (window.confirm('Do you want to Deactivate this Division Code ?')) {
         
          this.dactivateDivision()
        }
       
       }
       
      }
    },1000)
    
     

    }

    getVerifyDivCodeTreasurycode(){
      this.loader.setLoading(true);
      let treasuryCode=this.AgDivisionSearchForm.controls.TreasuryControl.value.TreasuryCode
      let agDivCode=this.AgDivisionUpdateForm.controls.AGDiv.value
      let divisionCode=this.AgDivisionUpdateForm.controls.Division.value
      
       this.ApiMethods.getservice(this.ApiService.getVerifyDivTreasury+'/'+divisionCode+'/'+treasuryCode).subscribe((resp:any)  => {
        this.loader.setLoading(false);
        
        console.log("VerifyDivCode result",resp.result);
         if (resp.result=='Y') {
          console.log("Inside resp.result",resp.result);
          this.verifyOfficeId=true
       
         }else{
          this.snackbar.show(' Division code does not verified !', 'alert');
          this.verifyOfficeId=false
         }
   
       });
   
     }

     getVerifyOfficeId(){
      this.loader.setLoading(true);
      let OfficeId=this.AgDivisionUpdateForm.controls.OfficeId.value
       this.ApiMethods.getservice(this.ApiService.getVerifyOfficeId+'/'+OfficeId).subscribe((resp:any)  => {
        this.loader.setLoading(false);
        console.log("getVerifyOfficeId result",resp.result);
         if (resp.result=='Y') {
          console.log("Inside resp.result",resp.result);
          this.verifyDivCode=true
         }else{
          this.snackbar.show(' Office Id does not verified !', 'danger');
          this.verifyDivCode=false
         }
   
       });
   
     }

     saveAgOfficeDetails(){
      this.loader.setLoading(true);
      let treasuryCode=this.AgDivisionSearchForm.controls.TreasuryControl.value.TreasuryCode
      let agDivCode=this.AgDivisionUpdateForm.controls.AGDiv.value
      let divisionCode=this.AgDivisionUpdateForm.controls.Division.value
      let OfficeId=this.AgDivisionUpdateForm.controls.OfficeId.value
      let DivisionName=this.AgDivisionUpdateForm.controls.DivisionName.value

      const formData ={
        
        "treasuryCode":treasuryCode,
        "oldDivisionCode": 0,
        "officeId": OfficeId,
        "agDivCode": agDivCode,
        "divisionCode":divisionCode,
        "divisionName": DivisionName
       
      
      }

      this.ApiMethods.postresultservice(this.ApiService.agDivisionSave, formData).subscribe((resp:any)  => {
        this.loader.setLoading(false);
        let ResultData= resp.result;
        console.log(" Save ResultData==",ResultData)
        if(resp.result==true){
          this.snackbar.show(' Ag Division Saved Sucessfully !', 'success');
        }else if(resp.result==false){
          this.snackbar.show(' Ag Division Already Exists !', 'alert');
        }
      },
      (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
             
            }
          });
     }

     updateAgOfficeDetails(){
      this.loader.setLoading(true);
      let treasuryCode=this.AgDivisionSearchForm.controls.TreasuryControl.value.TreasuryCode
      let agDivCode=this.AgDivisionUpdateForm.controls.AGDiv.value
      let divisionCode=this.AgDivisionUpdateForm.controls.Division.value
      let OfficeId=this.AgDivisionUpdateForm.controls.OfficeId.value
      let DivisionName=this.AgDivisionUpdateForm.controls.DivisionName.value
      console.log("DivisionName",DivisionName)
      const formData ={
        
        "treasuryCode":treasuryCode,
        "oldDivisionCode": divisionCode,
        "officeId": OfficeId,
        "agDivCode": agDivCode,
        "divisionCode":divisionCode,
        "divisionName": DivisionName
       
      }

      this.ApiMethods.postresultservice(this.ApiService.agDivisionUpdate, formData).subscribe((resp:any)  => {
        this.loader.setLoading(false);
        let ResultData= resp.result;
        console.log(" Save ResultData==",ResultData)
        if(resp.result==true){
          this.snackbar.show(' Ag Division Updated Sucessfully !', 'Success');
        }else if(resp.result==false){
          this.snackbar.show(' Ag Division Already Exists !', 'alert');
        }
       
      },
      (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
             
            }
          });
     }

     dactivateDivision(){
      console.log("Deactivate Division")
     
      this.loader.setLoading(true);
      let treasuryCode=this.AgDivisionSearchForm.controls.TreasuryControl.value.TreasuryCode
      let agDivCode=this.AgDivisionUpdateForm.controls.AGDiv.value
      let divisionCode=this.AgDivisionUpdateForm.controls.Division.value
      let OfficeId=this.AgDivisionUpdateForm.controls.OfficeId.value
      let DivisionName=this.AgDivisionUpdateForm.controls.DivisionName.value
      console.log("DivisionName",DivisionName)
      const formData ={
        
        "treasuryCode":treasuryCode,
        "oldDivisionCode": divisionCode,
        "officeId": OfficeId,
        "agDivCode": agDivCode,
        "divisionCode":divisionCode,
        "divisionName": DivisionName
       
      }

      this.ApiMethods.postresultservice(this.ApiService.agDivisionDeactivate, formData).subscribe((resp:any)  => {
        this.loader.setLoading(false);
        let ResultData= resp.result;
        console.log(" Save ResultData==",ResultData)
        if(resp.result==true){
          this.AgDivisionUpdateForm.disable()
          this.snackbar.show('Division Code Deactivated Successfully !', 'Success');
        } 
       

      },
      (res:any) => {
            console.log("errror message___", res.status);
            if (res.status != 200) {
              this.loader.setLoading(false);
             
            }
          });
     }

     onHideShow() {
      this.show = !this.show;
    }

    insertNewRecord(){
      this.onHideShow()
      this.insertShow=true
      this.updateShow=false
      this.deActivateShow=false
    }

    cancelBtn(){
      this.onHideShow()
      this.AgDivisionSearchForm.enable();
      this.newBtnShow=false
    }

    deactivatedAlready(){
      this.AgDivisionUpdateForm.disable();
    }

    searchReset(){
      
        this.AgDivisionSearchForm.get('AGDivCode').reset();
        this.AgDivisionSearchForm.get('DivisionCode').reset();
        this.AgDivisionSearchForm.enable();
        this.newBtnShow=false
       this.show=false

    }

   
    

}
