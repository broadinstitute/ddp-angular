import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from "toolkit";

@Component({
  selector: 'privacy-policy-full',
  template: `
    <prion-header currentRoute="/privacy-policy"></prion-header>
    <prion-privacy-policy></prion-privacy-policy>
  `
})
export class PrivacyPolicyFullComponent implements OnInit {
  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {

  }
}
