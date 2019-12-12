export interface ActivityRule {
    type: string;
    func: (data: any) => any;
}
