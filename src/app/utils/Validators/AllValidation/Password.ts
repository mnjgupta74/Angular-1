import { FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";


// export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: any } | null => 
//  {
//       const controlNew = FormGroup.controls[controlName];
//       const matchingControl = FormGroup.controls[matchingControlName];

//       if (matchingControl.errors && !matchingControl.errors?.['mustMatch']) {
//         return;
//       }

//       // set error on matchingControl if validation fails
//       if (controlNew.value !== matchingControl.value) {
//         matchingControl.setErrors({ mustMatch: true });
//       } else {
//         matchingControl.setErrors(null);
//       }
//       return null;
//     };
//   }


export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  let msg = "";
  if (!value) {
    return null
  }

  let upperCaseCharacters = /[A-Z]+/g;
  let lowerCaseCharacters = /[a-z]+/g;
  let numberCharacters = /[0-9]+/g;
  // let specialCharacters = /[!@#$*_-~=()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
  let specialCharacters = /[!@#$*_-~=]+/;

  // if (upperCaseCharacters.test(value) === false || specialCharacters.test(value) === false || numberCharacters.test(value) === false) {
  if (specialCharacters.test(value) === false) {

    return {
      'PasswordStrengthValidator': 'Password must contain numbers, uppercase letters and special characters.'
    };

  }
  return null;
}

export function passwordMatch(password: string, confirmPassword: string): ValidatorFn {
  console.log("passworddd___mathc", password, confirmPassword);

  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors?.['passwordMismatch']
    ) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: 'Confirm Password should be same as password' });
      return { passwordMismatch: 'Confirm Password should be same as password' };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  };
}
// export function MustMatch(controlName: string, matchingControlName: string) {
//   // return (formGroup: FormGroup) => {
//     return (formGroup: AbstractControl): { [key: string]: any } | null => {

//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];

//     if (matchingControl.errors && !matchingControl.errors?.['MustMatch']) {
//       return;
//     }

//     // set error on matchingControl if validation fails
//     if (control.value !== matchingControl.value) {
//       matchingControl.setErrors({ mustMatch: true });
//     } else {
//       matchingControl.setErrors(null);
//     }
//     // return null;
//   };
// }

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors?.['mustMatch']) {
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  };
}

