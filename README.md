# TypeScript Sample Web Service

## What's this about?

This repository contains an opinionated example of a simple Node/TypeScript web service. It's aimed to give non-Node/TS developers an idea of what a simple web application can look like and might serve as a starter for other projects.

This application needs a running mongodb instance to work. If no `DB_CONN_URL` environment variable containing a mongodb connection url is passed, the application falls back to `mongodb://127.0.0.1:27017`.
If you don't have a running mongodb instance at hand, you can start one running `docker run --name some-mongo -p 127.0.0.1:27017:27017 -d mongo`, assuming you have docker installed.

Before usage, run `npm install`.

You can use this service by running:

* `npm run build` to build the application
* `npm run start` to (build and) start the application
* `npm run serve` to start the application in watch mode
* `npm run test` to run the sample tests

## This is the ADVANCED BRANCH

I included an advanced branch to discuss some higher-level TypeScript features and some higher-level architecture approaches. 
You can find more on what's different in the `advanced` branch at the end of this README. To have a look at the simpler starter version, please check out the `master` branch.

## Some opinionated stuff

This application uses some extra packages that can be handy for slightly larger services:

* [expressjs](https://github.com/expressjs/express) might be the most popular Node.js web framework out there
* The [routing controllers](https://github.com/typestack/routing-controllers) packages allows to simply declare controllers via decorators, much like in Java Spring with annotations.
* The [typedi](https://github.com/typestack/typedi) package allows to declare and inject services for DI/IOC.
* I do use mongodb (just because it's easy for an example). I do not use an ORM like mongoose, mainly because ORMs are magic, performance eating monsters that aren't needed if you work with a document database (opinionated).

Please be aware that these are just examples. There are other good packages out there for all of these purposes.

Services are currently named via a string constant (as seen in the `@Service(...)` decorators). This is not a must. It helps to identify services and to exchange an injected services for testing purposes.

## Some pitfalls

* New services (with the `@Service()` class decorator) have to be registered in the `app.ts` class constructor.
* New controllers also have to be registered in the `app.ts` constructors.

## Disclaimer

This is obviously just a sample project. There are some things that are missing or incomplete. For example:

* The `DbFactory` class does not have a reconnect mechanism in case the first database connection fails.
* There are currently **no validations** for incoming http payloads in place. Please add some before you put anything in production ([joi](https://github.com/hapijs/joi) is a popular choice for more complex validations).
* I included some tests, mainly to show how tests can be done easily. You should probably have better test coverage.
* Please **update** these projects dependencies before you use it.

If you there is anything you don't understand, bugs or requests, please don't hesitate to write me a mail.

## Advanced types and the onion architecture

Again, this architecture style only exists on the `advanced` branch. To see an easier example with easier typing, check out the `master` branch.
Although the more classical folder structure seen on the `master` branch will suit simpler projects just well, this branch makes use of the so called [onion architecture](https://www.innoq.com/en/blog/cooking-with-onions-inward-pointing-arrows/) (aka hexagonal architecture). This architecture is a [good fit for Domain Driven Design](https://www.innoq.com/de/blog/ddd-mit-onion-architecture-umsetzen/) approaches.

### Onion Architecture in short

In a Domain Driven Design approach, one challenge is to keep external dependencies away from our domain logic. The Onion Architecture embraces this with its onion-style layer definitions:

* An inner _domain_ core contains domain logic like models, aggregates and domain services. It has no external dependencies to things like databases, controllers, etc. It may use utility libraries of course.
* An outer _infrastructure_ layer contains infrastructure dependent code such as database repositories and controllers (the web is infrastructure).
* A middle _boundary_ layer kind of works like a connector between the two. It often contains services that aren't exactly pure domain logic but connect domain logic to infrastructure elements.
* Dependencies only ever point inwards: A repository might depend on boundary services and domain models, never the other way around. This helps to keep our domain code free of dependencies. Inversion of control is used in domain and boundary modules to make this work.

### Problems with the naive master branch approach.

On the `master` branch version, our main domain entity, `Beer`, is kind of problematic because we would like to use it in the domain core and at the same time store it in MongoDB. It looks something like this:

```ts
interface Beer {
    _id?: ObjectID;
    ...
}
```
The `_id` field has three problems:

* It contains an underscore, just because that's how ids are named in MongoDB (infrastructure dependency)
* Its type is `ObjectID`, a hard infrastructure dependency on MongoDB's bson type.
* Since a new `beer` object doesn't have an id before it's stored, the field is optional. Since TypeScript is configured to be null safe, this has now to be checked everytime and everywhere in the code, even with already stored objects.

One solution could be be to just duplicate code and write three different `Beer` interfaces. Another one is to use TypeScripts [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html) to construct the types we need. This way, we have a plain `Beer` entity with a non-optional, string type `id` field. The `Unstored<Beer>` type omits its `id` attribute and is used for beers that are not yet stored. The `MongoDbEntity<Beer>` type is only used in MongoDB repository classes. It also omits the `id` attribute and exchanges it for an `_id: ObjectID` attribute.

This, of course, is only one way to do it and the main reason for it is - like with everything in this repository - to show off TypeScript's capabilities.
