import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { DB_CONN_URL, DB_NAME } from '../config/config';

const mongoClientOptions: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

export class DbFactory {

    private static db: Db;

    static get database(): Db {
        if (!DbFactory.db) {
            throw new Error('database connection has not been initialized');
        }
        return DbFactory.db;
    }

    static async init() {
        await DbFactory.establishConnection();
    }

    private static async establishConnection() {
        const client = await MongoClient.connect(DB_CONN_URL, mongoClientOptions);
        DbFactory.db = client.db(DB_NAME);
    }

}