"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketManagementMenu = ticketManagementMenu;
const console_1 = require("./console");
function printTicketRow(ticket, index) {
    const prefix = index !== undefined ? `${index + 1}. ` : "   ";
    const status = ticket.isReturned ? "[ПОВЕРНЕНО]" : "[АКТИВНИЙ]";
    (0, console_1.printLine)(`${prefix}[${ticket.id.slice(0, 8)}] ${status}`);
    (0, console_1.printLine)(`   Вистава: "${ticket.showTitle}" - ${(0, console_1.formatDate)(ticket.showDate)}`);
    (0, console_1.printLine)(`   Покупець: ${ticket.buyerName} | Місце: ${ticket.seatNumber}`);
    (0, console_1.printLine)(`   Куплено: ${(0, console_1.formatDate)(ticket.purchaseDate)} | Ціна: ${(0, console_1.formatMoney)(ticket.pricePaid)}`);
    (0, console_1.printSeparator)();
}
async function ticketManagementMenu(ticketService, showService) {
    while (true) {
        (0, console_1.printLine)("Управління квитками\n");
        const choice = await (0, console_1.askMenu)([
            "Купити квиток",
            "Повернути квиток",
            "Квитки на виставу",
            "Квитки покупця",
            "Знайти квиток за ID",
        ]);
        if (choice === 0)
            return;
        if (choice === 1)
            await buyTicket(ticketService, showService);
        else if (choice === 2)
            await returnTicket(ticketService);
        else if (choice === 3)
            await ticketsByShow(ticketService, showService);
        else if (choice === 4)
            await ticketsByBuyer(ticketService);
        else if (choice === 5)
            await findTicketById(ticketService);
    }
}
async function buyTicket(ticketService, showService) {
    (0, console_1.printLine)("КУПИТИ КВИТОК");
    const shows = await showService.getUpcomingShows();
    if (shows.length === 0) {
        (0, console_1.printInfo)("Немає майбутніх вистав");
        return;
    }
    shows.forEach((s, i) => {
        (0, console_1.printLine)(`  ${i + 1}. [${s.id.slice(0, 8)}] "${s.title}" - ${(0, console_1.formatDate)(s.date)}`);
        (0, console_1.printLine)(`     Вільних місць: ${s.availableSeats} | Ціна: ${(0, console_1.formatMoney)(s.ticketPrice)}`);
        (0, console_1.printSeparator)();
    });
    const idInput = await (0, console_1.ask)("Введіть перші 8 символів ID вистави: ");
    if (!idInput)
        return;
    const show = shows.find((s) => s.id.startsWith(idInput));
    if (!show) {
        (0, console_1.printError)("Виставу не знайдено");
        return;
    }
    const buyerName = await (0, console_1.ask)("Ім'я покупця: ");
    if (!buyerName) {
        (0, console_1.printError)("Ім'я не може бути порожнім");
        return;
    }
    const result = await ticketService.buyTicket({ showId: show.id, buyerName });
    if (result.success && result.data) {
        const t = result.data;
        (0, console_1.printSuccess)(`Квиток успішно куплено!`);
        (0, console_1.printLine)(`   ID квитка: ${t.id}`);
        (0, console_1.printLine)(`   Вистава: "${t.showTitle}" - ${(0, console_1.formatDate)(t.showDate)}`);
        (0, console_1.printLine)(`   Місце №${t.seatNumber} | Сплачено: ${(0, console_1.formatMoney)(t.pricePaid)}`);
    }
    else {
        (0, console_1.printError)(result.error ?? "Невідома помилка");
    }
}
async function returnTicket(ticketService) {
    (0, console_1.printLine)("Повернення квитка\n");
    const id = await (0, console_1.ask)("Введіть ID квитка: ");
    if (!id)
        return;
    const confirm = await (0, console_1.ask)(`Повернути квиток ${id.slice(0, 8)}? Буде утримано 20%. (так/ні): `);
    if (confirm.toLowerCase() !== "так" && confirm.toLowerCase() !== "т") {
        (0, console_1.printInfo)("Скасовано");
        return;
    }
    const result = await ticketService.returnTicket({ ticketId: id });
    if (result.success && result.data) {
        (0, console_1.printSuccess)(`Квиток повернено!`);
        (0, console_1.printLine)(`   Сума повернення: ${(0, console_1.formatMoney)(result.data.refundAmount)}`);
    }
    else {
        (0, console_1.printError)(result.error ?? "Невідома помилка");
    }
}
async function ticketsByShow(ticketService, showService) {
    (0, console_1.printLine)("Квитки на виставу\n");
    const shows = await showService.getAllShows();
    if (shows.length === 0) {
        (0, console_1.printInfo)("Вистав ще немає");
        return;
    }
    shows.forEach((s, i) => (0, console_1.printLine)(`  ${i + 1}. [${s.id.slice(0, 8)}] "${s.title}" - ${(0, console_1.formatDate)(s.date)}`));
    const idInput = await (0, console_1.ask)("Введіть перші 8 символів ID вистави: ");
    const show = shows.find((s) => s.id.startsWith(idInput));
    if (!show) {
        (0, console_1.printError)("Виставу не знайдено");
        return;
    }
    const tickets = await ticketService.getTicketsByShow(show.id);
    if (tickets.length === 0) {
        (0, console_1.printInfo)(`На виставу "${show.title}" не продано квитків`);
        return;
    }
    (0, console_1.printLine)(`\nКвитки на "${show.title}":`);
    tickets.forEach((t, i) => printTicketRow(t, i));
}
async function ticketsByBuyer(ticketService) {
    (0, console_1.printLine)("Квитки покупця\n");
    const buyerName = await (0, console_1.ask)("Ім'я покупця: ");
    if (!buyerName)
        return;
    const tickets = await ticketService.getTicketsByBuyer(buyerName);
    if (tickets.length === 0) {
        (0, console_1.printInfo)(`Квитків для "${buyerName}" не знайдено`);
        return;
    }
    tickets.forEach((t, i) => printTicketRow(t, i));
}
async function findTicketById(ticketService) {
    (0, console_1.printLine)("Пошук квитка за ID\n");
    const id = await (0, console_1.ask)("Повний ID квитка: ");
    if (!id)
        return;
    const ticket = await ticketService.getTicketById(id);
    if (!ticket) {
        (0, console_1.printInfo)("Квиток не знайдено");
        return;
    }
    printTicketRow(ticket);
}
//# sourceMappingURL=ticketScreens.js.map