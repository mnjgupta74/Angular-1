import { AbstractControl } from "@angular/forms";

export function Alphabet(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const regex = new RegExp(/^[a-zA-Z ]*$/);
        if (!regex.test(control.value)) {
            return { 'Alphabet': 'Only Alphabets are allowed.' };
        }

    }
    return null;
}
export function NotSpecialChar(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        // const regex = new RegExp(/^[a-zA-Z ]*$/);
        var regex = new RegExp("^[a-zA-Z0-9 ]+$");
        if (!regex.test(control.value)) {
            return { 'NotSpecialChar': 'Only Alphabets and Numeric are allowed.' };
        }

    }
    return null;
}

export function IFSCFormat(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const regex = new RegExp(/^[A-Z]{4}[0-9]{7}$/)
        if (!regex.test(control.value)) {
            return { 'IFSCFormat': 'IFSC Code not valid (e.g. SBIN0001234)' };
        }

    }
    return null;
}

export function cannotContainSpace(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const regex = new RegExp(/\s/g)
        if (regex.test(control.value)) {
            return { 'cannotContainSpace': 'Space is not allowed.' };
        }
    }
    return null;
}
export function BeginSpace(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const regex = new RegExp(/^\s/);
        if (regex.test(control.value)) {
            return { 'BeginSpace': 'Field not start with Space.' };
        }
        // input.value = '';
    }
    return null;
}

export function TanFormat(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const regex = new RegExp(/^[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}$/)
        if (!regex.test(control.value)) {
            return { 'TanFormat': 'Tan Number not valid' };
        }

    }
    return null;
}



