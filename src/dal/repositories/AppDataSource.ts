import "reflect-metadata";
import { DataSource } from "typeorm";
import { ShowEntity } from "../entities/ShowEntity";
import { TicketEntity } from "../entities/TicketEntity";
import * as path from "path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "..", "..", "..", "data", "theatre.db"),
  synchronize: true,
  logging: false,
  entities: [ShowEntity, TicketEntity],
});
