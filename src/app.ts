import 'reflect-metadata';
import * as http from 'http';
import { Container } from 'typedi';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './config/config';
import { DbFactory } from './persistence/db-factory';

export class App {

    private httpServer!: http.Server;

    constructor() {
        Container.import([]);
    }

    async start(): Promise<http.Server> {
        await DbFactory.init();
        return this.startHttpServer();
    }

    private startHttpServer(): Promise<http.Server> {
        return new Promise((resolve, reject) => {
            this.httpServer = createExpressServer({
                controllers: [],
            });
            this.httpServer.listen(SERVER_PORT, () => {
                console.log('server running on *:' + SERVER_PORT);
                resolve(this.httpServer);
            });
        });
    }
}