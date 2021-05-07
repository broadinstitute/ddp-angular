export enum EnrollmentStatusType {
    REGISTERED = 'REGISTERED',
    ENROLLED = 'ENROLLED',
    EXITED_BEFORE_ENROLLMENT = 'EXITED_BEFORE_ENROLLMENT',
    EXITED_AFTER_ENROLLMENT = 'EXITED_AFTER_ENROLLMENT',
    CONSENT_SUSPENDED = 'CONSENT_SUSPENDED',
    COMPLETED = 'COMPLETED',
}
export const enrollmentStatusTypeToLabel = new Map<EnrollmentStatusType, string>([
    [EnrollmentStatusType.REGISTERED, 'Registered'],
    [EnrollmentStatusType.ENROLLED, 'Enrolled'],
    [EnrollmentStatusType.EXITED_BEFORE_ENROLLMENT, 'Exited before enrollment'],
    [EnrollmentStatusType.EXITED_AFTER_ENROLLMENT, 'Exited after enrollment'],
    [EnrollmentStatusType.CONSENT_SUSPENDED, 'Consent suspended'],
    [EnrollmentStatusType.COMPLETED, 'Completed'],
]);
