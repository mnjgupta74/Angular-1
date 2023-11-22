import { Component, OnInit,ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-togglesidemenu',
  templateUrl: './togglesidemenu.component.html',
  styleUrls: ['./togglesidemenu.component.scss']
})
export class TogglesidemenuComponent implements OnInit {
  showFiller = false;
  
  @ViewChild('select') select!: ElementRef;
  selected :string="active";
  constructor() { }

  ngOnInit(): void {
  }

  togglesidebar() {
    
    if(this.selected==="active"){
    document.getElementById('sidebar')?.classList.add('toggler');
    document.getElementById('sidebarbtn')?.classList.add('toggle-sidebar-btn_toggle');
    this.selected="inactive";
    }
    else{
    document.getElementById('sidebar')?.classList.remove('toggler');
    document.getElementById('sidebarbtn')?.classList.remove('toggle-sidebar-btn_toggle');
    this.selected="active";
    }
    // console.log(width);

  }
}
