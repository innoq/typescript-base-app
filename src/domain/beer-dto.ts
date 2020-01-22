export interface BeerDto {
    id?: string;
    name: string;
    brewery: string;
    type: 'lager' | 'ale' | 'wheat'; // there are more, of course ;-)
    volPerc: number;
    t_added: Date;
}