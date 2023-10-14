import GithubAuthService from "../services/GithubAuthService";
import { Request, Response } from "express";
import * as Log from "../utils/logger";
import sendResponse from "../utils/response";
import UserService from "../services/ClientService";
import ClientService from "../services/ClientService";

export const generateAuthUrl = async (req: Request, res: Response) => {
  const authUrl = await GithubAuthService.generateAuthUrl();
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
    const GithubUserService = new GithubAuthService(req.query.code);
    const githubUserData = await GithubUserService.getUserFromAuthCode();
    const githubEmail = await GithubUserService.getEmailsByUser();
    const newUser = await ClientService.createUserFromGithub({
      githubUserData,
      githubEmail,
    });
    sendResponse(res, {
      statusCode: 200,
      data: newUser,
    });
  } else {
    sendResponse(res, {
      statusCode: 400,
      message: "No auth code received",
    });
  }
};
