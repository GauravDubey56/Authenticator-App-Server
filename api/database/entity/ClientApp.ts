import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Client } from "./Client";
@Entity("client_apps", { schema: "public" })
export class ClientApp {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ name: "name", type: "varchar" })
  name: string;
  @ManyToOne(() => Client, (client: Client) => client.apps)
  client: Client;
  @Column({name: "clientId", type: "integer"})
  clientId: number;
  @Column({ name: "app_id", type: "varchar", unique: true })
  appId: string;
  @Column({ name: "access_key", type: "varchar" })
  accessKey: string;
  @Column({ name: "salt", type: "varchar" })
  salt: string;
  @Column({ name: "hash", type: "varchar" })
  hash: string;
  @Column({ name: "callback_url", type: "varchar" })
  callbackUrl: string;
  @Column({ name: "app_info", type: "json" })
  appInfo?: clientInfo;
  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: string;
  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: string;
}
