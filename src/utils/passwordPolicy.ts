export const PASSWORD_POLICY_MESSAGE =
  "Password must be 8-16 characters and include an uppercase letter, a number, and a symbol.";

const STRONG_PASSWORD =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

export function getPasswordPolicyError(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }
  if (!STRONG_PASSWORD.test(password)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  return null;
}
