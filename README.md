# TypeScript Sample Web Service

## What's this about?

This repository contains an opinionated example of a simple Node/TypeScript web service. It's aimed to give non-Node/TS developers an idea of what a simple web application can look like and might serve as a starter for other projects.

Note that there is also an [advanced branch](https://github.com/innoq/typescript-base-app/tree/advanced) of this project that aims to be an example of an Onion Architecture approach and uses some of TypeScript's more advanced utility types to solve common dependency problems.

This application needs a running mongodb instance to work. If no `DB_CONN_URL` environment variable containing a mongodb connection url is passed, the application falls back to `mongodb://127.0.0.1:27017`.
If you don't have a running mongodb instance at hand, you can start one running `docker run --name some-mongo -p 127.0.0.1:27017:27017 -d mongo`, assuming you have docker installed.

Before usage, run `npm install`.

You can use this service by running:

* `npm run build` to build the application
* `npm run start` to (build and) start the application
* `npm run serve` to start the application in watch mode
* `npm run test` to run the sample tests

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