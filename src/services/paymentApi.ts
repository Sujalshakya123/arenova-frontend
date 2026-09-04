import api from "../api/axios";
import type { PaymentReceipt } from "./paymentReceiptTypes";

export type EsewaPaymentInit = {
  paymentUrl: string;
  amount: string;
  taxAmount: string;
  totalAmount: string;
  transactionUuid: string;
  productCode: string;
  productServiceCharge: string;
  productDeliveryCharge: string;
  successUrl: string;
  failureUrl: string;
  signedFieldNames: string;
  signature: string;
};

export type EsewaVerifyResult = {
  success: boolean;
  message: string;
  paymentStatus: string;
  transactionUuid: string;
  registrationId: number;
  eventId: number;
  amount: string;
  esewaRefId?: string | null;
};

/** Auto-submit a hidden form POST to eSewa checkout. */
export const redirectToEsewa = (payment: EsewaPaymentInit) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payment.paymentUrl;
  form.style.display = "none";

  const fields: Record<string, string> = {
    amount: payment.amount,
    tax_amount: payment.taxAmount,
    total_amount: payment.totalAmount,
    transaction_uuid: payment.transactionUuid,
    product_code: payment.productCode,
    product_service_charge: payment.productServiceCharge,
    product_delivery_charge: payment.productDeliveryCharge,
    success_url: payment.successUrl,
    failure_url: payment.failureUrl,
    signed_field_names: payment.signedFieldNames,
    signature: payment.signature,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export const verifyEsewaPayment = (data: string) =>
  api.post<EsewaVerifyResult>("/api/payments/esewa/verify", { data });

export const resumeEsewaPayment = (registrationId: string | number) =>
  api.post<EsewaPaymentInit>(`/api/registrations/${registrationId}/pay/esewa`);

export const getMyPaymentReceipt = (paymentId: string | number) =>
  api.get<PaymentReceipt>(`/api/payments/${paymentId}`);

export const getMyPaymentReceiptByRegistration = (registrationId: string | number) =>
  api.get<PaymentReceipt>(`/api/registrations/${registrationId}/payment-receipt`);
