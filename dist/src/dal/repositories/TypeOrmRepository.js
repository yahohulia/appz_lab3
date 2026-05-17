"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRepository = void 0;
class TypeOrmRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async getAll() {
        return this.repo.find();
    }
    async getById(id) {
        return this.repo.findOneBy({ id });
    }
    async create(entity) {
        return this.repo.save(entity);
    }
    async update(entity) {
        return this.repo.save(entity);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async find(predicate) {
        const all = await this.repo.find();
        return all.filter(predicate);
    }
    async findOne(predicate) {
        const all = await this.repo.find();
        return all.find(predicate) ?? null;
    }
}
exports.TypeOrmRepository = TypeOrmRepository;
//# sourceMappingURL=TypeOrmRepository.js.map