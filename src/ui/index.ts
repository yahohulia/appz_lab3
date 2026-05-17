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

main().catch((err) => {
  console.error("Критична помилка:", err);
  process.exit(1);
});
