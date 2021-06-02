export interface UserStatusResponse {
  medicalRecord: {
    status: string;
    requestedAt?: number;
    receivedBackAt?: number;
  };
  tissueRecord: {
    status: string;
    requestedAt?: number;
    receivedBackAt?: number;
  };
  kits: Array<{
    kitType: string;
    status: string;
    sentAt: number;
    receivedBackAt: number;
    trackingId: string;
    shipper: string;
  }>;
  workflows: Array<{
    workflow: string;
    status: string;
    date: string;
  }>;
}
