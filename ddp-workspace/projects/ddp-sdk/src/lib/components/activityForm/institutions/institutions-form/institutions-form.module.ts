import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InstitutionsFormComponent} from './institutionsForm.component';
import {DdpInstitutionModule} from '../institution/institution.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    DdpInstitutionModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [InstitutionsFormComponent],
  exports: [InstitutionsFormComponent],
})
export class DdpInstitutionsFormModule { }
