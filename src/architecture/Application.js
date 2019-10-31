/**
 * Dependencies
 */
const uuid = require('uuid')
const path = require('path')
const debug = require('debug')('sunstone:app')
const Lifecycle = require('./Lifecycle')
const PluginRegistry = require('./PluginRegistry')
const { ApplicationSchema } = require('./schemas')

/**
 * Symbols
 */
const REGISTRY = Symbol()


/**
 * Application
 *
 * @class
 * Application represents the main app. It's configurable data comes from
 * package.json in the current working directory and data passed to the factory
 * method "create()".
 */
class Application extends Lifecycle {

  /**
   * constructor
   */
  constructor (config) {
    let pkg = require(path.join(process.cwd(), 'package.json'))
    super(Object.assign({ uuid: uuid.v4() }, pkg, config))

    // create a new registry for the application
    this[REGISTRY] = PluginRegistry.create(this)
  }


  /**
   * schema
   */
  static get schema () {
    return ApplicationSchema
  }

  /**
   * lifecycle
   */
  static get lifecycle () {}

  /**
   * create
   */
  static create (config) {
    debug('creating extensible application')
    return new Application(config)
  }

  /**
   * start
   */
  start () {
    debug('starting "%s"', this.name)
    let registry = this[REGISTRY]

    this.state = 'STARTING'

    return Promise.resolve()
      .then(() => registry.discover())
      .then(() => registry.register())
      .then(() => registry.resolve())
      .then(() => registry.prioritize())
      .then(() => registry.initialize())
      .then(() => registry.start())
      .then(() => {
        this.state = 'STARTED'
        debug('started "%s"', this.name)
      })
      .catch(console.log)
  }

  /**
   * install
   */
  install (options) {
    //let { name, names, paths, repository }
  }

  /**
   * accessors
   */
  get registry () {
    return this[REGISTRY]
  }

  get injector () {
    return this[REGISTRY].injector
  }

}

/**
 * Export
 */
module.exports = Application
