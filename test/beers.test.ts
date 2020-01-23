import axios from 'axios';
import { expect } from 'chai';
import { Server } from 'http';
import { App } from '../src/app';
import { SERVER_PORT } from '../src/config/config';
import { DbFactory } from '../src/infrastructure/persistence/db-factory';

const api = axios.create({
    baseURL: 'http://127.0.0.1:' + SERVER_PORT,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json'
    }
});

const beerA = { name: 'Beyreuther Hefe-Weissbier', brewery: 'Beyreuther', type: 'wheat', volPerc: 5.2 };
const beerB = { name: 'Berliner Berg Pale Ale', brewery: 'Berliner Berg', type: 'ale', volPerc: 5.5 };
const beerC = { name: 'Duvel Barrel Aged', brewery: 'Duvel', type: 'lager', volPerc: 11.5 };

describe('/beers tests', async () => {

    let app: App;
    let server: Server;

    before(async () => {
        app = new App();
        server = await app.start();
    });

    it('add beers and then find all of them', async () => {
        const resA = await api.post('/beers', beerA);
        const resB = await api.post('/beers', beerB);

        expect(resA.status).to.eql(200);
        expect(resB.status).to.eql(200);

        const beerAData = resA.data;
        const beerBData = resB.data;

        expect(beerAData.id).to.be.a('string');
        expect(beerBData.id).to.be.a('string');

        const beersRes = await api.get('/beers');

        expect(beersRes.status).to.eql(200);
        expect(beersRes.data).to.have.deep.members([beerAData, beerBData]);
    });

    it('get a beer by its id', async () => {
        const resA = await api.post('/beers', beerA);

        const beerAByIdRes = await api.get('/beers/' + resA.data.id);

        expect(beerAByIdRes.status).to.eql(200);
        expect(beerAByIdRes.data).to.deep.equal(resA.data);
    });

    it('get only strong beers', async () => {
        await api.post('/beers', beerA);
        await api.post('/beers', beerB);
        const resC = await api.post('/beers', beerC);

        const strongBeersRes = await api.get('/beers', { params: { strong: true } });

        expect(strongBeersRes.status).to.be.eql(200);
        expect(strongBeersRes.data).to.have.deep.members([resC.data]);
    });

    it('update one beer', async () => {
        const resA = await api.post('/beers', beerA);
        const update = { ...beerA, name: 'Bayreuther' };
        const updateResA = await api.patch('/beers/' + resA.data.id, update);

        expect(updateResA.status).to.be.eql(200);
        expect(updateResA.data.name).to.deep.equal('Bayreuther');
    });

    afterEach(async () => {
        DbFactory.database.dropDatabase();
    });

});