import { IFile } from './common.model';

export interface IOkapsUser {
  lastName: string;
  firstName: string;
  middleName: string;
  identifier: string;
  email: string;
  phone: string;
  birthDate: Date | null;
  image: IFile;
  certificateStartDate?: Date;
  certificateEndDate?: Date;
}

export interface ITokenClaims {
  userId: string;
  nameId: string;
  email: string;
  sub: string;
  nbf: number;
  exp: number;
}
