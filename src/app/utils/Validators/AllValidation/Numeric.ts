import { AbstractControl } from "@angular/forms";

export function Numeric(control: AbstractControl){
    if (control.value==0 || control.value==null){
        return null;
      }
      else {
    if(control && (control.value!== null || control.value!==undefined)){
        const regex = new RegExp(/^[0-9]*$/);
        if(!regex.test(control.value)){
            return{'Numeric': 'Only Numeric is allowed.'};
        }

    }
    return null;}
}


export function positiveValue(control: AbstractControl){
    if(control && (control.value!== null || control.value!==undefined)){
        if(control.value < 0){
            return{'positiveValue': 'Only Positive Values are allowd.'};
        }

    }
    return null;
}


export function Decimal(control: AbstractControl){
    if ( control.value==null){
        return null;
      }
      else {
    if(control && (control.value!== null || control.value!==undefined)){
        const regex = new RegExp(/^\d*\.?\d*$/);
        if(!regex.test(control.value)){
            return{'Decimal': 'Only Decimal and Numeric is allowed.'};
        }

    }
    return null;}
}