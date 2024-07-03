"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const bridge_routes_1 = __importDefault(require("./routes/bridge.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
dotenv_1.default.config();
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: '*'
    }
});
app.set("io", io);
app
    .disable("x-powered-by")
    .use((0, morgan_1.default)("dev"))
    .use(express_1.default.urlencoded({ extended: true }))
    .use(express_1.default.json())
    .use((0, cors_1.default)({ origin: '*' }))
    .use("/api/v1/", bridge_routes_1.default)
    .get("/healthz", (req, res) => {
    return res.json({ status: "API is Online" });
});
io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);
    socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
    });
});
mongoose_1.default.connect("mongodb://admin:RootVince@172.232.23.153:27017/test?authSource=admin" || "", {
    family: 4,
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
    server.listen(process.env.PORT || 5050, () => {
        console.log("Server is running on port", process.env.PORT || 5050);
    });
})
    .catch((err) => {
    console.log("MongoDB Connection Error", err);
});
