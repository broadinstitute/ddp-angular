import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './pages/patients.component';
import { ParticipantsListComponent } from './components/participantsList/participantsList.component';

import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [PatientsComponent, ParticipantsListComponent],
  imports: [CommonModule, PatientsRoutingModule, MaterialModule],
})
export class PatientsModule {}
