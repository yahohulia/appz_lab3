import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });
}

export function closeInput(): void {
  rl.close();
}

export function printLine(text: string = ""): void {
  console.log(text);
}

export function printSeparator(): void {
  console.log("─".repeat(60));
}

export function printSuccess(text: string): void {
  console.log(`${text}`);
}

export function printError(text: string): void {
  console.log(`Помилка: ${text}`);
}

export function printInfo(text: string): void {
  console.log(`\n*  ${text}\n`);
}

export function formatDate(date: Date): string {
  return date.toLocaleString("uk-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(amount: number): string {
  return `${amount.toFixed(2)} грн`;
}

export async function askNumber(prompt: string): Promise<number> {
  while (true) {
    const input = await ask(prompt);
    const n = parseFloat(input);
    if (!isNaN(n) && n > 0) return n;
    printError("Введіть коректне число більше нуля");
  }
}

export async function askDate(prompt: string): Promise<Date | null> {
  const input = await ask(prompt + " (РРРР-ММ-ДД ГГ:ХХ): ");
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
}

export async function askFutureDate(prompt: string): Promise<Date> {
  while (true) {
    const input = await ask(`${prompt} (РРРР-ММ-ДД ГГ:ХХ): `);
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      printError("Невірний формат дати. Приклад: 2026-12-31 19:00");
      continue;
    }
    if (date <= new Date()) {
      printError("Дата має бути в майбутньому");
      continue;
    }
    return date;
  }
}

export async function askMenu(options: string[]): Promise<number> {
  options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
  console.log("  0. Назад");
  while (true) {
    const input = await ask("\nВаш вибір: ");
    const n = parseInt(input, 10);
    if (!isNaN(n) && n >= 0 && n <= options.length) return n;
    printError("Неправильний вибір, спробуйте ще раз");
  }
}
