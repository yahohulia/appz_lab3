import { IRepository } from "../interfaces";
export declare class GenericRepository<T extends {
    id: string;
}> implements IRepository<T> {
    private items;
    private onChanged;
    constructor(items: T[], onChanged: () => void);
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(id: string): Promise<boolean>;
    find(predicate: (entity: T) => boolean): Promise<T[]>;
    findOne(predicate: (entity: T) => boolean): Promise<T | null>;
}
//# sourceMappingURL=GenericRepository.d.ts.map