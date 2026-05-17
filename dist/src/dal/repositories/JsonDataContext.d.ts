import { ShowEntity, TicketEntity } from "../entities";
import { IDataContext, IRepository } from "../interfaces";
export declare class JsonDataContext implements IDataContext {
    private readonly dbPath;
    private data;
    private isDirty;
    shows: IRepository<ShowEntity>;
    tickets: IRepository<TicketEntity>;
    constructor(dbPath: string);
    private loadDatabase;
    save(): Promise<void>;
}
//# sourceMappingURL=JsonDataContext.d.ts.map