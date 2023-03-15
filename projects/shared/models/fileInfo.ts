export interface IFileInfo {
  code: FileCode;
  page: FilePage;

  size: number;

  type: string;
  title: string;

  blob?: File;
  dataBase64?: string;
  id?: string;
  date?: Date;
  appId?: string;
  basePledgeId?: string;
  number?: string;

  pageCount?: number;
  pageInterval?: number;
  isOriginal?: boolean;
}

export enum FileCode {
  Passport = 1, //Удостоверение личности
  FiancePassport = 2, //Удостоверение личности супруги (-а)
  MarriageEvidence = 3, //Свидетелство о заключении брака
  ChildrenEvidence = 4, //Свидетельство о рождении ребенка
  AtamekenCertificate = 5, //Сертификата Национальной палаты предпринимателей «Атамекен»
  TrainingCertificate = 6, //Сертификата о прохождении обучения основам предпринимательства
  EmploymentDirection = 7, //Направление с центра занятости
  AccountEvidence = 8, //Справка о наличии текущего счета
  SanitarEvidence = 9, //Справка о ветеринарно-санитарном благополучии
  RightsEvidence = 10, //справка о зарегистрированных правах и
  // обременениях не более чем за 20
  // календарных дней до даты подачи
  // заявки;
  TechnicalPassport = 11, //Технический паспорт на объект недвижимости,
  BuySellAgreement = 12, //договор купли продажи;
  PrivateAgreement = 13, //договор приватизации;
  MenaAgreement = 14, //договор мены;
  TransportRegisterEvidence = 15, //Свидетельство о регистрации
  // транспортного средства (технический
  // паспорт);
  RepairEvidence = 16, //Документ, подтверждающий
  // исправленное техническое состояние
  // автотранспорта;
  RoadPoliceDocument = 17, //Справка органа Дорожной полиции;
  GarantDecision = 18,
  // Решение гаранта на предоставление
  // гарантии в обеспечение исполнения
  // обязательств Замещика перед Обществом
  BankAgreement = 19, //Договор банкоского счета;
  DepositAgreement = 20,
  //Депозитный
  // договор,
  // подтверждающий размещение денег в
  // банке;
  BusinessPlan = 21, //Бизнес План
  Application = 23, //Заявление
  Survey = 24, //Анкета
  DocumentSummary = 25, //Опись
  ActVisitPlan = 22, //Акт осмотра места бизнеса
  JuristConclusion = 26,
}

export enum FilePage {
  All = 1,
  AppClientInformation = 2,
  AppPledges = 3,
  AppPurpose = 4,
  ActVisit = 5,
  AppFinal = 6,
  JuristExpert = 7,
}

export const TESTFileCodes = () => {
  return [
    { code: FileCode.Passport, title: 'Удостоверение личности' },
    {
      code: FileCode.FiancePassport,
      title: 'Удостоверение личности супруги (-а)',
    },
    {
      code: FileCode.MarriageEvidence,
      title: 'Свидетельство о заключении брака',
    },
    {
      code: FileCode.ChildrenEvidence,
      title: 'Свидетельство о рождении ребенка',
    },
    {
      code: FileCode.AtamekenCertificate,
      title: 'Сертификата Национальной палаты предпринимателей «Атамекен»',
    },
    {
      code: FileCode.TrainingCertificate,
      title: 'Сертификата о прохождении обучения основам предпринимательства',
    },
    {
      code: FileCode.EmploymentDirection,
      title: 'Направление с центра занятости',
    },
    {
      code: FileCode.AccountEvidence,
      title: 'Справка о наличии текущего счета',
    },
    {
      code: FileCode.SanitarEvidence,
      title: 'Справка о ветеринарно-санитарном благополучии',
    },
  ];
};

export const TESTPledgeCodes = () => [
  {
    code: FileCode.RightsEvidence,
    title:
      'Справка о зарегистрированных правах и обременениях не более чем за 20 календарных дней до даты подачи заявки',
  },
  {
    code: FileCode.TechnicalPassport,
    title: 'Технический паспорт на объект недвижимости',
  },
  {
    code: FileCode.BuySellAgreement,
    title: 'Договор купли продажи',
  },
  {
    code: FileCode.PrivateAgreement,
    title: 'Договор приватизации',
  },
  {
    code: FileCode.MenaAgreement,
    title: 'Договор мены',
  },
  {
    code: FileCode.TransportRegisterEvidence,
    title:
      'Свидетельство о регистрации транспортного средства (технический паспорт)',
  },
  {
    code: FileCode.RepairEvidence,
    title:
      'Документ, подтверждающий исправленное техническое состояние автотранспорта',
  },
  {
    code: FileCode.RoadPoliceDocument,
    title: 'Справка органа Дорожной полиции',
  },
  {
    code: FileCode.GarantDecision,
    title:
      'Решение гаранта на предоставление гарантии в обеспечение исполнения обязательств Замещика перед Обществом',
  },
  {
    code: FileCode.BankAgreement,
    title: 'Договор банкоского счета',
  },
  {
    code: FileCode.DepositAgreement,
    title: 'Депозитный договор, подтверждающий размещение денег в банке',
  },
];

export const TESTPurposeCodes = () => [
  {
    code: FileCode.BusinessPlan,
    title: 'Бизнес план',
  },
];

export const TESTFinalCodes = () => [
  {
    code: FileCode.Application,
    title: 'Заявление',
  },
  {
    code: FileCode.Survey,
    title: 'Анкета',
  },
  {
    code: FileCode.DocumentSummary,
    title: 'Опись',
  },
  {
    code: FileCode.BusinessPlan,
    title: 'Бизнес план',
  },
];
