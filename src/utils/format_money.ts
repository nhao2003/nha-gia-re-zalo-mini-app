export function formatNumberWithCommas(value: number) {
  if (value >= 1000) {
    const strNumber = value.toString();
    let result = "";
    for (let i = strNumber.length - 1; i >= 0; i--) {
      result = strNumber[i] + result;
      if ((strNumber.length - i) % 3 === 0 && i > 0) {
        result = "." + result;
      }
    }
    return result;
  } else {
    return value.toString();
  }
}

export function formatNumberWithCommasK(value: number) {
  if (value >= 1000000) {
    const cal = value - (value % 1000);
    const tmp = formatNumberWithCommas(cal);
    return `${tmp}K`;
  } else if (value >= 1000) {
    const cal = value / 1000;
    return `${cal.toFixed(cal % 1 === 0 ? 0 : 1)}K`;
  } else {
    return value.toString();
  }
}
