export const UNSAFE_anyToNumber = <T = unknown>(
  inputVal: Exclude<T, (...args: never) => unknown>,
) => {
  if (!inputVal) {
    return inputVal;
  }

  const result = Number(inputVal);
  return isNaN(result) ? inputVal : result;
};
