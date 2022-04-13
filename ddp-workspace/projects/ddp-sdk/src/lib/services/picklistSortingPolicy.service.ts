import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ActivityPicklistNormalizedGroup } from '../models/activity/activityPicklistNormalizedGroup';
import { SortOrder } from './sortOrder';
import { ActivityPicklistOption } from '../models/activity/activityPicklistOption';
import { FuncType } from '../models/funcType';

export const PICKLIST_SORTING_POLICY_MAIN_SORT_ORDER = new InjectionToken<string>(
    'mainSortOrder for PicklistSortingPolicy configuration', {
        factory: () => SortOrder.NONE // default value for DI
    }
);
export const PICKLIST_SORTING_POLICY_LAST_STABLE_ID = new InjectionToken<string>(
    'lastStableId (optional) for PicklistSortingPolicy configuration', {
        factory: () => undefined // default value for DI
    }
);

@Injectable()
export class PicklistSortingPolicy {
    constructor(
        @Inject(PICKLIST_SORTING_POLICY_MAIN_SORT_ORDER)
            readonly mainSortOrder: SortOrder = SortOrder.NONE, // default value for new PicklistSortingPolicy()
        @Inject(PICKLIST_SORTING_POLICY_LAST_STABLE_ID) readonly lastStableId?: string
    ) {
    }

    public sortPicklistGroups(groups: ActivityPicklistNormalizedGroup[]): ActivityPicklistNormalizedGroup[] {
        const groupsCopy = groups.slice();
        if (this.mainSortOrder === SortOrder.ALPHABETICAL) {
            const sortedPicklistGroups = groupsCopy.sort(this.buildComparator('name'));
            sortedPicklistGroups.forEach(group => group.options = this.sortPicklistOptions(group.options));
        }
        return groupsCopy;
    }

    public sortPicklistOptions(options: Array<ActivityPicklistOption>): Array<ActivityPicklistOption> {
        const optionsCopy = options.slice();
        if (this.lastStableId || this.mainSortOrder === SortOrder.ALPHABETICAL) {
            const comparePicklistOptions: FuncType<number> = (
                a: ActivityPicklistOption,
                b: ActivityPicklistOption,
                lastOptionStableId?: string
            ) => {
                if (lastOptionStableId) {
                    if (a.stableId === lastOptionStableId) {
                        return 1;
                    } else if (b.stableId === lastOptionStableId) {
                        return -1;
                    }
                }
                return this.mainSortOrder === SortOrder.ALPHABETICAL ? this.buildComparator('optionLabel')(a, b) : 0;
            };
            optionsCopy.sort((a, b) => comparePicklistOptions(a, b, this.lastStableId));
        }
        return optionsCopy;
    }

    private buildComparator<T>(property: keyof T): (a: T, b: T) => number {
        return (a: T, b: T): number => {
            if (a[property] < b[property]) {
                return -1;
            } else if (a[property] > b[property]) {
                return 1;
            } else {
                return 0;
            }
        };
    }
}
