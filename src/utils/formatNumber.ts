import BigNumber from "bignumber.js";

/**
 * Formats a number with a fixed number of decimal places,
 * removing any trailing zeros.
 *
 * @param {number} num - The number to format.
 * @param {number} decimalPlaces - The number of decimal places.
 * @returns {string} The formatted number as a string without trailing zeros.
 */
export function formatNumber(num: number, decimalPlaces: number): string {
  const fixedNum = num.toFixed(decimalPlaces);

  const formattedNum = parseFloat(fixedNum).toLocaleString(undefined, { maximumFractionDigits: decimalPlaces });

  return formattedNum;
}

/**
 * Returns the position of the first non-zero digit in the fractional part of a given number.
 * If there is no fractional part or if it consists only of zeros, returns null.
 *
 * @param {number} num - The number to analyze.
 * @returns {number | null} The position of the first non-zero digit in the fractional part,
 *                          or null if there is no fractional part or it consists only of zeros.
 *
 * @example
 * getFirstNonZeroDigitInFractionalPartPosition(5.83048542001408e-7); // 7
 * getFirstNonZeroDigitInFractionalPartPosition(1e-21); // 21
 * getFirstNonZeroDigitInFractionalPartPosition(1e21); // null
 * getFirstNonZeroDigitInFractionalPartPosition(0.00000123); // 7
 */
export function getFirstNonZeroDigitInFractionalPartPosition(num: number): number | null {
  const numString = new BigNumber(num).toFixed();
  const dotPosition = numString.indexOf(".");

  if (dotPosition === -1) {
    return null;
  }

  let firstNonZeroDigitPosition = null;
  for (let i = dotPosition + 1; i < numString.length; i++) {
    if (numString[i] !== "0") {
      firstNonZeroDigitPosition = i;
      break;
    }
  }

  return firstNonZeroDigitPosition;
}

export function formatPrice(num: number) {
  const firstNonZeroDigitPosition = getFirstNonZeroDigitInFractionalPartPosition(num);

  /**
   * If `firstNonZeroDigitPosition` is `null`, just take 2 digits after dot.
   * If `firstNonZeroDigitPosition` is a number, increment it because it's index, not count.
   */
  const decimalPlaces = (firstNonZeroDigitPosition ?? 1) + 1;
  const formattedPrice = formatNumber(num, decimalPlaces);

  return formattedPrice;
}
