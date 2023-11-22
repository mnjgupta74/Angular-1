

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { ActiveReportsModule } from '@grapecity/activereports-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptorInterceptor } from './interceptor/auth-interceptor.interceptor';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatSidenavModule} from '@angular/material/sidenav';


// import { CommonDirective } from './directives/common.directive';
import { LayoutModule } from './layout/layout.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

// import { PfmsTrackReportComponent } from './Reports/pfms-track-report/pfms-track-report.component';
 
 





@NgModule({
  declarations: [
    AppComponent,
 
    // 
    // CommonDirective 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule ,
    // MatCardModule,
    // MatIconModule,
    // MatExpansionModule,
    // MatSidenavModule,
    LayoutModule,

    // ActiveReportsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
