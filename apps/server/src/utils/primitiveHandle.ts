export const safeAnyToNumber = <T = unknown>(
  inputVal: Exclude<T, (...args: never) => unknown>,
  fallbackNum = 0,
) => {
  if (inputVal === null || typeof inputVal === 'symbol') {
    return fallbackNum;
  }

  const result = Number(inputVal);
  return isNaN(result) ? fallbackNum : result;
};

export const UNSAFE_anyToNumber = <T = unknown>(
  inputVal: Exclude<T, (...args: never) => unknown>,
) => {
  if (!inputVal) {
    return inputVal;
  }

  const result = Number(inputVal);
  return isNaN(result) ? inputVal : result;
};
