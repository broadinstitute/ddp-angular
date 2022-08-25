import { BehaviorSubject, Observable } from 'rxjs';
import { FeatureFlags } from './feature-flags';
import { FeatureFlagsEnum} from './feature-flags.enum';


const initialFlags: FeatureFlags = {
  [FeatureFlagsEnum.DDP_8404_Home_page_update] : false,
  [FeatureFlagsEnum.DDP_8560_Dashboard_page_update] : false
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
