
import { Request, Response } from "express";
import { SearchController } from "../../controllers/search/search.controller";
import { Constants } from "../../utils/constants";

export default [
    /**
     * Definicion de ruta encargada de obtener el detalle
     * de cada ciudad para ser entregada como respuesta.
     * @method GET
     * @path /cities/
     */
    {
        method: "get",
        path: "/cities/",
        handler: async (req: Request, res: Response) => {
            const searchController: SearchController = new SearchController();
            try {
                res.send(await searchController.getCitiesDetail());
            } catch (error) {
                res.status(400).send({ message: "How unfortunate! The API Request Failed" });
            }
        },
    },
];
