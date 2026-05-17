export interface ShowDto {
    id: string;
    title: string;
    author: string;
    genre: string;
    date: Date;
    totalSeats: number;
    availableSeats: number;
    ticketPrice: number;
}
export interface TicketDto {
    id: string;
    showId: string;
    showTitle: string;
    showDate: Date;
    buyerName: string;
    seatNumber: number;
    purchaseDate: Date;
    pricePaid: number;
    isReturned: boolean;
}
export interface CreateShowDto {
    title: string;
    author: string;
    genre: string;
    date: Date;
    totalSeats: number;
    ticketPrice: number;
}
export interface BuyTicketDto {
    showId: string;
    buyerName: string;
}
export interface ReturnTicketDto {
    ticketId: string;
}
export interface OperationResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map