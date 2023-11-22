
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { ContentComponent } from './content/content.component';

import { TogglesidemenuComponent } from './togglesidemenu/togglesidemenu.component';

import { SharedModule } from "../shared/shared.module";




@NgModule({
  declarations: [
    LayoutComponent,
    ContentComponent,
    FooterComponent,
    HeaderComponent,

    TogglesidemenuComponent,

  ],
  imports: [
    CommonModule,AppRoutingModule, MatIconModule, MatSidenavModule, MatButtonModule,SharedModule
  ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
