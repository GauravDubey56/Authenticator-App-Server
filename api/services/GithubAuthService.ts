// import * as queryString from 'query-string';
import * as Constants from "../config/constants";
import Http from "../utils/http";
import queryString from "querystring";
import CustomError from "../utils/error";
import Logger from "../utils/logging";
class GithubAuthService {
  #accessCode: any;
  #authToken: any;
  constructor (code ?: any) {
    if(code) {
      this.#accessCode = code;
    }
  }
  static async generateAuthUrl(): Promise<string> {
    const params = queryString.stringify({
      client_id: Constants.GITHUB_CLIENT_ID,
      redirect_uri: Constants.GITHUB_CALLBACK_URL,
      allow_signup: true,
      scope: `user:email`
    });
    const githubLoginUrl = `${Constants.GITHUB_AUTH_URL}?${params}`;
    return githubLoginUrl;
  }
  setAccessCode(code: string) {
    this.#accessCode = code;
  }
  getAccessCode() {
    return this.#accessCode
  }
  setAuthToken(token: any) {
    this.#authToken = token;
  }
  getAuthToken() {
    return this.#authToken
  }
  async getUserAccessToken(code?: any) {
    if(this.getAuthToken()) {
      return this.getAuthToken();
    }
    if(!code) {
      code = this.getAccessCode();
    }
    const apiCall = {
      url: `https://github.com/login/oauth/access_token?client_id=${Constants.GITHUB_CLIENT_ID}&client_secret=${Constants.GITHUB_CLIENT_SECRET}&code=${code}`,
      headers: {
        accept: "application/json",
      },
    };
    const response = await Http.post(apiCall.url, { headers: apiCall.headers });
    Logger.log('access token response', response.data)
    if (response?.data?.access_token) {
      this.setAuthToken(response?.data?.access_token);
      return response?.data?.access_token;
    } else {
      throw new CustomError(`Could not generate access token for code ${code}`);
    }
  }
  private async getHeaderForUserApi () {
    const accessToken = await this.getUserAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`
    }
  }
  async getUserFromAuthCode() {
    const apiCall = {
      url: `${Constants.GITHUB_USER_API}`,
      headers: await this.getHeaderForUserApi(),
    };
    const response = await Http.get(apiCall.url, { headers: apiCall.headers });
    Logger.log(response.data);
    return response.data;
  }
  async getEmailsByUser() {
    const authHeader = await this.getHeaderForUserApi()
    const apiCall = {
      url: `${Constants.GITHUB_USER_API}/emails`,
      headers: authHeader,
    }
    const response = await Http.get(apiCall.url, { headers: apiCall.headers });
    Logger.log(response.data);
    if(Array.isArray(response.data)) {
      return response.data.filter((emailId: any) => emailId.primary)[0].email
    } else {
      throw new CustomError('Could not find email for github user')
    }
    
  }
}

export default GithubAuthService;
