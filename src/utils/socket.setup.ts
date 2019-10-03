import { SearchController } from "../controllers/search/search.controller";
import { City } from "../model/city.model";
import { Constants } from "./constants";

export const initSocket = (socket: SocketIO.Server) => {

    socket.on("connection", (client: SocketIO.Client) => {

        const searchController: SearchController = new SearchController();

        const interval = setInterval(() => {
            let cities: any[] = [];
            searchController.getCitiesDetail().then((data: any[]) => {
                cities = data;
                client.server.emit("update", cities);
            });
        }, Constants.UPDATE_INTERVAL);

        client.server.on("disconnect", () => {
            clearInterval(interval);
        });

    });

};
