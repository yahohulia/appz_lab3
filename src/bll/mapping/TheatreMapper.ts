import { ShowEntity } from "../../dal/entities/ShowEntity";
import { TicketEntity } from "../../dal/entities/TicketEntity";
import { ShowDto, TicketDto, CreateShowDto } from "../dto";
import { v4 as uuidv4 } from "uuid";

export class TheatreMapper {
  static toShowDto(entity: ShowEntity): ShowDto {
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

  static toShowEntity(dto: CreateShowDto): ShowEntity {
    return {
      id: uuidv4(),
      title: dto.title,
      author: dto.author,
      genre: dto.genre,
      date: dto.date.toISOString(),
      totalSeats: dto.totalSeats,
      availableSeats: dto.totalSeats,
      ticketPrice: dto.ticketPrice,
    };
  }

  static toTicketDto(entity: TicketEntity, show: ShowEntity): TicketDto {
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
