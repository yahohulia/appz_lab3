"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataContext = void 0;
const ShowEntity_1 = require("../entities/ShowEntity");
const TicketEntity_1 = require("../entities/TicketEntity");
const TypeOrmRepository_1 = require("./TypeOrmRepository");
class DataContext {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.shows = new TypeOrmRepository_1.TypeOrmRepository(dataSource.getRepository(ShowEntity_1.ShowEntity));
        this.tickets = new TypeOrmRepository_1.TypeOrmRepository(dataSource.getRepository(TicketEntity_1.TicketEntity));
    }
}
exports.DataContext = DataContext;
//# sourceMappingURL=DataContext.js.map