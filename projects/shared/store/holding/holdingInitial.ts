import { ITableState, tableInitialState } from '../table';
import {
  PledgeFirstLevel,
  PledgeSecondLevel,
  PledgeThirdLevel,
} from 'projects/shared/services/pledge.service';

export interface IHoldingEntry {
  id: string;
  applicationId: string;

  name: string;
  address: string;
  firstLevel: PledgeFirstLevel;
  secondLevel: PledgeSecondLevel;
  thirdLevel: PledgeThirdLevel;
  asonSum?: number;
  nokSum?: number;
  finalSum?: number;

  livingArea?: number;
  totalArea?: number;
  landArea?: number;
  builtYear?: number;
  rent?: number;
  rentedFor?: number;
  landPurpose?: string;
  commercialName?: string;

  year?: number;
  govNumber?: string;
  registerDate?: Date;
  registerNumber?: string;
  vin?: string;
  mark?: string;
  color?: string;
  countryCode?: string;

  cadastralNumber?: string;
  coefficient?: number;
  nokName?: string;
  expertSum?: number;
  expertiseSum?: number;
}

export interface IHoldingState extends ITableState<IHoldingEntry> {
  loading: boolean;
}

export const holdingInitialState: IHoldingState = {
  ...tableInitialState,
  loading: false,
};
