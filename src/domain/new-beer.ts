export interface NewBeer {
    name: string;
    brewery: string;
    type: 'lager' | 'ale' | 'wheat'; // there are more, of course ;-)
    volPerc: number;
}