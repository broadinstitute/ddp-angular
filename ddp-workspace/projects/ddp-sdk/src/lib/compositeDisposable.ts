import { Subscription, TeardownLogic } from 'rxjs';

export class CompositeDisposable {
    private isSmbSubscribed = false;
    private anchor: Subscription;

    constructor(subscription?: Subscription) {
        this.anchor = new Subscription();
        subscription && this.addNew(subscription);
    }

    public addNew(teardown: TeardownLogic): this {
        this.anchor.add(teardown);
        this.isSmbSubscribed = true;
        return this;
    }

    public removeAll(): void {
        if (this.isSmbSubscribed) {
            this.anchor.unsubscribe();
            this.isSmbSubscribed = false;
        }
    }
}
