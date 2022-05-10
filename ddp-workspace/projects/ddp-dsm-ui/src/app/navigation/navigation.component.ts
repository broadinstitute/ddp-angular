import {Component, OnInit} from '@angular/core';
import {filter} from 'rxjs/operators';
import {ComponentService} from '../services/component.service';
import {RoleService} from '../services/role.service';
import {Auth} from '../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {NameValue} from '../utils/name-value.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})

export class NavigationComponent implements OnInit {

  realmFromUrl: string;


  constructor(private router: Router, private auth: Auth, private sanitizer: DomSanitizer,
              private role: RoleService, private route: ActivatedRoute, private title: Title) {
  }


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.params
      .subscribe(params => {
        this.realmFromUrl = params.study;
        this.title.setTitle(this.realmFromUrl);
      });
    this.auth.getRealmList();
  }

  selectRealm(newValue): void {
    this.auth.selectRealm(newValue);
  }

  isRealmChosen(realm): boolean {
    return this.realmFromUrl === realm;
  }

  doLogin(): void {
    localStorage.removeItem(ComponentService.MENU_SELECTED_REALM); // if user logs in new or logs out, remove stored menu!
    this.auth.logout();
  }

  hasRole(): RoleService {
    return this.role;
  }

  getAuth(): Auth {
    return this.auth;
  }

  shouldSeeRealmSelection(): boolean {
    return this.role.allowedToHandleSamples() || this.role.allowedToViewMedicalRecords() ||
      this.role.allowedToViewMailingList() || this.role.allowedToViewEELData() ||
      this.role.allowedToExitParticipant() || this.role.allowedToSkipParticipantEvents() ||
      this.role.allowedToDiscardSamples() || this.role.allowToViewSampleLists() ||
      this.role.allowedParticipantListView();
  }
}
