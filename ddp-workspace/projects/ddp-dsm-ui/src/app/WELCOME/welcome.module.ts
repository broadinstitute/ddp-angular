import {NgModule} from '@angular/core';
import {welcomeRoutingModule} from './welcome-routing.module';
import {AuthComponent} from './auth/auth.component';
import {CommonModule} from '@angular/common';
import {PickStudyComponent} from './pickStudy/pickStudy.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';

const angularMaterial = [MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule, MatButtonModule];

@NgModule({
  declarations: [AuthComponent, PickStudyComponent],
  imports: [CommonModule, welcomeRoutingModule, ...angularMaterial, ReactiveFormsModule],
})

export class WelcomeModule {}
