import { BehaviorSubject, Observable } from 'rxjs';
import { FeatureFlags } from './feature-flags';
import { FeatureFlagsEnum} from './feature-flags.enum';


const initialFlags: FeatureFlags = {
  [FeatureFlagsEnum.ShowDDP8404HomePageUpdate] : false,
  [FeatureFlagsEnum.ShowDDP8560DashboardPageUpdate] : false
};

const featureFlags: BehaviorSubject<FeatureFlags> = new BehaviorSubject(initialFlags);

export function getFeatureFlags$(): Observable<FeatureFlags> {
  return featureFlags.asObservable();
}

export function getFeatureFlags(): FeatureFlags {
  return featureFlags.value;
}

export function setFeatureFlags(flags: FeatureFlags): void {
  featureFlags.next(flags);
}
