import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ]
})
export class MaterialModule { }
