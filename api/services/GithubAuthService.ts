// import * as queryString from 'query-string';
import * as Constants from "../config/constants";
import Http from "../utils/http";
import { GithubAuthInterface } from "../interfaces/auth.interface";
import queryString from "querystring";
import CustomError from "../utils/error";
class GithubAuthService implements GithubAuthInterface {
  async generateAuthUrl(): Promise<string> {
    const params = queryString.stringify({
      client_id: Constants.GITHUB_CLIENT_ID,
      redirect_uri: Constants.GITHUB_CALLBACK_URL,
      allow_signup: true,
    });
    const githubLoginUrl = `${Constants.GITHUB_AUTH_URL}?${params}`;
    return githubLoginUrl;
  }
  async getUserAccessToken(code: any) {
    const apiCall = {
      url: `https://github.com/login/oauth/access_token?client_id=${Constants.GITHUB_CLIENT_ID}&client_secret=${Constants.GITHUB_CLIENT_SECRET}&code=${code}`,
      headers: {
        accept: "application/json",
      },
    };
    const response = await Http.post(apiCall.url, { headers: apiCall.headers });
    console.log(response.data)
    if (response?.data?.access_token) {
      return response?.data?.access_token;
    } else {
      throw new CustomError(`Could not generate access token for code ${code}`);
    }
  }
  async getUserFromAuthCode(code: any) {
    const accessToken = await this.getUserAccessToken(code);
    console.log(accessToken)
    const apiCall = {
      url: Constants.GITHUB_USER_API,
      headers: {
        Authorization: `token ${accessToken}`,
      },
    };
    const response = await Http.get(apiCall.url, { headers: apiCall.headers });
    console.log(response.data)
    return response.data;
  }
}

export default GithubAuthService;
