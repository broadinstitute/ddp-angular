import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {studyGuidEnum} from "../enums/studyNameEnum";
import {SessionService} from "../services/session.service";

@Injectable()
export class OncHistoryUploadGuard implements CanActivate {
  constructor(private readonly session: SessionService) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedStudies: string[] =
      [studyGuidEnum.OC_PE_CGS, studyGuidEnum.LMS];

    return allowedStudies.includes(this.session.selectedRealm);
  }
}
