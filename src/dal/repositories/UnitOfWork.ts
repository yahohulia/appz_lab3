import { ShowEntity } from "../entities/ShowEntity";
import { TicketEntity } from "../entities/TicketEntity";
import { IRepository, IUnitOfWork, IDataContext } from "../interfaces";

export class UnitOfWork implements IUnitOfWork {
  public readonly shows: IRepository<ShowEntity>;
  public readonly tickets: IRepository<TicketEntity>;

  private readonly context: IDataContext;
  private snapshotShows: ShowEntity[] = [];
  private snapshotTickets: TicketEntity[] = [];
  private inTransaction: boolean = false;

  constructor(context: IDataContext) {
    this.context = context;
    this.shows = context.shows;
    this.tickets = context.tickets;
  }

  async saveChanges(): Promise<void> {}

  beginTransaction(): void {
    this.inTransaction = true;
    this.context.shows.getAll().then((s) => {
      this.snapshotShows = s.map((x) => ({ ...x }));
    });
    this.context.tickets.getAll().then((t) => {
      this.snapshotTickets = t.map((x) => ({ ...x }));
    });
  }

  async commitTransaction(): Promise<void> {
    if (!this.inTransaction) throw new Error("No active transaction");
    this.inTransaction = false;
    this.snapshotShows = [];
    this.snapshotTickets = [];
  }

  rollbackTransaction(): void {
    if (!this.inTransaction) return;
    this.snapshotShows.forEach((s) => this.context.shows.update(s));
    this.snapshotTickets.forEach((t) => this.context.tickets.update(t));
    this.inTransaction = false;
  }
}
