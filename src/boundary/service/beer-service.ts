import { Inject, Service } from 'typedi';
import { BEER_REPO, BEER_SERVICE } from '../../config/services';
import { BeerUpdate } from '../../domain/beer/beer-update';
import { NewBeer } from '../../domain/beer/new-beer';
import { BeerDto } from '../../infrastructure/beer-dto';
import { BeerRepository } from '../beer-repository';

@Service(BEER_SERVICE)
export class BeerService {

    constructor(
        @Inject(BEER_REPO) private readonly beerRepo: BeerRepository,
    ) { }

    async addNewBeer(newBeer: NewBeer): Promise<BeerDto> {
        return this.beerRepo.insertOne({ ...newBeer, t_added: new Date() });
    }

    async findOneById(id: string): Promise<BeerDto | null> {
        return this.beerRepo.findOneById(id);
    }

    async findAll(): Promise<BeerDto[]> {
        return (await this.beerRepo.findAll());
    }

    async findStrongBeers(): Promise<BeerDto[]> {
        const allBeers = await this.beerRepo.findAll();
        return allBeers.filter(beer => beer.volPerc > 5.5);
    }

    async updateBeer(beerUpdate: BeerUpdate, beerId: string): Promise<BeerDto | null> {
        await this.beerRepo.updateOne(beerUpdate, beerId);
        return this.beerRepo.findOneById(beerId);
    }

}