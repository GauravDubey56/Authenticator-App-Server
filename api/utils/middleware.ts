import { NextFunction, Response, Request, ErrorRequestHandler } from "express";
import CustomError from "./error";
import sendResponse from "./response";
const handleApiException = (error: any) => {
  if (error instanceof CustomError) {
    return {
      statusCode: 400,
      message: error.message,
    };
  } else {
    return {
      statusCode: 500,
      error,
    };
  }
};

export const asyncHandler =
  (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const errorObject = handleApiException(error);
      sendResponse(res, errorObject);
    }
  };

export const nextErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  if (error) {
    sendResponse(res, {
      statusCode: 500,
      message: "Something went wrong",
      error,
    });
  } else {
    sendResponse(res, {
      statusCode: 500,
      message: "An unkown error occurred",
    });
  }
};
