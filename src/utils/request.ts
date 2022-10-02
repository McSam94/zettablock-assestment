const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAIL = "FAIL";
const RESET = "RESET";

export const createRequestTypes = (base: string) => ({
  [REQUEST]: `${base}_${REQUEST}`,
  [SUCCESS]: `${base}_${SUCCESS}`,
  [FAIL]: `${base}_${FAIL}`,
  [RESET]: `${base}_${RESET}`,
});

const ON = "ON";
const OFF = "OFF";

export const createToggleTypes = (base: string) => ({
  [ON]: `${base}_${ON}`,
  [OFF]: `${base}_${OFF}`,
});
