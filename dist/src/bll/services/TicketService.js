"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const uuid_1 = require("uuid");
const TheatreMapper_1 = require("../mapping/TheatreMapper");
const RETURN_PENALTY_PERCENT = 20;
const MIN_DAYS_BEFORE_RETURN = 2;
class TicketService {
    constructor(uow) {
        this.uow = uow;
    }
    async buyTicket(dto) {
        if (!dto.buyerName?.trim()) {
            return { success: false, error: "Ім'я покупця не може бути порожнім" };
        }
        const show = await this.uow.shows.getById(dto.showId);
        if (!show) {
            return { success: false, error: "Виставу не знайдено" };
        }
        const showDate = new Date(show.date);
        if (showDate <= new Date()) {
            return {
                success: false,
                error: "Не можна купити квиток на виставу, що вже відбулась",
            };
        }
        if (show.availableSeats <= 0) {
            return { success: false, error: "Немає вільних місць на цю виставу" };
        }
        const soldTickets = await this.uow.tickets.find((t) => t.showId === dto.showId && !t.isReturned);
        const takenSeats = new Set(soldTickets.map((t) => t.seatNumber));
        let seatNumber = 1;
        while (takenSeats.has(seatNumber))
            seatNumber++;
        show.availableSeats -= 1;
        await this.uow.shows.update(show);
        const ticketEntity = {
            id: (0, uuid_1.v4)(),
            showId: dto.showId,
            buyerName: dto.buyerName.trim(),
            seatNumber,
            purchaseDate: new Date().toISOString(),
            pricePaid: show.ticketPrice,
            isReturned: false,
        };
        const created = await this.uow.tickets.create(ticketEntity);
        await this.uow.saveChanges();
        return { success: true, data: TheatreMapper_1.TheatreMapper.toTicketDto(created, show) };
    }
    async returnTicket(dto) {
        const ticket = await this.uow.tickets.getById(dto.ticketId);
        if (!ticket) {
            return { success: false, error: "Квиток не знайдено" };
        }
        if (ticket.isReturned) {
            return { success: false, error: "Цей квиток вже повернено" };
        }
        const show = await this.uow.shows.getById(ticket.showId);
        if (!show) {
            return { success: false, error: "Виставу для цього квитка не знайдено" };
        }
        const showDate = new Date(show.date);
        const now = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysUntilShow = Math.floor((showDate.getTime() - now.getTime()) / msPerDay);
        if (daysUntilShow < MIN_DAYS_BEFORE_RETURN) {
            return {
                success: false,
                error: `Квиток можна повернути не пізніше, ніж за ${MIN_DAYS_BEFORE_RETURN} дні до вистави. До вистави залишилось: ${daysUntilShow} дн.`,
            };
        }
        const refundAmount = ticket.pricePaid * (1 - RETURN_PENALTY_PERCENT / 100);
        ticket.isReturned = true;
        await this.uow.tickets.update(ticket);
        show.availableSeats += 1;
        await this.uow.shows.update(show);
        await this.uow.saveChanges();
        return { success: true, data: { refundAmount } };
    }
    async getTicketsByShow(showId) {
        const show = await this.uow.shows.getById(showId);
        if (!show)
            return [];
        const tickets = await this.uow.tickets.find((t) => t.showId === showId);
        return tickets.map((t) => TheatreMapper_1.TheatreMapper.toTicketDto(t, show));
    }
    async getTicketsByBuyer(buyerName) {
        const tickets = await this.uow.tickets.find((t) => t.buyerName.toLowerCase() === buyerName.toLowerCase());
        const result = [];
        for (const ticket of tickets) {
            const show = await this.uow.shows.getById(ticket.showId);
            if (show) {
                result.push(TheatreMapper_1.TheatreMapper.toTicketDto(ticket, show));
            }
        }
        return result;
    }
    async getTicketById(id) {
        const ticket = await this.uow.tickets.getById(id);
        if (!ticket)
            return null;
        const show = await this.uow.shows.getById(ticket.showId);
        if (!show)
            return null;
        return TheatreMapper_1.TheatreMapper.toTicketDto(ticket, show);
    }
}
exports.TicketService = TicketService;
//# sourceMappingURL=TicketService.js.map