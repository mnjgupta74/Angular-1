import { Component, OnInit } from '@angular/core';
import { PlatformLocation,APP_BASE_HREF } from '@angular/common';
import { ContextPathService } from '../services/context-path.service';
import { ActivatedRoute, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  IsActiveHeader:any;
  contextPath!: string;
  IsLogin: boolean = false;
  constructor(private router: Router,private route:ActivatedRoute,private platformLocation: PlatformLocation,private contextPathService: ContextPathService) { 

  this.contextPathService.config.subscribe((item:any)=>{
      this.IsLogin  = item.IsLogin;
    });
    console.log("context path", this.contextPath);
    
    // console.log("my route:",this.router.url);
    // console.log("Activated route",route.snapshot.url);
   
  }

  ngOnInit(): void {
    this.IsActiveHeader= sessionStorage.getItem('IsActiveHeader'); 
   
    
    // this.IsActiveHeader=1;
    // console.log("===>",this.IsActiveHeader); 
    // this.route.url.subscribe(urlSegments => {
    //   console.log(urlSegments); 
    // });

   // console.log("router===>>",this.router);
   
    
  }
}
