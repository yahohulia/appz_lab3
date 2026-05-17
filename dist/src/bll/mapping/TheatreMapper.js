"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheatreMapper = void 0;
const uuid_1 = require("uuid");
class TheatreMapper {
    static toShowDto(entity) {
        return {
            id: entity.id,
            title: entity.title,
            author: entity.author,
            genre: entity.genre,
            date: new Date(entity.date),
            totalSeats: entity.totalSeats,
            availableSeats: entity.availableSeats,
            ticketPrice: entity.ticketPrice,
        };
    }
    static toShowEntity(dto) {
        return {
            id: (0, uuid_1.v4)(),
            title: dto.title,
            author: dto.author,
            genre: dto.genre,
            date: dto.date.toISOString(),
            totalSeats: dto.totalSeats,
            availableSeats: dto.totalSeats,
            ticketPrice: dto.ticketPrice,
        };
    }
    static toTicketDto(entity, show) {
        return {
            id: entity.id,
            showId: entity.showId,
            showTitle: show.title,
            showDate: new Date(show.date),
            buyerName: entity.buyerName,
            seatNumber: entity.seatNumber,
            purchaseDate: new Date(entity.purchaseDate),
            pricePaid: entity.pricePaid,
            isReturned: entity.isReturned,
        };
    }
}
exports.TheatreMapper = TheatreMapper;
//# sourceMappingURL=TheatreMapper.js.map