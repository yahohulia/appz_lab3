"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericRepository = void 0;
class GenericRepository {
    constructor(items, onChanged) {
        this.items = items;
        this.onChanged = onChanged;
    }
    async getAll() {
        return [...this.items];
    }
    async getById(id) {
        return this.items.find((item) => item.id === id) ?? null;
    }
    async create(entity) {
        this.items.push(entity);
        this.onChanged();
        return entity;
    }
    async update(entity) {
        const index = this.items.findIndex((item) => item.id === entity.id);
        if (index === -1) {
            throw new Error(`Entity with id=${entity.id} not found`);
        }
        this.items[index] = { ...entity };
        this.onChanged();
        return entity;
    }
    async delete(id) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1)
            return false;
        this.items.splice(index, 1);
        this.onChanged();
        return true;
    }
    async find(predicate) {
        return this.items.filter(predicate);
    }
    async findOne(predicate) {
        return this.items.find(predicate) ?? null;
    }
}
exports.GenericRepository = GenericRepository;
//# sourceMappingURL=GenericRepository.js.map