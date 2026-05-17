"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowService = void 0;
const TheatreMapper_1 = require("../mapping/TheatreMapper");
class ShowService {
    constructor(uow) {
        this.uow = uow;
    }
    async getAllShows() {
        const entities = await this.uow.shows.getAll();
        return entities.map(TheatreMapper_1.TheatreMapper.toShowDto);
    }
    async getShowById(id) {
        const entity = await this.uow.shows.getById(id);
        return entity ? TheatreMapper_1.TheatreMapper.toShowDto(entity) : null;
    }
    async createShow(dto) {
        if (!dto.title?.trim()) {
            return { success: false, error: "Назва вистави не може бути порожньою" };
        }
        if (!dto.author?.trim()) {
            return { success: false, error: "Автор не може бути порожнім" };
        }
        if (dto.date <= new Date()) {
            return { success: false, error: "Дата вистави має бути в майбутньому" };
        }
        if (dto.totalSeats <= 0) {
            return { success: false, error: "Кількість місць має бути більше нуля" };
        }
        if (dto.ticketPrice <= 0) {
            return { success: false, error: "Ціна квитка має бути більше нуля" };
        }
        const entity = TheatreMapper_1.TheatreMapper.toShowEntity(dto);
        const created = await this.uow.shows.create(entity);
        await this.uow.saveChanges();
        return { success: true, data: TheatreMapper_1.TheatreMapper.toShowDto(created) };
    }
    async updateShow(id, dto) {
        const entity = await this.uow.shows.getById(id);
        if (!entity) {
            return { success: false, error: `Виставу з id=${id} не знайдено` };
        }
        if (dto.title !== undefined)
            entity.title = dto.title;
        if (dto.author !== undefined)
            entity.author = dto.author;
        if (dto.genre !== undefined)
            entity.genre = dto.genre;
        if (dto.date !== undefined)
            entity.date = dto.date.toISOString();
        if (dto.ticketPrice !== undefined)
            entity.ticketPrice = dto.ticketPrice;
        const updated = await this.uow.shows.update(entity);
        await this.uow.saveChanges();
        return { success: true, data: TheatreMapper_1.TheatreMapper.toShowDto(updated) };
    }
    async deleteShow(id) {
        const entity = await this.uow.shows.getById(id);
        if (!entity) {
            return { success: false, error: `Виставу з id=${id} не знайдено` };
        }
        const activeTickets = await this.uow.tickets.find((t) => t.showId === id && !t.isReturned);
        if (activeTickets.length > 0) {
            return {
                success: false,
                error: `Неможливо видалити виставу: є ${activeTickets.length} активних квитків`,
            };
        }
        await this.uow.shows.delete(id);
        await this.uow.saveChanges();
        return { success: true };
    }
    async getUpcomingShows() {
        const now = new Date().toISOString();
        const entities = await this.uow.shows.find((s) => s.date > now);
        return entities
            .map(TheatreMapper_1.TheatreMapper.toShowDto)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}
exports.ShowService = ShowService;
//# sourceMappingURL=ShowService.js.map