import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerficationComponent } from '../otp-verfication/otp-verfication.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';


export type FadeState = 'visible' | 'hidden';

export interface Config{
  inputStyles?: {[key: string]: any};
  containerStyles?: {[key: string]: any};
  allowKeyCodes?: string[];
  length?: number |undefined;
  allowNumbersOnly?: boolean;
  inputClass?: string;
  containerClass?: string;
  isPasswordInput?: boolean;
  disableAutoFocus?: boolean;
  placeholder?: string;
}
@Component({
  selector: 'app-dta-auth-user-register',
  templateUrl: './dta-auth-user-register.component.html',
  styleUrls: ['./dta-auth-user-register.component.scss'],
  animations: [
    trigger('state', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ),
      state(
        'hidden',
        style({
          opacity: '0'
        })
      ),
      transition('* => visible', [animate('500ms ease-in')]),
      transition('visible => hidden', [animate('500ms ease-out')])
    ])
  ],
})


export class DtaAuthUserRegisterComponent implements OnInit,AfterViewInit {
  registerForm!:FormGroup
  // constructor(private fb:FormBuilder) { }

  // ngOnInit(): void {
    
  // }
  @Input() config: Config ={
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  @ViewChild('myTemplate')
  myTemplate!: TemplateRef<unknown>;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onInputChange = new EventEmitter<string>();
  otpForm!: any;
  inputControls: FormControl[] = new Array(this.config.length);
  componentKey =
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36);
  inputType!: string;
  constructor(private fb:FormBuilder, public dialog: MatDialog) {}
  myDialogRef!: any;
  ngOnInit() {
    this.registerForm = this.fb.group({
      username: new FormControl('', Validators.required),
      designation: [''],
      department: [''],
      mobileNo: [''],
  
    });
    this.otpForm = new FormGroup({});
    for (let index = 0; index < 5; index++) {
      this.otpForm.addControl(this.getControlName(index), new FormControl());
    }
    this.inputType = this.getInputType();
    this.keys()
  }
  key:any[]=[]
  keys(){
    this.key= Object.keys(this.otpForm?.controls)
  }
  openDialog(template: TemplateRef<unknown>) {
    // this.myDialogRef = this.dialog.open(template,{disableClose:true,});
    this.myDialogRef = this.dialog.open(OtpVerficationComponent, {
      panelClass: 'dialog-w-50',
      autoFocus: true,
      disableClose:false,
      height: 'auto',
      width: '40%',
      
    });

    this.myDialogRef.afterClosed().subscribe((result:any) => {
console.log(result);

});
    this.afterClose()
  }
  afterClose(){
    this.myDialogRef.afterClosed((data:any)=>{
console.log(data);

    })
  }
  otpField=false
  verifyContact(){
// this.otpField = ! this.otpField
this.openDialog(this.myTemplate)
  }
  ngAfterViewInit(): void {
    if (!this.config.disableAutoFocus) {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      if (containerItem) {
        containerItem.addEventListener('paste', (evt) => this.handlePaste(evt));
        const ele: any = containerItem.getElementsByClassName('otp-input')[0];
        if (ele && ele.focus) {
          ele.focus();
        }
      }
    }
  }
  private getControlName(idx:any) {
    return `ctrl_${idx}`;
  }

  ifLeftArrow(event:any) {
    return this.ifKeyCode(event, 37);
  }


  ifRightArrow(event:any) {
    return this.ifKeyCode(event, 39);
  }

  ifBackspaceOrDelete(event:any) {
    return (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      this.ifKeyCode(event, 8) ||
      this.ifKeyCode(event, 46)
    );
  }

  ifKeyCode(event:any, targetCode:any) {
    const key = event.keyCode || event.charCode;
    // tslint:disable-next-line: triple-equals
    return key == targetCode ? true : false;
  }
  onKeyDown($event:any) {
    var isSpace=this.ifKeyCode($event,32)
    if (isSpace) {// prevent space
    return false;
    }
    return true
  }

  onKeyUp($event:any, inputIdx:any) {
    const nextInputId = this.appendKey(`otp_${inputIdx + 1}`);
    const prevInputId = this.appendKey(`otp_${inputIdx - 1}`);
    if (this.ifRightArrow($event)) {
      this.setSelected(nextInputId);
      return;
    }
    if (this.ifLeftArrow($event)) {
      this.setSelected(prevInputId);
      return;
    }
    const isBackspace = this.ifBackspaceOrDelete($event);
    if (isBackspace && !$event.target.value) {
      this.setSelected(prevInputId);
      this.rebuildValue();
      return;
    }
    if (!$event.target.value) {
      return;
    }
    if (this.ifValidEntry($event)) {
      this.setSelected(nextInputId);
    }
    this.rebuildValue();
  }

