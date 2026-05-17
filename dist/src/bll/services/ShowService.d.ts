import { IUnitOfWork } from "../../dal/interfaces";
import { CreateShowDto, OperationResult, ShowDto } from "../dto";
import { IShowService } from "../interfaces";
export declare class ShowService implements IShowService {
    private readonly uow;
    constructor(uow: IUnitOfWork);
    getAllShows(): Promise<ShowDto[]>;
    getShowById(id: string): Promise<ShowDto | null>;
    createShow(dto: CreateShowDto): Promise<OperationResult<ShowDto>>;
    updateShow(id: string, dto: Partial<CreateShowDto>): Promise<OperationResult<ShowDto>>;
    deleteShow(id: string): Promise<OperationResult>;
    getUpcomingShows(): Promise<ShowDto[]>;
}
//# sourceMappingURL=ShowService.d.ts.map