"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var rxjs_1 = require("rxjs");
var CalculateItems_1 = __importDefault(require("./CalculateItems"));
var app = express_1.default();
var events = new CalculateItems_1.default();
var words = new CalculateItems_1.default();
var events_cache = new rxjs_1.BehaviorSubject(events.getItemsJSON());
var words_cache = new rxjs_1.BehaviorSubject(words.getItemsJSON());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var incoming;
    return __generator(this, function (_a) {
        incoming = child_process_1.spawn('/home/semion/IdeaProjects/bigpanda/generator/generator-linux-amd64');
        incoming.stdout.on('data', function (data) {
            data.toString().split('\n').map(function (row) {
                try {
                    var jrow = JSON.parse(row);
                    events.Calculate(jrow['event_type']);
                    events_cache.next(events.getItemsJSON());
                    words.Calculate(jrow['data']);
                    words_cache.next(words.getItemsJSON());
                }
                catch (e) {
                }
            });
        });
        incoming.stderr.on('data', function (e) {
            throw e;
        });
        return [2];
    });
}); })();
var index = fs_1.readFileSync('/home/semion/IdeaProjects/bigpanda/dist/index.html', 'utf8');
app.get('/', function (req, res) { return res.send(index); });
app.get('/events', function (req, res) {
    try {
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        });
        res.flushHeaders();
        res.write('retry: 10000\n\n');
        events_cache.subscribe(function (value) {
            res.write("data: events:" + value + "\n\n");
        });
        words_cache.subscribe(function (value) {
            res.write("data: words:" + value + "\n\n");
        });
    }
    catch (e) {
        console.log(e.message);
    }
});
app.listen(3003, function () { });
process.on('uncaughtException', function (e) {
    console.log(e.message);
    process.exit(1);
});
