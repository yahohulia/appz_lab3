import { Repository } from "typeorm";
import { IRepository } from "../interfaces";

export class TypeOrmRepository<
  T extends { id: string },
> implements IRepository<T> {
  private readonly repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  async getAll(): Promise<T[]> {
    return this.repo.find();
  }

  async getById(id: string): Promise<T | null> {
    return this.repo.findOneBy({ id } as any);
  }

  async create(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  async update(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async find(predicate: (entity: T) => boolean): Promise<T[]> {
    const all = await this.repo.find();
    return all.filter(predicate);
  }

  async findOne(predicate: (entity: T) => boolean): Promise<T | null> {
    const all = await this.repo.find();
    return all.find(predicate) ?? null;
  }
}
