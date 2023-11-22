import { ChangeDetectionStrategy } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { log } from 'console';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';

export const  fileUploadValidator: ValidatorFn=(): ValidationErrors | null=> {
  let allowedExtensions=['png']
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    // Enter to validation only if has value or it's not undefined
    if (control.value !== undefined && isNaN(control.value)) {
      const file = control.value;
      // Get extension from file name
      const ext = file.substring(file.lastIndexOf('.') + 1);
      // Find extension file inside allowed extensions array
      if (allowedExtensions.includes(ext.toLowerCase())) {
      } else {
        return { extensionFile: true };
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-employee-signature',
  templateUrl: './employee-signature.component.html',
  styleUrls: ['./employee-signature.component.scss']
})
export class EmployeeSignatureComponent implements OnInit {
  ddoCheckForm!:FormGroup
  imagesForm!:FormGroup
  treasuryCode!:string;
  ddoList:Observable<any[]> | undefined
  ddoOptions :Observable<any[]> | undefined;
  selectddoCode!:any
  buttonText:string = "save"
  filesArray:any={
    signI:'',
    signII:'',
    signIII:'',

  }

  submitted :boolean =false
  src1: any='';
  src2: any='';
  src3: any='';
 
 EmployeeDetails:any =  {
        "mode":"",
        "treasuryCode": this.Tcode.Treasury_Code,
        "ddoCode": 0,
       "empName": "",
       "empSign1": "",
       "empSign2": "",
       "empSign3": "",
       "userId":""
    }
    userinfo:any
  constructor(private fb:FormBuilder,
    private apiMethods: ApiMethods,
    private ApiService: ApiService,
    public loader: LoaderService,
    private Tcode: Helper,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private snackbar: SnackbarService,
    private sanitizer:DomSanitizer
 ) { }
 allowedFileExtensions = [ 'png'];
  ngOnInit(): void {
    this.userinfo = this.apiMethods.getUserInfo(); 
    this.ddoCheckForm = this.fb.group({
      ddoCode:[null,Validators.required],
      

    })
    this.imagesForm = this.fb.group({
      signI:new FormControl(
        { value: '', disabled: false },
        [fileUploadValidator,Validators.required]),
      signII:[null,Validators.required],
      signIII:[null,Validators.required],
      

    })
    this.getDDOList()
  }
 
  //DDO List Api CAll
  getDDOList() {
    this.loader.setLoading(true);
    this.treasuryCode = this.Tcode.Treasury_Code;
    let ddolist = `${this.ApiService.getDdoCode}/${this.treasuryCode}`;
    this.apiMethods.getservice(ddolist).subscribe(
      (resp:any) => {
        let data = resp.result;
        if (resp.result && resp.result.length > 0) {
          this.ddoList = resp.result;
        }
        this.ddoOptions = this.ddoCheckForm.controls[
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
      (res:any) => {
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
  imageUrl = ''

  submit(){

    if(this.ddoCheckForm.valid){
      this.loader.setLoading(true);
      this.treasuryCode = this.Tcode.Treasury_Code;
 
      let ddolist = `${this.ApiService.checkEmployee}${this.treasuryCode}/${this.selectddoCode?.ddoCode}`;
      // let ddolist = `${this.ApiService.checkEmployee}${3100}/${1121}`;
      this.apiMethods.getservice(ddolist).subscribe(
        (resp:any) => {
         
          console.log(resp.result[0]);
          if(resp && resp.result.length){
            this.src1=resp.result[0].EMP_SIGN1 ? this.transform(resp.result[0].EMP_SIGN1):'';
            this.src2=resp.result[0].EMP_SIGN2 ?this.transform(resp.result[0].EMP_SIGN2):"";
            this.src3=resp.result[0].EMP_SIGN3 ?this.transform(resp.result[0].EMP_SIGN3):"";

            this.imagesForm.value.signI=  this.src1 ?this.src1:'';
            this.imagesForm.value.signII =  this.src2 ?this.src2:'';
            this.imagesForm.value.signIII=  this.src3?this.src3:''
            this.filesArray.signI = this.src1 ?this.src1:'';
            this.filesArray.signII = this.src2 ?this.src2:'';
            this.filesArray.signIII = this.src3?this.src3:''
           if(this.src1 !=="" || this.src2 !=="" || this.src1 !==""){
            this.buttonText = "Update"
           }else{
            this.buttonText = "save"
           }
           this.submitted = true
           this.loader.setLoading(false);
          }else{
       
           this.src1='';
           this.src2="";
           this.src3="";
           // this.src1 =this.transform(data)
           this.imagesForm.value.signI=  '';
           this.imagesForm.value.signII ='';
           this.imagesForm.value.signIII=''
           this.filesArray.signI ='';
           this.filesArray.signII = '';
           this.filesArray.signIII ='';
           this.buttonText = "save"
           this.snackbar.show("No Record Found",'alert')
            this.submitted = true;
            this.loader.setLoading(false);
          }
  
        },(error:any)=>{
          this.snackbar.show('Something Went Wrong',"danger")
          this.loader.setLoading(false);
        })
    }else{
      this.submitted = false
    }
    

  }

  transform(base64Image:any){
  
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(base64Image) as any).changingThisBreaksApplicationSecurity;
}

   blobToBase64(blob:any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  
    // Image Preview
    showPreview(event:any,index:any,field:any) {
 
      this.onFileChangeCheck(event,field,index);
    }

    myDialogRef!: any;

openDialog(template: TemplateRef<unknown>,src:any) {
   // you can pass additional params, choose the size and much more
   if(src !==''){
    this.myDialogRef = this.dialog.open(template);
    let ele = document.querySelector('.popup');
    ele?.setAttribute('src',src)
   }
 

}


updateEmployee(){

 if(this.src1 !=="" || this.src2 !=="" || this.src3 !==""){
  // employeeSignMode:string = environment.BaseUrl1+ '/employee/sign/mode'  // (GET) API, Used Component:-GrnMinusEntryComponent'
  // public employeeSignUpdate
  this.EmployeeDetails.mode="I";
  this.EmployeeDetails.ddoCode=this.ddoCheckForm.value.ddoCode.ddoCode;
  this.EmployeeDetails.empName="";
  this.EmployeeDetails.empSign1 =  this.filesArray.signI !=="" ?this.filesArray.signI.split(",")[1]:null;
  this.EmployeeDetails.empSign2=  this.filesArray.signII !=="" ?this.filesArray.signII.split(",")[1]:null;
  this.EmployeeDetails.empSign3= this.filesArray.signIII !=="" ?this.filesArray.signIII.split(",")[1]:null;
  this.EmployeeDetails.userId= this.userinfo.userId;
  if(this.buttonText == 'save'){
    this.employeeSave()
  }else if(this.buttonText == 'Update'){
    this.employeeUpdate()
  }

 }else{
 this.snackbar.show("Please upload atleast one signature Image",'danger')
 }


  
  // this.onSubmit()
}

employeeSave(){

  this.loader.setLoading(true);
      this.apiMethods.postresultservice(this.ApiService.employeeSignMode,this.EmployeeDetails).subscribe(
        (resp:any) => {
         
          console.log(resp.result[0]);
          if(resp && resp.result ==true){
            this.snackbar.show(`Signature Saved SuccessFully`,'success')
            this.reset();
           this.loader.setLoading(false);
          }else{
            this.snackbar.show("Something went wrong",'alert')
            // this.submitted = false;
            this.loader.setLoading(false);
          }
  
        },(error:any)=>{
          this.snackbar.show('Something Went Wrong',"danger")
          this.loader.setLoading(false);
        })

 
}

employeeUpdate(){
  delete(this.EmployeeDetails.mode)
  this.loader.setLoading(true);
  this.apiMethods.postresultservice(this.ApiService.employeeSignUpdate,this.EmployeeDetails).subscribe(
    (resp:any) => {
     
      console.log(resp.result[0]);
      if(resp && resp.result == true){
        this.snackbar.show(`Signature Updated SuccessFully`,'success')
        this.reset();
       this.loader.setLoading(false);
      }else{
        this.snackbar.show("Something went wrong",'alert')
        this.loader.setLoading(false);
      }

    },(error:any)=>{
      this.snackbar.show('Something Went Wrong',"danger")
      this.loader.setLoading(false);
    })
}

reset(){
  this.src1='';
  this.src2="";
  this.src3="";
  // this.src1 =this.transform(data)
  this.imagesForm.value.signI=  '';
  this.imagesForm.value.signII ='';
  this.imagesForm.value.signIII=''
  this.filesArray.signI ='';
  this.filesArray.signII = '';
  this.filesArray.signIII ='';
  this.buttonText = "save"
  this.imagesForm.reset()
  this.ddoCheckForm.reset()
  this.submitted = false;

}

  onFileChangeCheck(file:any,field:any,index:any){

    let filenameStr= file.target.files[0].name;
    let uploadfilenameNumber =this.getFileNameWithoutExtension(filenameStr);
    let isuploadfilenameNumber= parseInt(uploadfilenameNumber);
    // if(isNaN(isuploadfilenameNumber)){
    //   this.imagesForm.controls[field].reset();
    //   // this.P2FForm.get("chequeNumber").reset();
    //   this.snackbar.show('Name should be in format of (Valid 6 Digit Cheque No) Allow', 'danger');
    //   return;
    // }

    let fileExt= filenameStr.split('.').pop().toLowerCase();
    let allowedExtensions=['jpg', 'png','jpeg','gif'];
    if (!allowedExtensions.includes(fileExt)) {
      this.imagesForm.controls[field].reset();
      this.filesArray[field] = ''
      if(index==1){
        this.src1 =''
      }else if(index==2){
        this.src2 = ''
      }if(index==3){
        this.src3 = ''
      }
      // this.P2FForm.get("chequeNumber").reset();
      this.snackbar.show('File Extension Only jpg, png, jpeg Allow', 'danger');
      return;
    }

    let fileSize= file.target.files[0].size / 1024;

    if (fileSize > 16) {
       this.imagesForm.controls[field].setValue('');
      this.filesArray[field] = ''
      if(index==1){
        this.src1 =''
      }else if(index==2){
        this.src2 = ''
      }if(index==3){
        this.src3 = ''
      }

      this.snackbar.show('File Size allowed max 90 kb Allow', 'danger');
      return;

    }

    const reader = new FileReader();    
      
    reader.readAsDataURL(file.target.files[0])
    // : 'handle exception'
    const uploadfile:any = file.target.files;
 
  
    reader.onload = () => {
      if(index==1){
        this.src1 = reader.result as string;
        this.imageUrl = reader.result as string;
      }else if(index==2){
        this.src2 = reader.result as string;
      }if(index==3){
        this.src3 = reader.result as string;
      }
    //     this.imagesForm.patchValue({
    //   [field]: uploadfile[0]
    // });
    this.filesArray[field] = reader.result as string
    }




  }
  convertToBase64(file: File): void {


    const reader = new FileReader();

    reader.onloadend = () => {
      // The result is the Base64-encoded image
      const base64String = reader.result as string;
      // let base64StringReplacefileExt= base64String.replace("data:image/"+this.fileExt+";base64,", "");
      // const base64StringReplace= base64StringReplacefileExt.replace("data:image/jpeg;base64,", "");

      //strreplace()

  //   this.base64ImgString=base64StringReplace;

    };

    reader.readAsDataURL(file);
  }

  cancel(){
    this.submitted = false;
    this.imagesForm.reset();
    this.buttonText = "save"
    this.filesArray={
    signI:'',
    signII:'',
    signIII:'',
     }
     this.imagesForm.reset()
     this.ddoCheckForm.reset()
  this.src1='';
  this.src2 ='';
  this.src3='';
  }

  private getFileNameWithoutExtension(fileName: string): string {
    // Get the last index of the dot (to identify the extension)
    const dotIndex = fileName.lastIndexOf('.');
    // Extract the file name without the extension
    const  fileNameWithoutExtension = dotIndex === -1 ? fileName : fileName.slice(0, dotIndex);
    return fileNameWithoutExtension;
  }
}
