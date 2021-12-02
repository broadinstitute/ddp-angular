export enum UserType {
    user = 'user',
    operator = 'operator'
}
export enum InstanceType {
    latest = 'latest',
    specific = 'specific'
}
export enum Timeunit {
    days = 'DAYS',
    weeks = 'WEEKS',
    months = 'MONTHS',
    years = 'YEARS'
}
export enum UnaryOperator {
    not = '!',
    minus = '-'
}
export enum RelationOperator {
    less = '<',
    lessOrEqual = '<=',
    more = '>',
    moreOrEqual = '>='
}
export enum EqualityOperator {
    equal = '==',
    notEqual = '!='
}
export enum LogicalOperator {
    and = '&&',
    or = '||'
}
// ----------------
export enum StudyPredicate {
    hasAgedUp = 'hasAgedUp',
    hasInvitation = 'hasInvitation',
    isGovernedParticipant = 'isGovernedParticipant',
    isEnrollmentStatus = 'isEnrollmentStatus'
}
export enum ProfilePredicate {
    birthDate = 'birthDate',
    age = 'age',
    language = 'language'
}
export enum FormPredicate {
    isStatus = 'isStatus',
    hasInstance = 'hasInstance'
}


