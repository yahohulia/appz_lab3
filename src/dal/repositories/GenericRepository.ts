import { IRepository } from "../interfaces";

export class GenericRepository<
  T extends { id: string },
> implements IRepository<T> {
  private items: T[];
  private onChanged: () => void;

  constructor(items: T[], onChanged: () => void) {
    this.items = items;
    this.onChanged = onChanged;
  }

  async getAll(): Promise<T[]> {
    return [...this.items];
  }

  async getById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(entity: T): Promise<T> {
    this.items.push(entity);
    this.onChanged();
    return entity;
  }

  async update(entity: T): Promise<T> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index === -1) {
      throw new Error(`Entity with id=${entity.id} not found`);
    }
    this.items[index] = { ...entity };
    this.onChanged();
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    this.onChanged();
    return true;
  }

  async find(predicate: (entity: T) => boolean): Promise<T[]> {
    return this.items.filter(predicate);
  }

  async findOne(predicate: (entity: T) => boolean): Promise<T | null> {
    return this.items.find(predicate) ?? null;
  }
}
