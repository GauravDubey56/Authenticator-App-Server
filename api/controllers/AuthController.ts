import GithubAuthService from "../services/GithubAuthService";
import { Request, Response } from "express";
import * as Log from "../utils/logger";
import sendResponse from "../utils/response";
import Logger from "../utils/logging";

const GithubService = new GithubAuthService();

export const generateAuthUrl = async (req: Request, res: Response) => {
  console.log(req.query);
  const authUrl = await GithubService.generateAuthUrl();
  Log.debug(`Auth url `, authUrl);
  // return res.redirect(authUrl);
  sendResponse(res, {
    statusCode: 200,
    data: {
      redirectUrl: authUrl,
    },
  });
};

export const handleGithubCallback = async (req: Request, res: Response) => {
  if (req?.query?.code) {
    const user = await GithubService.getUserFromAuthCode(req.query.code);
    sendResponse(res, {
      statusCode: 200,
      data: user,
    });
  } else {
    sendResponse(res, {
      statusCode: 400,
      message: "No auth code received",
    });
  }
};
