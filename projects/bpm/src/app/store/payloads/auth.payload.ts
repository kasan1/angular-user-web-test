export interface ILoginPayload {
  inn: string;
  password: string;
}

export interface ILoggedInPayload {
  iin: string;
  lastName: string;
  firstName: string;
  middleName: string;
}
