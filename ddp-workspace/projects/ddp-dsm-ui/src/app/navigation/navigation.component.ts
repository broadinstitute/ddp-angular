import {Component, OnInit} from '@angular/core';
import {tap} from 'rxjs/operators';
import {ComponentService} from '../services/component.service';
import {RoleService} from '../services/role.service';
import {Auth} from '../services/auth.service';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';
import {SessionStorageService} from '../services/session-storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})

export class NavigationComponent implements OnInit {

  selectedStudy: Observable<string>;


  constructor(private router: Router, private auth: Auth, private location: Location, sanitizer: DomSanitizer,
              private role: RoleService, private activatedRoute: ActivatedRoute, private title: Title,
              private localStorageService: SessionStorageService) {
  }


  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.selectedStudy = this.auth.getSelectedStudy().pipe(tap(study => this.title.setTitle(study)));

    this.auth.getRealmList();


    this.router.events
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          const [,study,page] = event.url.split('/');
          this.auth.selectRealm(study, page);
          sessionStorage.setItem(ComponentService.MENU_SELECTED_REALM, study);
          this.auth.setSelectedStudy = this.auth.realmList.find(realm => realm.name === study)?.value;
        }
      });

  }

  selectRealm(realmName, realmValue): void {
    const [,study,page] = this.location.path().split('/');
    this.auth.setSelectedStudy = realmValue;
    study !== realmName && this.auth.selectRealm(realmName, page);
    this.localStorageService.emitStudyChange(realmName);
  }

  isRealmChosen(realm): boolean {
    return this.activatedRoute.snapshot.params.study === realm;
  }

  doLogin(): void {
    sessionStorage.removeItem(ComponentService.MENU_SELECTED_REALM); // if user logs in new or logs out, remove stored menu!
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
