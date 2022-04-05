import { ActivitySection } from './activitySection';
import { ReplaySubject } from 'rxjs';
import { ActivityStatusCodes } from './activityStatusCodes';

export class ActivityForm {
    public readonly: boolean;
    public isHidden: boolean;
    public title: string;
    public subtitle: string | null;
    public sections: Array<ActivitySection> = [];
    public introduction: ActivitySection;
    public closing: ActivitySection;
    public formType: string;
    public activityCode: string;
    public readonlyHint: string | null;
    public lastUpdatedText?: string;
    public lastUpdated?: Date;
    public validationState: ReplaySubject<boolean> = new ReplaySubject();
    public sectionIndex: number | null;
    public statusCode: ActivityStatusCodes;

    public validate(validateOnlyVisibleSections?: boolean): boolean {
        let isValid = true;

        const sectionsToValidate = this.getAllSections().filter(
            // section should be considered visible as long as `visible` prop isn't explicitly set to `false`
            section => validateOnlyVisibleSections ? section.visible !== false : section
        );

        for (const section of sectionsToValidate) {
            isValid = section.validate() && isValid;
        }
        this.validationState.next(isValid);
        return isValid;
    }

    public shouldScrollToFirstInvalidQuestion(): void {
        for (const section of this.sections) {
            if (section.shouldScrollToFirstInvalidQuestion()) {
                return;
            }
        }
    }

    public recalculateSectionsVisibility(): void {
        this.sections.forEach(section => section.recalculateVisibility());
    }

    public isSomeSectionVisible(): boolean {
        this.recalculateSectionsVisibility();
        return this.sections.some(section => section.visible === true);
    }

    public visibleSectionsCount(): number {
        this.recalculateSectionsVisibility();
        return this.sections.filter(section => section.visible).length;
    }

    private getAllSections(): Array<ActivitySection> {
        const allSections: ActivitySection[] = [];
        this.introduction && allSections.push(this.introduction);
        allSections.push(...this.sections);
        this.closing && allSections.push(this.closing);
        return allSections;
    }
}
