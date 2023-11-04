import { ClientApp } from "../database/entity/ClientApp";
import Db from "../database/data-source";
import CustomError from "../utils/error";
import { createNewApp } from "../interfaces/ClientAppInterface";
import ServiceResponse from "./Response";
import Crypto from "crypto";
import * as constants from "../config/constants";
import queryString from "querystring";
class ClientAppService {
  #ownerId: number;
  constructor(ownerId: number) {
    this.#ownerId = ownerId;
  }
  generateRandomAppId(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  getAppByName(appName: string) {
    return Db.getRepository(ClientApp)
      .createQueryBuilder("client_app")
      .where("client_app.name = :appName ", {
        appName,
      })
      .andWhere("client_app.clientId = :ownerId", {
        ownerId: this.#ownerId,
      })
      .getOne();
  }
  generateAccessKeyAndHash() {
    const secretKey = Crypto.randomBytes(20).toString("hex");
    const salt = Crypto.randomBytes(16).toString("hex");
    const hashedPassword = Crypto.pbkdf2Sync(
      secretKey,
      salt,
      10,
      32,
      "sha512"
    ).toString("hex");
    return {
      secretKey,
      hashedKey: [salt, hashedPassword].join("#"),
      hash: hashedPassword,
      salt,
    };
  }
  generateHashFromAccessKey(secretKey: string) {
    const salt = Crypto.randomBytes(16).toString("hex");
    const hashedPassword = Crypto.pbkdf2Sync(
      secretKey,
      salt,
      10,
      32,
      "sha512"
    ).toString("hex");
    return {
      secretKey,
      hashedKey: [salt, hashedPassword].join("#"),
    };
  }
  async createApp({ callbackUrl, appName }: createNewApp) {
    const response = new ServiceResponse(400);
    const existingApp = await this.getAppByName(appName);
    if (existingApp) {
      throw new CustomError("Application with given name already exists");
    } else {
      const clientApp = new ClientApp();
      clientApp.name = appName;
      clientApp.callbackUrl = callbackUrl;
      clientApp.appId = this.generateRandomAppId();
      clientApp.clientId = this.#ownerId;
      const secrets = this.generateAccessKeyAndHash();
      clientApp.hash = secrets.hash;
      clientApp.salt = secrets.salt;
      clientApp.accessKey = secrets.secretKey;
      clientApp.appInfo = {};
      await Db.getRepository(ClientApp).save(clientApp);
      const authUrl = `${constants.AUTH_PAGE_URL}?${queryString.stringify({
        appId: clientApp.appId,
        accessId: secrets.secretKey,
      })}`;
      return response
        .success("New application created", {
          secretKey: secrets.secretKey,
          authUrl,
        })
        .getResponse();
    }
  }
}

export default ClientAppService;
