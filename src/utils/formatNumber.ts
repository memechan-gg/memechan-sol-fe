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
