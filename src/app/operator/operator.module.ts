import { NgModule } from '@angular/core';
import {HttpModule} from "@angular/http";
import {OperatorService} from "./operator.service";

@NgModule({
  imports: [
    HttpModule
  ],
  declarations: [OperatorService],
  exports: [OperatorService]
})
export class OperatorModule { }
