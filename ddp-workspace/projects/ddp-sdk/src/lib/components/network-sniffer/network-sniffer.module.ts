import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NetworkSnifferComponent} from './networkSniffer.component';
import {NewRequestMock} from './newRequestMock.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatLineModule, MatOptionModule} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatSlideToggleModule,
    MatLineModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
  ],
  declarations: [
    NetworkSnifferComponent,
    NewRequestMock,
  ],
  exports: [
    NetworkSnifferComponent,
    NewRequestMock,
  ],
})
export class DdpNetworkSnifferModule {}
