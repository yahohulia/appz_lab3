import { DataSource } from "typeorm";
import { ShowEntity } from "../entities/ShowEntity";
import { TicketEntity } from "../entities/TicketEntity";
import { IDataContext, IRepository } from "../interfaces";
import { TypeOrmRepository } from "./TypeOrmRepository";

export class DataContext implements IDataContext {
  public shows: IRepository<ShowEntity>;
  public tickets: IRepository<TicketEntity>;

  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.shows = new TypeOrmRepository(dataSource.getRepository(ShowEntity));
    this.tickets = new TypeOrmRepository(
      dataSource.getRepository(TicketEntity),
    );
  }
}
