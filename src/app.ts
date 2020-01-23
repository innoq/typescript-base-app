import * as http from 'http';
import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { BeerService } from './boundary/service/beer-service';
import { SERVER_PORT } from './config/config';
import { MongoDbBeerRepository } from './infrastructure/persistence/beer-repository';
import { DbFactory } from './infrastructure/persistence/db-factory';
import { BeerController } from './infrastructure/web/beer-controller';

useContainer(Container);

export class App {

    private httpServer!: http.Server;

    constructor() {
        Container.import([
            MongoDbBeerRepository,
            BeerService,
        ]);
    }

    async start(): Promise<http.Server> {
        await DbFactory.init();
        return this.startHttpServer();
    }

    private startHttpServer(): Promise<http.Server> {
        return new Promise((resolve) => {
            this.httpServer = createExpressServer({
                controllers: [
                    BeerController,
                ],
            });
            this.httpServer.listen(SERVER_PORT, () => {
                console.log('server running on *:' + SERVER_PORT);
                resolve(this.httpServer);
            });
        });
    }
}