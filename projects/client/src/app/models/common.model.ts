import { Dictionary } from 'lodash';

export interface IResponse<T> {
  data: T;
  message: string;
  succeed: boolean;
  errors: Dictionary<string[]>;
}

export interface IDictionaryBase {
  id: string;
  code: string;
  name: string;
  parentId?: string;
}

export interface IList<T> {
  list: T[];
  count: number;
}

export interface BooleanFn {
  (): boolean;
}

export interface IFile {
  id: string;
  filename: string;
  url: string;
}

export enum EntityTypeEnum {
  LoanApplication = 1,
  LoanApplicationTask = 2,
  PKB = 3,
  Comment = 4,
  GKB = 5,
  Personality = 6,
  UserImage = 7,
}

export interface IFileBase {
  entityId: string;
  entityType: EntityTypeEnum;
}

export interface IFileUpload extends IFileBase {
  files: FileList;
}

export interface IConfirmDialogContent {
  title: string;
  contentText?: string;
}

export enum Gender {
  Female = 0,
  Male = 1,
}

export enum EssenceType {
  Individual = 1,
  Legal = 2,
}

export interface IAttachment extends IFile {
  documentType: string;
  applicationNumber: string;
  applicationDate: string;
}
