import { IShowService, ITicketService } from "../bll/interfaces";
import { TicketDto } from "../bll/dto";
import {
  ask,
  askMenu,
  formatDate,
  formatMoney,
  printError,
  printInfo,
  printLine,
  printSeparator,
  printSuccess,
} from "./console";

function printTicketRow(ticket: TicketDto, index?: number): void {
  const prefix = index !== undefined ? `${index + 1}. ` : "   ";
  const isPast = ticket.showDate < new Date();
  const status = ticket.isReturned
    ? "[ПОВЕРНЕНО]"
    : isPast
      ? "[ВИСТАВА ПРОЙШЛА]"
      : "[АКТИВНИЙ]";
  printLine(`${prefix}[${ticket.id.slice(0, 8)}] ${status}`);
  printLine(
    `   Вистава: "${ticket.showTitle}" - ${formatDate(ticket.showDate)}`,
  );
  printLine(`   Покупець: ${ticket.buyerName} | Місце: ${ticket.seatNumber}`);
  printLine(
    `   Куплено: ${formatDate(ticket.purchaseDate)} | Ціна: ${formatMoney(ticket.pricePaid)}`,
  );
  printSeparator();
}

export async function ticketManagementMenu(
  ticketService: ITicketService,
  showService: IShowService,
): Promise<void> {
  while (true) {
    printLine("Управління квитками\n");
    const choice = await askMenu([
      "Покупка квитка",
      "Повернення квитка",
      "Квитки на виставу",
      "Квитки покупця",
      "Знайти квиток за ID",
    ]);

    if (choice === 0) return;
    if (choice === 1) await buyTicket(ticketService, showService);
    else if (choice === 2) await returnTicket(ticketService, showService);
    else if (choice === 3) await ticketsByShow(ticketService, showService);
    else if (choice === 4) await ticketsByBuyer(ticketService);
    else if (choice === 5) await findTicketById(ticketService);
  }
}

async function buyTicket(
  ticketService: ITicketService,
  showService: IShowService,
): Promise<void> {
  printLine("Покупка Квитка");

  const shows = await showService.getUpcomingShows();
  if (shows.length === 0) {
    printInfo("Немає майбутніх вистав");
    return;
  }

  shows.forEach((s, i) => {
    printLine(
      `  ${i + 1}. [${s.id.slice(0, 8)}] "${s.title}" - ${formatDate(s.date)}`,
    );
    printLine(
      `     Вільних місць: ${s.availableSeats} | Ціна: ${formatMoney(s.ticketPrice)}`,
    );
    printSeparator();
  });

  const idInput = await ask("Введіть перші 8 символів ID вистави: ");
  if (!idInput) return;

  const show = shows.find((s) => s.id.startsWith(idInput));
  if (!show) {
    printError("Виставу не знайдено");
    return;
  }

  const buyerName = await ask("Ім'я покупця: ");
  if (!buyerName) {
    printError("Ім'я не може бути порожнім");
    return;
  }

  const result = await ticketService.buyTicket({ showId: show.id, buyerName });

  if (result.success && result.data) {
    const t = result.data;
    printSuccess(`Квиток успішно куплено!`);
    printLine(`   ID квитка: ${t.id}`);
    printLine(`   Вистава: "${t.showTitle}" - ${formatDate(t.showDate)}`);
    printLine(
      `   Місце №${t.seatNumber} | Сплачено: ${formatMoney(t.pricePaid)}`,
    );
  } else {
    printError(result.error ?? "Невідома помилка");
  }
}

async function returnTicket(
  ticketService: ITicketService,
  showService: IShowService,
): Promise<void> {
  printLine("Повернення квитка\n");

  const shows = await showService.getAllShows();
  let hasActiveTickets = false;
  for (const show of shows) {
    const tickets = await ticketService.getTicketsByShow(show.id);
    if (tickets.some((t) => !t.isReturned)) {
      hasActiveTickets = true;
      break;
    }
  }

  if (!hasActiveTickets) {
    printInfo("Квитків ще не куплено");
    return;
  }

  const id = await ask("Введіть ID квитка: ");
  if (!id) return;

  const confirm = await ask(
    `Повернути квиток ${id.slice(0, 8)}?(Буде утримано 20%). (так/ні): `,
  );
  if (confirm.toLowerCase() !== "так" && confirm.toLowerCase() !== "т") {
    printInfo("Скасовано");
    return;
  }

  const result = await ticketService.returnTicket({ ticketId: id });

  if (result.success && result.data) {
    printSuccess(`Квиток повернено!`);
    printLine(`   Сума повернення: ${formatMoney(result.data.refundAmount)}`);
  } else {
    printError(result.error ?? "Невідома помилка");
  }
}

async function ticketsByShow(
  ticketService: ITicketService,
  showService: IShowService,
): Promise<void> {
  printLine("Квитки на виставу\n");
  const shows = await showService.getAllShows();
  if (shows.length === 0) {
    printInfo("Вистав ще немає");
    return;
  }

  shows.forEach((s, i) =>
    printLine(
      `  ${i + 1}. [${s.id.slice(0, 8)}] "${s.title}" - ${formatDate(s.date)}`,
    ),
  );

  const idInput = await ask("Введіть перші 8 символів ID вистави: ");
  const show = shows.find((s) => s.id.startsWith(idInput));
  if (!show) {
    printError("Виставу не знайдено");
    return;
  }

  const tickets = await ticketService.getTicketsByShow(show.id);
  if (tickets.length === 0) {
    printInfo(`На виставу "${show.title}" не продано квитків`);
    return;
  }
  printLine(`\nКвитки на "${show.title}":`);
  tickets.forEach((t, i) => printTicketRow(t, i));
}

async function ticketsByBuyer(ticketService: ITicketService): Promise<void> {
  printLine("Квитки покупця\n");
  const buyerName = await ask("Ім'я покупця: ");
  if (!buyerName) return;

  const tickets = await ticketService.getTicketsByBuyer(buyerName);
  if (tickets.length === 0) {
    printInfo(`Квитків для "${buyerName}" не знайдено`);
    return;
  }
  tickets.forEach((t, i) => printTicketRow(t, i));
}

async function findTicketById(ticketService: ITicketService): Promise<void> {
  printLine("Пошук квитка за ID\n");
  const id = await ask("Повний ID квитка: ");
  if (!id) return;

  const ticket = await ticketService.getTicketById(id);
  if (!ticket) {
    printInfo("Квиток не знайдено");
    return;
  }
  printTicketRow(ticket);
}
