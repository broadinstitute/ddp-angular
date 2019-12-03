export class DdpException {
    constructor(private body?: any) { }

    public get Body(): any {
        return this.body;
    }
}
