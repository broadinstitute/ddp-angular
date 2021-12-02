import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Auth0AdapterService } from 'ddp-sdk';

@Component({
  selector: 'app-accept-age-up',
  templateUrl: './accept-age-up.component.html',
  styleUrls: ['./accept-age-up.component.scss'],
})
export class AcceptAgeUpComponent implements OnInit {
  constructor(private route: ActivatedRoute, private auth0: Auth0AdapterService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.auth0.signup({ invitation_id: params['invitation'] });
    });
  }
}
