export interface NetworkingMock {
    key: string;
    mock: string | null;
    mocked: boolean;
    supportedCodes: Array<number>;
    mockedCode: number;
    returnNull: boolean;
}
