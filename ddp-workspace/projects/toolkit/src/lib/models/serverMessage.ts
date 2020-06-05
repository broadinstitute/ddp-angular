export class ServerMessage {
    public text: string;
    public isError: boolean;
    public constructor(text: string, isError: boolean) {
      this.text = text;
      this.isError = isError;
    }
}
