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
exports.JsonDataContext = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const GenericRepository_1 = require("../repositories/GenericRepository");
class JsonDataContext {
    constructor(dbPath) {
        this.isDirty = false;
        this.dbPath = path.resolve(dbPath);
        this.data = this.loadDatabase();
        this.shows = new GenericRepository_1.GenericRepository(this.data.shows, () => {
            this.isDirty = true;
        });
        this.tickets = new GenericRepository_1.GenericRepository(this.data.tickets, () => {
            this.isDirty = true;
        });
    }
    loadDatabase() {
        if (!fs.existsSync(this.dbPath)) {
            const empty = { shows: [], tickets: [] };
            fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
            fs.writeFileSync(this.dbPath, JSON.stringify(empty, null, 2), "utf-8");
            return empty;
        }
        const raw = fs.readFileSync(this.dbPath, "utf-8");
        return JSON.parse(raw);
    }
    async save() {
        if (this.isDirty) {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), "utf-8");
            this.isDirty = false;
        }
    }
}
exports.JsonDataContext = JsonDataContext;
//# sourceMappingURL=JsonDataContext.js.map