import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("clients", { schema: "public" })
export class Client {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ name: "first_name", type: "varchar" })
  firstName: string;
  @Column({ name: "last_name", type: "varchar", nullable: true })
  lastName?: string;
  @Column({ name: "email", type: "varchar" })
  email: string;
  @Column({ name: "github_id", type: "varchar" })
  githubId: string;
  @Column({ name: "owner_id", type: "uuid" })
  ownerId: string;
  @Column({ name: "client_info", type: "json" })
  clientInfo?: clientInfo;
  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: string;
  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: string;


  getFullname() {
    return `${this.firstName}${this.lastName ? ` ${this.lastName}` : ""}`;
  }
  getClient(): clientTokenData {
    const fullName = this.getFullname();
    return {
      name: fullName,
      email: this.email,
      clientId: this.ownerId,
      githubUsername: this?.clientInfo?.githubUsername,
    };
  }
}
