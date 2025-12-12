/**
 * Credit Card Validator
 * Validate credit card numbers
 *
 * Online tool: https://devtools.at/tools/credit-card-validator
 *
 * @packageDocumentation
 */

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

function detectCardType(cardNumber: string): CardType | null {
  const digits = cardNumber.replace(/\D/g, "");

  for (const type of cardTypes) {
    if (type.pattern.test(digits)) {
      return type;
    }
  }

  return null;
}

function formatCardNumber(cardNumber: string, cardType: CardType | null): string {
  const digits = cardNumber.replace(/\D/g, "");

  if (!cardType || !cardType.spacing) {
    // Default formatting: groups of 4
    return digits.match(/.{1,4}/g)?.join(" ") || digits;
  }

  let formatted = "";
  let index = 0;

  for (const group of cardType.spacing) {
    if (index >= digits.length) break;
    if (formatted) formatted += " ";
    // Use slice() instead of deprecated substr()
    formatted += digits.slice(index, index + group);
    index += group;
  }

  // Add remaining digits if any
  if (index < digits.length) {
    formatted += " " + digits.slice(index);
  }

  return formatted;
}

function getIINInfo(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 6) return "";

  const iin = digits.substring(0, 6);
  return `IIN/BIN: ${iin}`;
}

function validateExpirationDate(expiry: string): { valid: boolean; message: string } {
  const cleaned = expiry.replace(/\D/g, "");

  if (cleaned.length !== 4) {
    return { valid: false, message: "Expiration date must be in MM/YY format" };
  }

  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.substring(2, 4), 10);

  if (month < 1 || month > 12) {
    return { valid: false, message: "Invalid month (must be 01-12)" };
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Last 2 digits
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { valid: false, message: "Card has expired" };
  }

  return { valid: true, message: "Valid expiration date" };
}

// Export for convenience
export default { encode, decode };
