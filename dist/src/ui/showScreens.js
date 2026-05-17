"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showManagementMenu = showManagementMenu;
const console_1 = require("./console");
function printShowRow(show, index) {
    const prefix = index !== undefined ? `${index + 1}. ` : "   ";
    (0, console_1.printLine)(`${prefix}[${show.id.slice(0, 8)}] "${show.title}" - ${show.author}`);
    (0, console_1.printLine)(`   Жанр: ${show.genre} | Дата: ${(0, console_1.formatDate)(show.date)}`);
    (0, console_1.printLine)(`   Місць: ${show.availableSeats}/${show.totalSeats} | Ціна: ${(0, console_1.formatMoney)(show.ticketPrice)}`);
    (0, console_1.printSeparator)();
}
async function showManagementMenu(service) {
    while (true) {
        (0, console_1.printLine)("Управління виставами\n");
        const choice = await (0, console_1.askMenu)([
            "Переглянути всі вистави",
            "Переглянути майбутні вистави",
            "Додати виставу",
            "Редагувати виставу",
            "Видалити виставу",
        ]);
        if (choice === 0)
            return;
        if (choice === 1)
            await listAllShows(service);
        else if (choice === 2)
            await listUpcomingShows(service);
        else if (choice === 3)
            await addShow(service);
        else if (choice === 4)
            await editShow(service);
        else if (choice === 5)
            await deleteShow(service);
    }
}
async function listAllShows(service) {
    (0, console_1.printLine)("Усі вистави\n");
    const shows = await service.getAllShows();
    if (shows.length === 0) {
        (0, console_1.printInfo)("Вистав ще немає");
        return;
    }
    shows.forEach((s, i) => printShowRow(s, i));
}
async function listUpcomingShows(service) {
    (0, console_1.printLine)("Майбутні вистави:\n");
    const shows = await service.getUpcomingShows();
    if (shows.length === 0) {
        (0, console_1.printInfo)("Майбутніх вистав немає");
        return;
    }
    shows.forEach((s, i) => printShowRow(s, i));
}
async function addShow(service) {
    (0, console_1.printLine)("Додавання вистави\n");
    const title = await (0, console_1.ask)("Назва: ");
    const author = await (0, console_1.ask)("Автор: ");
    const genre = await (0, console_1.ask)("Жанр: ");
    const date = await (0, console_1.askFutureDate)("Дата вистави");
    const seats = await (0, console_1.askNumber)("Кількість місць: ");
    const price = await (0, console_1.askNumber)("Ціна квитка (грн): ");
    const result = await service.createShow({
        title,
        author,
        genre,
        date,
        totalSeats: seats,
        ticketPrice: price,
    });
    if (result.success && result.data) {
        (0, console_1.printSuccess)(`Виставу "${result.data.title}" успішно додано!`);
    }
    else {
        (0, console_1.printError)(result.error ?? "Невідома помилка");
    }
}
async function editShow(service) {
    (0, console_1.printLine)("Редагування вистави\n");
    const shows = await service.getAllShows();
    if (shows.length === 0) {
        (0, console_1.printInfo)("Вистав ще немає");
        return;
    }
    shows.forEach((s, i) => printShowRow(s, i));
    const idInput = await (0, console_1.ask)("Введіть перші 8 символів ID вистави (або порожньо для скасування): ");
    if (!idInput)
        return;
    const show = shows.find((s) => s.id.startsWith(idInput));
    if (!show) {
        (0, console_1.printError)("Виставу не знайдено");
        return;
    }
    (0, console_1.printInfo)(`Редагуємо: "${show.title}". Залиште поле порожнім, щоб не змінювати.`);
    const title = await (0, console_1.ask)(`Назва [${show.title}]: `);
    const author = await (0, console_1.ask)(`Автор [${show.author}]: `);
    const genre = await (0, console_1.ask)(`Жанр [${show.genre}]: `);
    const priceStr = await (0, console_1.ask)(`Ціна [${show.ticketPrice}]: `);
    const result = await service.updateShow(show.id, {
        title: title || undefined,
        author: author || undefined,
        genre: genre || undefined,
        ticketPrice: priceStr ? parseFloat(priceStr) : undefined,
    });
    if (result.success) {
        (0, console_1.printSuccess)("Виставу оновлено!");
    }
    else {
        (0, console_1.printError)(result.error ?? "Невідома помилка");
    }
}
async function deleteShow(service) {
    (0, console_1.printLine)("Видалити виставу\n");
    const shows = await service.getAllShows();
    if (shows.length === 0) {
        (0, console_1.printInfo)("Вистав ще немає");
        return;
    }
    shows.forEach((s, i) => printShowRow(s, i));
    const idInput = await (0, console_1.ask)("Введіть перші 8 символів ID вистави: ");
    if (!idInput)
        return;
    const show = shows.find((s) => s.id.startsWith(idInput));
    if (!show) {
        (0, console_1.printError)("Виставу не знайдено");
        return;
    }
    const confirm = await (0, console_1.ask)(`Видалити "${show.title}"? (так/ні): `);
    if (confirm.toLowerCase() !== "так" && confirm.toLowerCase() !== "т") {
        (0, console_1.printInfo)("Скасовано");
        return;
    }
    const result = await service.deleteShow(show.id);
    if (result.success) {
        (0, console_1.printSuccess)("Виставу видалено!");
    }
    else {
        (0, console_1.printError)(result.error ?? "Невідома помилка");
    }
}
//# sourceMappingURL=showScreens.js.map