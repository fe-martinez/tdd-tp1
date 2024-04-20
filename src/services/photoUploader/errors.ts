class InvalidSizeError extends Error {
  constructor(expected: string, current: string) {
    super(`The photo must be between ${expected}. Actual size: ${current}`);
    this.name = "InvalidSizeError";
  }
}

export { InvalidSizeError };