import { JsonController, Post, Body, Patch, Param, OnUndefined, Get, QueryParam } from 'routing-controllers';
import { NewBeer } from '../domain/new-beer';
import { BeerService } from '../service/beer-service';
import { Inject } from 'typedi';
import { BeerUpdate } from '../domain/beer-update';
import { BEER_SERVICE } from '../config/services';

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