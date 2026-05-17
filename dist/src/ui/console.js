"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = ask;
exports.closeInput = closeInput;
exports.printLine = printLine;
exports.printSeparator = printSeparator;
exports.printSuccess = printSuccess;
exports.printError = printError;
exports.printInfo = printInfo;
exports.formatDate = formatDate;
exports.formatMoney = formatMoney;
exports.askNumber = askNumber;
exports.askDate = askDate;
exports.askFutureDate = askFutureDate;
exports.askMenu = askMenu;
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function ask(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer.trim()));
    });
}
function closeInput() {
    rl.close();
}
function printLine(text = "") {
    console.log(text);
}
function printSeparator() {
    console.log("─".repeat(60));
}
function printSuccess(text) {
    console.log(`${text}`);
}
function printError(text) {
    console.log(`Помилка: ${text}`);
}
function printInfo(text) {
    console.log(`\n*  ${text}\n`);
}
function formatDate(date) {
    return date.toLocaleString("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
function formatMoney(amount) {
    return `${amount.toFixed(2)} грн`;
}
async function askNumber(prompt) {
    while (true) {
        const input = await ask(prompt);
        const n = parseFloat(input);
        if (!isNaN(n) && n > 0)
            return n;
        printError("Введіть коректне число більше нуля");
    }
}
async function askDate(prompt) {
    const input = await ask(prompt + " (РРРР-ММ-ДД ГГ:ХХ): ");
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
}
async function askFutureDate(prompt) {
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
async function askMenu(options) {
    options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
    console.log("  0. Назад");
    while (true) {
        const input = await ask("\nВаш вибір: ");
        const n = parseInt(input, 10);
        if (!isNaN(n) && n >= 0 && n <= options.length)
            return n;
        printError("Неправильний вибір, спробуйте ще раз");
    }
}
//# sourceMappingURL=console.js.map