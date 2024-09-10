export const safeAnyToNumber = (inputVal: unknown, fallbackNum = 0) => {
  const result = Number(inputVal);
  return isNaN(result) ? fallbackNum : result;
};

export const UNSAFE_anyToNumber = (inputVal: unknown) => {
  if (!inputVal) {
    return inputVal;
  }

  const result = Number(inputVal);
  return isNaN(result) ? inputVal : result;
};
