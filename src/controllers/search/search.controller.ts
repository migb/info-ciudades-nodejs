import { RedisClient } from "redis";
import { get } from "request";
import { CityResponse } from "../../model/city-response.model";
import { City } from "../../model/city.model";
import { config } from "../../resources/config";
import { redisConnection } from "../../utils/redis";

/**
 * Clase encarcada de realizar los flujos logicos de
 * la consulta de informacion de cada ciudad.
 */
export class SearchController {

    /**
     * Instancia del cliente de Redis.
     */
    private redis: RedisClient;

    /**
     * Constructor de la clase.
     */
    constructor() {
        this.redis = redisConnection;
    }

    /**
     * Método encargdo de iterar y retornar el detalle de cada ciudad.
     */
    public async getCitiesDetail(): Promise<any> {

        const date: Date = new Date();

        if (Math.random() < 0.1) {
            this.redis.hmset("api.errors", { [date.getTime()]: `An error has occurred in the request - Date: ${date}` });
            throw new Error("How unfortunate! The API Request Failed");
        }

        const response: CityResponse[] = [];
        const cities: City[] = await this.getCities();

        for (const city of cities) {
            const result = await this.searchByCoordinates(city.lat, city.lon);
            const jsonResult = JSON.parse(result);
            const cityResponse: CityResponse = new CityResponse();
            cityResponse.name = city.name;
            cityResponse.temperature = jsonResult.currently.temperature;
            cityResponse.time = new Date(jsonResult.currently.time * 1000).toLocaleString("es-CL", { timeZone: jsonResult.timezone });
            response.push(cityResponse);
        }

        this.redis.hmset("api.requests", { [date.getTime()]: `Successful Request - Date: ${date}` });

        return new Promise((resolve, reject) => {
            resolve(response);
        });

    }

    /**
     * Método encargado de obtener las coordenadas desde Redis.
     */
    private getCities(): Promise<City[]> {
        return new Promise((resolve, reject) => {
            this.redis.get("Coordinates", (err, coordinates) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(coordinates));
                }
            });
        });
    }

    /**
     * Método encargado de realizar la peticion HTTP al servicio de forecast.op
     * @param lat Latitud de la ciudad.
     * @param lon  Longitud de la cuidad.
     */
    private searchByCoordinates(lat: number, lon: number): Promise<any> {

        return new Promise((resolve, reject) => {
            get({
                uri: `${config.forecast.endpoint}${config.forecast.key}/${lat},${lon}?lang=es&units=si`,
            }, (err: any, res: any, body: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    }

}
