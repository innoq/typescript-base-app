import { ObjectID } from 'mongodb';

export interface Beer {
    _id?: ObjectID;
    name: string;
    brewery: string;
    type: 'lager' | 'ale' | 'wheat'; // there are more, of course ;-)
    volPerc: number;
    t_added: Date;
}