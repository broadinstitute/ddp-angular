import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivityServiceAgent, CompositeDisposable } from 'ddp-sdk';


@Component({
  selector: 'app-sandbox-institution-info',
  templateUrl: 'institutionInfo.component.html',
  styles: [
    `.form-field {
        width: 50%;
      }`
  ]
})
export class InstitutionInfoComponent implements OnInit, OnDestroy {
  public instanceGuid: string;
  public activityGuid = 'TEST_MULTIPLE_INSTITUTIONS_COMPONENT';
  public insitutionOptions: any = [
    'TEST_MULTIPLE_INSTITUTIONS_COMPONENT',
    'TEST_MULTIPLE_PHYSICIANS_COMPONENT',
    'TEST_SINGLE_INSTITUTION_COMPONENT',
    'TEST_SINGLE_PHYSICIAN_COMPONENT'
  ];
  private anchor: CompositeDisposable;

  constructor(private serviceAgent: ActivityServiceAgent) { }

  public ngOnInit(): void {
    this.anchor = new CompositeDisposable();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public create(): void {
    const create = this.serviceAgent.createInstance('TESTSTUDY1', this.activityGuid)
       .subscribe(x => {
        !!x && (this.instanceGuid = x.instanceGuid);
      });
    this.anchor.addNew(create);
  }
}
