import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  SessionMementoService,
  LoggingService
} from 'ddp-sdk';

@Component({
  selector: 'app-prism-activity-link',
  template: `<p></p>`
})
export class PrismActivityLinkComponent implements OnInit {
  // This component handles redirecting a study staff to a specific activity for a specific user. This is
  // handy for embedding a URL in a study staff email. The required arguments to this component is the
  // user's guid and activity instance guid. These are expected to be passed as query parameters.

  private readonly LOG_SOURCE = 'PrismActivityLinkComponent';

  constructor(
    private router: Router,
    private logger: LoggingService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionMementoService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const participantGuid = params.participantGuid;
      const instanceGuid = params.instanceGuid;
      if (participantGuid && instanceGuid) {
          // todo: finish implemention, see ddp-testboston
      } else {
        this.logger.logError(this.LOG_SOURCE, 'Either `participantGuid` or `instanceGuid` query parameters are missing');
        this.router.navigateByUrl(`/error`);
      }
    });
  }
}
