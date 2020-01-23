import { Beer } from './beer';

export type BeerUpdate = Omit<Beer, 'id'>
