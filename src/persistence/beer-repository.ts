import { Collection, ObjectId } from 'mongodb';
import { DbFactory } from './db-factory';
import { Beer } from '../domain/beer';
import { Service } from 'typedi';
import { BeerUpdate } from '../domain/beer-update';

@Service()
export class BeerRepository {

    private readonly collection: Collection;

    constructor() {
        this.collection = DbFactory.database.collection('beers');
    }

    async insertOne(beer: Beer): Promise<Beer> {
        const res = await this.collection.insertOne(beer);
        return { ...beer, _id: res.insertedId };
    }

    async updateOne(update: BeerUpdate, id: string): Promise<void> {
        try {
            await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
        } catch (error) { // new ObjectId() will throw an error for a malformed id
            throw new Error('something went wrong...');
        }
    }

    async findOneById(id: string): Promise<Beer | null> {
        try {
            return this.collection.findOne<Beer>({ _id: new ObjectId(id) });
        } catch (error) { // new ObjectId() will throw an error for a malformed id
            console.log(error);
            return null;
        }
    }

    async findAll(): Promise<Beer[]> {
        return this.collection.find<Beer>().toArray();
    }

}