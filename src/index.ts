import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import SocketIO from 'socket.io';

import bridgeRoute from './routes/bridge.routes'

dotenv.config();
const app = express();
dotenv.config();
const server = http.createServer(app);
const io = new SocketIO.Server(server, {
    cors: {
        origin: '*'
    }
})

app.set("io", io);

app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors({ origin: '*' }))

    .use("/api/v1/", bridgeRoute)

    .get("/healthz", (req, res) => {
        return res.json({ status: "API is Online"})
    })

     io.on("connection", (socket: SocketIO.Socket) => {
        console.log("Socket connected", socket.id);

         socket.on("disconnect", () => {
            console.log("Socket disconnected", socket.id);
        })
    })

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1" || "", {
    family: 4,
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        server.listen(process.env.PORT || 4000, () => {
            console.log("Server is running on port", process.env.PORT || 4000);
        })
    })
    .catch((err) => {
        console.log("MongoDB Connection Error", err);
    })