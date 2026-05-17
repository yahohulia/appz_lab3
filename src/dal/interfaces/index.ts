import { ShowEntity } from "../entities/ShowEntity";
import { TicketEntity } from "../entities/TicketEntity";

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  find(predicate: (entity: T) => boolean): Promise<T[]>;
  findOne(predicate: (entity: T) => boolean): Promise<T | null>;
}

export interface IDataContext {
  shows: IRepository<ShowEntity>;
  tickets: IRepository<TicketEntity>;
}

export interface IUnitOfWork {
  shows: IRepository<ShowEntity>;
  tickets: IRepository<TicketEntity>;
  saveChanges(): Promise<void>;
  beginTransaction(): void;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): void;
}
