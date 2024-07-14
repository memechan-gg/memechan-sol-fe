/**
 * Formats a number with a fixed number of decimal places,
 * removing any trailing zeros.
 *
 * @param {number} num - The number to format.
 * @param {number} chainDecimals - The number of decimal that are used for storing on chain.
 * @param {number} decimalPlaces - The number of decimal places to leave after parsing.
 * @returns {string} The formatted number as a string without trailing zeros.
 */
export function parseChainValue(num: number, chainDecimals: number, decimalPlaces: number): string {
  const transformedNumber = num / 10 ** chainDecimals;
  const formattedNum = transformedNumber.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces });
  return formattedNum;
}
