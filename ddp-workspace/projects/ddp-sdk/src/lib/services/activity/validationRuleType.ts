export enum ValidationRuleType {
    Required = 'REQUIRED',
    Complete = 'COMPLETE',
    Length = 'LENGTH',
    Regex = 'REGEX',
    NumOptionsSelected = 'NUM_OPTIONS_SELECTED',
    YearRequired = 'YEAR_REQUIRED',
    MonthRequired = 'MONTH_REQUIRED',
    DayRequired = 'DAY_REQUIRED',
    DateRange = 'DATE_RANGE',
    AgeRange = 'AGE_RANGE',
    IntRange = 'INT_RANGE',
    DecimalRange = 'DECIMAL_RANGE',
    Unique = 'UNIQUE',
    UniqueValue = 'UNIQUE_VALUE',  // UNIQUE_VALUE is server-side validation
    Comparison = 'COMPARISON'      // COMPARISON is server-side validation
}
