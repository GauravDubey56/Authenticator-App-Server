import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthInterface";
import ClientAppService from "../services/ClientApp";
import sendResponse from "../utils/response";
export const createNewApp = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const clientApp = new ClientAppService(req.user.clientId);
  const newApp = await clientApp.createApp({
    callbackUrl: req.body.CallbackUrl,
    appName: req.body.AppName,
  });
  sendResponse(res, {
    statusCode: newApp.status,
    message: newApp.message,
    data: newApp.data,
  });
};

export const getClientApps = async (req: AuthenticatedRequest, res: Response) => {
  const clientApp = new ClientAppService(req.user.clientId);
  const appsData = await clientApp.getApps();
  sendResponse(res, {
    statusCode: appsData.status,
    message: appsData.message,
    data: appsData.data,
  });
};
