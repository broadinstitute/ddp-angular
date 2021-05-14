export enum EnrollmentStatusType {
    REGISTERED = 'REGISTERED',
    ENROLLED = 'ENROLLED',
    EXITED_BEFORE_ENROLLMENT = 'EXITED_BEFORE_ENROLLMENT',
    EXITED_AFTER_ENROLLMENT = 'EXITED_AFTER_ENROLLMENT',
    CONSENT_SUSPENDED = 'CONSENT_SUSPENDED',
    COMPLETED = 'COMPLETED',
}
export const enrollmentStatusTypeToLabel = new Map<EnrollmentStatusType, string>([
    [EnrollmentStatusType.REGISTERED, 'SDK.Prism.EnrollmentStatusType.Registered'],
    [EnrollmentStatusType.ENROLLED, 'SDK.Prism.EnrollmentStatusType.Enrolled'],
    [EnrollmentStatusType.EXITED_BEFORE_ENROLLMENT, 'SDK.Prism.EnrollmentStatusType.ExitedBeforeEnrollment'],
    [EnrollmentStatusType.EXITED_AFTER_ENROLLMENT, 'SDK.Prism.EnrollmentStatusType.ExitedAfterEnrollment'],
    [EnrollmentStatusType.CONSENT_SUSPENDED, 'SDK.Prism.EnrollmentStatusType.ConsentSuspended'],
    [EnrollmentStatusType.COMPLETED, 'SDK.Prism.EnrollmentStatusType.Completed'],
]);
