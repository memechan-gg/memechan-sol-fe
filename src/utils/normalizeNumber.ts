export function normalizeNumber(number: number | string) {
  number = number.toString();

  if (number.includes(".")) {
    const [integer, decimal] = number.split(".");

    let i = 0;

    while (decimal[i] === "0") {
      i++;
    }

    const numberAfterZeros = decimal.slice(i + 1);

    return `${integer}.${decimal.slice(0, i)}${numberAfterZeros.slice(0, 2)}`;
  } else {
    return number;
  }
}
