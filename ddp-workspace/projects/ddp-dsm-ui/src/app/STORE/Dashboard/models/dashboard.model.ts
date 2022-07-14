export interface DashboardModel {
  type: string;
  title: string;
  size: string;
  x: [number | string];
  y: [number | string];
  values: number[];
  labels: number[];
  color: string[];
}
