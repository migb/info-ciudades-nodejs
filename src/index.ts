import express from "express";
import http from "http";
import * as socketIo from "socket.io";
import middleware from "./middleware";
import { config } from "./resources/config";
import routes from "./services";
import { applyMiddleware, applyRoutes, saveCoordinates } from "./utils";
import { initSocket } from "./utils/socket.setup";

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
const port = config.server.port || process.env.PORT;
const server = http.createServer(router);

server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
    const socket: SocketIO.Server = socketIo.listen(server);
    initSocket(socket);
    saveCoordinates();
});
