import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, of } from "rxjs";
import { DropdownGroup } from "../components/dropdown-select/dropdown-select.component";

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
    name: "User Name #1",
    operatorId: "789-123",
    centerName: "Center name 1",
    activity: "Medical history",
    action: "Created",
    subjectName: "User Name #1",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
  {
    date: "01/02/2021",
    name: "User Name #2",
    operatorId: "789-123",
    centerName: "Center name 2",
    activity: "Medical history",
    action: "Created",
    subjectName: "User Name #1",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
  {
    date: "01/02/2021",
    name: "User Name #3",
    operatorId: "789-123",
    centerName: "Center name 3",
    activity: "Medical history",
    action: "Created",
    subjectName: "User Name #1",
    subjectId: "321-456",
    details: [
      { Question: "History of Complications", Answer: "Endocarditis" },
      { Question: "Age of consent", Answer: "12" },
    ],
  },
  {
    date: "01/02/2021",
    name: "User Name #4",
    operatorId: "789-123",
    centerName: "Center name 4",
    activity: "Medical history",
    action: "Created",
    subjectName: "User Name #1",
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
  fromDateSearch$ = new BehaviorSubject("");
  fromTimeSearch$ = new BehaviorSubject("");

  centers$ = new BehaviorSubject<DropdownGroup[]>([]);
  activities$ = new BehaviorSubject<DropdownGroup[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.response$ = combineLatest([
      of(MOCK_RESPONSE),
      this.operatorSearchText$,
      this.subjectSearchText$,
      this.centers$,
      this.activities$,
      this.fromDateSearch$,
      this.fromTimeSearch$,
    ]).pipe(
      map(
        ([
          data,
          operator,
          subject,
          centers,
          activities,
          fromDate,
          fromTime,
        ]) => {
          let fromDateTimeString;
          if (fromTime || fromDate) {
            fromDateTimeString = this.combineDate(fromDate, fromTime);
          }

          if (!centers.length && !activities.length) {
            this.centers$.next(
              this.groupBy(data, (x) => x.centerName)
                .map((x) => x[0])
                .map((x) => ({ label: x.centerName, isChecked: true }))
            );
            const groupedActivities = this.groupBy(data, (x) => x.activity)
              .map((x) => x[0])
              .map((x) => ({ label: x.activity, isChecked: true }));
            this.activities$.next(groupedActivities);
          }

          const filteredCenters = this.centers$.value
            .filter((filter) => filter.isChecked === true)
            .map((x) => x.label);
          const filteredActivities = this.activities$.value
            .filter((filter) => filter.isChecked === true)
            .map((x) => x.label);
          return data.filter((x) => {
            const currentDate = new Date(x.date);
            const currentDateUTC = Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate()
            );

            console.log(currentDate, currentDateUTC, fromDateTimeString);
            return (
              x.name.toLowerCase().includes(operator.toLowerCase()) &&
              x.subjectName.toLowerCase().includes(subject.toLowerCase()) &&
              filteredCenters.includes(x.centerName) &&
              filteredActivities.includes(x.activity)
            );
          });
        }
      )
    );
  }

  onFilterSelect(selectedFilters): void {
    console.log(selectedFilters);
  }

  combineDate(dateString: string, timeString?: string) {
    const date = new Date();
    const timeSplit = timeString.split(":");
    const dateSplit = dateString.split("-");
    if (timeSplit) {
      date.setHours(parseInt(timeSplit[0]));
      date.setMinutes(parseInt(timeSplit[1]));
    }
    if (dateSplit) {
      date.setFullYear(parseInt(dateSplit[0]));
      date.setMonth(parseInt(dateSplit[1]));
      date.setDate(parseInt(dateSplit[2]));
    }

    const utcDateTime =
      [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()].join(
        "-"
      ) +
      " " +
      [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].join(
        ":"
      ) +
      "Z";

    return utcDateTime;
  }

  onActivitySelect(selectedFilter: string): void {
    const updatedFilters = this.activities$.value.map((filter) => {
      console.log(selectedFilter, filter);
      if (filter.label === selectedFilter) {
        filter.isChecked = !filter.isChecked;
      }
      return filter;
    });
    this.activities$.next(updatedFilters);
  }

  groupBy: any = <T, K>(list: T[], getKey: (item: T) => K) => {
    // eslint-disable-next-line
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

  sortByOperator(response: AuditTrail[]): void {
    response.sort((a, b) =>
      parseInt(a.operatorId) < parseInt(b.operatorId) ? 1 : -1
    );
  }
}
