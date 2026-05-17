import { ShowEntity } from "../../dal/entities/ShowEntity";
import { TicketEntity } from "../../dal/entities/TicketEntity";
import { ShowDto, TicketDto, CreateShowDto } from "../dto";
export declare class TheatreMapper {
    static toShowDto(entity: ShowEntity): ShowDto;
    static toShowEntity(dto: CreateShowDto): ShowEntity;
    static toTicketDto(entity: TicketEntity, show: ShowEntity): TicketDto;
}
//# sourceMappingURL=TheatreMapper.d.ts.map