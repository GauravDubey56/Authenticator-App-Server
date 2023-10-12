class CustomError extends Error {
  constructor(errMessage: string) {
    throw super(errMessage);
  }
}

export default CustomError;
