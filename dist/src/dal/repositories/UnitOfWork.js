"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitOfWork = void 0;
class UnitOfWork {
    constructor(context) {
        this.snapshotShows = [];
        this.snapshotTickets = [];
        this.inTransaction = false;
        this.context = context;
        this.shows = context.shows;
        this.tickets = context.tickets;
    }
    async saveChanges() { }
    beginTransaction() {
        this.inTransaction = true;
        this.context.shows.getAll().then((s) => {
            this.snapshotShows = s.map((x) => ({ ...x }));
        });
        this.context.tickets.getAll().then((t) => {
            this.snapshotTickets = t.map((x) => ({ ...x }));
        });
    }
    async commitTransaction() {
        if (!this.inTransaction)
            throw new Error("No active transaction");
        this.inTransaction = false;
        this.snapshotShows = [];
        this.snapshotTickets = [];
    }
    rollbackTransaction() {
        if (!this.inTransaction)
            return;
        this.snapshotShows.forEach((s) => this.context.shows.update(s));
        this.snapshotTickets.forEach((t) => this.context.tickets.update(t));
        this.inTransaction = false;
    }
}
exports.UnitOfWork = UnitOfWork;
//# sourceMappingURL=UnitOfWork.js.map