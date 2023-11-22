import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { NgxOtpInputConfig } from 'ngx-otp-input';
import { LoaderService } from 'src/app/services/loaderservice';
import { ApiMethods } from 'src/app/utils/ApiMethods';
import { Helper } from 'src/app/utils/Helper';
import { SnackbarService } from 'src/app/utils/snackbar.service';
import { ApiService } from 'src/app/utils/utility.service';
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
  selector: 'app-otp-verfication',
  templateUrl: './otp-verfication.component.html',
  styleUrls: ['./otp-verfication.component.scss'],
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
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
 
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpVerficationComponent implements OnInit {

  MobileOtpForm!:FormGroup
  OTPForm!:FormGroup
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
  @Output() onInputChange = new EventEmitter<any>();
  @Output() childButtonEvent = new EventEmitter();
  @Output() onInitEvent = new EventEmitter();
  @Input() childComp:boolean = false
  otpForm!: any;
  inputControls: FormControl[] = new Array(this.config.length);
  componentKey =
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36);
  inputType!: string;
  constructor(private fb:FormBuilder, public dialog: MatDialog,
    private ApiService: ApiService,private ApiMethods: ApiMethods, private UId: Helper, public loader: LoaderService,private snackbar: SnackbarService,
    @Optional() @Inject(MAT_DIALOG_DATA)private data?: any,@Optional() public dialogRef?: MatDialogRef<OtpVerficationComponent>,public finyear_?: Helper, private Tcode?: Helper) {}
  myDialogRef!: any;
  state!: FadeState;
  private _show!: boolean;
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
  // otpInputConfig: NgxOtpInputConfig = {
  //   otpLength: 6,
  //   autofocus: true,
  //   classList: {
  //     inputBox: 'my-super-box-class',
  //     input: 'my-super-class',
  //     inputFilled: 'my-super-filled-class',
  //     inputDisabled: 'my-super-disable-class',
  //     inputSuccess: 'my-super-success-class',
  //     inputError: 'my-super-error-class',
  //   },
  // };

  handeOtpChange(value: string[]): void {
    console.log(value);
  }

  handleFillEvent(value: string): void {
    console.log(value);
  }
  ngOnInit() {
    this.MobileOtpForm = this.fb.group({
      PhoneNumber: new FormControl('', Validators.required),
      
    });
   
    this.OTPForm = this.fb.group({
      otp: new FormControl('', Validators.required),
      
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
  animationDone(event: any) {
    // now remove the 
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      // this._show = false;
      this._show = false;
      // this.state=
    }
  }
  openDialog(template: TemplateRef<unknown>) {
    // this.myDialogRef = this.dialog.open(template,{disableClose:true,});
    this.myDialogRef = this.dialog.open(OtpVerficationComponent, {
      panelClass: 'dialog-w-50',
      autoFocus: false,
      height: 'auto',
      width: '50%',
      
    });
  }
  afterClose(){
    this.myDialogRef.afterClosed((data:any)=>{

    })
  }
  otpField=false
  verifyContact(){
this.otpField = ! this.otpField
this.show =!this.show;
// this.openDialog(this.myTemplate)
  }
  ngAfterViewInit(): void {
    // this.dialogRef.disableClose = this.data.d;
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

  Submit(){
    console.log(this.dialogRef);
    
    if(this.childComp){
       this.childButtonEvent.emit(true)
    }else{
      this.dialogRef?.close({data:true})
    }
    this.show =!this.show;
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
}
