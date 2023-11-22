import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, map, startWith } from 'rxjs';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';

@Component({
  selector: 'app-sign-verification',
  templateUrl: './sign-verification.component.html',
  styleUrls: ['./sign-verification.component.scss']
})
export class SignVerificationComponent implements OnInit {
  ddoCheckForm !:FormGroup
  treasuryCode!:string;
  ddoList:Observable<any[]> | undefined
  ddoOptions :Observable<any[]> | undefined;
  selectddoCode!:any
  src1=''
  src2=''
  src3=''
  ddoName:string=''
  submitted:boolean =false
  employeeData:any
  myDialogRef!: any;
  constructor(
    private fb:FormBuilder,
    private apiMethods: ApiMethods,
    private ApiService: ApiService,
    public loader: LoaderService,
    private Tcode: Helper,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private snackbar: SnackbarService,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.ddoCheckForm = this.fb.group({
      ddoCode:[null,Validators.required],
      

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
          this.employeeData=resp.result
          this.src1=resp.result[0].EMP_SIGN1 ? this.transform(resp.result[0].EMP_SIGN1):'';
          this.src2=resp.result[0].EMP_SIGN2 ?this.transform(resp.result[0].EMP_SIGN2):"";
          this.src3=resp.result[0].EMP_SIGN3 ?this.transform(resp.result[0].EMP_SIGN3):"";
          this.ddoName =this.ddoCheckForm.value.ddoCode.ddoName.split('-')[1]
 
         this.submitted = true
         this.loader.setLoading(false);
        }else{
          this.src1='';
          this.src2="";
          this.src3="";
          this.ddoName ="";
          this.employeeData = []
          this.snackbar.show("No Record Found",'alert')
          this.loader.setLoading(false);
        }

      },(error:any)=>{
        this.snackbar.show('Something Went Wrong',"danger")
        this.loader.setLoading(false);
      })
  }else{
    this.employeeData = []
    this.submitted = false
  }
  

}


openDialog(template: TemplateRef<unknown>,src:any) {
   // you can pass additional params, choose the size and much more
   if(src !==''){
    this.myDialogRef = this.dialog.open(template);
    let ele = document.querySelector('.popup');
    ele?.setAttribute('src',src)
   }
 

}
transform(base64Image:any){
  return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(base64Image) as any).changingThisBreaksApplicationSecurity;
}
}
