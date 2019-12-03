export class ActivityPicklistDetails {
    public placeholder: string | null = null;
    public stableId: string | null = null;
    public text: string | null = null;
    public show = false;

    public isAssignedTo(stableId: string): boolean {
        return this.stableId === stableId;
    }

    public assign(stableId: string, placeholder: string | null): void {
        this.stableId = stableId;
        this.placeholder = placeholder;
    }
}
