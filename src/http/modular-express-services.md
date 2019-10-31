# Modular HTTP Services for Express with ES6 Classes

It's desireable in many cases to reuse encapsulated bundles of server behavior.
For example, library authors implementing an open standard may wish to export
an object that is completely responsible for behavior within it's scope and
entirely self-contained, such that integrators have virtually nothing to do
other than import the code and pass a few configuration parameters.

```javascript
const express = require('express')
const SomeService = require('some-service')

let server = express()

// configure and mount the service into the new Express server
server.use(SomeService.create(config).router)

// other stuff here
server.get('/', (req, res) => {
  res.send('Unlike SomeService's endpoints, I am specific to this server')
})

server.listen(process.env.PORT || 3000)
```

## Defining a Modular Service

Using [Express][express] in [Node.js][nodejs], we can create a new server and
add middleware, request handlers, error handling, complete routers, and even
entire apps. Express provides a mechanism suitable for service composition,
without prescribing a design for service components. We propose such a design
here, using ES6 classes as the primary unit of organization and Promises as the
preferred method of factoring out very complex asyncronous request handlers.

[express]: http://expressjs.com/
[nodejs]: https://nodejs.org/

### HTTP Services

We'll first need a way to publish a set of request handlers and maintain state
common to each of them, such as service metadata, settings, and in-memory
dependencies. We'll create a new class for this extending
[HTTPService](#httpservice), which we'll describe in detail later. The simplest
possible service looks something like this:

```javascript
const { AlphaRequest, BravoRequest } = require('./handlers')

class MyService extends HTTPService {

  get handlers () {
    return [
      AlphaRequest,
      BravoRequest
    ]
  }

}
```

The new extended `HTTPService` comes with a factory method
`create(data, dependencies)`, which must be used to obtain a new instance. The
first argument, `data`, is service metadata, settings and other enumerable
properties. The second argument, `dependencies` is used for injecting
dependencies to the service, such as database adapters, loggers, and other
behavior or state that's required internally but not representative of the
service.

```javascript
let server = express()

let service = MyService.create(
  { website: 'https://example.com' }, // enumerable properties of the service, possibly stored in a file or database
  { server, settings, database, log } // nonenumerable values useful within the service
)

server.use(service.route)
```

Alternately, if the Express server is provided as a dependency (as in the
example above), it can mount and unmount itself from the server using methods
defined by `HTTPService`.

```javascript
service.mount()
service.unmount()
```


### Request Handlers

A request handler is a class which optionally extends
[BaseRequest](#baserequest) and defines, at a bare minimum, a static `route`
getter and a static `handle` method. The `route` getter describes the handler
to the service so it can be wired up to an Express router. The `handle` method
is the route handler, with a special extra argument `service`. At runtime, the
instantiated `HTTPService` will be passed to this argument. This is a form of
dependency injection.


```javascript
class AlphaRequest extends BaseRequest {

  static get route () {
    return {
      path: '/alpha',
      method: 'GET'
    }
  }

  static handle (req, res, service) {
    res.status(418).send('I am a teapot')
  }

}
```

> Note that there is no `next` argument to `handle(req, res, service)`. This is
> by design. Services are meant to be self-contained and responsible for every
> possible outcome of each request within their scope.

This extended `BaseRequest` may look like boilerplate without a purpose until
we consider a more complex request.

The main advantage of defining a request handler as a class is that we can
decompose very complex request logic with mixed synchronicity into smaller
functions that can be recomposed to represent complicated control flows
using promise chains and share state between them using a request instance.
This is a helpful technique for avoiding bad patterns with callbacks and middleware
stacks.





```javascript
class BravoRequest extends BaseRequest {

  static get route () {
    return {
      path: '/bravo',
      method: 'GET'
    }
  }

  static handle (req, res, service) {
    let request = new BravoRequest({ req, res, service })

    Promise.resolve()
      .then(() => request.step1())
      .then(() => request.step2())
      .then(() => request.step3())
      .catch(err => request.error(err))
  }

  step1 () {
    // do something synchronous
  }

  step2 () {
    // do something asynchronous
  }

  step3 () {
    let {res} = this

    if (!this.isOk()) {
      return this.badRequest()
    }

    res.send('asynchronously, with feeling')
  }

  isOk () {
    return true
  }

}
```


Here, `handle` instantiates the request handler class, creating an object
representing all the state and behavior required to handle this request.

Handlers should never mutate the `req` argument, as is common (and bad) practice
in Node.js development. Our request handler instance provides a safer scope for
accessing mutable data that won't come into conflict with any state defined by
middleware upstream.

This technique makes it possible to decompose a complex route handler
into a series of methods that are easier to understand and test.


## Under the hood

### HTTPService abstract class

The magic behind HTTPService is minimal. Instances are created using a factory method `create(data, dependencies)`. The first argument is an object representing enumerable properties of the service that can be treated as metadata or service-specific settings. The second argument is an object representing dependency-injected values. Each property of this latter argument is assigned to the service as a nonenumerable property. The `inject` method is responsible for nonenumerable assignment.

The `router` getter builds an express router based on handlers enumerated for the service. For convenience, `mount` and `unmount` methods will add and move remove a router from an Express server known to the service via dependency injection.

```javascript
class HTTPService {

  static create (data, dependencies) {
    let ExtendedHTTPService = this
    let service = new ExtendedHTTPService(data)
    service.inject(dependencies)
    return service
  }

  get handlers () {
    throw new Error('Handlers must be defined for a subclass of HTTPService')
  }

  inject (properties) {
    Object.keys(properties).forEach(key => {
      let value = properties[key]

      Object.defineProperty(this, key, {
        enumerable: false,
        value
      })
    })
  }

  get router () {
    let service = this
    let router = express.Router()

    service.handlers.forEach(request => {
      let { path, method, methods, middleware } = request.route

      if (method && !methods) {
        methods = [method]
      }

      methods.forEach(m => {
        router[m.toLowerCase()](path, (req, res) => {
          request.handle(req, res, service)
        })
      })
    })

    return router
  }

  mount () {
    this.server.use(this.router)
  }

  unmount () {
    let stack = this.server._router.stack
    let index = stack.indexOf(this)

    stack.splice(index, 1)
  }

}
```

### BaseRequest abstract class

Route handler classes can optionally extend a base class defining shared behavior. For example:

```javascript
class BaseRequest {

  constructor (data) {
    Object.assign(this, data || {})
  }

  badRequest (err) {
    this.res.statusCode(400).send(err.message)
    throw new TermationError() // ignore me, I just stop the promise chain
  }

  unauthorized () {
    this.res.statusCode(401).send('Unauthorized')
    throw new TerminationError()
  }

  internalServerError (err) {
    this.res.statusCode(500).send(err.message)
  }

  error (err) {
    if (err instanceof TerminationError()) { return false }
    this.internalServerError(err)
  }

}
```

### TerminationError

## Using the pattern in Sunstone plugins

```javascript
class MyPlugin extends AbstractPlugin {

  initialize () {
    this.require({ 'MyService': 'my-service' )

    this.factory('myService', (MyService, serviceSettings, database, blockchain) => {
      return MyService.create(serviceSettings, { database, blockchain})
    })
  }

  start () {
    this.injector.get('myService').mount()
  }

  stop () {
    this.injector.get('myService').unmount()
  }

}
```

Plugins can be further simplified by adding these reusable start/stop methods to an intermediate class:

```javascript
class HTTPServicePlugin extends AbstractPlugin {

  start () {
    // NOTE: this depends on adding a new kind of injector registration function
    // (using plugin.assembler() in previous iteration of Sunstone
    this.injector.filter({
      type: 'router',
      plugin: {
        name: this.name
      }
    }).forEach(router => router.mount())
  }

  stop () {
    this.injector.filter({
      type: 'router',
      plugin: {
        name: this.name
      }
    }).forEach(router => router.unmount())
  }

}

class MyPlugin extends HTTPServicePlugin {

  initialize () {
    this.require({ 'MyService': 'my-service' })

    this.router('myService', (MyService, serviceSettings, database, blockchain) => {
      return MyService.create(serviceSettings, { database, blockchain })
    })
  }

}
```

## Composing HTTP Services

```javascript


class HTTPService {

  // ...

  /**
   * with
   */
  static with (service, data, dependencies) {
    let service = this.create(data, dependencies)

    shared.dependencies.forEach(key => {
      Object.defineProperty(key, service, {
        get: () => shared[key]
      })
    })

    shared.siblings.push(service)

    return service
  }

  /**
   * inject
   */
  inject (dependencies) {
    // ...

    Object.defineProperty('dependencies', this, {
      enumerable: false,
      value: Object.keys(dependencies)
    })
  }

}


class CoreService extends HTTPService {

  get handlers () {
    return [ LemonadeStandHandler ]
  }

}

class OptionalService extends HTTPService {

  get handlers () {
    return [ LemonFuHandler, LemonBarHandler ]
  }

}

let data = {
  name: 'Lemonade Franchise, LLC'
}

let core = CoreService.create(data, { server, database, log, keys })
let optional = OptionalService.with(core)
```


## Conclusion

This pattern allows us to create reusable HTTP services which can be easily
packaged and utilized as libraries and Sunstone plugins.

We may offer the abstract classes defined here as a library. Arguably it's more
important to communicate the design pattern as a convention that can be applied
for maximum compatibility and code reuse within the greater ecosystem.
