import { IShowService } from "../bll/interfaces";
import { ShowDto } from "../bll/dto";
import {
  ask,
  askFutureDate,
  askMenu,
  askNumber,
  formatDate,
  formatMoney,
  printError,
  printInfo,
  printLine,
  printSeparator,
  printSuccess,
} from "./console";

function printShowRow(show: ShowDto, index?: number): void {
  const prefix = index !== undefined ? `${index + 1}. ` : "   ";
  printLine(
    `${prefix}[${show.id.slice(0, 8)}] "${show.title}" - ${show.author}`,
  );
  printLine(`   Жанр: ${show.genre} | Дата: ${formatDate(show.date)}`);
  printLine(
    `   Місць: ${show.availableSeats}/${show.totalSeats} | Ціна: ${formatMoney(show.ticketPrice)}`,
  );
  printSeparator();
}

export async function showManagementMenu(service: IShowService): Promise<void> {
  while (true) {
    printLine("Управління виставами\n");
    const choice = await askMenu([
      "Переглянути всі вистави",
      "Переглянути майбутні вистави",
      "Додати виставу",
      "Редагувати виставу",
      "Видалити виставу",
    ]);

    if (choice === 0) return;
    if (choice === 1) await listAllShows(service);
    else if (choice === 2) await listUpcomingShows(service);
    else if (choice === 3) await addShow(service);
    else if (choice === 4) await editShow(service);
    else if (choice === 5) await deleteShow(service);
  }
}

async function listAllShows(service: IShowService): Promise<void> {
  printLine("Усі вистави\n");
  const shows = await service.getAllShows();
  if (shows.length === 0) {
    printInfo("Вистав ще немає");
    return;
  }
  shows.forEach((s, i) => printShowRow(s, i));
}

async function listUpcomingShows(service: IShowService): Promise<void> {
  printLine("Майбутні вистави:\n");
  const shows = await service.getUpcomingShows();
  if (shows.length === 0) {
    printInfo("Майбутніх вистав немає");
    return;
  }
  shows.forEach((s, i) => printShowRow(s, i));
}

async function addShow(service: IShowService): Promise<void> {
  printLine("Додавання вистави\n");

  const title = await ask("Назва: ");
  const author = await ask("Автор: ");
  const genre = await ask("Жанр: ");
  const date = await askFutureDate("Дата вистави");
  const seats = await askNumber("Кількість місць: ");
  const price = await askNumber("Ціна квитка (грн): ");

  const result = await service.createShow({
    title,
    author,
    genre,
    date,
    totalSeats: seats,
    ticketPrice: price,
  });

  if (result.success && result.data) {
    printSuccess(`Виставу "${result.data.title}" успішно додано!`);
  } else {
    printError(result.error ?? "Невідома помилка");
  }
}

async function editShow(service: IShowService): Promise<void> {
  printLine("Редагування вистави\n");
  const shows = await service.getAllShows();
  if (shows.length === 0) {
    printInfo("Вистав ще немає");
    return;
  }

  shows.forEach((s, i) => printShowRow(s, i));
  const idInput = await ask(
    "Введіть перші 8 символів ID вистави (або порожньо для скасування): ",
  );
  if (!idInput) return;

  const show = shows.find((s) => s.id.startsWith(idInput));
  if (!show) {
    printError("Виставу не знайдено");
    return;
  }

  printInfo(
    `Редагуємо: "${show.title}". Залиште поле порожнім, щоб не змінювати.`,
  );
  const title = await ask(`Назва [${show.title}]: `);
  const author = await ask(`Автор [${show.author}]: `);
  const genre = await ask(`Жанр [${show.genre}]: `);
  const priceStr = await ask(`Ціна [${show.ticketPrice}]: `);

  const result = await service.updateShow(show.id, {
    title: title || undefined,
    author: author || undefined,
    genre: genre || undefined,
    ticketPrice: priceStr ? parseFloat(priceStr) : undefined,
  });

  if (result.success) {
    printSuccess("Виставу оновлено!");
  } else {
    printError(result.error ?? "Невідома помилка");
  }
}

async function deleteShow(service: IShowService): Promise<void> {
  printLine("Видалити виставу\n");
  const shows = await service.getAllShows();
  if (shows.length === 0) {
    printInfo("Вистав ще немає");
    return;
  }

  shows.forEach((s, i) => printShowRow(s, i));
  const idInput = await ask("Введіть перші 8 символів ID вистави: ");
  if (!idInput) return;

  const show = shows.find((s) => s.id.startsWith(idInput));
  if (!show) {
    printError("Виставу не знайдено");
    return;
  }

  const confirm = await ask(`Видалити "${show.title}"? (так/ні): `);
  if (confirm.toLowerCase() !== "так" && confirm.toLowerCase() !== "т") {
    printInfo("Скасовано");
    return;
  }

  const result = await service.deleteShow(show.id);
  if (result.success) {
    printSuccess("Виставу видалено!");
  } else {
    printError(result.error ?? "Невідома помилка");
  }
}
