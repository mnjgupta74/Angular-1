import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDividerModule} from '@angular/material/divider';
import { MatMenuModule} from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule} from '@angular/material/tabs';

import { MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from '../directives/common.directive';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [NumberOnlyDirective],
  
  exports: [
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatStepperModule,
    MatSidenavModule,
    // datatable
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatNativeDateModule,
    HttpClientModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule,
    MatTabsModule,
    MatListModule,
    CommonModule,
    MatSliderModule,
    DragDropModule

  ],

 

})
export class SharedModule { }
