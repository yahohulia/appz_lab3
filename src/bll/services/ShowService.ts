import { IUnitOfWork } from "../../dal/interfaces";
import { CreateShowDto, OperationResult, ShowDto } from "../dto";
import { IShowService } from "../interfaces";
import { TheatreMapper } from "../mapping/TheatreMapper";

export class ShowService implements IShowService {
  private readonly uow: IUnitOfWork;

  constructor(uow: IUnitOfWork) {
    this.uow = uow;
  }

  async getAllShows(): Promise<ShowDto[]> {
    const entities = await this.uow.shows.getAll();
    return entities.map(TheatreMapper.toShowDto);
  }

  async getShowById(id: string): Promise<ShowDto | null> {
    const entity = await this.uow.shows.getById(id);
    return entity ? TheatreMapper.toShowDto(entity) : null;
  }

  async createShow(dto: CreateShowDto): Promise<OperationResult<ShowDto>> {
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

    const entity = TheatreMapper.toShowEntity(dto);
    const created = await this.uow.shows.create(entity);
    await this.uow.saveChanges();

    return { success: true, data: TheatreMapper.toShowDto(created) };
  }

  async updateShow(
    id: string,
    dto: Partial<CreateShowDto>,
  ): Promise<OperationResult<ShowDto>> {
    const entity = await this.uow.shows.getById(id);
    if (!entity) {
      return { success: false, error: `Виставу з id=${id} не знайдено` };
    }

    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.author !== undefined) entity.author = dto.author;
    if (dto.genre !== undefined) entity.genre = dto.genre;
    if (dto.date !== undefined) entity.date = dto.date.toISOString();
    if (dto.ticketPrice !== undefined) entity.ticketPrice = dto.ticketPrice;

    const updated = await this.uow.shows.update(entity);
    await this.uow.saveChanges();

    return { success: true, data: TheatreMapper.toShowDto(updated) };
  }

  async deleteShow(id: string): Promise<OperationResult> {
    const entity = await this.uow.shows.getById(id);
    if (!entity) {
      return { success: false, error: `Виставу з id=${id} не знайдено` };
    }

    const activeTickets = await this.uow.tickets.find(
      (t) => t.showId === id && !t.isReturned,
    );
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

  async getUpcomingShows(): Promise<ShowDto[]> {
    const now = new Date().toISOString();
    const entities = await this.uow.shows.find((s) => s.date > now);
    return entities
      .map(TheatreMapper.toShowDto)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
