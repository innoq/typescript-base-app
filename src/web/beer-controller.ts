import { JsonController, Post, Body, Patch, Param, OnUndefined, Get, QueryParam } from 'routing-controllers';
import { NewBeer } from '../domain/new-beer';
import { BeerDto } from '../domain/beer-dto';
import { BeerService } from '../service/beer-service';
import { Inject } from 'typedi';
import { BeerUpdate } from '../domain/beer-update';

@JsonController('/beer')
export class BeerController {

    constructor(
        @Inject() private readonly beerService: BeerService
    ) { }

    @Post()
    async addNewBeer(@Body() newBeer: NewBeer): Promise<BeerDto> {
        return this.beerService.addNewBeer(newBeer);
    }

    @Patch('/:beerId')
    @OnUndefined(200) // because this one doesn't return an object
    async updateBeer(@Param('beerId') beerId: string, @Body() beerUpdate: BeerUpdate): Promise<void> {
        await this.beerService.updateBeer(beerUpdate, beerId);
    }

    @Get()
    async findAll(@QueryParam('strong') strong?: boolean): Promise<BeerDto[]> {
        if (strong) {
            return this.beerService.findStrongBeers();
        }
        return this.beerService.findAll();
    }

}