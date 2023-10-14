import Db from "../database/data-source";
import { Client } from "../database/entity/Client";
import Logger from "../utils/logging";
import ServiceResponse from "./Response";
import { randomUUID } from "crypto";

class ClientService {
  static splitName(name: string) {
    const parts = name.split(/\s/g);
    return {
      firstName: parts[0],
      ...(parts.length > 1 && { lastName: parts.slice(2).join(" ") }),
    };
  }
  static async createUserFromGithub({ githubUserData, githubEmail }: any) {
    const queryRunner = Db.createQueryRunner();
    const response = new ServiceResponse(400);
    try {
      await queryRunner.connect();
      const githubId = githubUserData.id;
      await queryRunner.startTransaction();

      let client = await queryRunner.manager.findOne(Client, {
        where: {
          githubId,
        },
      });

      if (client) {
        response.success("Github user already exists", client);
        return response.getResponse();
      }

      client = new Client();
      client.email = githubEmail;
      client.githubId = githubId;
      client.clientInfo = {
        githubUsername: githubUserData.login,
      };
      const { firstName, lastName } = this.splitName(githubUserData.name);
      client.firstName = firstName;
      if (lastName) {
        client.lastName = lastName;
      }
      client.ownerId = randomUUID();
      await queryRunner.manager.save(client);
      const clientData = client.getClient();
      response.success("New user created", clientData);
    } catch (error: any) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      Logger.error(error);
      error = new Error(error?.message || error);
      response.setError(error);
    } finally {
      if (queryRunner.isTransactionActive) {
        if (response.status == 200) {
          await queryRunner.commitTransaction();
        } else {
          await queryRunner.rollbackTransaction();
        }
      }
      return response.getResponse();
    }
  }
}

export default ClientService;
