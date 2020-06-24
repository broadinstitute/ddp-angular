import { Injectable } from '@angular/core';
import { ToolkitConfigurationService } from "toolkit";

@Injectable()
export class PrionToolkitConfigurationService extends ToolkitConfigurationService {
  assetsBucketUrl: string;
}
