export interface INotification {
  id: string;
  title: string;
  body: string;
  createdDate: Date;
  isRead: boolean;
  loanApplicationId: string;
}
