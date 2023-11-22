import { ContextPathService } from 'src/app/services/context-path.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  IsLogin: boolean = false;

  constructor(
    private contextPathService: ContextPathService,
    private router: Router
  ) {
    this.contextPathService.config.subscribe((item: any) => {
      this.IsLogin = item.IsLogin;
      console.log(this.IsLogin);
    });
  }
  @ViewChild('drawer') public drawer!: MatDrawer;
  public getScreenWidth: any;
  panelOpenState: boolean = false;
  showFiller = false;
  event: any;
  currentRoute: any;
  rotater: any = document.getElementsByClassName('toggler-button');
  sidebarElement: any = document.getElementsByClassName('sidebar');
  getSmSidebar: any;
  myElement: any;

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.currentRoute = evt.url;
        // alert(this.currentRoute)
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  isLargeScreen() {
    this.myElement = document.getElementById('side-bar');
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > 991) {
      this.showFiller = false;
      this.getSmSidebar == document.getElementsByClassName('sm-sidebar');
      // this.panelOpenState = true;
      return true;
    } else if (this.getScreenWidth < 992 && this.getScreenWidth > 768) {
      if (this.showFiller == true) {
        this.sidebarElement[0].classList.remove('sm-sidebar');
      } else {
        if (this.panelOpenState == false || this.showFiller == false) {
          this.sidebarElement[0].classList.add('sm-sidebar');
        }
      }
      return true;
    } else {
      this.sidebarElement[0].classList.remove('sm-sidebar');
      return false;
    }
  }

  toggle_sm(e: any) {
    this.sidebarElement[0].classList.toggle('sm-sidebar');
    this.showFiller = !this.showFiller;
    this.panelOpenState = false;
  }

  toggle_menu(e: any) {
    if (Object.values(this.myElement.classList).includes('sm-sidebar')) {
      this.rotate();
    }
    this.panelOpenState = true;
    this.sidebarElement[0].classList.remove('sm-sidebar');
    this.showFiller = true;
  }

  // toggler icon rotate function
  rotate() {
    this.rotater[0].classList.toggle('active');
  }

  hideSidenavAfterClick() {
    if (window.innerWidth < 768) {
      this.drawer.close();
    }
  }

  // menuItems = [
  //   {
  //     menuItemId: '1',
  //     name: 'System Admin',
  //     actionName: '#',
  //     controllerName: '#',
  //     url: '#',
  //     disable: 'False',
  //     hasAccess: '1,2,3,4,5,7,9',
  //     parentMenuId: '0',
  //     menuImage: 'glyphicon glyphicon-book',
  //     menuDescription: 'Menu description on hover',
  //     userIdAccess: null,
  //     menuUrl: null,
  //   },
  //   {
  //     menuItemId: '2',
  //     name: 'MajorHead User Mapping',
  //     actionName: 'MHeadUserMapping',
  //     controllerName: 'MHeadUserMapping',
  //     url: '/MHeadUserMapping',
  //     disable: 'False',
  //     hasAccess: '1,2,3,4,5,7,9',
  //     parentMenuId: '1',
  //     menuImage: null,
  //     menuDescription: null,
  //     userIdAccess: null,
  //     menuUrl: null,
  //   },

  // ];

  menuItems = [
    {
      MenuId: 1,
      MenuName: 'Home',
      MenuLink: null,
      Action: null,
      Controller: null,
      ParentID: null,
      SortOrder: 1,
      ModuleId: null,
      Disabled:false,
      Child: [
        {
          MenuId: 9,
          MenuName: 'Masters',
          MenuLink: null,
          Action: null,
          Controller: null,
          ParentID: 1,
          SortOrder: 1,
          ModuleId: null,
          SubChild: [],
        },
      ]
    },    
    {
      MenuId: 2,
      MenuName: 'Data Upload',
      MenuLink: null,
      Action: null,
      Controller: null,
      ParentID: null,
      SortOrder: 2,
      ModuleId: null,
      Child: [
        {
          MenuId: 10,
          MenuName: 'Masters',
          MenuLink: null,
          Action: null,
          Controller: null,
          ParentID: 2,
          SortOrder: 1,
          ModuleId: null,
          SubChild: [],
        },
      ]
    },
    {
      MenuId: 3,
      MenuName: 'Administration',
      MenuLink: null,
      Action: null,
      Controller: null,
      ParentID: null,
      SortOrder: 3,
      ModuleId: null,
      Child: [
        {
          MenuId: 4,
          MenuName: 'Masters',
          MenuLink: null,
          Action: null,
          Controller: null,
          ParentID: 3,
          SortOrder: 1,
          ModuleId: null,
          SubChild: [
            {
              MenuId: 5,
              MenuName: 'Currency',
              MenuLink: '/Currencies/Index',
              Action: 'Index',
              Controller: 'Currencies',
              ParentID: 4,
              SortOrder: 1,
              ModuleId: null,
              Child: [],
            },
            {
              MenuId: 6,
              MenuName: 'Country',
              MenuLink: '/Countries/Index',
              Action: 'Index',
              Controller: 'Countries',
              ParentID: 4,
              SortOrder: 2,
              ModuleId: null,
              Child: [],
            },
          ],
        },
        {
          MenuId: 7,
          MenuName: 'User Management',
          MenuLink: null,
          Action: null,
          Controller: null,
          ParentID: 3,
          SortOrder: 2,
          ModuleId: null,
          SubChild: [],
        },
      ],
    },
  ];
}
