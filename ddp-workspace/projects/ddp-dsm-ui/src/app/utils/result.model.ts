export class Result {
  constructor(public code: number, public body: string) {
  }

  static parse(json): Result {
    return new Result(json.code, json.body);
  }
}
