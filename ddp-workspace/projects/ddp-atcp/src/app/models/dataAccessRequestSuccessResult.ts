export class DataAccessRequestSuccessResult {
  private readonly _code: string;
  get code(): string {
    return this._code;
  }

  private readonly _message: any;
  get message(): any {
    return this._message;
  }

  constructor(code: string, message: any) {
    this._message = message;
    this._code = code;
  }
}
