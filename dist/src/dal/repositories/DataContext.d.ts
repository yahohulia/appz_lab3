import { DataSource } from "typeorm";
import { ShowEntity } from "../entities/ShowEntity";
import { TicketEntity } from "../entities/TicketEntity";
import { IDataContext, IRepository } from "../interfaces";
export declare class DataContext implements IDataContext {
    shows: IRepository<ShowEntity>;
    tickets: IRepository<TicketEntity>;
    private readonly dataSource;
    constructor(dataSource: DataSource);
}
//# sourceMappingURL=DataContext.d.ts.map