  appendKey(id:any) {
    return `${id}_${this.componentKey}`;
  }

  setSelected(eleId:any) {
    this.focusTo(eleId);
    const ele: any = document.getElementById(eleId);
    if (ele && ele.setSelectionRange) {
      setTimeout(() => {
        ele.setSelectionRange(0, 1);
      }, 0);
    }
  }

  ifValidEntry(event:any) {
    const inp = String.fromCharCode(event.keyCode);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) ||
      (this.config.allowKeyCodes &&
        this.config.allowKeyCodes.includes(event.keyCode)) ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    );
  }

  focusTo(eleId:any) {
    const ele: any = document.getElementById(eleId);
    if (ele) {
      ele.focus();
    }
  }

  // method to set component value
  setValue(value: any) {
    if (this.config.allowNumbersOnly && isNaN(value)) {
        return;
    }
    this.otpForm.reset();
     if (!value) {
       this.rebuildValue();
       return;
     }
     value = value.toString().replace(/\s/g, ''); // remove whitespace
     Array.from(value).forEach((c, idx) => {
          if (this.otpForm.get(this.getControlName(idx))) {
            this.otpForm.get(this.getControlName(idx))?.setValue(c);
          }
     });
     if (!this.config.disableAutoFocus) {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      var indexOfElementToFocus = value.length < 5 ? value.length : (5 - 1);
      let ele : any = containerItem?.getElementsByClassName('otp-input')[indexOfElementToFocus];
      if (ele && ele.focus) {
        ele.focus();
      }
     }
     this.rebuildValue();
  }
  // get keys(value: any): string[] {
  //   return Object.keys(value)
  // }
  transform(value: any): string[] {
    return Object.keys(value)
  }

  rebuildValue() {
    let val = '';
    this.transform(this.otpForm.controls).forEach((k:any) => {
      if (this.otpForm.controls[k].value) {
        val += this.otpForm.controls[k].value;
      }
    });
    this.onInputChange.emit(val);
  }
  getInputType():string{
    return this.config.isPasswordInput 
      ? 'password' 
      : this.config.allowNumbersOnly 
        ? 'tel'
        : 'text';
  }
  onkeyPress(event:any) {return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 0};
  handlePaste(e:any) {
    // Get pasted data via clipboard API
    let clipboardData = e.clipboardData 
    if(clipboardData){
     var pastedData =clipboardData.getData('Text');
    }
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    if (!pastedData) {
      return;
    }
    this.setValue(pastedData);
  }

  state!: FadeState;

  get show() {
    return this._show;
  }
  @Input()
  set show(value: boolean) {
    if (value) {
      // show the content and set it's state to trigger fade in animation
      this._show = value;
      this.state = 'visible';
    } else {
      // just trigger the fade out animation
      this.state = 'hidden';
    }
  }
   _show: boolean=false
  table:any
  dataSource: MatTableDataSource<any>= new MatTableDataSource();
  @ViewChild(MatPaginator) set MatPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;

  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  displayedColumns = [

         "SrNo",
        "UserName",
        "Designation",
        "MobileNo",
        "RegistrationDate",
        "delete"
        
      ];
data: any[] =[
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
  {
    "UserName":"Amit Kumar",
    "Designation":"Secretary",
    "MobileNo":"0123456789",
    "RegistrationDate":"05/09/2023"
  },
 
 

  ]
  animationDone(event: any) {
    // now remove the 
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      // this._show = false;
      this._show = false;
      // this.state=
    }
  }
  register(){
    this.show=!this.show
    this.dataSource.data = this.data;
  }
  reset(){
    this.registerForm.reset()
  }
  delete(index:any){
this.data.splice(index,1)
this.dataSource.data = this.data;
  }
  onDelete(item: any) {
    if (window.confirm('Are you sure you want to Deactive !')) {

      console.log("deactive_r__,", item);
      var body = {
        "bankbranchcode": item.BankBranchCode,
        "treasurycode": item.TreasuryCode,
      }

      // this.loader.setLoading(true);

      // this.ApiMethods.postresultservice(this.ApiService.BankDeactive, body).subscribe(resp => {
      //   console.log("BankList__deactive___res", resp.result);
      //   if (resp.result) {
      //     this.loader.setLoading(false);

      //     this.getBankDetails()
      //     this.snackbar.show('Successfully Deactivated !', 'success')

      //   }
      // },
      //   (res) => {
      //     console.log("errror message___", res.status);
      //     if (res.status != 200) {
      //       this.loader.setLoading(false);
      //       //this.toastrService.error('Something Went Wrong! Please Try Again', 'Alert!');
      //       this.snackbar.show('Something Went Wrong ! Please Try Again', 'danger')
      //     }
      //   })
    }
  }
}
