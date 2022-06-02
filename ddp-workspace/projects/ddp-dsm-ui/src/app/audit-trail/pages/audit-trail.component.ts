import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, of } from "rxjs";

interface AuditTrail {
  date: string;
  name: string;
  operatorId: string;
  centerName: string;
  activity: string;
  action: string;
  subjectName: string;
  subjectId: string;
  details: { Question: string; Answer: string }[];
}

const MOCK_RESPONSE: AuditTrail[] = [
  {
    date: "01/02/2021",
    name: "Last name, first name",
    operatorId: "789-123",
    centerName: "Center name or ID",
    activity: "Medical history",
    action: "Created",
    subjectName: "Last name, first name",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
  {
    date: "01/02/2021",
    name: "Last name, first name",
    operatorId: "789-123",
    centerName: "Center name or ID",
    activity: "Medical history",
    action: "Created",
    subjectName: "Last name, first name",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
  {
    date: "01/02/2021",
    name: "Last name, first name",
    operatorId: "789-123",
    centerName: "Center name or ID",
    activity: "Medical history",
    action: "Created",
    subjectName: "Last name, first name",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
  {
    date: "01/02/2021",
    name: "Last name, first name",
    operatorId: "789-123",
    centerName: "Center name or ID",
    activity: "Medical history",
    action: "Created",
    subjectName: "Last name, first name",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
];

@Component({
  selector: "app-audit-trail",
  templateUrl: "./audit-trail.component.html",
  styleUrls: ["./audit-trail.component.scss"],
})
export class AuditTrailComponent implements OnInit {
  response$: Observable<AuditTrail[]>;
  operatorSearchText$ = new BehaviorSubject("");
  subjectSearchText$ = new BehaviorSubject("");
  centers$ = new BehaviorSubject<{ centerName: string; checked: boolean }[]>(
    []
  );
  activities$ = new BehaviorSubject<{ activity: string; checked: boolean }[]>(
    []
  );

  constructor() {}

  ngOnInit(): void {
    this.response$ = combineLatest([
      of(MOCK_RESPONSE),
      this.operatorSearchText$,
      this.subjectSearchText$,
      this.centers$,
      this.activities$,
    ]).pipe(
      map(([data, operator, subject, centers, activities]) => {
        if (!centers.length && !activities.length) {
          this.centers$.next(
            this.groupBy(data, (x) => x.centerName)
              .map((x) => x[0])
              .map((x) => ({ centerName: x.centerName, checked: true }))
          );
          const groupedActivities = this.groupBy(data, (x) => x.activity)
            .map((x) => x[0])
            .map((x) => ({ activity: x.activity, checked: true }));
          this.activities$.next(groupedActivities);
        }

        const filteredCenters = this.centers$.value
          .filter((filter) => filter.checked === true)
          .map((x) => x.centerName);
        const filteredActivities = this.activities$.value
          .filter((filter) => filter.checked === true)
          .map((x) => x.activity);
        console.log(filteredActivities);
        return data.filter((x) => 
            x.name.toLowerCase().includes(operator.toLowerCase()) &&
            x.subjectName.toLowerCase().includes(subject.toLowerCase()) &&
            filteredCenters.includes(x.centerName) &&
            filteredActivities.includes(x.activity)
        );
      })
    );
  }

  onFilterSelect(selectedFilter: string) {
    const updatedFilters = this.centers$.value.map((filter) => {
      if (filter.centerName === selectedFilter) {
        filter.checked = !filter.checked;
      }
      return filter;
    });
    this.centers$.next(updatedFilters);
  }

  onActivitySelect(selectedFilter: string) {
    const updatedFilters = this.activities$.value.map((filter) => {
      console.log(selectedFilter, filter);
      if (filter.activity === selectedFilter) {
        filter.checked = !filter.checked;
      }
      return filter;
    });
    console.log(updatedFilters);
    this.activities$.next(updatedFilters);
  }

  groupBy = <T, K>(list: T[], getKey: (item: T) => K) => {
    const map = new Map<K, T[]>();
    list.forEach((item) => {
      const key = getKey(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return Array.from(map.values());
  };
}
