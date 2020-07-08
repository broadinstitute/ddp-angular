export class UserProfile {
    public birthYear: number | null;
    public birthDayInMonth: number | null;
    public birthMonth: number | null;
    public sex: string | null;
    public preferredLanguage: string | null;
    public firstName: string | null;
    public lastName: string | null;
    public enrollmentStatus: string | null;
    public consoleActions: Array<{ name: string, href: string }> | null;
}
