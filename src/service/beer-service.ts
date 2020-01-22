import { Service, Inject } from 'typedi';
import { NewBeer } from '../domain/new-beer';
import { BeerDto } from '../domain/beer-dto';
import { BeerRepository } from '../persistence/beer-repository';
import { Beer } from '../domain/beer';
import { BeerUpdate } from '../domain/beer-update';
import { BEER_SERVICE, BEER_REPO } from '../config/services';

@Service(BEER_SERVICE)
export class BeerService {

    constructor(
        @Inject(BEER_REPO) private readonly beerRepo: BeerRepository,
    ) { }

    async addNewBeer(newBeer: NewBeer): Promise<BeerDto> {
        const addedBeer = await this.beerRepo.insertOne({ ...newBeer, t_added: new Date() });
        return beerDto(addedBeer);
    }

    async findOneById(id: string): Promise<BeerDto | null> {
        const beer = await this.beerRepo.findOneById(id);
        return beer ? beerDto(beer) : null;
    }

    async findAll(): Promise<BeerDto[]> {
        return (await this.beerRepo.findAll()).map(beerDto);
    }

    async findStrongBeers(): Promise<BeerDto[]> {
        const allBeers = await this.beerRepo.findAll();
        return allBeers.filter(beer => beer.volPerc > 5.5).map(beerDto);
    }

    async updateBeer(beerUpdate: BeerUpdate, beerId: string): Promise<BeerDto | null> {
        await this.beerRepo.updateOne(beerUpdate, beerId);
        const updated = await this.beerRepo.findOneById(beerId);
        return updated ? beerDto(updated) : null;
    }

}

function beerDto(beer: Beer): BeerDto {
    const { _id, ...rest } = beer; // destruct beer object
    return { ...rest, id: _id?.toHexString() }; // construct dto
}