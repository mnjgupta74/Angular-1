
import {
  AbstractControl,
  ValidatorFn
} from '@angular/forms';



export function minLength(minLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // if (Math.ceil(Math.log(control.value + 1) / Math.LN10) < minLength)
    if (control.value != null && control.value.length < (minLength)) {
      return { 'minLength': 'Minimum Length should be ' + minLength + '.' };
    }
    return null;
  };
}

export function maxLength(maxLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value != null && control.value.length >= (maxLength + 1)) {
      return { 'maxLength': 'Maximum Length should be ' + maxLength + '.' };
    }
    return null;
  };
}

export function Length(Length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value == 0) {
      return null;
    }
    else {
      if (control.value != null && control.value.length != (Length)) {
        return { 'Length': 'Length should be ' + Length + '.' };
      }
      return null;
    }
  };
}

export function isLengthInRange(minLength: number, maxLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value == 0 || control.value == null) {
      return null;
    }
    else {
      if (Math.ceil(Math.log(control.value + 1) / Math.LN10) < minLength || Math.ceil(Math.log(control.value + 1) / Math.LN10) >= (maxLength + 1)) {
        return { 'isLengthInRange': 'Length should be between' + minLength + ' and ' + maxLength + ' characters.' };
      }
      return null;
    }
  };
}


export function Number_Wordsallowed(control: AbstractControl) {
  if (control && (control.value !== null || control.value !== undefined)) {
    var regex = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])");
    if (!regex.test(control.value)) {
      return { 'Number_Wordsallowed': 'Atleast a number and Charcter is Reqired.' };
    }
  }
  return null;
}
