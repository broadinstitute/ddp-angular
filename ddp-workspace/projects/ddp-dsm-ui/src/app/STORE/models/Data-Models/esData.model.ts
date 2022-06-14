import {ProfileModel} from "./profile.model";
import {DsmModel} from "./dsm.model";
import {MedicalProviderModel} from "./medicalProvider.model";
import {ActivityDataModel} from "./activityData.model";
import {AddressModel} from "./address.model";
import {InvitationDataModel} from "./invitationData.model";
import {ComputedModel} from "./computed.model";

export interface EsDataModel {
  profile: ProfileModel;
  status: string;
  statusTimestamp: number;
  dsm: DsmModel;
  ddp: string;
  medicalProviders: MedicalProviderModel[];
  files: any[];
  activities: ActivityDataModel[];
  address: AddressModel;
  invitations: InvitationDataModel[];
  computed: ComputedModel;
}
