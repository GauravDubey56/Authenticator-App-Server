import { Response } from "express";
const sendResponse = (res: Response, response: apiResponse) => {
  if (response.redirectUrl) {
    res.redirect(response.redirectUrl);
  } else {
    res.status(response.statusCode).json({
      message: response.message || "",
      data: response.data || null,
      ...(response.error && {
        exception: response.error,
      }),
    });
  }
};
export default sendResponse;
