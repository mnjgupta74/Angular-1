import { Directive, ElementRef, HostListener, Input, Optional } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[numberOnly]'

})
export class NumberOnlyDirective {

  constructor(public el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initvalue = this.el.nativeElement.value;
    this.el.nativeElement.value = initvalue.replace(/[^0-9]*/g, '');
    if (initvalue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
};

@Directive({
  selector: '[alphabetOnly]'
})
export class AlphabetOnlyDirective {
  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^a-zA-Z, ]/, '');
    input.value = sanitized;
  }

};

@Directive({
  selector: '[formControlName]',
})
export class TrimDirective {
  constructor(private readonly control: NgControl) { }

  @HostListener('change') onchange() {
    if (typeof this.control.value === 'string') {
      this.control?.control?.setValue(this.control.value.trim());
    }
  }
}


