export class PrionActivityInstanceState {
    code: string;
    translationKey: string;

    public constructor (code: string, translationKey: string) {
        this.code = code;
        this.translationKey = translationKey;
    }
}
