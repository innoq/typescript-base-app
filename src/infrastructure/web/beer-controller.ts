import { Body, Get, JsonController, OnUndefined, Param, Patch, Post, QueryParam } from 'routing-controllers';
import { Inject } from 'typedi';
import { BeerService } from '../../boundary/service/beer-service';
import { BEER_SERVICE } from '../../config/services';
import { BeerUpdate } from '../../domain/beer/beer-update';
import { NewBeer } from '../../domain/beer/new-beer';

@JsonController('/beers')
export class BeerController {

    constructor(
        @Inject(BEER_SERVICE) private readonly beerService: BeerService
    ) { }

    @Post()
    async addNewBeer(@Body() newBeer: NewBeer) {
        return this.beerService.addNewBeer(newBeer);
    }

    @Patch('/:beerId')
    @OnUndefined(200) // because this one doesn't return an object
    async updateBeer(@Param('beerId') beerId: string, @Body() beerUpdate: BeerUpdate) {
        return this.beerService.updateBeer(beerUpdate, beerId);
    }

    @Get()
    async findAll(@QueryParam('strong') strong?: boolean) {
        if (strong) {
            return this.beerService.findStrongBeers();
        }
        return this.beerService.findAll();
    }

    @Get('/:beerId')
    findOneById(@Param('beerId') beerId: string) {
        return this.beerService.findOneById(beerId);
    }

}