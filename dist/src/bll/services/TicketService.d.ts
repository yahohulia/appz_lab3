import { IUnitOfWork } from "../../dal/interfaces";
import { BuyTicketDto, OperationResult, ReturnTicketDto, TicketDto } from "../dto";
import { ITicketService } from "../interfaces";
export declare class TicketService implements ITicketService {
    private readonly uow;
    constructor(uow: IUnitOfWork);
    buyTicket(dto: BuyTicketDto): Promise<OperationResult<TicketDto>>;
    returnTicket(dto: ReturnTicketDto): Promise<OperationResult<{
        refundAmount: number;
    }>>;
    getTicketsByShow(showId: string): Promise<TicketDto[]>;
    getTicketsByBuyer(buyerName: string): Promise<TicketDto[]>;
    getTicketById(id: string): Promise<TicketDto | null>;
}
//# sourceMappingURL=TicketService.d.ts.map