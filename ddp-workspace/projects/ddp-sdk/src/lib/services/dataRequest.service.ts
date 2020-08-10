import { Inject, Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DataRequestService {
  constructor(@Inject('ddp.config') private configuration: ConfigurationService) {}
}
