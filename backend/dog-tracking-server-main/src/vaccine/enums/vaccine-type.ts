import { registerEnumType } from "@nestjs/graphql";

export enum VaccineType {
  LiveAttenuated = 'Live Attenuated',
  Inactivated = 'Inactivated',
  Combination = 'Combination',
  Other = 'Other',
}

