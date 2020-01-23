import { Beer } from '../domain/beer/beer';
import { BeerUpdate } from '../domain/beer/beer-update';
import { Unstored } from '../domain/stored-entity';

export interface BeerRepository {

    insertOne(beer: Unstored<Beer>): Promise<Beer>;

    updateOne(update: BeerUpdate, id: string): Promise<void>;

    findOneById(id: string): Promise<Beer | null>;

    findAll(): Promise<Beer[]>;

}
