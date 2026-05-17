export interface ShowEntity {
    id: string;
    title: string;
    author: string;
    genre: string;
    date: string;
    totalSeats: number;
    availableSeats: number;
    ticketPrice: number;
}
export interface TicketEntity {
    id: string;
    showId: string;
    buyerName: string;
    seatNumber: number;
    purchaseDate: string;
    pricePaid: number;
    isReturned: boolean;
}
//# sourceMappingURL=index.d.ts.map