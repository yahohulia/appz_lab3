import "reflect-metadata";
import { AppDataSource } from "../dal/repositories/AppDataSource";
import { DataContext } from "../dal/repositories/DataContext";
import { UnitOfWork } from "../dal/repositories/UnitOfWork";
import { ShowService } from "../bll/services/ShowService";
import { TicketService } from "../bll/services/TicketService";
import { askMenu, closeInput, printLine } from "./console";
import { showManagementMenu } from "./showScreens";
import { ticketManagementMenu } from "./ticketScreens";

async function main(): Promise<void> {
  await AppDataSource.initialize();

  const context = new DataContext(AppDataSource);
  const uow = new UnitOfWork(context);
  const showService = new ShowService(uow);
  const ticketService = new TicketService(uow);

  await seedDemoData(showService);

  while (true) {
    printLine("Театральна каса\n");

    const choice = await askMenu([
      "Управління виставами",
      "Управління квитками",
    ]);

    if (choice === 0) {
      printLine("\nДо побачення!");
      await AppDataSource.destroy();
      closeInput();
      break;
    }
    if (choice === 1) await showManagementMenu(showService);
    else if (choice === 2)
      await ticketManagementMenu(ticketService, showService);
  }
}

async function seedDemoData(showService: ShowService): Promise<void> {
  const existing = await showService.getAllShows();
  if (existing.length > 0) return;

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
