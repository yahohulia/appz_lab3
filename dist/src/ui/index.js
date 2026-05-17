"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const AppDataSource_1 = require("../dal/repositories/AppDataSource");
const DataContext_1 = require("../dal/repositories/DataContext");
const UnitOfWork_1 = require("../dal/repositories/UnitOfWork");
const ShowService_1 = require("../bll/services/ShowService");
const TicketService_1 = require("../bll/services/TicketService");
const console_1 = require("./console");
const showScreens_1 = require("./showScreens");
const ticketScreens_1 = require("./ticketScreens");
async function main() {
    await AppDataSource_1.AppDataSource.initialize();
    const context = new DataContext_1.DataContext(AppDataSource_1.AppDataSource);
    const uow = new UnitOfWork_1.UnitOfWork(context);
    const showService = new ShowService_1.ShowService(uow);
    const ticketService = new TicketService_1.TicketService(uow);
    await seedDemoData(showService);
    while (true) {
        (0, console_1.printLine)("Театральна каса\n");
        const choice = await (0, console_1.askMenu)([
            "Управління виставами",
            "Управління квитками",
        ]);
        if (choice === 0) {
            (0, console_1.printLine)("\nДо побачення!");
            await AppDataSource_1.AppDataSource.destroy();
            (0, console_1.closeInput)();
            break;
        }
        if (choice === 1)
            await (0, showScreens_1.showManagementMenu)(showService);
        else if (choice === 2)
            await (0, ticketScreens_1.ticketManagementMenu)(ticketService, showService);
    }
}
async function seedDemoData(showService) {
    const existing = await showService.getAllShows();
    if (existing.length > 0)
        return;
    const shows = [
        {
            title: "Гамлет",
            author: "Вільям Шекспір",
            genre: "Трагедія",
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            totalSeats: 50,
            ticketPrice: 350,
        },
        {
            title: "Лісова пісня",
            author: "Леся Українка",
            genre: "Драма-феєрія",
            date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            totalSeats: 80,
            ticketPrice: 250,
        },
        {
            title: "Наталка Полтавка",
            author: "Іван Котляревський",
            genre: "Опера",
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            totalSeats: 100,
            ticketPrice: 200,
        },
        {
            title: "Тарас Бульба",
            author: "Микола Гоголь",
            genre: "Драма",
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            totalSeats: 60,
            ticketPrice: 300,
        },
    ];
    for (const show of shows) {
        await showService.createShow(show);
    }
}
main().catch((err) => {
    console.error("Критична помилка:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map