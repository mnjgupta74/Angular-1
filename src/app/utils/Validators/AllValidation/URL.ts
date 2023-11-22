import { AbstractControl, ValidatorFn } from "@angular/forms";

export function isValidURL(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const regex = new RegExp(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/);
        if (!regex.test(control.value)) {
            return { 'isValidURL': 'This is valid URL.' };
        }
    }
    return null;
}
