import { ShowDto, TicketDto, CreateShowDto, BuyTicketDto, ReturnTicketDto, OperationResult } from "../dto";
export interface IShowService {
    getAllShows(): Promise<ShowDto[]>;
    getShowById(id: string): Promise<ShowDto | null>;
    createShow(dto: CreateShowDto): Promise<OperationResult<ShowDto>>;
    updateShow(id: string, dto: Partial<CreateShowDto>): Promise<OperationResult<ShowDto>>;
    deleteShow(id: string): Promise<OperationResult>;
    getUpcomingShows(): Promise<ShowDto[]>;
}
export interface ITicketService {
    buyTicket(dto: BuyTicketDto): Promise<OperationResult<TicketDto>>;
    returnTicket(dto: ReturnTicketDto): Promise<OperationResult<{
        refundAmount: number;
    }>>;
    getTicketsByShow(showId: string): Promise<TicketDto[]>;
    getTicketsByBuyer(buyerName: string): Promise<TicketDto[]>;
    getTicketById(id: string): Promise<TicketDto | null>;
}
//# sourceMappingURL=index.d.ts.map