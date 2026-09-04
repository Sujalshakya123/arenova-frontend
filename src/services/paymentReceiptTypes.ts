export type PaymentReceipt = {
  id: number;
  registrationId?: number | null;
  eventId?: number | null;
  tournament: string;
  playerName: string;
  email: string;
  amount: string;
  method: string;
  status: string;
  transactionUuid: string;
  esewaRefId?: string | null;
  paidAt: string;
  createdAt: string;
};
