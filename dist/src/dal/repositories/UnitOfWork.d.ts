import { ShowEntity } from "../entities/ShowEntity";
import { TicketEntity } from "../entities/TicketEntity";
import { IRepository, IUnitOfWork, IDataContext } from "../interfaces";
export declare class UnitOfWork implements IUnitOfWork {
    readonly shows: IRepository<ShowEntity>;
    readonly tickets: IRepository<TicketEntity>;
    private readonly context;
    private snapshotShows;
    private snapshotTickets;
    private inTransaction;
    constructor(context: IDataContext);
    saveChanges(): Promise<void>;
    beginTransaction(): void;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): void;
}
//# sourceMappingURL=UnitOfWork.d.ts.map