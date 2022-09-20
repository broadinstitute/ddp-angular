export type DashboardColumns = 'name' | 'summary' | 'date' | 'status' | 'actions';
export type cellTypes = 'form' | 'description' | 'date' | 'status' | 'action';
export interface CustomDashboardColumns {
    name: String;
    key: String;
    cellType: cellTypes;
}
