import { ClientApp } from "../database/entity/ClientApp";
import Db, {initializeDb} from "../database/data-source";
import CustomError from "../utils/error";
import { CreateNewApp, UpdateApp } from "../interfaces/ClientAppInterface";
import ServiceResponse from "./Response";
import Crypto from "crypto";
import * as constants from "../config/constants";
import queryString from "querystring";
import dataSource from "../database/migration-runner";
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
  async getAppById(id: number) {
    await initializeDb(Db);
    const data = await Db.getRepository(ClientApp)
      .createQueryBuilder("client_app")
      .select("client_app.name", "AppName")
      .addSelect("client_app.id", "AppId")
      .addSelect("client_app.callback_url", "CallbackUrl")
      .addSelect("client_app.app_id", "AppAccessId")
      .where(`client_app.id = ${id}`)
      .andWhere("client_app.clientId = :ownerId", {
        ownerId: this.#ownerId,
      })
      .execute();
    if (data) {
      return data;
    } else {
      throw new CustomError("No data found for given id", 400);
    }
  }
  async createApp({ callbackUrl, appName }: CreateNewApp) {
    await initializeDb(Db);
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
  async getApps(id ?: number) {
    await initializeDb(Db);
    let data = Db.getRepository(ClientApp)
      .createQueryBuilder("client_app")
      .select("client_app.name", "AppName")
      .addSelect("client_app.id", "AppId")
      .addSelect("client_app.callback_url", "CallbackUrl")
      .addSelect("client_app.app_id", "AppAccessId")
      .where("client_app.clientId = :ownerId", {
        ownerId: this.#ownerId,
      })
    if (id) {
      data = data.andWhere("client_app.id = :appId", {
        appId: id,
      });
    }
    data = await data.execute();
    const response = new ServiceResponse(200);
    return response
      .setData(data)
      .setMessage(`${data ? "Apps fetched" : "No app found"} `)
      .getResponse();
  }
  async updateApp(appId: number, updateData: UpdateApp) {
    await initializeDb(Db);
    const response = new ServiceResponse(200);
    await this.getAppById(appId);
    let clientApp: any = {};
    if (updateData.appName) {
      clientApp.name = updateData.appName;
    }
    if (updateData.callbackUrl) {
      clientApp.callbackUrl = updateData.callbackUrl;
    }
    await Db.getRepository(ClientApp).update(
      {
        id: appId,
      },
      clientApp
    );
    return response.setMessage("App updated").getResponse();
  }
}

export default ClientAppService;
