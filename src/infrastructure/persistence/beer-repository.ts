import { Collection, ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { BeerRepository } from '../../boundary/beer-repository';
import { BEER_REPO } from '../../config/services';
import { Beer } from '../../domain/beer/beer';
import { BeerUpdate } from '../../domain/beer/beer-update';
import { Unstored } from '../../domain/stored-entity';
import { DbFactory } from './db-factory';
import { MongoDbEntity } from './mongodb-entity';

@Service(BEER_REPO)
export class MongoDbBeerRepository implements BeerRepository {

    private readonly collection: Collection;

    constructor() {
        this.collection = DbFactory.database.collection('beers');
    }

    async insertOne(beer: Unstored<Beer>): Promise<Beer> {
        const res = await this.collection.insertOne(beer);
        return toBeer({ ...beer, _id: res.insertedId });
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
            const res = await this.collection.findOne<MongoDbEntity<Beer>>({ _id: new ObjectId(id) });
            return res ? toBeer(res) : null;
        } catch (error) { // new ObjectId() will throw an error for a malformed id
            console.log(error);
            return null;
        }
    }

    async findAll(): Promise<Beer[]> {
        const res = await this.collection.find<MongoDbEntity<Beer>>().toArray();
        return res.map(toBeer);
    }

}

function toBeer(entity: MongoDbEntity<Beer>): Beer {
    const { _id, ...rest } = entity;
    return { ...rest, id: _id.toHexString() };
}