import { ObjectID } from 'mongodb';
import { StoredEntity } from '../../domain/stored-entity';

export type MongoDbEntity<T extends StoredEntity> = Omit<T, 'id'> & { _id: ObjectID; };