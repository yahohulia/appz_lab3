import { Repository } from "typeorm";
import { IRepository } from "../interfaces";
export declare class TypeOrmRepository<T extends {
    id: string;
}> implements IRepository<T> {
    private readonly repo;
    constructor(repo: Repository<T>);
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(id: string): Promise<boolean>;
    find(predicate: (entity: T) => boolean): Promise<T[]>;
    findOne(predicate: (entity: T) => boolean): Promise<T | null>;
}
//# sourceMappingURL=TypeOrmRepository.d.ts.map