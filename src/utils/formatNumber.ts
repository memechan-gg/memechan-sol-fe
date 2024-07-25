// import { Decimal } from "decimal.js";
// import { numericFormatter } from "react-number-format";

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

// export const formatMoney = (value: number | string, symbol?: string): string => {
//   let formatted: string;
//   const valueFloat = typeof value === "string" ? parseFloat(value) : value;
//   if (valueFloat > 0 && valueFloat < 0.01) {
//     formatted = "<0.01";
//   } else if (valueFloat > -0.01 && valueFloat < 0) {
//     formatted = ">-0.01";
//   } else if (Math.round(Math.abs(valueFloat) * 100) / 100 >= 100) {
//     formatted = Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(valueFloat);
//   } else {
//     formatted = Intl.NumberFormat("en-US", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(valueFloat);
//   }
//   return symbol ? `${formatted} ${symbol}` : formatted;
// };

// export const NUMERIC_FORMAT_DEFAULT_PROPS: { thousandSeparator: string } = {
//   thousandSeparator: ",",
// };

// export const formatNumberV2 = (value: number): string => {
//   const parsed = isFinite(value) ? new Decimal(value).toFixed() : "";
//   return numericFormatter(parsed, NUMERIC_FORMAT_DEFAULT_PROPS);
// };

// export const truncateAddress = (address: string | null | undefined): string | null => {
//   return truncateText(address, { nCharsStart: 5, nCharsEnd: 4 });
// };

// type TruncateTextOptions = { nCharsStart: number; nCharsEnd: number };
// export const truncateText = (text: string | null | undefined, options: TruncateTextOptions): string | null => {
//   if (!text) {
//     return null;
//   }
//   const start = text.substring(0, options.nCharsStart);
//   const end = text.substring(text.length - options.nCharsEnd);
//   const shortText = `${start}…${end}`;
//   if (shortText.length < text.length) {
//     return shortText;
//   } else {
//     return text;
//   }
// };

// export const toTitleCase = (input: string): string =>
//   input.replace(/\w+/g, (word) => word[0].toUpperCase() + word.substring(1).toLowerCase());

// export const removeNegativeSign = (str: string): string => (str.startsWith("-") ? str.substring(1) : str);

// export const truncateLabel = (label: string, maxLength: number): string =>
//   label.length > maxLength ? label.substring(0, maxLength - 3).trimEnd() + "..." : label;

// type TruncateLinkedItemsParams = {
//   childName: string;
//   parentName: string;
//   maxLength?: number;
// };

// export const truncateLinkedItems = ({
//   childName,
//   parentName,
//   maxLength = Infinity,
// }: TruncateLinkedItemsParams): [string, string] => {
//   const separator = " 🔗 ";
//   const lengthWithoutTruncation = childName.length + parentName.length + separator.length;
//   if (lengthWithoutTruncation <= maxLength) {
//     return [childName, parentName];
//   } else {
//     const maxLengthWithoutSeparator = maxLength - separator.length;
//     const spareCharsFromChild = Math.max(maxLengthWithoutSeparator / 2 - childName.length, 0);
//     const spareCharsFromParent = Math.max(maxLengthWithoutSeparator / 2 - parentName.length, 0);
//     const childNameTruncated = truncateLabel(childName, maxLengthWithoutSeparator / 2 + spareCharsFromParent);
//     const parentNameTruncated = truncateLabel(parentName, maxLengthWithoutSeparator / 2 + spareCharsFromChild);
//     return [childNameTruncated, parentNameTruncated];
//   }
// };

// export const pluralize = (word: string, count: number): string => `${word}${count > 1 || count === 0 ? "s" : ""}`;

// export const stripDecimalsAndFormat = (value: number, maxTotalChars = 5): string => {
//   // Special handling for very small decimal values

//   if (value > 0 && value < 0.01) {
//     return "<0.01";
//   } else if (value < 0 && value > -0.01) {
//     return ">-0.01";
//   }
//   const maxCharsExcludingDecimalPlace = maxTotalChars - 1;

//   // Convert the number to a compact string without any decimal places first
//   const compactNumber: string = new Intl.NumberFormat("en-US", {
//     notation: "compact",
//     maximumFractionDigits: 0,
//   }).format(value);
//   if (compactNumber.length >= maxCharsExcludingDecimalPlace) {
//     // If the compact number without decimals already meets/exceeds the length, return it
//     return compactNumber;
//   } else {
//     // Calculate how many decimal places can fit into the remaining space
//     const remainingChars = maxCharsExcludingDecimalPlace - compactNumber.length;

//     return new Intl.NumberFormat("en-US", {
//       notation: "compact",
//       maximumFractionDigits: remainingChars,
//     }).format(value);
//   }
// };
