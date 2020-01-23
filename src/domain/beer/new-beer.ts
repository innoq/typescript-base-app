import { Beer } from './beer';

export type NewBeer = Omit<Beer, 'id'>