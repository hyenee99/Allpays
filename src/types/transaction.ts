export interface Transaction {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: string;
  status: string;
  paymentAt: string;
}

export interface TransactionsResponse {
  status: number;
  message: string;
  data: Transaction[];
}
