import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

export type FadeState = 'visible' | 'hidden';
@Component({
  selector: 'app-upload-ecs-file',
  templateUrl: './upload-ecs-file.component.html',
  styleUrls: ['./upload-ecs-file.component.scss'],
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
export class UploadEcsFileComponent implements OnInit {
  state!: FadeState;
   _show!: boolean;
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
  animationDone(event: any) {
    // now remove the 
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      // this._show = false;
      this._show = false;
      // this.state=
    }
  }
  constructor() { }

  ngOnInit(): void {
  }
  msgOnButtonClick!: any;
  msgOnChildCompInit!: String;
  name = 'Angular';

  receivedMessageHandler(p:any) {
    this.msgOnButtonClick = p;
    console.log(p);
    
    this.show=this.msgOnButtonClick
  }

  receiveAutoMsgHandler(p:any) {
    this.msgOnChildCompInit = p;
    console.log();
    
  }
}
