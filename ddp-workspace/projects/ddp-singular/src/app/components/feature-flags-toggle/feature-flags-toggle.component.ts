import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';

import { FeatureFlags } from '../../config/feature-flags/feature-flags';
import { getFeatureFlags, setFeatureFlags } from '../../config/feature-flags/feature-flags-setup';

@Component({
  selector: 'app-feature-flags-toggle',
  templateUrl: './feature-flags-toggle.component.html',
  styles: [`
    .title-text {
      font-size: 24px;
      text-align: center;
    }
    .toggle {
      display: block;
      margin: 20px;
    }
  `]
})
export class FeatureFlagsToggleComponent implements OnInit, OnDestroy {
  featureFlagsGroup: FormGroup;
  private readonly featureFlags: FeatureFlags = getFeatureFlags();
  private subscription: Subscription;

  ngOnInit(): void {
    const controls = Object.entries(this.featureFlags)
      // sort alphabetically
      .sort(([flagName1, flagValue1], [flagName2, flagValue2]) => flagName2.localeCompare(flagName1))
      .reduce((acc, [flagName, flagValue]) => {
        acc[flagName] = new FormControl(flagValue);
        return acc;
      }, {});

    this.featureFlagsGroup = new FormGroup(controls);

    this.subscription = this.featureFlagsGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe(this.toggleFlags);
  }

  toggleFlags(flags: FeatureFlags): void {
    setFeatureFlags(flags);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
